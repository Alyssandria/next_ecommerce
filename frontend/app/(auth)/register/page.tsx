"use client"
import { AuthInput } from "@/components/ui/auth-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { fetchApi } from "@/lib/utils";
import { registerSchema, RegisterValidator } from "@/lib/validations/authValidators";
import { ApiResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export default function RegisterPage() {
  const form = useForm<RegisterValidator>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      confirm: "",
      last_name: "",
      email: "",
      password: "",
      agree: false
    }
  });

  const onSubmit = async (data: RegisterValidator) => {
    const res = await fetchApi("auth/register", {
      method: "POST",
      body: JSON.stringify({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
      })
    });

    const TRegister = registerSchema.omit({ agree: true, confirm: true });
    const json = (await res.json()) as ApiResponse<z.infer<typeof TRegister>>;

    if (!json.success) {
      const errors = json.errors;

      // FORM ERRORS
      if (!errors.global) {
        for (const [key, message] of Object.entries(errors.form.fieldErrors)) {
          form.setError(key as keyof z.infer<typeof TRegister>, {
            type: "server",
            message: message[0]
          })
        }
        form.setFocus("email")
        return;
      }

      toast.error("Something went wrong, please try again later");
      return;
    }

    toast.success("Registered Successfully, please log in to continue");
    return redirect('login');
  }
  return (
    <div className="space-y-10">
      <div className="space-y-8">
        <h1 className="text-neutral-07 font-medium text-5xl">Sign up</h1>
        <span className="block text-neutral-04">Already have an account?
          {" "}
          <Link href="/login" className="text-green font-medium">Sign in</Link>
        </span>
      </div>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)} method="POST">
        <FieldSet>
          <FieldLegend className="sr-only">Sign up</FieldLegend>
          <FieldDescription className="sr-only">Sign up credentials</FieldDescription>
          <FieldGroup className="gap-8">
            <Controller
              name="first_name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="first_name" className="sr-only">
                    First Name
                  </FieldLabel>
                  <AuthInput
                    {...field}
                    id="first_name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Your first name"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="last_name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="last_name" className="sr-only">Last Name</FieldLabel>
                  <AuthInput
                    {...field}
                    id="last_name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Your last name"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />


            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email" className="sr-only">Email</FieldLabel>
                  <AuthInput
                    {...field}
                    id="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="Your email"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />


            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password" className="sr-only">Password</FieldLabel>
                  <AuthInput
                    {...field}
                    id="password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Your password"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />


            <Controller
              name="confirm"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirm" className="sr-only">Confirm Password</FieldLabel>
                  <AuthInput
                    {...field}
                    id="confirm"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Confirm password"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <Controller
            name="agree"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="w-full space-y-3">
                <Field data-invalid={fieldState.invalid} orientation={"horizontal"}>
                  <Checkbox
                    className="block size-8 w-8"
                    id="agree"
                    name={field.name}
                    aria-invalid={fieldState.invalid}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <FieldLabel htmlFor="agree" className="block text-xs text-neutral-04 flex-1">
                    I agree with
                    {" "}
                    <span className="font-bold text-neutral-07">Privacy Policy</span>
                    {" "}
                    and
                    {" "}
                    <span className="font-bold text-neutral-07">Terms of Use</span>
                  </FieldLabel>
                </Field>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} className="flex-1" />
                )}
              </div>
            )}
          />
        </FieldSet>

        <Button className="w-full text-lg p-6" disabled={form.formState.isSubmitting}>
          {
            form.formState.isSubmitting ?
              <Loader2Icon className="animate-spin" />
              :
              <span>Sign up</span>
          }
        </Button>
      </form>
    </div>
  )
}
