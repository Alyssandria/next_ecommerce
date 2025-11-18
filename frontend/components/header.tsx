import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import Link from "next/link";
import { MobileMenuIcon } from "./ui/icons/menu-icon";
import { CartSidebar } from "./cart-sidebar";

const NAV = [
  {
    name: "LOGO",
    label: "3Legant.",
    href: "/",
    className: "text-primary text-2xl font-medium"
  },
  {
    name: "HOME",
    label: "Home",
    href: "/",
    className: "max-lg:hidden"
  },
  {
    name: "Shop",
    label: "Shop",
    href: "/shop",
    className: "max-lg:hidden"
  },
  {
    name: "CONTACTS",
    label: "Contact use",
    href: "/",
    className: "max-lg:hidden"
  },
];

export const Header = () => {
  return (
    <header className="h-20">
      <nav className="size-full flex items-center">
        <ul className="flex items-center w-full">
          <Sheet>
            <SheetTrigger><MobileMenuIcon className="size-8" /></SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Are you absolutely sure?</SheetTitle>
                <SheetDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove your data from our servers.
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
          {
            NAV.map(el => (
              <li key={el.name} className={el.className}>
                <Link href={el.href}>{el.label}</Link>
              </li>
            ))
          }
          <CartSidebar />
        </ul>
      </nav>
    </header>
  )
}
