"use server";

import { cookies } from "next/headers";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { Database } from "../@types/database";

export const getInvoice = async (invoice_id: string) => {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: invoice } = await supabase
    .from("invoices")
    .select("*, user:users(*)")
    .eq("id", invoice_id);

  return invoice?.[0];
};
