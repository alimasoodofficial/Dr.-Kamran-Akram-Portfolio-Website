import GradientText from "@/components/ui/GradientText";
import Hero from "@/components/sections/Hero";
import Button from "@/components/ui/Button";
import Spline from "@/components/ui/Spline";
import Image from "next/image";
import ThemeBackground from "@/components/ui/ThemeBackground";
import ElectricBorder from "@/components/ui/ElectricBorder";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import CircularGallery from "@/components/ui/CircularGallery";
import CursorReveal from "@/components/ui/CursorReveal";
import LogoLoopDetails from "@/components/sections/LogoLoopDetails";
import TrueFocus from "@/components/ui/TrueFocus";
import SlantedGrid from "@/components/ui/SlantedGrid";
import ScrollRevealText from "@/components/ui/ScrollRevealText";
import HelpCardsHome from "@/components/ui/HelpCardsHome";

export default function HomePage() {
 const aboutText = "I am Dr Muhammad Kamran, a scientist, data storyteller, and dreamer who believes that meaningful change begins with curiosity. My journey started in a small village in Pakistan where simple questions about animals and nature slowly turned into a lifelong fascination with science and technology. That curiosity carried me across cities, continents, and disciplines until I found myself in Brisbane, exploring how data can reveal the invisible patterns that shape life, health, and sustainability.";
 
  return (
    <>
      <div className="overflow-hidden relative">
        <Hero />
        {/* <Spline
          className="
      absolute 
      right-0 
      -translate-y-1/2 
      translate-x-1/4 
      pl-60
      w-9/12
      h-9/12
      -mt-60
      overflow-hidden
    "
        /> */}
      </div>

      <div className=" overflow-hidden py-20 transition-all">
       
        <LogoLoopDetails />
      </div>
      <section>
        <HelpCardsHome />
      </section>

      {/* About Me Section */}
      <section className="flex flex-col items-center justify-center  rounded-2xl  pt-10 md:pt-20 pb-20  ">
        {/* Main content container */}
        
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10 md:gap-16 lg:gap-x-32 max-w-7xl mx-auto px-6 py-12 md:py-20">
          {/* 🧠 Left Side: Text */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl  md:text-3xl font-bold mb-4 text-[var(--foreground)]"> 
              <TrueFocus
                sentence="About Me"
                manualMode={false}
                blurAmount={5}
                borderColor="blue"
                animationDuration={1}
                pauseBetweenAnimations={1}
              />
            </h2>
            <p className="text-base sm:text-lg md:text-xl leading-relaxed font-body text-[var(--foreground)]  md:text-left">
               
            </p>
            <ScrollRevealText 
                        text={aboutText} 
                        className="text-sm md:text-lg"
                    />
          </div>

          {/* 🖼️ Right Side: Visual Content */}
          <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm md:max-w-none">
            <div className="w-full  flex justify-center items-center">
              <CursorReveal />
            </div>
          </div>
        </div>

        {/* 🌐 CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-12">
          <Button
            href="/newsletter"
            className="btn-gradient text-white text-sm md:text-base px-6 md:px-8 py-3 rounded-2xl font-medium transition-transform hover:scale-105"
          >
            Join My Newsletter
          </Button>
          <Button
            href="/academy"
            className="btn-gradient text-white text-sm md:text-base px-6 md:px-8 py-3 rounded-2xl font-medium transition-transform hover:scale-105"
          >
            Join My Academy
          </Button>
          <Button
            href="/consulting"
            className="btn-gradient text-white text-sm md:text-base px-6 md:px-8 py-3 rounded-2xl font-medium transition-transform hover:scale-105"
          >
            Work With Me
          </Button>
        </div>
      </section>

      <section>
        <SlantedGrid />
      </section>

      <section className="py-10">
        <div>
          <h2 className="font-heading text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6">
            <GradientText
              colors={["#97ABFF", "#123597"]}
              animationSpeed={6}
              className=""
            >
              {" "}
              My Snapshot Story
            </GradientText>
          </h2>
        </div>
        <div style={{ height: "600px", position: "relative" }}>
          <CircularGallery
            bend={8}
            borderRadius={0.05}
            scrollEase={0.02}
            scrollSpeed={4}
          />
        </div>
      </section>
    </>
  );
}
