'use client';

import {
  type Path,
  type Control,
  type FieldValues,
  useController,
  useFormContext,
} from "react-hook-form";
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";

type Props = {
  name: string,
  label?: string;
  placeholder?: string,
  className?: string,
  disabled?: boolean,
  description?: string | React.ReactNode,
  defaultValue?: string | number,
  type?: "button" | "checkbox" | "color" | "date" | "datetime-local" | "email" | "file" | "hidden" | "image" | "month" | "number" | "password" | "radio" | "range" | "reset" | "search" | "submit" | "tel" | "text" | "time" | "url" | "week",
} & React.InputHTMLAttributes<HTMLInputElement>;

export type RHFTextFieldProps<T extends FieldValues> = Props & {
  control: Control<T, object>;
  name: Path<T>;
};

export default function RHFTextField<T extends FieldValues>({
  name,
  control,
  type = 'text',
  label,
  placeholder,
  required,
  className,
}: RHFTextFieldProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name,
  });

  const formContext = useFormContext();

  return (
    <div className={className}>
        <Label htmlFor={field.name}>{label}</Label>
        <Input
          type={type}
          name={field.name}
          placeholder={placeholder}
          required={required}
          ref={field.ref}
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          onFocus={() => formContext.clearErrors("root")}
        />

        {!!error?.message && <p className="text-red-500">{error?.message}</p>}
    </div>
  );
}
