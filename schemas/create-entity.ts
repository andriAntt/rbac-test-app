import { z } from "zod";

export const CreateEntitySchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Has to be a valid email" }),
    name: z.string().min(1, { message: "Name is required" }),
  });

export type CreateEntityInput = z.infer<typeof CreateEntitySchema>;
