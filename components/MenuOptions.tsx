import { Loader } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Play } from "lucide-react";

import { z } from "zod";
import TopScoresTable from "./TopScoresTable";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import type { PlaylistInfo } from "@/types";

const FormSchema = z.object({
  timer: z.string(),
  showHints: z.boolean().default(false),
});

type MenuOptionsProps = {
  setDuration: React.Dispatch<React.SetStateAction<number>>;
  setTimer: React.Dispatch<React.SetStateAction<number>>;
  setScore: React.Dispatch<React.SetStateAction<number | null>>;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setShowHints: React.Dispatch<React.SetStateAction<boolean>>;
  gameReady: boolean;
  getHighScore: () => Promise<void>;
  playlistInfo: PlaylistInfo | undefined;
};

export default function MenuOptions({
  setDuration,
  setTimer,
  setScore,
  setShowMenu,
  setShowHints,
  gameReady,
  getHighScore,
  playlistInfo,
}: MenuOptionsProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      timer: "10",
      showHints: false,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setScore(0);
    setDuration(+data.timer);
    setTimer(+data.timer);
    setShowMenu(false);
    setShowHints(data.showHints);
    getHighScore();
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"spotify"} className="px-3 sm:px-4">
          <Play />
          <span className="hidden sm:block">Play</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center justify-center max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center">
            {playlistInfo?.name}
          </DialogTitle>
          <DialogDescription className="">
            Choose the game settings.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={form.control}
              name="timer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timer</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val);
                      setTimer(+val);
                    }}
                    defaultValue={"10"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10" defaultChecked>
                        10
                      </SelectItem>
                      <SelectItem value="15">15</SelectItem>
                      <SelectItem value="10000">10000</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="showHints"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(val) => {
                        field.onChange(val);
                        setShowHints(val as boolean);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Show Hints</FormLabel>
                    <FormDescription>
                      Two choices will be eliminated just before the timer
                      expires.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <Button variant={"spotify"} type="submit" disabled={!gameReady}>
              {gameReady ? "Start" : <Loader className="animate-spin" />}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
