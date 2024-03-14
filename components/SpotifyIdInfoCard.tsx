import { FaQuestionCircle } from "react-icons/fa";
import { Button } from "./ui/button";
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

export default function SpotifyIdInfoCard() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <FaQuestionCircle />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-1">Where is my Spotify ID?</DialogTitle>
          <DialogDescription>
            <div className="mb-1">
              <h2 className="font-bold text-white text-md">Mobile App</h2>
              <div className="leading-loose">
                1. Tap the User Icon in the top-left corner of the app.
                <br />
                2. Select{" "}
                <span className="tracking-wider font-bold">
                  Settings and privacy
                </span>
                .<br />
                3. Go to{" "}
                <span className="tracking-wider font-bold">Account</span>.<br />
                4. Your Spotify ID is listed under{" "}
                <span className="tracking-wider font-bold">Username</span>.
                <br />
              </div>
            </div>
            <div>
              <h2 className="font-bold text-white text-md">Desktop</h2>
              <div className="leading-loose">
                1. Click on the User Icon in the top-right corner.
                <br />
                2. Choose{" "}
                <span className="tracking-wider font-bold">Account</span> from
                the dropdown menu.
                <br />
                3. Click{" "}
                <span className="tracking-wider font-bold">Edit Profile</span>.
                <br />
                4. Your Spotify ID is listed under{" "}
                <span className="tracking-wider font-bold">Username</span>.
                <br />
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex"></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
