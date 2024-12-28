import { SidebarFooter } from "@/components/ui/sidebar";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { UserRound } from "lucide-react";
import Image from "next/image";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { Users } from "@/db/schema";

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

    const result = await db.select().from(Users).where(eq(Users.KindeID, id)).execute();
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

export default async function Footer() {
  const userDetails = await fetchUserDetails();

  if (!userDetails) {
    return (
      <SidebarFooter className="m-3 shadow-lg bg-white dark:bg-neutral-800 rounded-xl p-3 flex flex-row justify-start items-start">
        <UserRound />
        <div className="flex flex-col justify-start items-start">
          <h3 className="font-semibold text-lg tracking-tighter leading-snug">
            Guest
          </h3>
          <small className="leading-snug font-medium">
            Unable to load user information. Please try again later.
          </small>
        </div>
      </SidebarFooter>
    );
  }

  const { picture, given_name, credits } = userDetails;

  return (
    <SidebarFooter className="m-3 shadow-lg bg-white dark:bg-neutral-800 rounded-xl p-3 flex flex-row justify-start items-start">
      {picture ? (
        <Image
          alt={`${given_name}'s profile picture`}
          src={picture}
          width={30}
          height={30}
          className="rounded-lg pt-1"
        />
      ) : (
        <UserRound />
      )}
      <div className="flex flex-col justify-start items-start ml-2">
        <h3 className="font-semibold text-lg tracking-tighter leading-snug">
          {given_name}
        </h3>
        <small className="leading-snug font-medium">
          You are using the Free Plan of Quirk. You have {credits} free credits
          remaining.
        </small>
      </div>
    </SidebarFooter>
  );
}
