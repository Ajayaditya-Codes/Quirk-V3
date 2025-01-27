import React, { JSX, Suspense, lazy } from "react";
import { SidebarFooter } from "@/components/ui/sidebar";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { Users } from "@/db/schema";
import FooterSkeleton from "./footerSkeleton";

const Image = lazy(() => import("next/image"));
const UserRound = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.UserRound }))
);

interface UserDetails {
  id: string;
  given_name?: string | null;
  credits?: number;
}

const fetchUserDetails = async (): Promise<UserDetails | null> => {
  try {
    const { getUser } = getKindeServerSession();
    const { id } = await getUser();

    if (!id) return null;

    const result = await db
      .select()
      .from(Users)
      .where(eq(Users.KindeID, id))
      .execute();
    const userDetails = result?.[0] ?? null;

    return {
      id,
      given_name: userDetails?.Username || "Guest",
      credits: userDetails?.Credits ?? 0,
    };
  } catch {
    return null;
  }
};

const Footer: React.FC = async (): Promise<JSX.Element> => {
  const userDetails = await fetchUserDetails();

  return (
    <Suspense fallback={<FooterSkeleton />}>
      <SidebarFooter className="m-3 p-3 shadow-lg bg-white dark:bg-neutral-800 rounded-xl flex flex-col items-start justify-start space-y-1">
        <h3 className="text-lg font-semibold tracking-tighter leading-snug">
          {userDetails?.given_name || "Guest"}
        </h3>
        <small className="font-medium leading-snug">
          {userDetails
            ? `You are using the Free Plan of Quirk. You have ${userDetails.credits} free credits remaining.`
            : "Unable to load user information. Please try again later."}
        </small>
      </SidebarFooter>
    </Suspense>
  );
};

export default Footer;
