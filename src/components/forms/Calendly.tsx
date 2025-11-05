"use client";

import { useEffect } from "react";

interface CalendlyEmbedProps {
  url: string;
  height?: number | string;
  hideDetails?: boolean;
  className?: string;
}

export default function CalendlyEmbed({
  url,
  height = 700,
  hideDetails = true,
  className = "",
}: CalendlyEmbedProps) {
  useEffect(() => {
    // Load Calendly script only once
    const scriptId = "calendly-widget-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const calendlyUrl = hideDetails
    ? `${url}?hide_event_type_details=1&hide_gdpr_banner=1`
    : url;

  return (
    <div
      className={`calendly-inline-widget ${className}`}
      data-url={calendlyUrl}
      style={{ minWidth: "320px", height }}
    />
  );
}
