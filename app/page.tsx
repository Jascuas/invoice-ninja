import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Database } from "@/app/@types/database";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import Statistics from "./components/statistics";

export default async function Dashboard() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex  flex-1 px-6 2xl:container w-full">
      <Statistics />
    </div>
  );
}
