"use client";

import { CartProduct, CartProductCategory, CartProductDelete, CartProductImage, CartProductPrice, CartProductTitle, QuantityHandler } from "@/components/item-products";
import { PaypalButton } from "@/components/paypal-button";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCreateShippings } from "@/hooks/use-add-shippings";
import { useProductsByIds } from "@/hooks/use-products-by-id";
import { useShippings } from "@/hooks/use-shippings";
import { cn, fetchWithAuth, formatCase, formatPrice } from "@/lib/utils";
import { ShippingValidator, ShippingValidatorSchema } from "@/lib/validations/shippingValidators";
import { CartItem, CreateOrderApi, Shipping } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, Minus, Plus, XIcon } from "lucide-react";
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
    <form
      onSubmit={form.handleSubmit(submitHandler)}
      className="flex flex-col gap-6"
    >
      <FieldSet>
        <FieldGroup className="flex-row justify-between">
          <Controller
            name="label"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}
                className="flex-1"
              >
                <FieldLabel htmlFor="label">
                  Address Label
                </FieldLabel>
                <Input
                  {...field}
                  id="label"
                  className="max-sm:text-xs"
                  aria-invalid={fieldState.invalid}
                  placeholder="Label"
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
              <Field data-invalid={fieldState.invalid}
                className="flex-1 justify-between"
              >
                <FieldLabel htmlFor="recipient">
                  Recipient
                </FieldLabel>
                <Input
                  {...field}
                  id="recipient"
                  className="max-sm:text-xs"
                  aria-invalid={fieldState.invalid}
                  placeholder="Recipient"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
        <Controller
          name="province"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="size-full">
              <FieldLabel htmlFor="province">
                Province
              </FieldLabel>
              <Input
                {...field}
                id="province"
                className="text-xs  justify-self-end"
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
                className="text-xs"
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
                className="text-xs"
                aria-invalid={fieldState.invalid}
                placeholder="Zip"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
      </FieldSet>
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
  const [type, setType] = useState<"existing" | "new">(currAddress !== undefined ? "existing" : "new");
  const [isNewShowing, setIsNewShowing] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);

  const items = useProductsByIds(params.map(el => Number(el)));
  const [products, setProducts] = useState<CartItem[]>(items.data || []);

  useEffect(() => {
    if (currAddress === undefined) {
      setType("new");
    } else {
      setType("existing");
    }

  }, [currAddress]);

  useEffect(() => {
    if (items.data) {
      setProducts(items.data)
    }
  }, [items.data]);

  useEffect(() => {
    let total = 0;

    products.forEach(el => {
      total = Number((total + (el.quantity * el.productData.price)).toFixed(2));
    });

    setTotal(total);
  }, [products])

  console.log(products);

  const form = useForm<ShippingValidator>({
    resolver: zodResolver(ShippingValidatorSchema),
    defaultValues: {
      label: "",
      province: "",
      street: "",
      zip: "",
      recipient: ""
    }
  });

  // REDIRECT TO CARTS IF THERE'S NO PARAMS
  useEffect(() => {
    if (!params.length) {
      setTimeout(() => toast.error("Must select products to checkout"));
      router.push("/");
    }
  }, [])

  useEffect(() => {
    if (!currAddress && addresses.data && addresses.data.length > 0) {
      setCurrAddress(addresses.data[0].id);
    }
  }, [addresses.data]);

  const createOrder = async (data: {
    total: typeof total,
    type: typeof type,
    shipping_id?: typeof currAddress
    shippingDetails?: ShippingValidator,
    products: {
      price: number;
      quantity: number;
      name: string;
      product_id: number;
    }[];
  }) => {
    const { total, type, shippingDetails, shipping_id, products } = data;
    const response = await fetchWithAuth("/payments", {
      method: "POST",
      body: JSON.stringify({
        total,
        type,
        shipping_id,
        shippingDetails,
        products
      }),
    });

    if (!response.ok) {
      setTimeout(() => toast.error("Something went wrong, please try again later"));
    }

    const orderData = await response.json() as CreateOrderApi;

    orderData.data.result.links.forEach(el => {
      if (el.rel === "approve") {
        window.location.href = el.href;
      }
    });
  }

  const handleSubmit = async (data: ShippingValidator) => {
    await createOrder(
      {
        total,
        type,
        shipping_id: currAddress,
        shippingDetails: currAddress === undefined ? {
          label: data.label,
          province: data.province,
          recipient: data.recipient,
          street: data.street,
          zip: data.zip,
        } : undefined,
        products: products.map(el => ({
          name: el.productData.title,
          product_id: el.productData.id,
          quantity: el.quantity,
          price: Number(el.productData.price.toFixed(2)),
        }))
      })
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[4fr_1fr] max-w-[1400px] ">
      <div className="border border-neutral-04 p-4 rounded-lg flex flex-col gap-6 md:p-8">
        <div className="w-full flex flex-col justify-between md:flex-row">
          <span className="text-xl font-medium text-neutral-07 block">Shipping Information</span>
          <Activity mode={addresses.data && currAddress !== undefined ? "visible" : "hidden"}>
            <Button
              className="text-blue self-start p-0"
              variant={"ghost"}
              onClick={() => {
                setIsNewShowing(prev => !prev)
                form.reset();
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
          </Activity>
        </div>


        <div className="h-full flex flex-col">
          {addresses.data && currAddress !== undefined ?
            <ScrollArea className="h-72 px-6">
              <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col gap-8">
                  <RadioGroup
                    className="text-muted-foreground flex flex-col"
                    value={currAddress.toString()}
                    onValueChange={(val) => {
                      setCurrAddress(Number(val))
                    }}
                  >
                    {addresses.data.map((el) => (
                      <div
                        className={
                          cn(
                            "flex hover:cursor-pointer border border-neutral-03 rounded-lg p-4 items-center gap-3",
                            el.id === currAddress && "border-blue bg-blue/10"
                          )}
                      >
                        <RadioGroupItem
                          className="size-6 data-[state=checked]:bg-blue self-start"
                          value={String(el.id)}
                          id={String(el.id)}
                        />
                        <Label htmlFor={String(el.id)} className="hover:cursor-pointer flex flex-col w-full items-start">
                          <span className="text-primary">{el.label}</span>
                          <div className="flex gap-2 text-xs">
                            <span>{formatCase(el.province)}</span>
                            <span>{formatCase(el.zip)}</span>
                          </div>
                          <span className="text-xs">{formatCase(el.street)}</span>
                          <span className="text-xs">{formatCase(el.recipient)}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </ScrollArea>
            :
            <AddressFormField form={form} />
          }

          <Activity mode={isNewShowing ? "visible" : "hidden"}>
            <div className="border p-4 flex flex-col gap-6 rounded-lg">
              <span className="font-medium">Create new address</span>
              <AddressFormField
                form={form}
                isNew
                onSubmit={(ctx) => {
                  setIsNewShowing(false);
                  setCurrAddress(ctx.id);
                  setTimeout(() => toast.success("Successfully added a new address"));
                }}
              />
            </div>
          </Activity>
        </div>
      </div>

      <div className="h-fit border border-neutral-04 rounded-lg p-4 py-8 space-y-8 lg:w-[420px] md:p-8">
        <span className="text-xl font-medium block">Order Summary</span>
        <div className="flex flex-col justify-between gap-8">
          <ScrollArea className="h-48 overflow-x-hidden">
            {
              items.isPending ?
                <div className="size-full h-32 flex items-center justify-center">
                  <Loader2Icon className="animate-spin" />
                </div>
                :
                <div className="space-y-4">
                  {products.map(el => (
                    <CartProduct item={el} className="border-b pb-4 gap-2 sm:gap-10 flex">
                      <div>
                        <CartProductImage className="h-full" />
                      </div>
                      <div className="flex flex-col flex-1">
                        <div className="w-full flex justify-between items-center">
                          <CartProductTitle className="max-sm:text-sm" />
                          <CartProductPrice className="max-sm:text-sm" />
                        </div>
                        <div className="w-full flex justify-between items-center">
                          <CartProductCategory className="max-sm:text-sm" />
                          <CartProductDelete
                            onDelete={(id) => {
                              setProducts(prev => {
                                return (
                                  prev.filter(x => x.productData.id !== id)
                                )
                              });

                              setTimeout(() => toast.success("Cart item deleted"));
                            }}
                          >
                            <XIcon />
                          </CartProductDelete>

                        </div>
                        <div className="w-full flex justify-between items-center">
                          <QuantityHandler
                            onQuantityUpdate={(id, qty) => {
                              setProducts(prev => {
                                return (
                                  prev.map(x => x.id === id ? {
                                    ...x,
                                    quantity: qty
                                  } : x
                                  )
                                )
                              })
                            }}
                          />
                        </div>
                      </div>
                    </CartProduct>
                  ))}
                </div>
            }
          </ScrollArea>

          <div className="space-y-6">
            <div className="border-b pb-4 flex justify-between">
              <span className="">Shipping</span>
              <span className="font-bold">Free</span>
            </div>
            <div className="flex justify-between">
              <span className="text-lg font-bold">Total</span>
              <span className="font-bold">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>

      <Button
        className="w-full p-6"
        onClick={() => {
          if (type !== "existing") {
            return form.handleSubmit(handleSubmit)();
          }
          createOrder({
            type,
            total,
            products: products.map(el => ({
              name: el.productData.title,
              product_id: el.productData.id,
              quantity: el.quantity,
              price: Number(el.productData.price.toFixed(2)),
            })),
            shipping_id: currAddress
          })
        }}
      >
        Place Order
      </Button>
    </div>
  )

}
