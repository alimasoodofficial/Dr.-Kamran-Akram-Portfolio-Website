import React from 'react'
import Cards from './Cards'
import GradientText from './GradientText'

function HelpCardsHome() {
  return (
    <div>
      <section className="   flex flex-col md:flex-row align-center justify-center w-11/12  py-20 mx-auto gap-10 ">
        <div className="flex flex-col gap-5 duration-500">
          <h2 className="font-heading text-4xl md:text-7xl mb-12 ">
            How Can <br />{" "}
            <span>
              <GradientText
                colors={["#5d00ffff", "#289dd4ff", "#792eceff"]}
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
            className=" hover:shadow-lg  hover:bg-orange-400 dark:bg-orange-600  "
          />
          <Cards
            title="Projects"
            description="I help creators and entrepreneurs build scalable online businesses through practical strategies."
            iconClassName="fa-solid fa-diagram-project"
            link="/projects"
            className=" hover:shadow-lg hover:bg-green-400 dark:bg-green-600 "
          />
        </div>

        <div className=" flex flex-col gap-5 duration-300">
          <Cards
            title="Free Resources"
            description="On my YouTube channel, I share productivity tips, creative insights, and career advice."
            iconClassName="fa-solid fa-play"
            link="free-resources"
            className=" hover:shadow-lg hover:bg-red-400 dark:hover:bg-red-600"
          />

          <Cards
            title="Courses / Academy "
            description="Join thousands of learners in my online courses focused on creative entrepreneurship and learning effectively."
            iconClassName="fa-solid fa-graduation-cap"
            link="#"
            className=" hover:shadow-lg hover:bg-purple-400 dark:bg-purple-600"
          />
          <Cards
            title="Website Newsletter"
            iconClassName="fa-solid fa-envelope"
            link="/newsletter"
            className=" hover:shadow-lg hover:bg-yellow-400 dark:bg-yellow-600"
            buttonText="Subscribe"
          />
        </div>
      </section>  
    </div>
  )
}

export default HelpCardsHome
