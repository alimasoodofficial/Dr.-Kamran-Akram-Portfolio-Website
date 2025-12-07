import ElectricBorder from "@/components/ui/ElectricBorder";
import Banner from "@/components/sections/Banner";
import { GlowingEffectDemo } from "@/components/sections/GlowingEffectDemo";
import { CreativePricingDemo } from "@/components/ui/PricingPlan";
import { Timeline } from "@/components/ui/Timeline";

export default function ProjectsPage() {
  return (
    <>
      <Banner
        title="Welcome to Our Website"
        description="We provide amazing services and solutions for your business."
        imageSrc="https://aliabdaal.com/wp-content/uploads/2025/08/ali-abdaal-journalling-prompts-notion-template.png"
        imageAlt="Illustration"
        className="w-auto h-100px"
      />

<div className="flex justify-center">

        <GlowingEffectDemo />
</div>

      <div className="flex items-center justify-evenly py-20 ">
        <ElectricBorder
          color="#7df9ff"
          speed={1}
          chaos={0.5}
          thickness={2}
          style={{ borderRadius: 16 }}
        >
          <div>
            <h1>Main Heading</h1>
            <p style={{ margin: "6px 0 0", opacity: 0.8 }}>
              A glowing, animated border wrapper.
            </p>
          </div>
        </ElectricBorder>

        <ElectricBorder
          color="#7df9ff"
          speed={1}
          chaos={0.5}
          thickness={2}
          style={{ borderRadius: 16 }}
        >
          <div>
            <h1>Main Heading</h1>
            <p style={{ margin: "6px 0 0", opacity: 0.8 }}>
              A glowing, animated border wrapper.
            </p>
          </div>
        </ElectricBorder>

        <ElectricBorder
          color="#7df9ff"
          speed={1}
          chaos={0.5}
          thickness={2}
          style={{ borderRadius: 16 }}
        >
          <div>
            <h1>Main Heading</h1>
            <p style={{ margin: "6px 0 0", opacity: 0.8 }}>
              A glowing, animated border wrapper.
            </p>
          </div>
        </ElectricBorder>
      </div>

      <div>
      <Timeline />
      </div>
    </>
  );
}
