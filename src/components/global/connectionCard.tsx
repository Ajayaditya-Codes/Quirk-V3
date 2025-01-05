"use client";
import React, { useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { toaster } from "../ui/toaster";
import { useRouter } from "next/navigation";

type Props = {
  icon: React.ReactNode;
  title: string;
  description: string;
  connected: boolean;
  connectionLink?: string;
  disconnectionLink: string;
};

const ConnectionCard: React.FC<Props> = ({
  description,
  icon,
  title,
  connected,
  connectionLink,
  disconnectionLink,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDisconnect = async (): Promise<void> => {
    setLoading(true);

    const promise = new Promise<void>((resolve, reject) => {
      fetch(disconnectionLink, {
        method: "POST",
      })
        .then(async (response) => {
          if (response.ok) {
            resolve();
          } else {
            const errorData = await response.json();
            reject(new Error(errorData.error || "Disconnection failed"));
          }
        })
        .catch(() => {
          reject(new Error("Network error occurred while disconnecting."));
        });
    });

    toaster.promise(promise, {
      success: {
        title: `Successfully disconnected ${title}!`,
        description: "You have been disconnected from the service.",
        type: "success",
      },
      error: (error) => ({
        title: `Disconnect ${title} failed`,
        description: error?.message || "Something went wrong.",
        type: "error",
      }),
      loading: {
        title: `Disconnecting ${title}...`,
        description: "Please wait while we disconnect you.",
        type: "info",
      },
    });

    try {
      await promise;
      router.refresh();
    } catch (error) {
      console.error("Error during disconnection: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="flex justify-between items-end w-full bg-transparent border shadow-lg ">
      <CardHeader className="flex flex-col space-4">
        <div className="flex space-2">{icon}</div>
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <div className="flex p-4 space-2">
        {connected ? (
          <button
            onClick={handleDisconnect}
            className="p-2 font-bold border border-red-600 rounded-lg"
            disabled={loading}
          >
            {loading ? "Disconnecting..." : "Disconnect"}
          </button>
        ) : (
          <Link
            href={connectionLink || "#"}
            className="p-2 font-bold border rounded-lg text-center"
          >
            Connect
          </Link>
        )}
      </div>
    </Card>
  );
};

export default ConnectionCard;
