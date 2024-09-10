"use client";

import { useState, useContext } from "react";
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import FormProvider, { RHFTextField, SubmitButton } from "@/components/hook-form";
import { FormMessage } from "@/components/form-message";
import { CreateEntitySchema, type CreateEntityInput } from "@/schemas/create-entity";
import { AdminContext } from "@/contexts/admin";
import { Button } from "./ui/button";

type Props = {
  context: typeof AdminContext;
};

export default function EditEntityForm({ context }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const contextData = useContext(context);

  if (!contextData) {
    return null;
  }

  const { entityType, updateEntity, error, currentEntity } = contextData;

  const router = useRouter();

  const defaultValues = {
    email: currentEntity?.email || "",
    name: currentEntity?.name || "",
  };

  const form = useForm<CreateEntityInput>({
    resolver: zodResolver(CreateEntitySchema),
    defaultValues,
  });

  const onSubmit = form.handleSubmit(async (values: CreateEntityInput) => {
    if (!currentEntity) return;

    try {
      setIsSubmitting(true);

      const body = {
        ...((defaultValues.email !== values.email) && { email: values.email }),
        ...((defaultValues.name !== values.name) && { name: values.name }),
      };

      await updateEntity(currentEntity.id, body);
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleCancel = () => router.push(`/${entityType}`);

  return (
    <FormProvider form={form} onSubmit={onSubmit} className="flex-1 flex flex-col min-w-64">
      <h1 className="text-2xl font-medium">Edit</h1>
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
          label="Name"
          name="name"
          control={form.control}
          required
          placeholder="Name"
        />

        <div className="flex flex-row gap-2 mt-4">
          <Button onClick={handleCancel}>
            Cancel
          </Button>

          <SubmitButton pendingText="Updating..." pending={isSubmitting}>
            Edit
          </SubmitButton>
        </div>
        {!!error && <FormMessage message={{ error }} />}
      </div>
    </FormProvider>
  );
}