import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Database } from "@/app/@types/database";
import { ComposeInvoice } from "@/app/components/compose-invoice";
import { InvoceLists } from "@/app/components/invoices-list";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session === null) {
    redirect("/login");
  }
  const { data: invoices } = await supabase
    .from("invoices")
    .select("*, user:users(*)")
    .order("created_at", { ascending: false });
  return (
    <section className="max-w-[600px] w-full mx-auto border-l border-r border-white/20 h-full flex-1">
      <ComposeInvoice userAvatarUrl={session.user?.user_metadata?.avatar_url} />
      <InvoceLists invoices={invoices} />
    </section>
  );
}
