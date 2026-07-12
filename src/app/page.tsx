import { createClient } from "./utils/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import Header from "./component/Header";
import Footer from "./component/Footer";
import Hero from "./component/Hero";
import Groups from "./component/Groups";
import About from "./component/About";
import Verse from "./component/Verse";
import Service from "./component/Service";
import Contact from "./component/Contact";
import Sermon from "./component/Sermon";
import PledgeSection from "./component/PledgeSection";
import Loader from "./component/Loader";
import UpcomingEvent from "./component/UpcomingEvents";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getStoragePathFromUrl(imageUrl: string, bucket: string): string {
  try {
    const parsed = new URL(imageUrl || "");
    const marker = `/${bucket}/`;
    const idx = parsed.pathname.indexOf(marker);
    if (idx !== -1) {
      return decodeURIComponent(parsed.pathname.slice(idx + marker.length));
    }
    const fallback = parsed.pathname.split("/").pop() || "";
    return decodeURIComponent(fallback);
  } catch {
    return (imageUrl || "").split("/").pop()?.split("?")[0] || "";
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any;

export default async function Home() {
  const supabase: SupabaseClient = await createClient();

  const { data: sermons } = await supabase
    .from("sermons")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: groups } = await supabase.from("groups").select("*");

  const { data: worship } = await supabase
    .from("worship_images")
    .select("*")
    .order("order", { ascending: true });

  const { data: banners } = await supabase
    .from("banners")
    .select("*")
    .order("created_at", { ascending: false });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let worshipWithUrls: any[] = worship || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let bannersWithUrls: any[] = banners || [];

  try {
    const serviceUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (serviceUrl && serviceKey) {
      const service: SupabaseClient = createServiceClient(serviceUrl, serviceKey);

      if (!Array.isArray(bannersWithUrls) || bannersWithUrls.length === 0) {
        const { data: serviceBanners } = await service
          .from("banners")
          .select("*")
          .order("created_at", { ascending: false });
        bannersWithUrls = serviceBanners || [];
      }

      if (Array.isArray(worshipWithUrls) && worshipWithUrls.length > 0) {
        const signedWorship = await Promise.all(
          worshipWithUrls.map(async (item: { image_url?: string }) => {
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
          bannersWithUrls.map(async (item: { image_url?: string }) => {
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
  } catch {
    // ignore and fall back to stored URLs
  }

  return (
    <>
      <Header />
      <Hero />
      <About />
      <Loader />
      <UpcomingEvent serverEvents={bannersWithUrls || []} />
      <Groups serverGroups={groups || []} />
      <Sermon serverSermons={sermons || []} serverWorship={worshipWithUrls || []} />
      <Service />
      <Verse />
      <PledgeSection />
      <Contact />
      <Footer />
    </>
  );
}
