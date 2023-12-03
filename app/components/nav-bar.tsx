"use client";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { type Session } from "@supabase/auth-helpers-nextjs";

import { AuthButton } from "./auth-button-client";

export const NavBar = ({ session }: { session: Session | null }) => {
  return (
    <Navbar maxWidth="full" isBordered>
      <NavbarBrand>
        <img src="/logo.png" className="w-12 h-12 mr-2" />
        <p className="font-bold text-inherit ">INVOICE NINJA</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItemCustom href="/" name="Dashboard" />
        <NavbarItemCustom href="/invoices" name="Invoices" />
        <NavbarItemCustom href="/products" name="Products" />
        <NavbarItemCustom href="/friends" name="Friends" />
        <NavbarItemCustom href="/reader" name="Reader" />
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <AuthButton session={session} />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

interface navbarItemCustomProps {
  href: string;
  name: string;
}
const NavbarItemCustom = ({ href, name }: navbarItemCustomProps) => {
  const pathname = usePathname();
  const isActive = href === pathname;

  return (
    <NavbarItem isActive={isActive}>
      <Link
        href={href}
        as={NextLink}
        color={isActive ? "primary" : "foreground"}
      >
        {name}
      </Link>
    </NavbarItem>
  );
};
