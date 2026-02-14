import { FaNewspaper, FaBook, FaTools } from "react-icons/fa";
import FreeResourcesHero from "@/components/sections/FreeResourcesHero";
import ResourceCard from "@/components/sections/ResourceCard";
import FreeResourcesCTA from "@/components/sections/FreeResourcesCTA";

interface ResourceData {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  imagePlaceholder: string;
  gradient: string;
}

export default function FreeResourcesPage() {
  const resources: ResourceData[] = [
    {
      title: "Research Articles",
      description:
        "Explore my published research articles and academic publications. Access peer-reviewed papers on various topics including data science, microbiology, and educational research. Stay updated with the latest findings and scholarly contributions.",
      href: "/free-resources/articles",
      icon: <FaNewspaper className="w-8 h-8" />,
      imagePlaceholder: "ARTICLE_IMAGE_PLACEHOLDER",
      gradient: "from-orange-500 via-red-500 to-pink-500",
    },
    {
      title: "E-Books & Guides",
      description:
        "Download comprehensive e-books and practical guides designed to help you master complex topics. From technical tutorials to professional development resources, find valuable content to accelerate your learning journey.",
      href: "/coming-soon",
      icon: <FaBook className="w-8 h-8" />,
      imagePlaceholder: "EBOOK_IMAGE_PLACEHOLDER",
      gradient: "from-blue-500 via-purple-500 to-indigo-500",
    },
    {
      title: "Tools & Resources",
      description:
        "Access a curated collection of tools, templates, and resources to enhance your productivity. Discover utilities, calculators, and frameworks that simplify your work and boost efficiency in your projects.",
      href: "/coming-soon",
      icon: <FaTools className="w-8 h-8" />,
      imagePlaceholder: "TOOLS_IMAGE_PLACEHOLDER",
      gradient: "from-green-500 via-teal-500 to-cyan-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-black">
      {/* Hero Section */}
      <FreeResourcesHero />

      {/* Resources Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 ">
        <div className="flex flex-col gap-8 py-5">
          {resources.map((resource) => (
            <ResourceCard
              key={resource.href}
              title={resource.title}
              description={resource.description}
              href={resource.href}
              icon={resource.icon}
              imagePlaceholder={resource.imagePlaceholder}
              gradient={resource.gradient}
            />
          ))}
        </div>
      </section>

      {/* Bottom CTA Section */}
      <FreeResourcesCTA />
    </div>
  );
}
