import { z } from "zod";

export const SignInSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Has to be a valid email" }),
    password: z.string().min(1, { message: "Password is required" }),
  });

export type SignInInput = z.infer<typeof SignInSchema>;
