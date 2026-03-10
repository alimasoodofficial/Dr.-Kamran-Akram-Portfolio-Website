import { InfoCard, StripCard, ImageCard, CenterStatCard } from "./HeroCard";

export default function BentoGrid() {
  return (
    <div className="w-full  pb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
      {/* --- Column 1 --- */}
      <div className="flex flex-col gap-6">
        <InfoCard
          title="Ph.D"
          subtitle="Animal Sciences"
          desc="Translating complex research into practical knowledge for farmers, students, and communities."
          btnText="View Publications"
          bgClass="bg-[#064e3b] "
          href="https://scholar.google.com.au/citations?user=lBBycJgAAAAJ&hl"
        />
        <StripCard
          icon="fa-solid fa-microphone-lines"
          text="Science Communicator"
          bgClass="bg-[#E67E22]"
        />
      </div>

      {/* --- Column 2 --- */}
      <div className="flex flex-col gap-6 h-full">
        <ImageCard
          category="Specialization"
          title="Advancing Veterinary Science & Agriculture Projects"
          bgImage="https://images.unsplash.com/photo-1710322928695-c7fb49886cb1"
          overlayColor="rgba(2, 44, 34, 0.75) 0%, rgba(6, 78, 59, 0.5) 35%, rgba(16, 185, 129, 1) 100%"
        />
      </div>

      {/* --- Column 3 --- */}
      <div className="flex flex-col gap-6">
        <CenterStatCard />
        <ImageCard
          category="Research"
          title="MPhil Microbiology & Data Analysis"
          bgImage="https://images.unsplash.com/photo-1587355760421-b9de3226a046?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0MDZ8MHwxfHNlYXJjaHwyMnx8cmVzZWFyY2h8ZW58MHx8fHwxNzY3Mjk4OTQ4fDA&ixlib=rb-4.1.0&q=80&w=1080"
          overlayColor="rgba(6, 78, 59, 0.5) 0%, rgba(204, 126, 41, 1) 100%"
          heightClass="h-[240px]"
        />
      </div>

      {/* --- Column 4 --- */}
      <div className="flex flex-col gap-6">
        <InfoCard
          title=""
          subtitle="Free Resources"
          desc="Access my collection of eBooks, courses, and free guides for students and professionals."
          btnText="Download eBooks"
          bgClass="bg-[#E67E22]" // Applied requested orange
          href="/coming-soon"
        />
        <StripCard
          icon="fa-solid fa-award"
          text="MLA Red Meat Industry Ambassador"
          bgClass="bg-[#34d399]"
        />
      </div>
    </div>
  );
}
