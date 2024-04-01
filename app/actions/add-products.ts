"use server";

import { cookies } from "next/headers";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";

import { AddProduct } from "../@types/invoices";

export const addProducts = async (products?: AddProduct[]) => {
  if (products === null) return;

  const supabase = createServerActionClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user === null) return;

  const res = await supabase
    .from("products")
    .upsert(products, { onConflict: "external_id" })
    .select();

  return res;
  //revalidatePath(`/?content=${sub_total.toString()}`);
};
