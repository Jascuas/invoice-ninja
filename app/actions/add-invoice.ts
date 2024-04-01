"use server";

import { cookies } from "next/headers";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";

export const addReaderInvoice = async (sub_total: number) => {
  if (sub_total === null) return;
  console.log({ sub_total });
  const supabase = createServerActionClient({ cookies });
  // revisar si el usuario realmene está autentificado
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
