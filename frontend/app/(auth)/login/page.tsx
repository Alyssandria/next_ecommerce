"use client";
import { AuthInput } from "@/components/ui/auth-input";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { fetchApi } from "@/lib/utils";
import { loginSchema, LoginValidator } from "@/lib/validations/authValidators";
import { ApiResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function LoginPage() {

  const { setItem } = useLocalStorage();

  const form = useForm<LoginValidator>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });


  const onSubmit = async (data: LoginValidator) => {
    const res = await fetchApi("auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      })
    });


    const json = (await res.json()) as ApiResponse<LoginValidator>;

    if (!json.success) {
      const errors = json.errors;

      // FORM ERRORS
      if (!errors.global) {
        for (const [key, message] of Object.entries(errors.form.fieldErrors)) {
          form.setError(key as keyof LoginValidator, {
            type: "server",
            message: message[0]
          })
        }
        form.resetField("password");
        return;
      }


      toast.error("Something went wrong, please try again later");
      return;
    }

    toast.success("Logged in successfully!");

    setItem('token', json.data.token);

    return redirect('/');

  }
  return (
    <div className="space-y-10">
      <div className="space-y-8">
        <h1 className="text-neutral-07 font-medium text-5xl">Sign in</h1>
        <span className="block text-neutral-04">Don't have an account yet?
          {" "}
          <Link href="/register" className="text-green font-medium">Sign up</Link>
        </span>
      </div>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)} method="POST">
        <FieldSet>
          <FieldLegend className="sr-only">Sign in</FieldLegend>
          <FieldDescription className="sr-only">Sign in credentials</FieldDescription>
          <FieldGroup className="gap-8">
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email" className="sr-only">Email</FieldLabel>
                  <AuthInput
                    {...field}
                    id="email"
                    type="email"
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
                    placeholder="Password"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </FieldSet>

        <Button className="w-full text-lg p-6">Sign up</Button>
      </form>
    </div>
  )
}
