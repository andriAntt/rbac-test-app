"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import FormProvider, { RHFTextField, SubmitButton } from "@/components/hook-form";
import { FormMessage, Message } from "@/components/form-message";
import { SignInSchema, type SignInInput } from "@/schemas/sign-in";


export default function SignInForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();

  const router = useRouter();

  const paramsObject = Object.fromEntries(searchParams.entries()) as Message;

  const defaultValues = {
    email: "",
    password: "",
  };

  const form = useForm<SignInInput>({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const onSubmit = form.handleSubmit(async (values: SignInInput) => {
    try {
      setIsSubmitting(true);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const url = new URL(response.url);

      if (!response.ok) {
        const { error } = await response.json();

        router.push(`/sign-in?error=${error}`);
        return;
      }

      router.replace(`${url.pathname}`);
    } catch (err) {

    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <FormProvider form={form} onSubmit={onSubmit} className="flex-1 flex flex-col min-w-64">
      <h1 className="text-2xl font-medium">Sign in</h1>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <RHFTextField
          label="Email"
          name="email"
          type="email"
          control={form.control}
          required
          placeholder="you@example.com"
        />

        <RHFTextField
          label="Password"
          name="password"
          type="password"
          control={form.control}
          required
          placeholder="Your password"
        />

        <SubmitButton pendingText="Signing In..." pending={isSubmitting}>
          Sign in
        </SubmitButton>
        <FormMessage message={paramsObject} />
      </div>
    </FormProvider>
  );
}
