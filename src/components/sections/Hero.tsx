import "../../app/globals.css";
import NewsletterForm from "../forms/NewsletterForm";
import BentoGrid from "../ui/BentoGrid";
import GradientText from "../ui/GradientText";
import LogoLoop from "../ui/LogoLoop";
import Silk from "../ui/Silk";
import LogoLoopDetails from "./LogoLoopDetails";

export default function Hero() {
  return (
    <section className="relative  flex flex-col items-center justify-center max-w-screen min-h-screen overflow-x-hidden py-20 z-0">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover"
          poster="https://images.pexels.com/photos/12869244/pexels-photo-12869244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        >
          <source
            src="https://www.pexels.com/download/video/12869244/"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        {/* Premium Gradient Overlay for blending and high readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)] via-transparent to-[var(--background)]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)] via-transparent to-[var(--background)]"></div>
        <div className="absolute inset-0 bg-[var(--background)]/30"></div>
      </div>

      {/* 💬 Content (on top of background) */}
      <div className="relative pt-8 z-10 flex flex-col items-center justify-center w-full  px-6 text-center">
        <span
          className="font-body backdrop-blur-xl backdrop-saturate-150
  bg-white/10 border border-white/10 
  rounded-full shadow-[0_0_20px_rgba(0,0,0,0.25)]
  px-4 py-1 mb-2 text-[8px] md:text-base flex items-center gap-2 "
        >
          {/* Glowing green dot */}
          <span className="relative flex h-3 w-3 ">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#E67E22] opacity-75 animate-ping"></span>
            <span className="relative inline-flex rounded-full h-3 w-3  bg-[#E67E22]"></span>
          </span>
          Agriculture Consultant, Data & Business Analyst
        </span>
        <h1 className=" text-3xl  md:text-6xl pb-3 font-black  leading-tight tracking-wider">
          Turbocharge your{" "}
          <GradientText colors={["#10b981", "#10b981", "#10b981"]}>
            {" "}
            brand{" "}
          </GradientText>{" "}
          <br className="invisible md:visible" />
          Reach millions online
        </h1>

        <div className="w-full mx-auto">
          <BentoGrid />
        </div>
      </div>
    </section>
  );
}
