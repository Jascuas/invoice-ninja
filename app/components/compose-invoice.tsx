"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@nextui-org/react";

import { addInvoice } from "../actions/add-invoice";

export function ComposeInvoice() {
  const formRef = useRef<HTMLFormElement>(null);
  const { pending } = useFormStatus();
  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await addInvoice(formData);
        formRef.current?.reset();
      }}
      className="flex flex-row gap-4 items-center w-full p-3 bg-content1 rounded-lg max-w-xs"
    >
      {/* <Input
        id="sub_total"
        type="text"
        name="sub-total"
        variant={"underlined"}
        label="Invoice amount"
        isClearable
      /> */}
      <input type="text" name="sub-total" />
      <Button
        className="px-8"
        color="primary"
        type="submit"
        isDisabled={pending}
        isLoading={pending}
      >
        {pending ? "Adding..." : "Add invoice"}
      </Button>
    </form>
  );
}
