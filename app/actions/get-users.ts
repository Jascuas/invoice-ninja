"use server";

import { cookies } from "next/headers";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { Database } from "../@types/database";

export const getUsers = async () => {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: users } = await supabase
    .from("users")
    .select("*")
    .order("name", { ascending: true });
  return users;
};
