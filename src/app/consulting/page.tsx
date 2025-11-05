import ConsultancyForm from "@/components/forms/ConsultancyForm";
import CalendlyEmbed from "@/components/forms/Calendly";
import { packages } from "@/data/consultancyPackages";
// import { motion } from "framer-motion";

import Banner from "@/components/sections/Banner";
import Button from "@/components/ui/Button";

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

      {/* ✳️ What You Can Ask */}
      <section className="py-16 px-6 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-heading font-bold mb-8">
          What You Can Ask
        </h2>
        <div className="grid md:grid-cols-2 gap-6 text-left font-body">
          <ul className="list-disc list-inside space-y-2">
            <li>How to shortlist universities or supervisors</li>
            <li>Scholarship opportunities and expected funding</li>
            <li>Budgeting and living in Australia</li>
            <li>Accommodation and part-time work</li>
          </ul>
          <ul className="list-disc list-inside space-y-2">
            <li>Skills and certifications for employability</li>
            <li>Building a research or LinkedIn profile</li>
            <li>Career roadmap and future planning</li>
          </ul>
        </div>
      </section>

      {/* 💬 How It Works */}
      <section className="bg-gray-50 dark:bg-[#0b0c12] py-16 px-6 text-center">
        <h2 className="text-3xl font-heading font-bold mb-8 text-gray-900 dark:text-white">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              step: "1",
              title: "Select Your Package",
              desc: "Choose the consultation type that best matches your needs and goals.",
            },
            {
              step: "2",
              title: "Complete the Form",
              desc: "Provide your details and preferred time so we can prepare for your session.",
            },
            {
              step: "3",
              title: "Meet via Video Call",
              desc: "Join the scheduled session through the provided link and begin your consultation.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl font-bold text-orange-500">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-900 dark:text-white">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 🎯 Consultation Packages */}
      <section className="py-20 px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-heading font-bold mb-10 text-gray-900 dark:text-white">
          Consultation Packages
        </h2>

        <div className="grid md:grid-cols-3 gap-10 ">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="p-8 bg-white dark:bg-gray-900 rounded-3xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
            >
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                {pkg.title}
              </h3>

              <p className="text-sm md:text-lg text-gray-600 dark:text-gray-300 mb-2">
                {pkg.duration}
              </p>

              <p className="text-3xl font-semibold mb-4 text-blue-500">
                {pkg.price}
              </p>

              <ul className="text-left list-disc list-inside mb-6  space-y-1 text-sm text-gray-700 dark:text-gray-300">
                {pkg.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>

           
              <Button
                href={pkg.calendly}
                className="btn-gradient text-white text-sm px-6 py-2 rounded-2xl font-medium transition-transform hover:scale-105 hover:opacity-90"
              >
                Join 1000+ Subscribers
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* 📅 Embedded Calendly Widget */}
      <section className="bg-gray-50 dark:bg-[#0b0c12]    ">
        <h2 className="text-3xl font-heading font-bold text-center ">
          Ready to Start?
        </h2>
        <CalendlyEmbed url="https://calendly.com/dataexperts360/30min" />
      </section>
    </>
  );
}
