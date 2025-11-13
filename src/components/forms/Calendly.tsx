"use client";

import { useEffect } from "react";

interface CalendlyWidgetProps {
  url: string;
  height?: number;
}

export default function CalendlyWidget({ url, height = 700 }: CalendlyWidgetProps) {
  useEffect(() => {
    // Inject Calendly script if not already loaded
    const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      document.body.appendChild(script);
    }

    // Re-render Calendly when theme changes
    const observer = new MutationObserver(() => {
      const container = document.querySelector(".calendly-inline-widget");
      if (container) {
        // Dynamically adjust Calendly background based on theme
        const isDark = document.documentElement.classList.contains("dark");
        (container as HTMLElement).style.backgroundColor = isDark ? "#0b0c12" : "#ffffff";
      }
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="calendly-inline-widget transition-colors duration-500 rounded-2xl shadow-xl "
      data-url={url}
      style={{
        minWidth: "320px",
        height: `${height}px`,
        backgroundColor: "var(--background)",
      }}
    />
  );
}
