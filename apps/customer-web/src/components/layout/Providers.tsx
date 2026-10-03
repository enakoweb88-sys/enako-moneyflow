"use client";

import React from "react";
import { CustomerProvider } from "../../mock/CustomerContext";
import { Toaster } from "sonner";

export const Providers: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <CustomerProvider>
      {children}
      <Toaster position="top-right" richColors />
    </CustomerProvider>
  );
};
