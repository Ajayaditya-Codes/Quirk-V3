import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { Users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const POST = async (): Promise<NextResponse> => {
  const { getUser } = getKindeServerSession();
  const userSession = await getUser();

  if (!userSession?.id) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 }
    );
  }

  const userId = userSession.id;
  const user = await db
    .select()
    .from(Users)
    .where(eq(Users.KindeID, userId))
    .execute();

  if (!user.length) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  try {
    await db
      .update(Users)
      .set({ AsanaRefreshToken: null })
      .where(eq(Users.KindeID, userId))
      .execute();

    return NextResponse.json({ message: "Asana disconnected successfully." });
  } catch {
    return NextResponse.json(
      {
        error:
          "An error occurred while revoking the Asana access token. Please try again later.",
      },
      { status: 500 }
    );
  }
};
