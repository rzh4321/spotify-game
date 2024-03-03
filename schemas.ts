import { z } from "zod";

export const RegisterSchema = z.object({
  username: z.string().min(4, {
    message: "Username must be at least 4 characters.",
  }),
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  spotifyUserId: z.string().optional(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export const LoginSchema = z.object({
  username: z.string().min(1, {
    message: "Username is required.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

export const EditProfileSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  spotifyUserId: z.string().optional(),
});
