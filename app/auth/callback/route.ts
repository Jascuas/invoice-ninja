import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

// esto es una opción de Next.js, para evitar que cachee de forma
// estática la ruta, y que siempre se ejecute en el servidor
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code !== null) {
    const supabase = createRouteHandlerClient({ cookies });
    const res = await supabase.auth.exchangeCodeForSession(code);
    console.log(res);
  }

  return NextResponse.redirect(requestUrl.origin);
}
