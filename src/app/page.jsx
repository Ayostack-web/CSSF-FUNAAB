
  
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

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getStoragePathFromUrl(imageUrl, bucket) {
  try {
    const parsed = new URL(imageUrl || "");
    const marker = `/${bucket}/`;
    const idx = parsed.pathname.indexOf(marker);
    if (idx !== -1) {
      return decodeURIComponent(parsed.pathname.slice(idx + marker.length));
    }
    const fallback = parsed.pathname.split('/').pop() || '';
    return decodeURIComponent(fallback);
  } catch {
    return (imageUrl || '').split('/').pop()?.split('?')[0] || '';
  }
}




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

  const { data: banners } = await supabase
    .from("banners")
    .select("*")
    .order("created_at", { ascending: false });

  // If images are stored with public URLs but the bucket is private, generate signed URLs server-side
  let worshipWithUrls = worship || [];
  let bannersWithUrls = banners || [];
  try {
    const serviceUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (serviceUrl && serviceKey) {
      const service = createServiceClient(serviceUrl, serviceKey);

      if (!Array.isArray(bannersWithUrls) || bannersWithUrls.length === 0) {
        const { data: serviceBanners } = await service
          .from("banners")
          .select("*")
          .order("created_at", { ascending: false });
        bannersWithUrls = serviceBanners || [];
      }

      if (Array.isArray(worshipWithUrls) && worshipWithUrls.length > 0) {
        const signedWorship = await Promise.all(
          worshipWithUrls.map(async (item) => {
            try {
              const imageUrl = item.image_url || "";
              const fileName = getStoragePathFromUrl(imageUrl, "worship_images");
              if (!fileName) return item;

              const { data } = await service.storage
                .from("worship_images")
                .createSignedUrl(fileName, 60 * 60);

              return { ...item, image_url: data?.signedUrl || item.image_url };
            } catch {
              return item;
            }
          })
        );

        worshipWithUrls = signedWorship;
      }

      if (Array.isArray(bannersWithUrls) && bannersWithUrls.length > 0) {
        const signedBanners = await Promise.all(
          bannersWithUrls.map(async (item) => {
            try {
              const imageUrl = item.image_url || "";
              const fileName = getStoragePathFromUrl(imageUrl, "event-banners");
              if (!fileName) return item;

              const { data } = await service.storage
                .from("event-banners")
                .createSignedUrl(fileName, 60 * 60);

              return { ...item, image_url: data?.signedUrl || item.image_url };
            } catch {
              return item;
            }
          })
        );

        bannersWithUrls = signedBanners;
      }
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
       <UpcomingEvent serverEvents={bannersWithUrls || []} /> {/* Now it sits between Hero and About */}
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