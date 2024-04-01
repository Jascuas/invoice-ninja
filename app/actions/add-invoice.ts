"use server";

import { cookies } from "next/headers";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";

export const addReaderInvoice = async (sub_total: number) => {
  if (sub_total === null) return;

  const supabase = createServerActionClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user === null) return;

  const res = await supabase
    .from("invoices")
    .insert({ sub_total: sub_total, user_id: user.id })
    .select("id");

  return res;
};
