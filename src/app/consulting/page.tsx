import ConsultancyForm from "@/components/forms/ConsultancyForm";
import CalendlyEmbed from "@/components/forms/Calendly";

import Banner from "@/components/sections/Banner";

export default function ConsultingPage() {
  return (
    <>
      <Banner
        title="Looking For Guidance"
        description="If you are looking for masters or PhD scholarship guidance or job search in Australia then feel free to book a meeting with me."
        imageSrc="https://aliabdaal.com/wp-content/uploads/2025/08/ali-abdaal-journalling-prompts-notion-template.png"
        imageAlt="Illustration"
        className="w-auto h-100px  "
        bannerClass="py-20 "
        showImage={false}
        showBreadcrumb={true}
      />
      <div className="py-20">
        <CalendlyEmbed
          url="https://calendly.com/dataexperts360/30min"
          height={750}
          className="w-full max-w-4xl  mx-auto rounded-2xl overflow-hidden "
        />
      </div>
    </>
  );
}
