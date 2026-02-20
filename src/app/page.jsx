
  
// src/app/page.jsx
// 1. REMOVE "use client"
// 2. REMOVE "import { useState } from 'react'"

import { createClient } from "./utils/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import Header from './component/Header'
import Footer from './component/Footer'
import Hero from './component/Hero'
import Groups from './component/Groups'
import About from './component/About'
import Verse from './component/Verse'
import Service from './component/Service'
import Contact from './component/Contact'
import Sermon from './component/Sermon'
import PledgeSection from './component/PledgeSection' // New wrapper
import Scrollindicator from './component/ScrollIndicator'
import Loader from './component/Loader'
import UpcomingEvent from './component/UpcomingEvents'




export default async function Home() {
  // This now works because we are in a Server Component
  const supabase = await createClient();

  // Fetch Sermons
  const { data: sermons } = await supabase
    .from("sermons")
    .select("*")
    .order("created_at", { ascending: false });

  // Fetch Groups
  const { data: groups } = await supabase.from("groups").select("*");

  // ADD THIS: Fetch Worship Gallery
  const { data: worship } = await supabase
   .from("worship_images")
   .select("*")
   .order("order", { ascending: true });

  // If images are stored with public URLs but the bucket is private, generate signed URLs server-side
  let worshipWithUrls = worship || [];
  try {
    const serviceUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (serviceUrl && serviceKey && Array.isArray(worshipWithUrls) && worshipWithUrls.length > 0) {
      const service = createServiceClient(serviceUrl, serviceKey);
      const signed = await Promise.all(
        worshipWithUrls.map(async (item) => {
          try {
            const imageUrl = item.image_url || "";
            // Try to extract filename from stored URL (last path segment)
            const parts = imageUrl.split("/");
            const fileName = parts.length ? parts[parts.length - 1].split("?")[0] : null;
            if (!fileName) return item;

            const { data } = await service.storage
              .from("worship_images")
              .createSignedUrl(fileName, 60 * 60); // 1 hour

            return { ...item, image_url: data?.signedUrl || item.image_url };
          } catch {
            return item;
          }
        })
      );

      worshipWithUrls = signed;
    }
  } catch (err) {
    // ignore and fall back to stored URLs
  }


  return (
    <> 
      <Scrollindicator/>
      <Header/>
      <Hero/>
      <About />
      <Loader/>
       <UpcomingEvent /> {/* Now it sits between Hero and About */}
      {/* Pass data as props */}
      <Groups serverGroups={groups || []} />
        <Sermon serverSermons={sermons || []}    serverWorship={worshipWithUrls || []}  />
      <Service/>
      <Verse/>
      {/* Move showPledge logic into this component */}
      <PledgeSection />
      <Contact/>
      <Footer/>
    </>
  );
}