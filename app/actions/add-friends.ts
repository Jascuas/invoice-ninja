"use server";

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'

export const addFriends = async (user_id_2: string) => {
  if (user_id_2 === null) return;

  const supabase = createServerActionClient({ cookies });
  // revisar si el usuario realmene está autentificado
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user === null) return;

  await supabase.from("friends").insert({ user_id: user.id, friend_id: user_id_2 });

  revalidatePath(`/?content=${user_id_2}`);
};
