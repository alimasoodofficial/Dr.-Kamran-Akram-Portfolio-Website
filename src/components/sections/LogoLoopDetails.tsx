import { educationLogos, professionalLogos } from "@/data/companyLinks";
import LogoCarousel from "@/components/ui/LogoCarousel";
export default function LogoLoopDetails() {
  return (
    <div>
      {/* For Universities - Slower and larger */}
      <LogoCarousel
        items={educationLogos}
        speed={20}
        size={100}
        direction="right"
      />

      {/* For Startups - Faster and standard size */}
      <LogoCarousel
        items={professionalLogos}
        speed={20}
        size={200}
        direction="left"
      />
    </div>
  );
}
