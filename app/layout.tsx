import "./globals.css";

import type { Metadata } from "next";
import { cookies } from "next/headers";
import { twMerge } from "tailwind-merge";

import { Database } from "@/app/@types/database";
import { NavBar } from "@/app/components/nav-bar";
import { Providers } from "@/app/providers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export const metadata: Metadata = {
  title: "Invoice ninja",
  description: "Web app para manejar los tickets de la compra.",
};

export default async function RootLayout({
  children,
  types,
}: {
  children: React.ReactNode;
  types: React.ReactNode;
}) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en" className="dark">
      <body>
        <Providers>
          <div className="flex h-full min-h-screen flex-col flex-1">
            {session && <NavBar session={session} />}
            <main
              className={twMerge(
                "flex h-full flex-1 flex-col ",
                session && "max-w-full px-6 my-4"
              )}
            >
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
