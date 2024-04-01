"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";

import { AddUserProduct } from "../@types/invoices";

export const addUserProducts = async (products?: AddUserProduct[]) => {
  if (products === null) return;

  const supabase = createServerActionClient({ cookies });
  // revisar si el usuario realmene está autentificado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user === null) return;

  const res = await supabase
    .from("user_products")
    .upsert(products, {
      onConflict: "user_id, product_id",
      ignoreDuplicates: true,
    })
    .select();

  revalidatePath(`/?content=${res.status}`);
  return res;
};
