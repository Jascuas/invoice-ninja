"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";

export const addInvoice = async (formData: FormData) => {
  const sub_total = formData.get("sub-total");

  if (sub_total === null) return;

  const supabase = createServerActionClient({ cookies });
  // revisar si el usuario realmene está autentificado
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user === null) return;
  console.log({ sub_total });
  await supabase.from("invoices").insert({ sub_total, user_id: user.id });

  revalidatePath(`/?content=${sub_total.toString()}`);
};

export const addReaderInvoice = async (sub_total: number) => {
  if (sub_total === null) return;
  console.log({ sub_total });
  const supabase = createServerActionClient({ cookies });
  // revisar si el usuario realmene está autentificado
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user === null) return;

  const res = await supabase
    .from("invoices")
    .insert({ sub_total: sub_total, user_id: user.id })
    .select("id");

  return res;
};
