"use client";
import { motion } from "framer-motion";
import {
  Sparkles,
  ExternalLink,
  Linkedin,
  Globe,
  Users,
  Award,
  Rocket,
  Database,
  BarChart3,
  Leaf,
  Map,
  Compass,
  Heart,
  Wheat,
  Cpu,
  Sprout,
  TrendingUp,
  Target,
  Lightbulb,
  TreePine,
  Mountain,
  Truck,
  Settings,
  Shield,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import Image from "next/image";

// ============= DATA CONFIGURATION =============
export const PROJECTS_DATA = [
  {
    id: "data-experts",
    title: "Data Experts 360",
    subtitle: "Smart IT | Agri Tech | Sustainable Growth",
    description:
      "A global platform advancing data literacy and scientific communication through the Data Ambassadors Program. We offer analytics services, training, dashboards, and digital solutions for a data-driven future.",
    image:
      "https://rqrnzfuvgmnjkjqaahve.supabase.co/storage/v1/object/public/website%20images%20&%20videos/data-expert-360-3d-logo.webp",
    icon: Database,
    reverse: false,
    links: [
      {
        type: "website",
        url: "https://www.dataexperts360.com/",
        label: "Visit Website",
      },
      {
        type: "linkedin",
        url: "https://www.linkedin.com/company/dataexperts360/",
        label: "LinkedIn",
      },
    ],
    features: [
      {
        icon: Globe,
        title: "Web Development",
        description:
          "Cutting-edge web applications built with modern technologies.",
      },
      {
        icon: Cpu,
        title: "App Development",
        description: "Native and cross-platform mobile applications.",
      },
      {
        icon: TrendingUp,
        title: "Digital Marketing",
        description: "Strategic digital marketing and SEO optimization.",
      },
      {
        icon: Target,
        title: "Project Management",
        description: "Agile methodology ensuring timely delivery.",
      },
      {
        icon: Shield,
        title: "Quality Assurance",
        description: "Comprehensive QA testing for robust deployments.",
      },
      {
        icon: Lightbulb,
        title: "Data Science & AI",
        description: "Advanced AI/ML solutions for business intelligence.",
      },
    ],
    highlights: [
      "Trusted by 100+ clients worldwide",
      "5-Star support rating with proven results",
      "Enterprise-grade, cloud-native solutions",
      "End-to-end services from concept to deployment",
    ],
  },
  {
    id: "triisum",
    title: "Triisum ",
    subtitle: "Sustainability-Focused Travel Marketplace",
    description:
      "A sustainability-focused tourism marketplace powered by Eco Ambassadors who promote responsible travel. Connecting travellers with eco-experiences and community-led adventures that protect local culture.",
    image:
      "https://rqrnzfuvgmnjkjqaahve.supabase.co/storage/v1/object/public/website%20images%20&%20videos/triisum.jpg",
    icon: Compass,
    reverse: true,
    links: [
      {
        type: "linkedin",
        url: "https://www.linkedin.com/company/triisumofficial/",
        label: "Follow on LinkedIn",
      },
    ],
    features: [
      {
        icon: Leaf,
        title: "Eco-Friendly Travel",
        description:
          "Sustainable travel experiences minimizing environmental impact.",
      },
      {
        icon: Map,
        title: "Local Guides Network",
        description: "Authentic local guides sharing indigenous knowledge.",
      },
      {
        icon: Heart,
        title: "Community Adventures",
        description: "Experiences that benefit local economies.",
      },
      {
        icon: Users,
        title: "Eco Ambassadors",
        description: "Join our ambassador program for rewards and impact.",
      },
      {
        icon: TreePine,
        title: "Nature Conservation",
        description: "Bookings contribute directly to conservation efforts.",
      },
      {
        icon: Mountain,
        title: "Unique Experiences",
        description: "Off-the-beaten-path adventures for conscious travelers.",
      },
    ],
    highlights: [
      "Eco Ambassador program promoting sustainable tourism",
      "Unique eco-experiences curated by local experts",
      "Community-led adventures protecting local culture",
      "Supporting indigenous communities and economies",
    ],
  },
  {
    id: "agri-experts",
    title: "Agri Experts 360",
    subtitle: "Agricultural Innovation Hub",
    description:
      "A comprehensive hub providing agri-tech solutions, advisory services, and expert connections for smart farming. We bridge the gap between technology and the field for sustainable on-ground impact.",
    image:
      "https://rqrnzfuvgmnjkjqaahve.supabase.co/storage/v1/object/public/website%20images%20&%20videos/iStock-1326644171.jpg",
    icon: Wheat,
    reverse: false,
    links: [
      // Add links here when available
    ],
    features: [
      {
        icon: Cpu,
        title: "Agri-Tech Solutions",
        description:
          "Technology solutions designed for modern agricultural challenges.",
      },
      {
        icon: Sprout,
        title: "Smart Farming",
        description: "IoT-enabled farming techniques for optimized crop yield.",
      },
      {
        icon: Users,
        title: "Expert Network",
        description:
          "Connect with top-tier agricultural professionals worldwide.",
      },
      {
        icon: BarChart3,
        title: "Advisory Services",
        description: "Data-driven agricultural advisory for farmers and firms.",
      },
      {
        icon: Truck,
        title: "Supply Chain",
        description:
          "Connecting farmers directly to markets via tech platforms.",
      },
      {
        icon: Settings,
        title: "On-Ground Impact",
        description:
          "Practical implementation and training for farming communities.",
      },
    ],
    highlights: [
      "Cutting-edge agri-tech solutions for modern farming",
      "Expert advisory services for agricultural innovation",
      "Network connecting farmers and consultants globally",
      "Sustainable agricultural practices and professional training",
    ],
  },
];

// ============= REUSABLE SUB-COMPONENTS =============

const FeatureCard = ({ icon: Icon, title, description, index }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true }}
    className="group relative bg-white/40 dark:bg-emerald-950/20 backdrop-blur-md border border-emerald-100/30 dark:border-emerald-500/10 p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative flex items-start gap-4">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 shadow-inner">
        <Icon size={28} />
      </div>
      <div className="flex-1">
        <h4 className="text-lg font-bold text-foreground group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">{title}</h4>
        <p className="text-sm text-muted-foreground dark:text-slate-50 mt-1 leading-relaxed">{description}</p>
      </div>
    </div>
  </motion.div>
);

