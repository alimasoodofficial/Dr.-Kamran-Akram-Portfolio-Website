"use client";
import "../../app/globals.css";
import Silk from "../Silk";
import Iridescence from "../ui/Iridescence";

export default function Hero() {
  return (
    <section className="relative  flex flex-col items-center justify-center max-w-screen min-h-screen overflow-x-hidden py-20 z-0">
      {/* 🌈 Background Canvas (Iridescence) */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
        
        <Silk
          speed={20}
          scale={1}
          color="#0a84ff"
          noiseIntensity={0}
          rotation={0}
        />
      </div>

      {/* 💬 Content (on top of background) */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl px-6 text-center">
        <h1 className="font-heading text-3xl md:text-6xl pb-3 font-black text-white leading-tight tracking-wider">
          Turbocharge your brand. <br />
          Reach millions online
        </h1>

        <p className="font-body text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed text-white">
          I’m <span className="font-semibold">Kamran</span> — a Doctor turned
          Entrepreneur, YouTuber, and the author of the New York Times
          bestseller,
          <span className="font-semibold text-purple-300">
            {" "}
            Feel-Good Productivity
          </span>
          .
        </p>
      </div>
    </section>
  );
}
