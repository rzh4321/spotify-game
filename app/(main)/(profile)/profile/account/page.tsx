"use client";

import { useState, useTransition, useEffect } from "react";
import { Input } from "@/components/ui/input";
import getName from "@/actions/getName";
import getSpotifyUserId from "@/actions/getSpotifyUserId";
import updateNameAndSpotifyId from "@/actions/updateNameAndSpotifyId";
import { FaSpotify } from "react-icons/fa";
import FormSuccess from "@/components/auth/form-success";
import FormError from "@/components/auth/form-error";
import { useSession } from "next-auth/react";
import { FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Account() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [spotifyId, setSpotifyId] = useState("");

  useEffect(() => {
    const getNameAndSpotifyId = async () => {
      const name = await getName(
        (session?.user as { username: string }).username,
      );
      const spotifyUserId = await getSpotifyUserId(
        (session?.user as { username: string }).username,
      );
      if (name) {
        setName(name);
      }
      if (spotifyUserId) {
        setSpotifyId(spotifyUserId);
      }
    };
    if (status !== "authenticated") return;
    getNameAndSpotifyId();
  }, [status, session]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    startTransition(() => {
      async function callUpdateProfile() {
        try {
          await updateNameAndSpotifyId(
            (session?.user as { username: string }).username,
            name,
            spotifyId,
          );
          setSuccess("Updated profile");
        } catch (err: any) {
          console.log(err);
          setError(err.message);
        }
      }
      callUpdateProfile();
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 w-full">
      <div className="space-y-8">
        <div>
          <label>Username</label>
          <Input
            disabled
            value={
              status === "authenticated"
                ? (session?.user as { username: string }).username
                : ""
            }
          />
        </div>

        <div>
          <label htmlFor="name">Name</label>
          <Input
            id="name"
            disabled={isPending}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="flex gap-1 items-center" htmlFor="spotifyId">
            <FaSpotify />
            <span>Spotify ID</span>
          </label>
          <Input
            id="spotifyId"
            disabled={isPending}
            value={spotifyId}
            onChange={(e) => setSpotifyId(e.target.value)}
          />
        </div>
      </div>
      <FormSuccess message={success} />
      <FormError message={error} />
      <Button
        disabled={isPending || status !== "authenticated"}
        type="submit"
        className="text-lg"
      >
        Update
      </Button>
    </form>
  );
}
