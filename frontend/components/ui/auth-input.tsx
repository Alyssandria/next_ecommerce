"use client";
import { ComponentProps, useState } from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Eye, EyeOff } from "lucide-react";

export const AuthInput = ({ type, className, ...props }: ComponentProps<typeof Input>) => {
  const [visible, setVisible] = useState<boolean>(false);
  return (
    type !== "password" ?
      < Input className={cn("aria-invalid:ring-transparent border-0 border-b text-lg p-6 rounded-none px-0 border-b-neutral-03 placeholder:font-normal placeholder:text-neutral-04 focus-visible:ring-transparent focus-visible:border-b-2", className)} {...props} />
      :
      <div className="relative">
        < Input type={!visible ? type : "text"} className={cn("aria-invalid:ring-transparent border-0 border-b text-lg p-6 rounded-none px-0 border-b-neutral-03 placeholder:font-normal placeholder:text-neutral-04 focus-visible:ring-transparent focus-visible:border-b-2 pr-15", className)} {...props} />
        <Button type="button" onClick={() => setVisible(prev => !prev)} className="hover:bg-transparent hover:cursor-pointer bg-transparent text-neutral-04 absolute right-3 top-1/2 -translate-y-1/2">
          {
            visible ?
              <EyeOff />
              : <Eye />
          }
        </Button>
      </div>
  )

}
