import { educationLogos, professionalLogos } from "@/data/companyLinks";
import LogoCarousel from "@/components/ui/LogoCarousel";
export default function LogoLoopDetails() {
  return (
    <div>
      {/* For Universities - Slower and larger */}
      <LogoCarousel
        items={educationLogos}
        speed={60}
        size={80}
        direction="right"
      />

      {/* For Startups - Faster and standard size */}
      <LogoCarousel
        items={professionalLogos}
        speed={30}
        size={60}
        direction="left"
      />
    </div>
  );
}
