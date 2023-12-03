"use client";

import { experimental_useFormStatus as useFormStatus } from "react-dom";

import { Button } from "@nextui-org/react";

export function ComposeInvoiceButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      color="primary"
      type="submit"
      isDisabled={pending}
      isLoading={pending}
    >
      {pending ? "Adding..." : "Add invoice"}
    </Button>
  );
}
