import GradientText from "@/components/ui/GradientText";
import Hero from "@/components/sections/Hero";
import Button from "@/components/ui/Button";
import Cards from "@/components/ui/Cards";
import Spline from "@/components/ui/Spline";
import { techLogos } from "@/components/sections/LogoLoopDetails";
import LogoLoop from "@/components/ui/LogoLoop";
import Image from "next/image";
import ThemeBackground from "@/components/ui/ThemeBackground";
import ElectricBorder from "@/components/ui/ElectricBorder";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import CircularGallery from "@/components/ui/CircularGallery";

export default function HomePage() {
  const stats = {
    counters: [
      { value: 1200, label: "Patients Treated", suffix: "+" },
      { value: 15, label: "Years Experience", suffix: "+" },
      { value: 50, label: "Countries Reached", suffix: "+" },
      { value: 200, label: "Publications", suffix: "+" },
    ],
  };
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

      <div className="relative overflow-hidden py-20 transition-all">
        <LogoLoop
          logos={techLogos}
          speed={120}
          direction="left"
          logoHeight={60}
          gap={40}
          pauseOnHover
          scaleOnHover
          fadeOut
          // fadeOutColor="#000000"
          ariaLabel="Technology partners"
        />
      </div>
      <section className="md:w-9/12  flex flex-col md:flex-row align-center justify-center px-5 md:px-0 py-20 mx-auto gap-10 ">
        <div className="flex flex-col gap-5 duration-300">
          <h2 className="font-heading text-4xl md:text-7xl mb-12 ">
            How Can <br />{" "}
            <span>
              <GradientText
                colors={["#ff8800", "#8a2be2", "#007aff"]}
                animationSpeed={6}
                className=" "
              >
                I Help You?
              </GradientText>
            </span>
          </h2>
          <Cards
            title="Consulting"
            description="I help creators and entrepreneurs build scalable online businesses through practical strategies."
            svgSrc="/icons/cog.svg"
            link="/consulting"
            className="card hover:shadow-lg  hover:bg-orange-300 
 "
          />
          <Cards
            title="Consulting"
            description="I help creators and entrepreneurs build scalable online businesses through practical strategies."
            svgSrc="/icons/cog.svg"
            link="/consulting"
            className="card hover:shadow-lg hover:bg-green-300 "
          />
        </div>

        <div className="flex flex-col gap-5 duration-300">
          <Cards
            title="YouTube"
            description="On my YouTube channel, I share productivity tips, creative insights, and career advice."
            svgSrc="/icons/cog.svg"
            link="#"
            className="card hover:shadow-lg hover:bg-red-300 "
          />

          <Cards
            title="Courses"
            description="Join thousands of learners in my online courses focused on creative entrepreneurship and learning effectively."
            svgSrc="/icons/cog.svg"
            link="/academy"
            className="card hover:shadow-lg hover:bg-purple-300 "
          />
          <Cards
            title="....and more!"
            svgSrc="/icons/cog.svg"
            link="/newsletter"
            className="card hover:shadow-lg hover:bg-yellow-300 "
            buttonText="Subscribe"
          />
        </div>
      </section>

      {/* About Me Section */}
      <section className="flex flex-col items-center justify-center mx-5 rounded-2xl  pt-10 md:pt-20 pb-20 px-6 md:px-16 lg:px-24">
        {/* Main content container */}
        <div className="pb-20">
          <h2 className="font-heading text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6">
            <GradientText
              colors={["#97ABFF", "#123597"]}
              animationSpeed={6}
              className=""
            >
              I’m Kamran
            </GradientText>
          </h2>
          <div className="flex flex-col md:flex-row justify-evenly gap-2.5 items-start md:items-center">
            <div className=" rounded-4xl border-blue-500 text-blue-500 font-body border-2 px-4 py-2">
              Entrepreneur
            </div>
            <div className=" rounded-4xl border-blue-500 text-blue-500 font-body border-2 px-4 py-2">
              Veterinarian
            </div>
            <div className=" rounded-4xl border-blue-500 text-blue-500 font-body border-2 px-4 py-2">
              Science Communicator
            </div>
            <div className=" rounded-4xl border-blue-500 text-blue-500 font-body border-2 px-4 py-2">
              Researcher
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-16 lg:gap-x-32 max-w-7xl mx-auto">
          {/* 🧠 Left Side: Text */}
          <div className="flex-1 text-center   md:py-10 md:px-5 md:text-left ">
            <p className="text-base sm:text-lg md:text-xl leading-relaxed font-body text-[var(--foreground)] text-justify  mx-auto pt-5 md:mx-0">
              I am Dr Muhammad Kamran, a scientist, data storyteller, and
              dreamer who believes that meaningful change begins with curiosity.
              My journey started in a small village in Pakistan where simple
              questions about animals and nature slowly turned into a lifelong
              fascination with science and technology. That curiosity carried me
              across cities, continents, and disciplines until I found myself in
              Brisbane, exploring how data can reveal the invisible patterns
              that shape life, health, and sustainability.
            </p>
          </div>

          {/* 🖼️ Right Side: Images */}

          <div className="flex-1 flex flex-col items-center gap-6 w-full md:w-auto">
            <ElectricBorder
              color="#7df9ff"
              speed={2}
              chaos={0.1}
              thickness={5}
              style={{ borderRadius: 20 }}
            >
              <div>
                <Image
                  src="https://imkamran.com/wp-content/uploads/2023/12/Dr-Kamran-Akram.webp"
                  alt="Dr Kamran Akram"
                  width={500}
                  height={100}
                  className="object-contain rounded-2xl shadow-lg w-full "
                />
              </div>
            </ElectricBorder>
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
      <section className=" bg-gradient-to-r from-background/50 to-transparent">
        <div className="max-w-7xl mx-auto px-5">
          {/* pass the array inside an object and render the AnimatedCounter grid */}
          <AnimatedCounter counters={stats.counters} />
        </div>
      </section>

      <section className="py-10">
        <div>
          <h2 className="font-heading text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6">
            <GradientText
              colors={["#97ABFF", "#123597"]}
              animationSpeed={6}
              className=""
            > My Snapshot Story
            </GradientText>
          </h2>
        </div>
        <div style={{ height: "600px", position: "relative" }}>
          <CircularGallery
            bend={8}
            textColor="#ffffff"
            borderRadius={0.05}
            scrollEase={0.02}
            scrollSpeed={4}
          />
        </div>
      </section>
    </>
  );
}
