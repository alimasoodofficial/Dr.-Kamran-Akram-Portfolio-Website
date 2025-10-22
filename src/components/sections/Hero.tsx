import "../../app/globals.css";
import NewsletterForm from "../forms/NewsletterForm";
import LogoLoop from "../ui/LogoLoop";
import Silk from "../ui/Silk";
import {techLogos} from "./LogoLoopDetails";

export default function Hero() {
  return (
    <section className="relative  flex flex-col items-center justify-center max-w-screen min-h-screen overflow-x-hidden py-20 z-0">
      <div className=" absolute  inset-0 z-0 w-full h-full overflow-hidden">
        <Silk
          speed={20}
          scale={1}
          color="#0a84ff"
          noiseIntensity={0}
          rotation={0}
        />
      </div>

      {/* 💬 Content (on top of background) */}
      <div className="relative pt-8 z-10 flex flex-col items-center justify-center w-full max-w-4xl px-6 text-center">
        <span
          className="font-body backdrop-blur-xl backdrop-saturate-150
  bg-white/10 border border-white/10 text-white
  rounded-full shadow-[0_0_20px_rgba(0,0,0,0.25)]
  px-4 py-1 mb-2 text-sm md:text-base flex items-center gap-2 "
        >
          {/* Glowing green dot */}
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
            <span className="relative inline-flex rounded-full h-3 w-3  bg-green-500"></span>
          </span>
          An Expert Data Analyst
        </span>
        <h1 className="font-heading text-4xl md:text-6xl pb-3 font-black text-white leading-tight tracking-wider">
          Turbocharge your brand. <br  className="invisible md:visible"/>
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
        
        </p>
        <div className="py-3">
         <NewsletterForm /> 
        </div>
      </div>

      
    </section>
  );
}
