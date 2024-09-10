import {
  type FieldValues,
  FormProvider as RHFFormProvider,
  type UseFormReturn,
} from "react-hook-form";

type Props = {
  children: React.ReactNode;
  onSubmit?: VoidFunction;
  className?: string;
};

export type FormProps<T extends FieldValues> = Props & {
  form: UseFormReturn<T>;
};

export default function FormProvider<T extends FieldValues>({ children, onSubmit, form, className }: FormProps<T>) {
  return (
    <RHFFormProvider {...form}>
        <form className={className} onSubmit={onSubmit}>{children}</form>
    </RHFFormProvider>
  );
}
