"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import FormError from "./form-error";
import FormSuccess from "./form-success";
import { LoginSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { FaSpotify } from "react-icons/fa";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();
  const [spotifyLoggedIn, setSpotifyLoggedIn] = useState(false);

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      async function logIn() {
        const res = await signIn("credentials", {
          redirect: false,
          username: values.username,
          password: values.password,
        });
        if (res && res.error) {
          setError(res.error);
        }
        // if log in success, redirect to landing page
        else {
          setSuccess("Logging in...");
          router.push("/home");
        }
      }
      logIn();
    });
    if (success) router.push("/all");
  };

  return (
    <CardWrapper
      headerLabel="the Spotify guessing game"
      backButtonLabel="Don't have an account?"
      backButtonHref="/register"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormSuccess message={success} />
          <Button
            disabled={isPending || spotifyLoggedIn}
            type="submit"
            className="w-full text-lg"
          >
            Login
          </Button>
          <Button
            type="button"
            className="text-lg w-full bg-green-500"
            onClick={() => {
              setSpotifyLoggedIn(true);
              signIn("spotify", { callbackUrl: "/home" });
            }}
            disabled={isPending}
          >
            <span className="md:block hidden">Log in with</span>
            <FaSpotify className="mx-1" />
            <span className="text-sm">(Approved users only)</span>
          </Button>
        </form>
      </Form>
      <FormError message={error} />
    </CardWrapper>
  );
};
