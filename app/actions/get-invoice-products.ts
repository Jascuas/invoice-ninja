"use server";

import { cookies } from "next/headers";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { Database } from "../@types/database";

export const getInvoiceProducts = async (invoice_id: string) => {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: invoice_products } = await supabase
    .from("invoice_products")
    .select("*")
    .eq("invoice_id", invoice_id)
    // .range(0, 5)
    .order("description", { ascending: true });

  return invoice_products;
};
