"use client";
import React, { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { toaster } from "../ui/toaster"; // Assuming toaster utility is available
import { useRouter } from "next/navigation";

type Props = {
  icon: React.ReactNode;
  title: string;
  description: string;
  connected: boolean;
  connectionLink?: string;
  disconnectionLink: string;
};

// Function to handle the disconnection process
async function disconnectService(disconnectionLink: string): Promise<void> {
  const response = await fetch(disconnectionLink, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to disconnect. Please try again.");
  }
}

const ConnectionCard = ({
  description,
  icon,
  title,
  connected,
  connectionLink,
  disconnectionLink,
}: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDisconnect = async () => {
    setLoading(true);

    // Show the toaster loading state
    toaster.create({
      title: "Disconnecting " + title + "...",
      description: "Please wait while we disconnect you.",
      type: "info",
    });

    try {
      // Attempt to disconnect and handle success/failure
      await disconnectService(disconnectionLink);

      // Show success toast
      toaster.create({
        title: "Successfully disconnected " + title + "!",
        description: "You have been disconnected from the service.",
        type: "success",
      });

      // Optionally, refresh the page or state
      router.refresh();
    } catch (error: any) {
      // Show error toast
      toaster.create({
        title: "Disconnect " + title + " failed",
        description: error?.message || "Something went wrong.",
        type: "error",
      });
    } finally {
      // Reset loading state
      setLoading(false);
    }
  };

  return (
    <Card className="flex w-full items-end bg-transparent justify-between border shadow-lg">
      <CardHeader className="flex flex-col gap-4">
        <div className="flex flex-row gap-2">{icon}</div>
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <div className="flex flex-row gap-2 space-x-3 p-4 ">
        {connected ? (
          <button
            onClick={handleDisconnect}
            className="rounded-lg p-2 border border-red-600 font-bold"
            disabled={loading}
          >
            {loading ? "Disconnecting..." : "Disconnect"}
          </button>
        ) : (
          <Link
            href={connectionLink ? connectionLink : "#"}
            className="rounded-lg p-2 font-bold border text-center"
          >
            Connect
          </Link>
        )}
      </div>
    </Card>
  );
};

export default ConnectionCard;
