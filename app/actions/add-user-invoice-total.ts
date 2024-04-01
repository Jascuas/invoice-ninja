"use server";

import { cookies } from "next/headers";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";

import { AddUserInvoiceTotal } from "../@types/invoices";

export const addUserInvoiceTotal = async (
  userTotals?: AddUserInvoiceTotal[]
) => {
  if (userTotals === null) return;
  console.log(userTotals);
  const supabase = createServerActionClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user === null) return;

  const res = await supabase
    .from("user_invoice_total")
    .upsert(userTotals, {
      onConflict: "user_id, invoice_id",
    })
    .select();

  console.log(res);

  return res;
};
