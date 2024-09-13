import { z } from "zod";

export const SignUpSchema = z.object({
  name: z.string().min(3, { message: "Name should be alteast 3 characters" }),
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Password should be alteast 6 characters" }),
});
export const SignInSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Password should be alteast 6 characters" }),
});
