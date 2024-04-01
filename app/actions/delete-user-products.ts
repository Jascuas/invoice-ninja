"use server";

import { cookies } from "next/headers";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";

export const deleteUserProducts = async (
  user_id: string,
  products?: readonly any[]
) => {
  if (products === undefined) return;

  const supabase = createServerActionClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user === null) return;

  const res = await supabase
    .from("user_products")
    .delete()
    .eq("user_id", user_id)
    .in("product_id", products);

  return res;
};
