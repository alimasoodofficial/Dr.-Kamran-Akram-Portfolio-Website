import { InfoCard, StripCard, ImageCard, CenterStatCard } from "./HeroCard";

export default function BentoGrid() {
  return (
    <div className="w-full pb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start animate-fadeInUp">
      {/* --- Column 1 --- */}
      <div className="flex flex-col gap-6">
        <InfoCard
          title="Ph.D"
          subtitle="Animal Sciences"
          desc="Bridging livestock research, innovation and real world agricultural impact."
          btnText="View Publications"
          bgClass="bento-card-green"
          href="/free-resources/articles"
        />
        <StripCard
          icon="fa-solid fa-microphone-lines"
          text="Science Communicator"
          bgClass="bento-card-emerald"
          desc="Making science, agriculture and innovation easier to understand and share."
        />
      </div>

      {/* --- Column 2 --- */}
      <div className="flex flex-col gap-6 h-full">
        <ImageCard
          category="Specialization"
          title="Building Meaningful Ideas Across Science, Agriculture & Innovation"
          bgImage="https://images.unsplash.com/photo-1710322928695-c7fb49886cb1"
          overlayColor="rgba(1, 28, 22, 0.85) 0%, rgba(6, 78, 59, 0.6) 35%, rgba(16, 185, 129, 0.4) 100%"
        />
      </div>

      {/* --- Column 3 --- */}
      <div className="flex flex-col gap-6">
        <CenterStatCard />
        <ImageCard
          category="Research"
          title="Microbiology Research on Bioplastic Producing Bacteria (PHAs), and PhD Research in Parasitology, Buffalo Fly, Cattle Phenotyping, Proteomics & Genomics."
          bgImage="https://images.unsplash.com/photo-1587355760421-b9de3226a046?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0MDZ8MHwxfHNlYXJjaHwyMnx8cmVzZWFyY2h8ZW58MHx8fHwxNzY3Mjk4OTQ4fDA&ixlib=rb-4.1.0&q=80&w=1080"
          overlayColor="rgba(1, 28, 22, 0.75) 0%, rgba(5, 150, 105, 0.5) 100%"
          heightClass="h-[240px]"
        />
      </div>

      {/* --- Column 4 --- */}
      <div className="flex flex-col gap-6">
        <InfoCard
          title=""
          subtitle="eBooks"
          desc="Explore free and premium eBooks covering science, agriculture, innovation, research and practical insights."
          btnText="Browse eBooks"
          bgClass="bento-card-teal"
          href="/ebooks"
        />
        <StripCard
          icon="fa-solid fa-award"
          text="MLA Red Meat Industry Ambassador"
          bgClass="bento-card-emerald"
        />
      </div>
    </div>
  );
}
