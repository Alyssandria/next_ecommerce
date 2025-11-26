"use client"

import { ReactNode } from "react"
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export const PaymentProvider = ({ children }: { children: ReactNode }) => {
  const initialOptions = {
    clientId: "test",
    enableFunding: "venmo",
    disableFunding: "",
    currency: "PHP",
    dataPageType: "product-details",
    components: "buttons",
    dataSdkIntegrationSource: "developer-studio",
  };
  return (
    <PayPalScriptProvider options={initialOptions}>
      {children}
    </PayPalScriptProvider>
  )
}
