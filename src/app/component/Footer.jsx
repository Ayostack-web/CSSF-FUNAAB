"use client";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import { FaXTwitter } from "react-icons/fa6"; // New X (Twitter) logo

export default function Footer() {
  return (
    <>
     <footer className="bg-[#071026] text-blue-100 text-center py-8 px-4">
  <h1>Follow Us</h1>
  <div className="max-w-[600px] mx-auto">


    <div className="mt-10 flex justify-center gap-5 text-2xl">
      <a href="#" className="cursor-pointer transition-transform duration-300 text-blue-100 no-underline select-none hover:scale-130 hover:text-[#9bb6e0]">    <FaXTwitter />  </a>
      <a href="https://www.facebook.com/cssf.unaab" className="cursor-pointer transition-transform duration-300 text-blue-100 no-underline select-none hover:scale-130 hover:text-[#9bb6e0]">     <FaFacebookF />  </a>
      <a href="https://www.instagram.com/cssf_unification_funaab?igsh=YzljYTk1ODg3Zg==" className="cursor-pointer transition-transform duration-300 text-blue-100 no-underline select-none hover:scale-130 hover:text-[#9bb6e0]">         <FaInstagram /></a>
         <a href="#" className="cursor-pointer transition-transform duration-300 text-blue-100 no-underline select-none hover:scale-130 hover:text-[#9bb6e0]">        <SiTiktok />  </a>
    </div>



    <p className="mt-4 text-sm text-gray-400">
      © 2025 CSSF FUNAAB. All rights reserved.
    </p>

  </div>
</footer>
    </>
  );
}











