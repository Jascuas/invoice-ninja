"use server";

import { cookies } from "next/headers";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";

import { ProductInfo } from "../@types/invoices";

export const addLineProducts = async (products?: ProductInfo[]) => {
  if (products === null) return;

  const supabase = createServerActionClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user === null) return;

  const res = await supabase.from("invoice_products").insert(products).select();

  return res;
};
