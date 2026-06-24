import { educationLogos, professionalLogos } from "@/data/companyLinks";
import LogoCarousel from "@/components/ui/LogoCarousel";

export default function LogoLoopDetails() {
  return (
    <div>
      <div className="text-center mb-12 px-6">
        <h2 className="text-3xl font-heading md:text-5xl font-black text-slate-900 dark:text-slate-100">
          Places That{" "}
          <span className="text-emerald-500 dark:text-emerald-300">Shaped</span> My
          Journey
        </h2>
      </div>

      {/* For Universities - Responsive sizing */}
      <LogoCarousel
        items={educationLogos}
        speed={100}
        mobileSize={120}
        mobileContainerSize={150}
        size={200}
        containerSize={200}
        direction="right"
      />

      {/* For Startups - Responsive sizing */}
      <LogoCarousel
        items={professionalLogos}
        speed={100}
        mobileSize={120}
        mobileContainerSize={150}
        size={200}
        containerSize={200}
        direction="left"
      />
    </div>
  );
}
