"use server";

import { cookies } from "next/headers";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { Database } from "../@types/database";

export const getProducts = async () => {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: products } = await supabase
    .from("products")
    .select("*")
    // .range(0, 5)
    .order("description", { ascending: true });

  return products;
};
