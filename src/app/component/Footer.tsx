'use client';

import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';
import { FaTelegram } from 'react-icons/fa6';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative backdrop-blur-md bg-gradient-to-r from-[#071026]/95 via-[#0a1a35]/95 to-[#071026]/95 border-t border-blue-500/30 shadow-lg shadow-blue-500/20">
      <div className="max-w-[1200px] mx-auto px-6 py-6">
        {/* Heading with gradient text */}
        <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200 text-2xl font-semibold tracking-wide text-center mb-2">
          Follow Us
        </h1>
        <p className="text-blue-100/70 text-center text-lg mb-6">Connect with CSSF FUNAAB on social media</p>

        {/* Social Icons - Premium styling */}
        <div className="flex justify-center gap-8 mb-6">
          <a
            href="https://t.me/+vV2dBaEmfBkyZDFk"
            className="group relative p-4 rounded-full bg-gradient-to-br from-blue-600/10 to-blue-500/10 border border-blue-400/30 hover:border-blue-400/60 hover:bg-gradient-to-br hover:from-blue-600/20 hover:to-blue-500/20 text-blue-100 hover:text-blue-50 no-underline select-none transition-all duration-300 cursor-pointer"
            aria-label="Telegram"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTelegram className="text-xl group-hover:scale-110 group-hover:drop-shadow-lg group-hover:drop-shadow-blue-400/50 transition-all duration-300" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/0 via-blue-400/0 to-blue-300/10 group-hover:to-blue-300/20 transition-all duration-300" />
          </a>
          <a
            href="https://www.facebook.com/cssf.unaab"
            className="group relative p-4 rounded-full bg-gradient-to-br from-blue-600/10 to-blue-500/10 border border-blue-400/30 hover:border-blue-400/60 hover:bg-gradient-to-br hover:from-blue-600/20 hover:to-blue-500/20 text-blue-100 hover:text-blue-50 no-underline select-none transition-all duration-300 cursor-pointer"
            aria-label="Facebook"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookF className="text-xl group-hover:scale-110 group-hover:drop-shadow-lg group-hover:drop-shadow-blue-400/50 transition-all duration-300" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/0 via-blue-400/0 to-blue-300/10 group-hover:to-blue-300/20 transition-all duration-300" />
          </a>
          <a
            href="https://www.instagram.com/cssf_unification_funaab?igsh=YzljYTk1ODg3Zg=="
            className="group relative p-4 rounded-full bg-gradient-to-br from-blue-600/10 to-blue-500/10 border border-blue-400/30 hover:border-blue-400/60 hover:bg-gradient-to-br hover:from-blue-600/20 hover:to-blue-500/20 text-blue-100 hover:text-blue-50 no-underline select-none transition-all duration-300 cursor-pointer"
            aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram className="text-xl group-hover:scale-110 group-hover:drop-shadow-lg group-hover:drop-shadow-blue-400/50 transition-all duration-300" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/0 via-blue-400/0 to-blue-300/10 group-hover:to-blue-300/20 transition-all duration-300" />
          </a>
          <a
            href="#"
            className="group relative p-4 rounded-full bg-gradient-to-br from-blue-600/10 to-blue-500/10 border border-blue-400/30 hover:border-blue-400/60 hover:bg-gradient-to-br hover:from-blue-600/20 hover:to-blue-500/20 text-blue-100 hover:text-blue-50 no-underline select-none transition-all duration-300 cursor-pointer"
            aria-label="TikTok"
          >
            <SiTiktok className="text-xl group-hover:scale-110 group-hover:drop-shadow-lg group-hover:drop-shadow-blue-400/50 transition-all duration-300" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/0 via-blue-400/0 to-blue-300/10 group-hover:to-blue-300/20 transition-all duration-300" />
          </a>
        </div>

        {/* Footer Text */}
        <div className="border-t border-blue-500/20 pt-4">
          <p className="text-blue-100/70 text-center text-lg font-medium">
            © {currentYear} CSSF FUNAAB. | Developed By Ayokunle Shittu.
          </p>
          <div className="mt-2 text-center">
            <Link href="/admin-login" className="text-blue-400/40 hover:text-blue-400/70 text-xs transition-colors duration-300">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
