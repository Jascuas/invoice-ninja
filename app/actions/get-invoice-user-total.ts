"use server";

import { cookies } from "next/headers";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { Database } from "../@types/database";

export const getInvoiceUserTotal = async (invoice_id: string) => {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data } = await supabase
    .from("user_invoice_total")
    .select("*, user_id:users(*)")
    .eq("invoice_id", invoice_id);

  console.log(data);
  return data;
};
