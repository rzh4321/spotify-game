"use client";

import { useState, useTransition } from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import FormError from "./form-error";

// import { LoginSchema } from "@/schemas";
// import { Input } from "@/components/ui/input";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { Button } from "@/components/ui/button";

export const LoginForm = () => {
  const router = useRouter();

  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  // const form = useForm({
  //   resolver: zodResolver(LoginSchema),
  //   defaultValues: {
  //     username: "",
  //     password: "",
  //   },
  // });

  const onSubmit = () => {
    setError("");

    startTransition(() => {
      console.log("hi");
      async function logIn() {
        const res = await signIn("spotify", {
          redirect: false,
        });
        if (res && res.error) {
          setError(res.error);
        } else {
          // if log in success, redirect to landing page
          router.push("/home");
        }
      }
      logIn();
    });
  };

  return (
    <CardWrapper
      headerLabel="Happening now"
      backButtonLabel="Don't have an account?"
      backButtonHref="/register"
    >
      {/* <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
           <div className="space-y-4">
              <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                        />
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
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            disabled={isPending}
            type="submit"
            className="w-full"
          >
            Login
          </Button>
        </form>
      </Form> */}
      <Button className="text-lg" onClick={onSubmit} disabled={isPending}>
        Log in with Spotify
      </Button>
      <FormError message={error} />
    </CardWrapper>
  );
};