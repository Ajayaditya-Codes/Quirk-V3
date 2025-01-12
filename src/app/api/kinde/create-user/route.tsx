import { NextResponse } from "next/server";
import jwksClient from "jwks-rsa";
import jwt from "jsonwebtoken";
import { db } from "@/db/drizzle";
import { Users } from "@/db/schema";

const client = jwksClient({
  jwksUri: `${process.env.KINDE_ISSUER_URL}/.well-known/jwks.json`,
});

export const POST = async (req: Request) => {
  try {
    const token = await req.text();
    const decodedToken = jwt.decode(token, { complete: true });

    if (!decodedToken || !decodedToken.header || !decodedToken.payload) {
      return NextResponse.json(
        { message: "Invalid token structure" },
        { status: 400 }
      );
    }

    const { header } = decodedToken as jwt.Jwt;
    const { kid } = header;
    const key = await client.getSigningKey(kid);
    const signingKey = key.getPublicKey();
    const event = jwt.verify(token, signingKey);

    if ((event as jwt.JwtPayload)?.type === "user.created") {
      const user = (event as jwt.JwtPayload)?.data?.user;

      if (user?.id && user?.email) {
        try {
          await db
            .insert(Users)
            .values({
              KindeID: user.id,
              Username:
                (user?.first_name as string) +
                " " +
                (user?.last_name as string),
              Email: user.email,
              Credits: 20,
            })
            .execute();
        } catch (error) {
          return NextResponse.json(
            {
              message: "Failed to insert user into the database",
              error: (error as Error)?.message,
            },
            { status: 500 }
          );
        }
      } else {
        return NextResponse.json(
          { message: "Invalid user data in the event payload" },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error processing the request",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }

  return NextResponse.json({ status: 200, statusText: "success" });
};
