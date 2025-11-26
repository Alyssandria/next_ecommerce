import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/providers/query-provider";
import { PaymentProvider } from "@/providers/payment-provider";

const poppins = Poppins({
  weight: ['300', "500", "700"],
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: "Elegant",
  description: "Your one stop shop to slaying",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased`}
      >
        <QueryProvider>
          <PaymentProvider>
            {children}
          </PaymentProvider>
        </QueryProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
