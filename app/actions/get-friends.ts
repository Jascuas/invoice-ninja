"use server";

import { cookies } from "next/headers";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { Database } from "../@types/database";
import { Friend, User } from "../@types/invoices";

export const getFriends = async (user_id: string) => {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: friends, ...rest } = await supabase
    .from("friends")
    .select("*, friend_id:users(*)")
    .eq("user_id", user_id);
  // .order("user.name", { ascending: true });

  const newfriends: Friend[] | undefined = friends?.map((item) => ({
    id: item.id,
    friend_id: item.friend_id as unknown as User,
    created_at: item.created_at,
    status: item.status,
  }));
  return newfriends;
};
