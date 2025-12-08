"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCreateShippings } from "@/hooks/use-add-shippings";
import { useShippings } from "@/hooks/use-shippings";
import { fetchWithAuth } from "@/lib/utils";
import { ShippingValidator, ShippingValidatorSchema } from "@/lib/validations/shippingValidators";
import { Shipping } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, Minus, Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Activity, useEffect, useState } from "react";
import { Controller, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";


const AddressFormField = ({
  form,
  isNew = false,
  onSubmit,
}: {
  onSubmit?: (ctx: Shipping) => void,
  isNew?: boolean
  form: UseFormReturn<ShippingValidator, any, ShippingValidator>
}) => {
  const [submitCtx, setSubmitCtx] = useState();
  const shippings = useCreateShippings();

  const submitHandler = async (data: ShippingValidator) => {
    const result = await shippings.mutateAsync({
      data
    });

    form.reset();
    onSubmit?.(result);
  }
  return (
    <form onSubmit={form.handleSubmit(submitHandler)}>
      <Controller
        name="label"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="label">
              Address Label
            </FieldLabel>
            <Input
              {...field}
              id="label"
              aria-invalid={fieldState.invalid}
              placeholder="Address Label"
              autoComplete="off"
            />
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />


      <Controller
        name="recipient"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="recipient">
              Recipient
            </FieldLabel>
            <Input
              {...field}
              id="recipient"
              aria-invalid={fieldState.invalid}
              placeholder="Recipient"
            />
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />
      <Controller
        name="province"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="province">
              Province
            </FieldLabel>
            <Input
              {...field}
              id="province"
              aria-invalid={fieldState.invalid}
              placeholder="Province"
            />
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />


      <Controller
        name="street"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="street">
              Street
            </FieldLabel>
            <Input
              {...field}
              id="street"
              aria-invalid={fieldState.invalid}
              placeholder="Street"
            />
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />


      <Controller
        name="zip"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="zip">
              Zip
            </FieldLabel>
            <Input
              {...field}
              id="zip"
              aria-invalid={fieldState.invalid}
              placeholder="Zip"
            />
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />
      <Activity mode={isNew ? "visible" : "hidden"}>
        <Button type="submit">
          {shippings.isPending ?
            <Loader2Icon className="animate-spin" />
            :
            <span>Save changes</span>
          }
        </Button>
      </Activity>
    </form>
  )

}
export default function Checkout() {

  const params = useSearchParams().getAll("ids");
  const router = useRouter();

  const addresses = useShippings();
  const [currAddress, setCurrAddress] = useState<number | undefined>();
  const [isNewShowing, setIsNewShowing] = useState<boolean>(false);

  const form = useForm<ShippingValidator>({
    resolver: zodResolver(ShippingValidatorSchema),
    defaultValues: {
      label: "",
      province: "",
      street: "",
      zip: "",
      recipient: ""
    }
  })
  // REDIRECT TO CARTS IF THERE'S NO PARAMS
  useEffect(() => {
    if (!params.length) {
      setTimeout(() => toast.error("Must select products to checkout"));
      router.push("/");
    }
  }, [])

  useEffect(() => {
    console.log(currAddress);
    console.log("Address", addresses.data);
    if (!currAddress && addresses.data && addresses.data.length > 0) {
      setCurrAddress(addresses.data[0].id);
    }
  }, [addresses.data]);


  return (
    <div>
      {addresses.data && currAddress !== undefined ?
        <div className="flex flex-col gap-4">
          <div>
            <div className="w-full flex justify-between">
              <span>Shipping Information</span>
              <Button
                variant={"ghost"}
                onClick={() => {
                  setIsNewShowing(prev => !prev)
                }}
              >
                {
                  isNewShowing ?
                    <Minus />
                    :
                    <Plus />
                }
                Add New Address
              </Button>
            </div>
            <RadioGroup
              className="text-muted-foreground flex flex-col"
              value={currAddress.toString()}
              onValueChange={(val) => {
                setCurrAddress(Number(val))
              }}
            >
              {addresses.data.map((el) => (
                <div className="flex items-center gap-3">
                  <RadioGroupItem
                    value={String(el.id)}
                    id={String(el.id)}
                  />
                  <Label htmlFor={String(el.id)} className="flex flex-col items-start">
                    <span className="text-primary">{el.label}</span>
                    <div className="flex gap-4">
                      <span>{el.province}</span>
                      <span>{el.zip}</span>
                    </div>
                    <span>{el.street}</span>
                    <span>{el.recipient}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <Activity mode={isNewShowing ? "visible" : "hidden"}>
              <span>Create new address</span>
              <AddressFormField
                form={form}
                isNew
                onSubmit={(ctx) => {
                  setIsNewShowing(false);
                  setCurrAddress(ctx.id);
                  setTimeout(() => toast.success("Successfully added a new address"));
                }}
              />
            </Activity>
          </div>
        </div>
        :
        <AddressFormField form={form} />
      }
    </div>
  )

}
