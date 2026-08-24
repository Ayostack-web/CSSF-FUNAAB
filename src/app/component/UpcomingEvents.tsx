"use client";
import { useState, useEffect, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import type { CarouselApi } from "@/components/ui/carousel";
import { createClient } from "../utils/supabase/client";

interface BannerEvent {
  id: string;
  event_name: string;
  image_url: string;
  event_date?: string;
  event_time?: string;
  eventDate?: string;
  eventTime?: string;
}

interface UpcomingEventsProps {
  serverEvents?: BannerEvent[];
}

export default function UpcomingEvents({ serverEvents = [] }: UpcomingEventsProps) {
  const [events, setEvents] = useState(serverEvents);
  const [api, setApi] = useState<CarouselApi | undefined>(undefined);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const supabase = createClient();

    const refreshEvents = async () => {
      try {
        const res = await fetch("/api/banner/list", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (Array.isArray(json.banners)) {
          setEvents(json.banners as BannerEvent[]);
          setCurrent(0);
          api?.scrollTo(0);
        }
      } catch {
        return;
      }
    };

    const channel = supabase
      .channel("banners-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "banners" },
        () => {
          refreshEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [api]);

  const formatEventDateTime = (event: BannerEvent) => {
    const rawDate = event.event_date || event.eventDate || "";
    const rawTime = event.event_time || event.eventTime || "";

    let formattedDate = "";
    if (rawDate) {
      const [year, month, day] = String(rawDate).split("-").map(Number);
      if (year && month && day) {
        const dateObj = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
        formattedDate = new Intl.DateTimeFormat("en-NG", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          timeZone: "Africa/Lagos",
        }).format(dateObj);
      }
    }

    let formattedTime = "";
    if (rawTime) {
      const [hourText, minuteText = "00"] = String(rawTime).split(":");
      const hour = Number(hourText);
      const minute = Number(minuteText);

      if (!Number.isNaN(hour) && !Number.isNaN(minute)) {
        const period = hour >= 12 ? "PM" : "AM";
        const hour12 = ((hour + 11) % 12) + 1;
        formattedTime = `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
      }
    }

    return [formattedDate, formattedTime].filter(Boolean).join(" • ");
  };

  const plugin = useRef(Autoplay({ delay: 8000, stopOnInteraction: true }));

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (events.length === 0) return null;

  return (
    <section className="relative mt-auto mx-1 py-16 bg-blue-50 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-black text-blue-900 mb-3 drop-shadow-lg tracking-wide">
            Upcoming Gatherings
          </h1>
          <p className="text-blue-700 text-lg">Exciting events waiting for you</p>
        </motion.div>

        <Carousel
          key={events.length}
          setApi={setApi}
          plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          className="w-full relative"
          opts={{ align: "start", loop: true }}
        >
          <CarouselContent className="-ml-4 animate-nudge">
            {events.map((event, idx) => {
              const formattedDateTime = formatEventDateTime(event);
              return (
                <CarouselItem
                  key={event.id}
                  index={idx}
                  className="pl-4 basis-[85%] md:basis-1/2 lg:basis-1/3 h-[420px]"
                >
                  <div className="animate-glow-border p-[3px] rounded-2xl h-full relative isolate shadow-xl flex flex-col hover:shadow-2xl transition-shadow duration-300">
                    <Card className="relative z-10 bg-white dark:bg-slate-950 w-full flex-1 rounded-[13px] border-none overflow-hidden group hover:shadow-lg transition-all duration-300">
                      <div className="relative w-full h-full">
                        <img
                          src={event.image_url || ""}
                          alt={event.event_name}
                          className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop";
                          }}
                        />
                      </div>
                    </Card>

                    <div className="bg-white dark:bg-slate-950 px-3 py-2 rounded-b-[13px]">
                      <h3 className="font-extrabold text-sm text-blue-900 dark:text-white line-clamp-2 uppercase">
                        {event.event_name}
                      </h3>
                      {formattedDateTime && (
                        <p className="text-sm font-bold text-blue-900 dark:text-blue-200 mt-1">
                          {formattedDateTime}
                        </p>
                      )}
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          <div className="hidden md:block">
            <CarouselPrevious className="-left-12 border-blue-600 text-blue-900 hover:bg-blue-200" />
            <CarouselNext className="-right-12 border-blue-600 text-blue-900 hover:bg-blue-200" />
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`h-2 transition-all duration-300 rounded-full ${
                  index === current ? "w-8 bg-blue-600" : "w-2 bg-blue-200"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </Carousel>
      </div>
    </section>
  );
}
