"use client"
import { useLocalStorage } from "@/hooks/use-local-storage";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { toast } from "sonner";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { getItem } = useLocalStorage()
  const router = useRouter()

  useEffect(() => {
    if (getItem('token')) {
      setTimeout(() => {
        toast.error('Cannot access login or register page. You are already logged in');
      })
      router.replace('/');
    }
  }, [router])

  return (
    <div className="w-full min-h-screen">
      <div className="h-20 flex items-center justify-center text-2xl"><span className="block">3legant.</span></div>
      <div className="flex flex-col gap-8">
        <div>
          <Image src={"/auth-bg.png"} width={740} height={1080} alt="Authentication welcome image" />
        </div>
        <div className="size-full p-6">
          {children}
        </div>
      </div>
    </div >
  )
}
