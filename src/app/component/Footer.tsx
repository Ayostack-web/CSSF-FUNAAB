'use client';

import { FC } from 'react';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';
import { FaTelegram } from 'react-icons/fa6';

interface FooterProps {}

const Footer: FC<FooterProps> = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#071026] text-blue-100 text-center py-8 px-4">
      <h1 className="text-xl">Follow Us</h1>
      <div className="max-w-[600px] mx-auto">
        <div className="mt-10 flex justify-center gap-5 text-2xl">
          <a
            href="https://t.me/+vV2dBaEmfBkyZDFk"
            className="cursor-pointer transition-transform duration-300 text-blue-100 no-underline select-none hover:scale-130 hover:text-[#9bb6e0]"
            aria-label="Telegram"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTelegram />
          </a>
          <a
            href="https://www.facebook.com/cssf.unaab"
            className="cursor-pointer transition-transform duration-300 text-blue-100 no-underline select-none hover:scale-130 hover:text-[#9bb6e0]"
            aria-label="Facebook"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://www.instagram.com/cssf_unification_funaab?igsh=YzljYTk1ODg3Zg=="
            className="cursor-pointer transition-transform duration-300 text-blue-100 no-underline select-none hover:scale-130 hover:text-[#9bb6e0]"
            aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram />
          </a>
          <a
            href="#"
            className="cursor-pointer transition-transform duration-300 text-blue-100 no-underline select-none hover:scale-130 hover:text-[#9bb6e0]"
            aria-label="TikTok"
          >
            <SiTiktok />
          </a>
        </div>

        <p className="mt-4 text-bold text-gray-200">
          © {currentYear} CSSF FUNAAB. | Developed By Ayokunle Shittu.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
