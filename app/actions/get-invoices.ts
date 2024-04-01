"use server";

import { cookies } from "next/headers";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { Database } from "../@types/database";

export const getInvoices = async () => {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: invoices } = await supabase
    .from("invoices")
    .select("*, user:users(*)")
    .range(0, 5)
    .order("bought_at", { ascending: false });
  return invoices;
};
