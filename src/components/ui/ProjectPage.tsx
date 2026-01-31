"use client";
import { motion } from "framer-motion";
import {
  Sparkles, ExternalLink, Linkedin, Globe, Users, Award, 
  Rocket, Database, BarChart3, Leaf, Map, Compass, Heart, 
  Wheat, Cpu, Sprout, TrendingUp, Target, Lightbulb,
  TreePine, Mountain, Truck, Settings, Shield,
} from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/Accordion";

// ============= DATA CONFIGURATION =============
export const PROJECTS_DATA = [
  {
    id: "data-experts",
    title: "Data Experts 360",
    subtitle: "Smart IT | Agri Tech | Sustainable Growth",
    description: "A global platform advancing data literacy and scientific communication through the Data Ambassadors Program. We offer analytics services, training, dashboards, and digital solutions for a data-driven future.",
    image: "https://dataexperts360.com/wp-content/uploads/2025/06/data-expert-360-3d-logo.jpg",
    icon: Database,
    reverse: false,
    links: [
      { type: "website", url: "https://www.dataexperts360.com/", label: "Visit Website" },
      { type: "linkedin", url: "https://www.linkedin.com/company/dataexperts360/", label: "LinkedIn" },
    ],
    features: [
      { icon: Globe, title: "Web Development", description: "Cutting-edge web applications built with modern technologies." },
      { icon: Cpu, title: "App Development", description: "Native and cross-platform mobile applications." },
      { icon: TrendingUp, title: "Digital Marketing", description: "Strategic digital marketing and SEO optimization." },
      { icon: Target, title: "Project Management", description: "Agile methodology ensuring timely delivery." },
      { icon: Shield, title: "Quality Assurance", description: "Comprehensive QA testing for robust deployments." },
      { icon: Lightbulb, title: "Data Science & AI", description: "Advanced AI/ML solutions for business intelligence." },
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
    title: "Triisum Tourism",
    subtitle: "Sustainability-Focused Travel Marketplace",
    description: "A sustainability-focused tourism marketplace powered by Eco Ambassadors who promote responsible travel. Connecting travellers with eco-experiences and community-led adventures that protect local culture.",
    image: "https://images.pexels.com/photos/33784883/pexels-photo-33784883.jpeg",
    icon: Compass,
    reverse: true,
    links: [
      { type: "linkedin", url: "https://www.linkedin.com/company/triisumofficial/", label: "Follow on LinkedIn" },
    ],
    features: [
      { icon: Leaf, title: "Eco-Friendly Travel", description: "Sustainable travel experiences minimizing environmental impact." },
      { icon: Map, title: "Local Guides Network", description: "Authentic local guides sharing indigenous knowledge." },
      { icon: Heart, title: "Community Adventures", description: "Experiences that benefit local economies." },
      { icon: Users, title: "Eco Ambassadors", description: "Join our ambassador program for rewards and impact." },
      { icon: TreePine, title: "Nature Conservation", description: "Bookings contribute directly to conservation efforts." },
      { icon: Mountain, title: "Unique Experiences", description: "Off-the-beaten-path adventures for conscious travelers." },
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
    description: "A comprehensive hub providing agri-tech solutions, advisory services, and expert connections for smart farming. We bridge the gap between technology and the field for sustainable on-ground impact.",
    image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2070&auto=format&fit=crop",
    icon: Wheat,
    reverse: false,
    links: [
       // Add links here when available
    ],
    features: [
      { icon: Cpu, title: "Agri-Tech Solutions", description: "Technology solutions designed for modern agricultural challenges." },
      { icon: Sprout, title: "Smart Farming", description: "IoT-enabled farming techniques for optimized crop yield." },
      { icon: Users, title: "Expert Network", description: "Connect with top-tier agricultural professionals worldwide." },
      { icon: BarChart3, title: "Advisory Services", description: "Data-driven agricultural advisory for farmers and firms." },
      { icon: Truck, title: "Supply Chain", description: "Connecting farmers directly to markets via tech platforms." },
      { icon: Settings, title: "On-Ground Impact", description: "Practical implementation and training for farming communities." },
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
    className="bg-white dark:bg-teal-900 p-6 rounded-2xl shadow-lg bg-card hover:bg-accent/5 transition-all duration-300"
  >
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-primary bg-primary/10 group-hover:bg-primary transition-colors ">
        <Icon size={24} />
      </div>
      <div>
        <h4 className="text-lg font-semibold text-card-foreground ">{title}</h4>
        <p className="text-sm  dark:text-white">{description}</p>
      </div>
    </div>
  </motion.div>
);

const ProjectSection = ({ project }: { project: any }) => (
  <section id={project.id} className="py-20 border-b border-border/20 last:border-0">
    <div className="container mx-auto px-6">
      <div className={`flex flex-col ${project.reverse ? "lg:flex-row-reverse" : "lg:flex-row"} gap-12 items-center mb-16`}>
        <motion.div className="w-full lg:w-1/2" initial={{ opacity: 0, x: project.reverse ? 50 : -50 }} whileInView={{ opacity: 1, x: 0 }}>
          <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-xl shadow-primary/5">
            <img src={project.image} alt={project.title} className="w-full h-72 md:h-96 object-cover" />
            <div className="absolute bottom-6 left-6 p-3 bg-primary text-primary-foreground rounded-xl shadow-lg">
              <project.icon size={28} />
            </div>
          </div>
        </motion.div>

        <div className="w-full lg:w-1/2 space-y-6">
          <span className="px-4 py-1.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary uppercase tracking-wider ">{project.subtitle}</span>
          <h2 className="text-3xl my-2 md:text-5xl font-bold  font-display text-foreground">{project.title}</h2>
          <p className="text-lg text-muted-foreground text-justify dark:text-white leading-relaxed">{project.description}</p>
          <div className="flex flex-wrap gap-4">
            {project.links.map((link: any, idx: number) => (
              <a key={idx} href={link.url} className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${link.type === 'website' ? 'bg-primary text-primary-foreground hover:opacity-90' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border'}`}>
                {link.type === "linkedin" ? <Linkedin size={16} /> : <ExternalLink size={16} />}
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
          <Sparkles size={16} /> Dr. Muhammad Kamran
        </div>
        <h1 className="text-5xl md:text-8xl font-bold tracking-tight">
          My Projects & <span className="text-primary italic">Collaborations</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Bridging the gap between scientific research and digital innovation.
        </p>
      </motion.div>
      <div className="flex justify-center gap-4 pt-4">
        <a href="#projects" className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all">View All Work</a>
      </div>
    </div>
  </section>
);

export const ProjectsPage = () => (
  <div className="bg-background">
    <div id="projects">
      {PROJECTS_DATA.map((project) => (
        <ProjectSection key={project.id} project={project} />
      ))}
    </div>
  </div>
);

export default ProjectsPage;