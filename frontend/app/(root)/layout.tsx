import { Header } from "@/components/header";
import { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      <div>
        {children}
      </div>
    </div>
  )
}
