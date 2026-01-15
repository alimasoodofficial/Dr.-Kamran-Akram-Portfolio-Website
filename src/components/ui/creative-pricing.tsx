"use client";
import { Button } from "@/components/ui/Button2";
import { Check, Pencil, Star, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface PricingTier {
  name: string;
  icon: React.ReactNode;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
  color: string;
}

function CreativePricing({
  tag = "Simple Pricing",
  title = "Make Short Videos That Pop",
  description = "Edit, enhance, and go viral in minutes",
  tiers,
}: {
  tag?: string;
  title?: string;
  description?: string;
  tiers: PricingTier[];
}) {
  const [cardOpacity, setCardOpacity] = useState<number[]>(tiers.map(() => 1));
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Only apply fade effect on mobile screens (max-width: 768px)
      if (window.innerWidth >= 768) {
        setCardOpacity(tiers.map(() => 1));
        return;
      }

      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Calculate opacity based on vertical position
        // Card fades in when entering viewport and fades out when leaving
        let opacity = 1;

        if (rect.bottom < 0) {
          // Card is above viewport
          opacity = 0;
        } else if (rect.top > viewportHeight) {
          // Card is below viewport
          opacity = 0;
        } else if (rect.top < 0) {
          // Card is entering from top
          opacity = rect.bottom / (rect.height || 1);
        } else if (rect.bottom > viewportHeight) {
          // Card is exiting from bottom
          opacity = (viewportHeight - rect.top) / (rect.height || 1);
        }

        setCardOpacity((prev) => {
          const newOpacity = [...prev];
          newOpacity[index] = Math.max(0, Math.min(1, opacity));
          return newOpacity;
        });
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tiers.length]);
  return (
    <div className="w-full max-w-6xl mx-auto px-4" ref={containerRef}>
      <div className="text-center space-y-6 mb-16">
        <div className="font-handwritten text-xl text-blue-500 rotate-[-1deg]">
          {tag}
        </div>
        <div className="relative ">
          <h2 className="text-4xl font-heading md:text-5xl font-bold font-handwritten text-zinc-900 dark:text-white rotate-[-1deg]">
            {title}
          </h2>
          <div
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-44 h-3 bg-blue-500/20 
                        rotate-[-1deg] rounded-full blur-sm"
          />
        </div>
        <p className="font-handwritten text-xl text-zinc-600 dark:text-zinc-400 rotate-[-1deg]">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {tiers.map((tier, index) => (
          <div
            key={tier.name}
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
            className={cn(
              "relative group",
              "transition-opacity duration-300",
              "md:opacity-100"
            )}
            style={{
              opacity: cardOpacity[index] || 1,
            }}
          >
            <div
              className={cn(
                "absolute inset-0 bg-white dark:bg-zinc-900",
                "border-2 border-zinc-900 dark:border-white",
                "rounded-lg shadow-[4px_4px_0px_0px] shadow-zinc-900 dark:shadow-white",
                "transition-all duration-300",
                "group-hover:shadow-[8px_8px_0px_0px]",
                "group-hover:translate-x-[-4px]",
                "group-hover:translate-y-[-4px]"
              )}
            />

            <div className="relative p-6">
              {tier.popular && (
                <div
                  className="absolute -top-2 -right-2 bg-amber-400 text-zinc-900 
                                    font-handwritten px-3 py-1 rounded-full rotate-12 text-sm border-2 border-zinc-900"
                >
                  Popular!
                </div>
              )}

              <div className="mb-6">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full mb-4",
                    "flex items-center justify-center",
                    "border-2 border-zinc-900 dark:border-white",
                    `text-${tier.color}-500`
                  )}
                >
                  {tier.icon}
                </div>
                <h3 className="font-handwritten text-2xl text-zinc-900 dark:text-white">
                  {tier.name}
                </h3>
                <p className="font-handwritten text-zinc-600 dark:text-zinc-400">
                  {tier.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6 font-handwritten">
                <span className="text-4xl font-bold text-zinc-900 dark:text-white">
                  ${tier.price}
                </span>
                <span className="text-zinc-600 dark:text-zinc-400">/month</span>
              </div>

              <div className="space-y-3 mb-6">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div
                      className="w-5  h-5 rounded-full border-2 border-blue-600 bg-blue-600 text-white  
                                             flex items-center justify-center "
                    >
                      <Check className="w-auto " />
                    </div>
                    <span className="font-handwritten text-lg text-white-900 dark:text-white">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                className={cn(
                  "w-full h-12 font-handwritten text-lg relative",
                  "border-2 border-zinc-900 dark:border-white",
                  "transition-all duration-300",
                  "shadow-[4px_4px_0px_0px] shadow-zinc-900 dark:shadow-white",
                  "hover:shadow-[6px_6px_0px_0px]",
                  "hover:translate-x-[-2px] hover:translate-y-[-2px]",
                  tier.popular
                    ? [
                        "bg-amber-400 text-zinc-900",
                        "hover:bg-amber-300",
                        "active:bg-amber-400",
                        "dark:hover:bg-amber-300",
                        "dark:active:bg-amber-400",
                      ]
                    : [
                        "bg-zinc-50 dark:bg-zinc-800",
                        "text-zinc-900 dark:text-white",
                        "hover:bg-white dark:hover:bg-zinc-700",
                        "active:bg-zinc-50 dark:active:bg-zinc-800",
                      ]
                )}
              >
                Get Started
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { CreativePricing };
export type { PricingTier };