const ProjectSection = ({ project }: { project: any }) => (
  <section
    id={project.id}
    className="py-24 relative overflow-hidden"
  >
    <div className="container mx-auto px-6 relative z-10">
      <div
        className={`flex flex-col ${project.reverse ? "lg:flex-row-reverse" : "lg:flex-row"} gap-12 lg:gap-20 items-center mb-16`}
      >
        <motion.div
          className="w-full lg:w-1/2"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="group relative overflow-hidden h-80 md:h-[450px]">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-contain  transition-transform duration-700 group-hover:scale-110"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-6 left-6 p-4 bg-white/90 dark:bg-emerald-950/90 backdrop-blur-md text-emerald-600 dark:text-emerald-400 rounded-2xl shadow-xl z-20 transition-all duration-500 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
              <project.icon size={32} />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="w-full lg:w-1/2 space-y-8"
          initial={{ opacity: 0, x: project.reverse ? -30 : 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em]">
              <Sparkles size={14} className="animate-pulse" />
              {project.subtitle}
            </span>
            <h2 className="text-4xl md:text-6xl font-bold font-heading text-foreground tracking-tight">
              {project.title}
            </h2>
          </div>
          <p className="text-xl text-muted-foreground dark:text-slate-50 leading-relaxed font-light text-justify border-l-4 border-emerald-500/30 pl-6">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-5">
            {project.links.map((link: any, idx: number) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 ${link.type === "website" ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50" : "bg-white dark:bg-emerald-950/30 text-foreground border border-emerald-500/20 hover:bg-emerald-500/5 backdrop-blur-sm"}`}
              >
                {link.type === "linkedin" ? (
                  <Linkedin size={18} className="group-hover:rotate-[360deg] transition-transform duration-700" />
                ) : (
                  <ExternalLink size={18} className="group-hover:scale-110 transition-transform" />
                )}
                {link.label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {project.features.map((feature: any, idx: number) => (
          <FeatureCard key={idx} {...feature} index={idx} />
        ))}
      </div>
    </div>
  </section>
);

export const ProjectBanner = () => (
  <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background" />
    <div className="container text-center relative z-10 space-y-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
          <Sparkles size={16} /> Dr. Muhammad Kamran
        </div>
        <h1 className="text-5xl md:text-8xl font-bold tracking-tight">
          My Projects &{" "}
          <span className="text-primary italic">Collaborations</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Bridging the gap between scientific research and digital innovation.
        </p>
      </motion.div>
      <div className="flex justify-center gap-4 pt-4">
        <a
          href="#projects"
          className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all"
        >
          View All Work
        </a>
      </div>
    </div>
  </section>
);

export const ProjectsPage = () => (
  <div className="">
    <div id="projects">
      {PROJECTS_DATA.map((project) => (
        <ProjectSection key={project.id} project={project} />
      ))}
    </div>
  </div>
);

export default ProjectsPage;
