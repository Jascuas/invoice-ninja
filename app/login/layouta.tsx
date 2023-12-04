import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Database } from "@/app/@types/database";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/");
  }

  return <>{children}</>;
}
