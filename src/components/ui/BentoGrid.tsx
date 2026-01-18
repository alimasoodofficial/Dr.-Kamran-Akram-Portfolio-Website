import { InfoCard, StripCard, ImageCard, CenterStatCard } from "./HeroCard";

export default function BentoGrid() {
  return (
    <div className="w-full max-w-[1400px] px-6 pb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
      {/* --- Column 1 --- */}
      <div className="flex flex-col gap-6">
        <InfoCard 
          title="Ph.D"
          subtitle="Animal Sciences"
          desc="Translating complex research into practical knowledge for farmers, students, and communities."
          btnText="View Publications"
          bgClass="bg-blue-600"
          href="https://scholar.google.com.au/citations?user=lBBycJgAAAAJ&hl"
        />
        <StripCard
          icon="fa-solid fa-microphone-lines"
          text="Science Communicator"
          bgClass="bg-yellow-600 "
        />
      </div>

      {/* --- Column 2 --- */}
      <div className="flex flex-col gap-6 h-full">
        <ImageCard
          category="Specialization"
          title="Advancing Veterinary Science & Agriculture Projects"
          bgImage="https://images.unsplash.com/photo-1710322928695-c7fb49886cb1"
          overlayColor="rgba(5, 0, 148, 0.75) 0%, rgba(5, 5, 240, 0.5) 35%, rgba(0, 133, 235, 1) 100%"
        />
      </div>

      {/* --- Column 3 --- */}
      <div className="flex flex-col gap-6">
        <CenterStatCard />
        <ImageCard
          category="Research"
          title="MPhil Microbiology & Data Analysis"
          bgImage="https://images.unsplash.com/photo-1587355760421-b9de3226a046?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0MDZ8MHwxfHNlYXJjaHwyMnx8cmVzZWFyY2h8ZW58MHx8fHwxNzY3Mjk4OTQ4fDA&ixlib=rb-4.1.0&q=80&w=1080"
          overlayColor="rgba(153, 108, 29, 0.5) 0%, rgba(253, 187, 45, 1) 100%"
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
          bgClass="bg-yellow-600" // Custom brown
          href="free-resources/ebooks"
        />
        <StripCard
          icon="fa-solid fa-award"
          text="MLA Red Meat Industry Ambassador"
          bgClass="bg-blue-600"
        />
      </div>
    </div>
  );
}
