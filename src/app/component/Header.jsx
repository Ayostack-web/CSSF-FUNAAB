"use client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "../utils/supabase/client";
import { Badge } from "@/components/ui/badge";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const ADMIN_EMAIL = "ayokunleshittu@gmail.com";

    const checkAdmin = async () => {
      const { data } = await supabase.auth.getSession();
      const userEmail = data?.session?.user?.email || "";
      setIsAdmin(userEmail === ADMIN_EMAIL);
    };

    checkAdmin();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const userEmail = session?.user?.email || "";
      setIsAdmin(userEmail === ADMIN_EMAIL);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <header className="bg-[#071026] text-white py-4 fixed top-0 left-0 right-0 z-[1000]">
      <div className="flex justify-between items-center max-w-[1200px] mx-auto px-4 relative">
        {/* Logo */}

        <Image
          className="rounded-4xl h-[50px]"
          src="/img/CSSF-FUNAAB-LOGO.jpg"
          alt="Ayostack Logo"
          width={100}
          height={30}
          priority
        />{" "}
        <h1 className="text-blue-200 text-xl animate-pulse">CSSF FUNAAB</h1>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-4">
          <Link href="#" className="text-blue-100 hover:text-white transition">
            Home
          </Link>
          <Link href="#about" className="text-blue-100 hover:text-white transition">
            About
          </Link>
          <Link href="#Group" className="text-blue-100 hover:text-white transition">
            Units
          </Link>
          <Link href="#contact" className="text-blue-100 hover:text-white transition">
            Contact
          </Link>
          {isAdmin && (
            <Link href="/admin-portal" className="inline-flex items-center">
              <Badge variant="secondary" className="cursor-pointer">Admin Panel</Badge>
            </Link>
          )}
        </nav>

        {/* Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          className={`block md:hidden text-white text-2xl bg-none border-none transition-transform duration-400 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}>
          ☰
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <nav className="flex flex-col md:hidden bg-[#071026] absolute top-16 right-0 p-4 w-[200px] z-10 gap-4">
          <Link href="#" className="text-blue-100 hover:text-white transition">
            Home
          </Link>
          <Link href="#about" className="text-blue-100 hover:text-white transition">
            About
          </Link>
          <Link href="#Group" className="text-blue-100 hover:text-white transition">
            Units
          </Link>
          <Link href="#contact" className="text-blue-100 hover:text-white transition">
            Contact
          </Link>
          {isAdmin && (
            <Link href="/admin-portal" className="inline-flex items-center">
              <Badge variant="secondary" className="cursor-pointer">Admin Panel</Badge>
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}