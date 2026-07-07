'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState, FC } from 'react';
import Link from 'next/link';
import { createClient } from '../utils/supabase/client';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  const adminEmail = (
    process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'ayokunleshittu@gmail.com'
  ).toLowerCase();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data } = await supabase.auth.getSession();
      const email = data?.session?.user?.email?.toLowerCase() || '';
      setIsAdmin(email === adminEmail);
    };

    checkAdmin();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const email = session?.user?.email?.toLowerCase() || '';
      setIsAdmin(email === adminEmail);
    });

    return () => subscription.unsubscribe();
  }, [supabase, adminEmail]);

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] backdrop-blur-md bg-gradient-to-r from-[#071026]/95 via-[#0a1a35]/95 to-[#071026]/95 border-b border-blue-500/30 shadow-lg shadow-blue-500/20">
      <div className="flex justify-between items-center max-w-[1200px] mx-auto px-6 py-5 relative">
        {/* Logo - Premium styling */}
        <div className="flex items-center gap-3 group">
          <div className="relative">
            <Image
              className="rounded-full h-[50px] w-[50px] object-cover ring-2 ring-blue-400/40 group-hover:ring-blue-400/70 transition-all duration-300"
              src="/img/CSSF-FUNAAB-LOGO.jpg"
              alt="CSSF FUNAAB Logo"
              width={50}
              height={50}
              priority
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/0 via-blue-400/0 to-blue-300/10 group-hover:to-blue-300/20 transition-all duration-300" />
          </div>
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200 text-lg font-semibold tracking-wide">
            CSSF FUNAAB
          </h1>
        </div>

        {/* Desktop Nav - Premium styling */}
        <nav className="hidden md:flex items-center gap-3">
          <Link href="#">
            <Badge className="bg-blue-50/10 hover:bg-blue-50/20 text-blue-100 hover:text-white border-blue-400/20 cursor-pointer px-4 py-1.5 text-sm font-medium transition-all duration-300">
              Home
            </Badge>
          </Link>
          <Link href="#about">
            <Badge className="bg-blue-50/10 hover:bg-blue-50/20 text-blue-100 hover:text-white border-blue-400/20 cursor-pointer px-4 py-1.5 text-sm font-medium transition-all duration-300">
              About
            </Badge>
          </Link>
          <Link href="#Group">
            <Badge className="bg-blue-50/10 hover:bg-blue-50/20 text-blue-100 hover:text-white border-blue-400/20 cursor-pointer px-4 py-1.5 text-sm font-medium transition-all duration-300">
              Units
            </Badge>
          </Link>
          <Link href="#contact">
            <Badge className="bg-blue-50/10 hover:bg-blue-50/20 text-blue-100 hover:text-white border-blue-400/20 cursor-pointer px-4 py-1.5 text-sm font-medium transition-all duration-300">
              Contact
            </Badge>
          </Link>
          {isAdmin && (
            <Link href="/admin-portal" className="inline-flex items-center">
              <Badge className="cursor-pointer bg-gradient-to-r from-blue-200 to-blue-200 hover:from-blue-200 hover:to-blue-200 text-shadow-gray-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 border-blue-400/30">
                Admin Panel
              </Badge>
            </Link>
          )}
        </nav>

        {/* Hamburger - Premium styling */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          className={`block md:hidden relative w-10 h-10 flex items-center justify-center text-white text-2xl transition-all duration-300 rounded-lg hover:bg-blue-500/10 active:bg-blue-500/20 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        >
          ☰
        </button>
      </div>

      {/* Mobile Nav - Premium styling */}
      {isOpen && (
        <nav className="flex flex-col md:hidden bg-gradient-to-b from-[#071026]/98 via-[#0a1a35]/98 to-[#071026]/98 backdrop-blur-lg absolute top-[calc(100%)] right-0 w-1/2 p-6 gap-4 border-l border-blue-500/30 shadow-2xl shadow-blue-500/20 h-auto pb-4">
          <Link href="#">
            <Badge className="bg-blue-50/10 hover:bg-blue-50/20 text-blue-100 hover:text-white border-blue-400/20 cursor-pointer px-4 py-2 text-sm font-medium transition-all duration-300 w-full justify-start">
              Home
            </Badge>
          </Link>
          <Link href="#about">
            <Badge className="bg-blue-50/10 hover:bg-blue-50/20 text-blue-100 hover:text-white border-blue-400/20 cursor-pointer px-4 py-2 text-sm font-medium transition-all duration-300 w-full justify-start">
              About
            </Badge>
          </Link>
          <Link href="#Group">
            <Badge className="bg-blue-50/10 hover:bg-blue-50/20 text-blue-100 hover:text-white border-blue-400/20 cursor-pointer px-4 py-2 text-sm font-medium transition-all duration-300 w-full justify-start">
              Units
            </Badge>
          </Link>
          <Link href="#contact">
            <Badge className="bg-blue-50/10 hover:bg-blue-50/20 text-blue-100 hover:text-white border-blue-400/20 cursor-pointer px-4 py-2 text-sm font-medium transition-all duration-300 w-full justify-start">
              Contact
            </Badge>
          </Link>
          {isAdmin && (
            <Link href="/admin-portal" className="inline-flex items-center pt-2">
              <Badge className="cursor-pointer bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 border-blue-400/30 w-full justify-center">
                Admin Panel
              </Badge>
            </Link>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
