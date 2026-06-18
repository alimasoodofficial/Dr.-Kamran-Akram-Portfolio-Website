"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";

const DEFAULT_IMAGE =
  "https://rqrnzfuvgmnjkjqaahve.supabase.co/storage/v1/object/public/gallery-images/Dr-Kamran-Akram.webp";

const fallbackImages = [
  "https://images.pexels.com/photos/35823491/pexels-photo-35823491.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/35823490/pexels-photo-35823490.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/35823492/pexels-photo-35823492.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/35823493/pexels-photo-35823493.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/35823494/pexels-photo-35823494.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/35823495/pexels-photo-35823495.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/35823496/pexels-photo-35823496.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/35823497/pexels-photo-35823497.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/35823498/pexels-photo-35823498.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/35823499/pexels-photo-35823499.jpeg?auto=compress&cs=tinysrgb&w=400",
];

interface ImageSphereProps {
  initialImages?: string[];
}

export default function ImageSphere({ initialImages }: ImageSphereProps) {
  const [images, setImages] = useState<string[]>(initialImages || fallbackImages);

  useEffect(() => {
    if (initialImages && initialImages.length > 0) {
      setImages(initialImages);
      return;
    }

    async function fetchImages() {
      try {
        const { data, error } = await supabaseClient
          .from("gallery")
          .select("image_url")
          .order("date", { ascending: false })
          .limit(10);

        if (error) throw error;

        if (data && data.length > 0) {
          const urls = data
            .map((item) => (item.image_url && item.image_url.trim() ? item.image_url : DEFAULT_IMAGE))
            .filter(Boolean);
          if (urls.length > 0) {
            setImages(urls);
          }
        }
      } catch (err) {
        console.error("Failed to fetch gallery images for ImageSphere:", err);
      }
    }

    fetchImages();
  }, [initialImages]);

  const total = images.length;
  if (total === 0) return null;

  return (
    <div className="card-3d">
      {images.map((src, index) => {
        const rotate = (360 / total) * index;

        return (
          <div
            key={index}
            style={{
              transform: `translate(-50%, -50%) rotateY(${rotate}deg) translateZ(var(--radius))`,
              animationDelay: `-${index * 2}s`,
            }}
          >
            <img src={src} alt={`image-${index}`} />
          </div>
        );
      })}
    </div>
  );
}

