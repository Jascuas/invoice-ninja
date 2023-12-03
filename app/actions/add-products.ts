"use server";

import { cookies } from "next/headers";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";

import { AddProduct, ProductInfo } from "../@types/invoices";

export const addProducts = async (products?: AddProduct[]) => {
  if (products === null) return;

  const supabase = createServerActionClient({ cookies });
  // revisar si el usuario realmene está autentificado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user === null) return;

  const res = await supabase
    .from("products")
    .upsert(products, { onConflict: "external_id" })
    .select();
  console.log(res);
  console.log(res.data);
  return res;
  //revalidatePath(`/?content=${sub_total.toString()}`);
};

export const addLineProducts = async (products?: ProductInfo[]) => {
  if (products === null) return;
  console.log(products);
  const supabase = createServerActionClient({ cookies });
  // revisar si el usuario realmene está autentificado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user === null) return;

  const res = await supabase.from("invoice_products").insert(products).select();
  console.log(res);
  return res;
  //revalidatePath(`/?content=${sub_total.toString()}`);
};
