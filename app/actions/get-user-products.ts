"use server";

import { cookies } from "next/headers";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { Database } from "../@types/database";

export const getUserProducts = async (user_id: string[]) => {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: userProducts, ...rest } = await supabase
    .from("products")
    .select("*, user_products(user_id(*))")
    .in("user_products.user_id", user_id)
    .order("description", { ascending: true });

  return userProducts;
};

export const getUserFilterProducts = async (
  user_id: string[],
  products: string[]
) => {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: userProducts, ...rest } = await supabase
    .from("products")
    .select("*, user_products(user_id(*))")
    .in("user_products.user_id", user_id)
    .in("id", products)
    .order("description", { ascending: true });

  return userProducts;
};
