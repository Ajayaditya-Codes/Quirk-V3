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
  picture?: string | null;
  given_name?: string | null;
  credits?: number;
}

const fetchUserDetails = async (): Promise<UserDetails | null> => {
  try {
    const { getUser } = getKindeServerSession();
    const { id, picture, given_name } = await getUser();

    if (!id) return null;

    const result = await db
      .select()
      .from(Users)
      .where(eq(Users.KindeID, id))
      .execute();
    const userDetails = result?.[0] ?? null;

    return {
      id,
      picture,
      given_name: given_name ?? "Guest",
      credits: userDetails?.Credits ?? 0,
    };
  } catch (error) {
    console.error("Failed to fetch user details:", error);
    return null;
  }
};

const Footer: React.FC = async (): Promise<JSX.Element> => {
  const userDetails = await fetchUserDetails();

  return (
    <Suspense fallback={<FooterSkeleton />}>
      <SidebarFooter className="m-3 p-3 shadow-lg dark:shadow-gray-800 bg-white dark:bg-neutral-800 rounded-xl flex flex-row items-start">
        {userDetails?.picture ? (
          <Image
            alt={`${userDetails.given_name}'s profile picture`}
            src={userDetails.picture}
            width={30}
            height={30}
            className="pt-1 rounded-lg"
          />
        ) : (
          <UserRound />
        )}
        <div className="ml-2 flex flex-col items-start">
          <h3 className="text-lg font-semibold tracking-tighter leading-snug">
            {userDetails?.given_name || "Guest"}
          </h3>
          <small className="font-medium leading-snug">
            {userDetails
              ? `You are using the Free Plan of Quirk. You have ${userDetails.credits} free credits remaining.`
              : "Unable to load user information. Please try again later."}
          </small>
        </div>
      </SidebarFooter>
    </Suspense>
  );
};

export default Footer;
