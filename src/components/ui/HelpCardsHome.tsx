import React from 'react'
import Cards from './Cards'
import GradientText from './GradientText'
  
function HelpCardsHome() {
  return (
    <div>
      <section className="   flex flex-col md:flex-row align-center justify-center w-full  py-20 mx-auto gap-10 bg-gradient-to-br from-[#ecfdf5] via-[#bcf9da] to-[#96f4c8] dark:from-[#022c22] dark:via-[#064e3b] dark:to-[#022c22] px-6 md:px-12 ">
        <div className="flex flex-col gap-5 duration-500">
          <h2 className="font-heading text-4xl md:text-7xl mb-12 ">
            How Can <br />{" "}
            <span>
              <GradientText
                colors={["#10b981", "#34d399"]}
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
            iconClassName="fa-solid fa-chalkboard-user"
            link="/consulting"
            className=" hover:shadow-lg  hover:bg-[#34d399] dark:bg-[#0d614b] dark:hover:bg-[#10b981]/20 "
          />
          <Cards
            title="Projects"
            description="I help creators and entrepreneurs build scalable online businesses through practical strategies."
            iconClassName="fa-solid fa-diagram-project"
            link="/projects"
            className=" hover:shadow-lg hover:bg-[#34d399] dark:bg-[#0d614b] dark:hover:bg-[#10b981]/20 "
          />
        </div>

        <div className=" flex flex-col gap-5 duration-300">
          <Cards
            title="Free Resources"
            description="On my YouTube channel, I share productivity tips, creative insights, and career advice."
            iconClassName="fa-solid fa-play"
            link="free-resources"
            className=" hover:shadow-lg  hover:bg-[#34d399] dark:bg-[#0d614b] dark:hover:bg-[#10b981]/20"
          />

          <Cards
            title="Courses / Academy "
            description="Join thousands of learners in my online courses focused on creative entrepreneurship and learning effectively."
            iconClassName="fa-solid fa-graduation-cap"
            link="#"
            className=" hover:shadow-lg hover:bg-[#34d399] dark:bg-[#0d614b] dark:hover:bg-[#10b981]/20"
          />
          <Cards
            title="Website Newsletter"
            iconClassName="fa-solid fa-envelope"
            link="/newsletter"
            className=" hover:shadow-lg hover:bg-[#34d399] dark:bg-[#0d614b] dark:hover:bg-[#10b981]/20"
            buttonText="Subscribe"
          />
        </div>
      </section>  
    </div>
  )
}

export default HelpCardsHome
