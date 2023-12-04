"use client";

import { useRouter } from "next/navigation";

import { Avatar, Button } from "@nextui-org/react";
import {
  createClientComponentClient,
  type Session,
} from "@supabase/auth-helpers-nextjs";

import { Database } from "../@types/database";
import { GitHubIcon } from "./icons";

export function AuthButton({ session }: { session: Session | null }) {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const user = session?.user.user_metadata;
  const handleSignIn = async () => {
    const res = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: window?.location?.origin + "/auth/callback",
      },
    });
    console.log(res);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <>
      {session === null ? (
        <button
          onClick={handleSignIn}
          type="button"
          className="text-white bg-[#24292F] focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center focus:ring-gray-500 hover:bg-[#050708]/30 mr-2 mb-2"
        >
          <GitHubIcon />
          Iniciar sesión con Github
        </button>
      ) : (
        <div className="flex gap-4 items-center">
          <div className="flex gap-2 items-center px-3 py-1 bg-zinc-700 rounded-lg">
            <Avatar size="sm" src={user?.avatar_url} />
            <h4 className="text-small font-semibold leading-none text-default-600">
              @{user?.user_name}
            </h4>
          </div>

          <Button radius="sm" onClick={handleSignOut}>
            Logout
          </Button>
        </div>
      )}
    </>
  );
}
