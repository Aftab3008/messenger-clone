"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BsGithub, BsGoogle } from "react-icons/bs";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import AuthSocialButton from "./AuthSocialButton";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { SignInSchema, SignUpSchema } from "@/constants/ZodSchema";
import { useRouter } from "next/navigation";
import { sign } from "crypto";

type AuthFormVariant = "login" | "register";

export default function AuthForm() {
  const session = useSession();
  const router = useRouter();
  const [variant, setVariant] = useState<AuthFormVariant>("login");
  const signUpForm = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const signInForm = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/conversations");
    }
  }, [session?.status, router]);

  function onRegister(values: z.infer<typeof SignUpSchema>) {
    axios
      .post("/api/register", values)
      .then(() => {
        toast.success("Account created successfully");
        signIn("credentials", values).then((callback) => {
          if (callback?.error) {
            toast.error(callback.error);
          }
          if (callback?.ok && !callback?.error) {
            toast.success("Logged in successfully");
            router.push("/conversations");
          }
        });
      })
      .catch((err) => {
        if (err) {
          toast.error(err.response.data);
        } else {
          toast.error("Something went wrong", {
            description: "Please try again later",
          });
        }
      });
  }
  function onLogin(values: z.infer<typeof SignInSchema>) {
    signIn("credentials", {
      ...values,
      redirect: false,
    }).then((callback) => {
      if (callback?.error) {
        toast.error(callback.error);
      }
      if (callback?.ok && !callback?.error) {
        toast.success("Logged in successfully");
        router.push("/conversations");
      }
    });
  }

  function socialAction(provider: string) {
    signIn(provider, {
      redirect: false,
    }).then((callback) => {
      if (callback?.error) {
        toast.error(callback.error);
      }
      if (callback?.ok && !callback?.error) {
        toast.success("Logged in successfully");
      }
    });
  }

  const toggleVariant = useCallback(() => {
    if (variant === "login") {
      setVariant("register");
      signInForm.reset();
    } else {
      setVariant("login");
      signUpForm.reset();
    }
  }, [variant]);

  return (
    <>
      {/* {session?.status === "loading" && <LoadingModal />} */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className=" bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10 dark:bg-dusk dark:sm:border-2 dark:border-lightgray">
          {variant === "register" && (
            <Form {...signUpForm}>
              <form
                onSubmit={signUpForm.handleSubmit(onRegister)}
                className="space-y-8"
              >
                <FormField
                  control={signUpForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Name"
                          {...field}
                          className="focus-visible:ring-0 focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 focus:ring-offset-sky-600"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signUpForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="example@gmail.com"
                          {...field}
                          className="focus-visible:ring-0 focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 focus:ring-offset-sky-600"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signUpForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          className="focus-visible:ring-0 focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 focus:ring-offset-sky-600"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={signUpForm.formState.isSubmitting}
                  className="w-full bg-sky-500 hover:bg-sky-600 focus-visible:outline-sky-600"
                >
                  {signUpForm.formState.isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" color="white" />
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </form>
            </Form>
          )}
          {variant === "login" && (
            <Form {...signInForm}>
              <form
                onSubmit={signInForm.handleSubmit(onLogin)}
                className="space-y-8"
              >
                <FormField
                  control={signInForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="example@gmail.com"
                          {...field}
                          className="focus-visible:ring-0 focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 focus:ring-offset-sky-600"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signInForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          className="focus-visible:ring-0 focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 focus:ring-offset-sky-600"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={signInForm.formState.isSubmitting}
                  className="w-full bg-sky-500 hover:bg-sky-600 focus-visible:outline-sky-600"
                >
                  {signInForm.formState.isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" color="white" />
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </Form>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-t-2 dark:border-lightgray" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500 dark:bg-dusk dark:text-gray-200">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <AuthSocialButton
                icon={BsGithub}
                onClick={() => socialAction("github")}
              />
              <AuthSocialButton
                icon={BsGoogle}
                onClick={() => socialAction("google")}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-center gap-2 px-2 text-sm text-gray-500 dark:text-gray-400">
            <div>
              {variant === "login"
                ? "New to Messenger?"
                : "Already have an account?"}
            </div>
            <div onClick={toggleVariant} className="cursor-pointer underline">
              {variant === "login" ? "Create an account" : "Login"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
