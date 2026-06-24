import { getSupabaseService } from "@/lib/supabaseService";
import GradientText from "@/components/ui/GradientText";
import Hero from "@/components/sections/Hero";
import Button from "@/components/ui/Button";
import Spline from "@/components/ui/Spline";
import Image from "next/image";
import LogoLoopDetails from "@/components/sections/LogoLoopDetails";
import ScrollRevealText from "@/components/ui/ScrollRevealText";
import HelpCardsHome from "@/components/ui/HelpCardsHome";
import ImageBackground from "@/components/ui/ImageBgContainer";
import SubscribeForm from "@/components/forms/SubscribeForm";
import {
  TrueFocus,
  SlantedGrid,
  CursorReveal,
  CircularGallery,
} from "@/components/home/DynamicHomeComponents";

async function getLatestNewsletter() {
  const supabase = getSupabaseService();
  const { data, error } = await supabase
    .from("newsletters")
    .select("id, title, subtitle, updated_at")
    .eq("status", "published")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return null;
  }
  return data;
}

export default async function HomePage() {
  const latestNewsletter = await getLatestNewsletter();
  const aboutText =
    "I am Dr Muhammad Kamran, a scientist, data storyteller, and dreamer who believes that meaningful change begins with curiosity. My journey started in a small village in Pakistan where simple questions about animals and nature slowly turned into a lifelong fascination with science and technology. That curiosity carried me across cities, continents, and disciplines until I found myself in Brisbane, exploring how data can reveal the invisible patterns that shape life, health, and sustainability.";

  return (
    <>
      <div className="overflow-hidden">
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

      <div className=" overflow-hidden    transition-all">
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
                borderColor="var(--primary)"
                animationDuration={1}
                pauseBetweenAnimations={1}
              />
            </h2>

            <div className="green-glass p-10 rounded-2xl">
              <ScrollRevealText
                text={aboutText}
                className="text-md md:text-2xl text-justify hyphen-auto"
              />
            </div>
          </div>

          {/* 🖼️ Right Side: Visual Content */}
          <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm md:max-w-none">
            <div className="w-full  flex justify-center items-center pr-10">
              <CursorReveal />
            </div>
          </div>
        </div>

        {/* 🌐 CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-12">
          <Button
            href="/newsletter"
            className=" text-white text-sm md:text-base px-6 md:px-8 py-3 rounded-2xl font-medium transition-transform hover:scale-105"
          >
            Join My Newsletter
          </Button>
          <Button
            href="/ebooks"
            className=" text-white text-sm md:text-base px-6 md:px-8 py-3 rounded-2xl font-medium transition-transform hover:scale-105"
          >
            Browse eBooks
          </Button>
          <Button
            href="/consulting"
            className=" text-white text-sm md:text-base px-6 md:px-8 py-3 rounded-2xl font-medium transition-transform hover:scale-105"
          >
            Work With Me
          </Button>
        </div>
      </section>

      <section>
        <SlantedGrid />
      </section>

      <section>
        {/* <ImageBackground /> */}
      </section>

      {/* <section className="py-10">
        <div>
          <h2 className="font-heading text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6">
            <GradientText
              colors={["#10b981", "#34d399", "#86efac"]}
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
      </section> */}

      {/* 🚀 Projects Overview Section */}
      

      {/* 📧 Newsletter Section */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-4xl md:text-5xl mb-6">
            The Creative Pulse
          </h2>
          <p className="font-body text-lg text-[var(--muted-foreground)] mb-12">
            Weekly insights on data storytelling, creative productivity, and technical mastery.
          </p>
          
          {/* Latest Newsletter Card */}
          <div className="green-card p-8 md:p-12 text-left mb-10 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <i className="fa-solid fa-envelope-open-text text-8xl text-primary"></i>
            </div>
            <span className="text-primary font-bold text-sm tracking-widest uppercase mb-4 block">
              Latest Issue {latestNewsletter ? `• ${new Date(latestNewsletter.updated_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}` : ""}
            </span>
            <h3 className="font-heading text-2xl md:text-4xl mb-4">
              {latestNewsletter ? latestNewsletter.title : "How Data Storytelling is Redefining Sustainability in 2026"}
            </h3>
            <p className="font-body text-lg text-[var(--muted-foreground)] mb-8 line-clamp-3">
              {latestNewsletter?.subtitle ? latestNewsletter.subtitle : "In this issue, we explore the intersection of environmental data and human empathy. How can we make numbers feel like stories that inspire real action?"}
            </p>
            <Button href={latestNewsletter ? `/newsletter/${latestNewsletter.id}` : "/newsletter"} className="text-white px-8 py-3 rounded-2xl">
              Read More
            </Button>
          </div>
          
          <div className="mb-10">
            <SubscribeForm layout="inline" />
          </div>
          
          <p className="text-sm text-[var(--muted-foreground)]">
            Join 5,000+ ambitious creators. No spam, ever.
          </p>
        </div>
      </section>

      {/* 🤝 Consulting Overview Section */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto mb-20">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-7xl mb-4">
            Let's Build <GradientText colors={["#10b981", "#34d399", "#86efac"]} animationSpeed={6}>Your Future</GradientText>
          </h2>
          <p className="font-body text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
            I provide tailored mentorship to help you navigate academia, build a powerful personal brand, and establish a successful career in Australia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Academic Strategy",
              desc: "Tailored guidance for securing PhD/Master's admissions, finding supervisors, and scholarships.",
              icon: "fa-graduation-cap"
            },
            {
              title: "Career & Brand Building",
              desc: "Actionable insights to optimize your profile, build a strong portfolio, and become job-ready.",
              icon: "fa-chart-line"
            },
            {
              title: "Relocation Mentorship",
              desc: "Step-by-step guidance on moving to Australia, from budgeting and finding jobs to settling in.",
              icon: "fa-plane-arrival"
            }
          ].map((item, index) => (
            <div key={index} className="bg-slate-100 dark:bg-slate-950 rounded-2xl p-8 group hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-6 group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300">
                <i className={`fa-solid ${item.icon} text-2xl`}></i>
              </div>
              <h3 className="font-heading text-2xl mb-4">{item.title}</h3>
              <p className="font-body text-[var(--muted-foreground)] mb-6 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button href="/consulting" className="text-white px-10 py-4 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20">
            Book a Discovery Call
          </Button>
        </div>
      </section>
    </>

  );
}
