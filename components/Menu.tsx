"use client";

import { Loader } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";

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

const FormSchema = z.object({
  timer: z.string(),
});

type MenuProps = {
  setDuration: React.Dispatch<React.SetStateAction<number>>;
  setScore: React.Dispatch<React.SetStateAction<number | null>>;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  gameReady: boolean;
};

export default function Menu({
  setDuration,
  setScore,
  setShowMenu,
  gameReady,
}: MenuProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      timer: "10",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setScore(0);
    setDuration(+data.timer);
    setShowMenu(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="timer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timer</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={"10"}>
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
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={!gameReady}>
          {gameReady ? "Play" : <Loader className="animate-spin" />}
        </Button>
      </form>
    </Form>
  );
}
