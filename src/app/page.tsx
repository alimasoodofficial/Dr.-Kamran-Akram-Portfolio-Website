import GradientText from "@/components/ui/GradientText";
import Hero from "@/components/sections/Hero";
import Button from "@/components/ui/Button";
import Cards from "@/components/ui/Cards";
import Spline from "@/components/ui/Spline";
import { techLogos } from "@/components/sections/LogoLoopDetails";
import LogoLoop from "@/components/ui/LogoLoop";

export default function HomePage() {
  return (
    <>
      <div className="overflow-hidden relative">
        <Hero />
        <Spline
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
        />
      </div>

      <div className="relative overflow-hidden py-20 transition-all"
      >
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
    </>
  );
}
