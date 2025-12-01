"use client"

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { Check } from "lucide-react";


const CHECKOUTSTEPS = {
  "/checkout": 2,
  "/carts": 1,
  "/complete": 3,

}

export const OrderSteps = () => {
  const currPath = usePathname() as "/checkout" | "/carts" | "/complete";
  const [step, setStep] = useState(CHECKOUTSTEPS[currPath]);

  useEffect(() => {
    setStep(CHECKOUTSTEPS[currPath])
  }, [currPath])

  const stepComponents = [
    {
      label: "Shopping Cart",
      className: "",
      step: 1
    },
    {
      label: "Checkout Details",
      className: "",
      step: 2
    },
    {
      label: "Order Complete",
      className: "",
      step: 3
    },
  ];

  return (
    <div className="w-full flex justify-between gap-8 items-center">
      {stepComponents.map((el) => {
        const isActive = el.step === step
        const isDone = el.step < step

        return (
          <div className={cn(
            "flex items-center w-full gap-4 py-6",
            el.step < step && "max-md:hidden",
            isActive && "border-b-2 border-neutral-07",
            isDone && "text-green border-b-2 border-green",
            el.step > step && "max-md:w-fit text-[#B1B5C3]"
          )}>
            <div className={
              cn(
                "size-10 text-white flex items-center justify-center rounded-full bg-[#23262F]",
                isDone && "bg-green",
                el.step > step && "bg-[#B1B5C3]"
              )
            }>{
                isDone ?
                  <Check />
                  :
                  el.step
              }</div>
            <span className={
              cn(
                "text-lg font-medium",
                el.step > step && "max-md:hidden"
              )
            }>
              {el.label}
            </span>
          </div>
        )
      }
      )}
    </div>
  )
}
