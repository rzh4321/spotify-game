"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormError from "./form-error";
import FormSuccess from "./form-success";
import { LoginSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
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
import SpotifyLoginButton from "../SpotifyLoginButton";
import VisitorLoginButton from "../VisitorLoginButton";

export const LoginForm = ({
  visitorUsername,
}: {
  visitorUsername: string | undefined;
}) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setIsLoading] = useState(false);

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

    async function logIn() {
      setIsLoading(true);
      const res = await signIn("credentials", {
        redirect: false,
        username: values.username,
        password: values.password,
      });
      if (res && res.error) {
        setIsLoading(false);
        setError(res.error);
      }
      // if log in success, redirect to landing page
      else {
        setSuccess("Logging in...");
        router.push("/home");
      }
    }
    logIn();
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
                    <Input {...field} disabled={loading} />
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
                    <Input {...field} disabled={loading} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormSuccess message={success} />
          <Button
            disabled={loading}
            type="submit"
            variant={"blue"}
            className="w-full text-lg"
          >
            Login
          </Button>
          <div className="flex flex-col gap-3">
            <SpotifyLoginButton setIsLoading={setIsLoading} loading={loading} />
            <VisitorLoginButton
              loading={loading}
              setIsLoading={setIsLoading}
              visitorUsername={visitorUsername}
            />
          </div>
        </form>
      </Form>
      <FormError message={error} />
    </CardWrapper>
  );
};
