"use client";
import { useState, useEffect, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function UpcomingEvents({ serverEvents = [] }) {
  const [events] = useState(serverEvents);
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const formatEventDateTime = (event) => {
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
  
  const plugin = useRef(
    Autoplay({ delay: 8000, stopOnInteraction: true })
  );

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
    <section className="mt-auto mx-1 py-10 bg-blue-50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-800 uppercase tracking-tight">
          Upcoming Gatherings
        </h1>
        
        <Carousel 
          setApi={setApi} 
          plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          className="w-full relative" 
          opts={{ align: "start", loop: true }}
        >
          <CarouselContent className="-ml-4 animate-nudge">
            {events.map((event, idx) => (
              (() => {
                const formattedDateTime = formatEventDateTime(event);
                return (
              <CarouselItem 
                key={event.id} 
                index={idx}
                className="pl-4 basis-[85%] md:basis-1/2 lg:basis-1/3 h-[420px]"
              >
                {/* 1. GLOW WRAPPER: 
                    The 'relative isolate' allows the ::before animation in your 
                    globals.css to show up without hiding behind the section. 
                */}
                <div className="animate-glow-border p-[3px] rounded-2xl h-full relative isolate shadow-xl flex flex-col">
                  
                  <Card className="relative z-10 bg-white dark:bg-slate-950 w-full flex-1 rounded-[13px] border-none overflow-hidden">
                    
                    {/* 2. FULL IMAGE LOGIC: 
                        'object-contain' ensures the full image is shown.
                        Image fills the card, title goes below outside the card.
                    */}
                    <div className="relative w-full h-full">
                      <img 
                        src={event.image_url || ""} 
                        alt={event.event_name} 
                        className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop";
                        }}
                      />
                    </div>
                  </Card>
                  
                  {/* Title Below Image */}
                  <div className="bg-white dark:bg-slate-950 px-3 py-2 rounded-b-[13px]">
                    <h3 className="font-bold text-sm text-blue-900 dark:text-white line-clamp-2 uppercase">
                      {event.event_name}
                    </h3>
                    {formattedDateTime && (
                      <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mt-1">
                        {formattedDateTime}
                      </p>
                    )}
                  </div>
                </div>
              </CarouselItem>
                );
              })()
            ))}
          </CarouselContent>

          {/* Nav Arrows */}
          <div className="hidden md:block">
            <CarouselPrevious className="-left-12 border-blue-200 text-blue-800 hover:bg-blue-100" />
            <CarouselNext className="-right-12 border-blue-200 text-blue-800 hover:bg-blue-100" />
          </div>

          {/* Dots */}
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