import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { signIn } from "next-auth/react";
import { useRef, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import SpotifyIdInfoCard from "./SpotifyIdInfoCard";

type VisitorLoginButtonProps = {
  loading: boolean;
  visitorUsername: string | undefined;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function VisitorLoginButton({
  loading,
  visitorUsername,
  setIsLoading,
}: VisitorLoginButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [spotifyId, setSpotifyId] = useState("");

  if (visitorUsername) {
    const signInVisitor = async () => {
      setIsLoading(true);
      const signInRes = await signIn("credentials", {
        redirect: true,
        username: visitorUsername,
        password: visitorUsername,
        callbackUrl: "/home",
      });
    };
    return (
      <Button
        type="button"
        onClick={signInVisitor}
        className="text-lg w-full"
        variant={"outline"}
        disabled={loading}
      >
        <span>Log in as visitor</span>
      </Button>
    );
  }

  const handleIdSubmit = async () => {
    // Trim whitespace from input value to check if it is empty
    if (spotifyId.trim() === "") {
      // If input is empty, focus the input element
      inputRef.current?.focus();
    } else {
      setIsLoading(true);
      const res = await fetch(`/api/auth/visitor-login`, {
        method: "POST",
        body: JSON.stringify({ spotifyUserId: spotifyId }),
      });
      const data = await res.json();
      // should return newly created (or existing) user object
      const signInRes = await signIn("credentials", {
        redirect: true,
        username: data.user.username,
        password: data.user.username,
        callbackUrl: "/home",
      });
    }
  };

  const handleSkip = async () => {
    const res = await fetch(`/api/auth/visitor-login`, {
      method: "POST",
      body: JSON.stringify({ spotifyUserId: "" }),
    });
    const data = await res.json();
    const signInRes = await signIn("credentials", {
      redirect: true,
      username: data.user.username,
      password: data.user.username,
      callbackUrl: "/home",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="text-lg w-full"
          variant={"outline"}
          disabled={loading}
        >
          <span>Log in as visitor</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex gap-1">
            Enter your Spotify ID
            <SpotifyIdInfoCard />
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            {
              "Sync your playlists by connecting your Spotify ID now, or you can add it later under your profile page."
            }
          </DialogDescription>
        </DialogHeader>
        <div>
          <Input
            ref={inputRef}
            onChange={(e) => setSpotifyId(e.target.value)}
            value={spotifyId}
          />
        </div>
        <DialogFooter className="flex">
          <DialogClose asChild>
            <Button type="button" variant={"outline"} onClick={handleSkip}>
              Skip
            </Button>
          </DialogClose>
          <Button type="button" variant={"spotify"} onClick={handleIdSubmit}>
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
