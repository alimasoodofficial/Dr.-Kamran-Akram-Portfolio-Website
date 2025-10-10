import Hero from "@/components/sections/Hero";
import Button from "@/components/ui/Button";
import Cards from "@/components/ui/Cards";

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="md:w-9/12  flex flex-col md:flex-row align-center justify-center px-5 md:px-0 py-20 mx-auto gap-10 ">

        <div className="flex flex-col gap-5 duration-300">

        <h2 className="font-heading text-4xl md:text-7xl mb-12 ">
          How Can <br /> <span>I Help You?</span> 
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
