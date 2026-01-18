import { educationLogos, professionalLogos } from "@/data/companyLinks";
import LogoCarousel from "@/components/ui/LogoCarousel";

export default function LogoLoopDetails() {
  return (
    <div>
      {/* For Universities - Responsive sizing */}
      <LogoCarousel
        items={educationLogos}
        speed={60}
        mobileSize={100}
        mobileContainerSize={150}
        size={200}
        containerSize={200}
        direction="right"
      />

      {/* For Startups - Responsive sizing */}
      <LogoCarousel
        items={professionalLogos}
        speed={60}
        mobileSize={100}
        mobileContainerSize={150}
        size={200}
        containerSize={200}
        direction="left"
      />
    </div>
  );
}
