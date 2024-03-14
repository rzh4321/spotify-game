import { Button } from "./ui/button";
import { FaSpotify } from "react-icons/fa";
import { signIn } from "next-auth/react";
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

type SpotifyLoginButtonProps = {
  setSpotifyLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  isPending: boolean;
};

export default function SpotifyLoginButton({
  setSpotifyLoggedIn,
  isPending,
}: SpotifyLoginButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="text-lg w-full bg-green-500"
          disabled={isPending}
        >
          <span className="md:block hidden">Log in with</span>
          <FaSpotify className="mx-1" />
          <span className="text-sm">(Approved users only)</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you an approved user?</DialogTitle>
          <DialogDescription>
            {
              "Spotify login is restricted to a select group of users due to API restrictions. If you haven't received a direct invitation to use this feature, attempting to log in with Spotify will redirect you to an error page. Please use an alternative login method or contact me if you believe you should have access."
            }
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex">
          <DialogClose asChild>
            <Button
              className="text-white"
              variant={"destructive"}
              type="submit"
            >
              No
            </Button>
          </DialogClose>
          <Button
            className="p-3"
            type="button"
            variant={"spotify"}
            onClick={() => {
              setSpotifyLoggedIn(true);
              signIn("spotify", { callbackUrl: "/home" });
            }}
          >
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
