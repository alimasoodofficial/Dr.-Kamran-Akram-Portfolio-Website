"use client";
import { motion } from "framer-motion";
import "./ProjectsPage.css";
import {
  ArrowDown,
  Sparkles,
  ExternalLink,
  Linkedin,
  Globe,
  ArrowUpRight,
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

// Dummy image generator utility - creates canvas-based placeholder images
const getDummyImage = (text: string, bgColor: string = "#3b82f6"): string => {
  if (typeof window === "undefined") return "";
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 32px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  return canvas.toDataURL();
};

// Image paths from public directory
const heroBg = "/images/projects/hero_bg.png";
const dataExpertsLogo = "/images/projects/data_experts.png";
const triisumImage = "/images/projects/triisum.png";
const agriExpertsImage = "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2070&auto=format&fit=crop"; // High quality fallback

// ============= HERO SECTION =============
const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-hero-zoom"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
      </div>

      <div className="floating-orb w-96 h-96 -top-48 -left-48" />
      <div className="floating-orb w-64 h-64 top-1/4 right-0 animate-float-delayed" />
      <div className="floating-orb w-48 h-48 bottom-1/4 left-1/4" />

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Dr. Muhammad Kamran
            </span>
          </motion.div>

          <h1 className="section-title max-w-4xl mx-auto font-display">
            My Projects &{" "}
            <span className="gradient-text glow-text">Collaborations</span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Explore my three flagship initiatives dedicated to data literacy,
            sustainable tourism, and agricultural innovation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <a href="#projects" className="btn-primary">
              Explore Projects
            </a>
            <a
              href="https://imkamran.com/projects-gallery"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              View Gallery
            </a>
          </motion.div>
        </motion.div>

        <motion.a
          href="#projects"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
        >
          <span className="text-sm font-medium">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowDown className="w-5 h-5" />
          </motion.div>
        </motion.a>
      </div>
    </section>
  );
};

// ============= STATS SECTION =============
const StatsSection = () => {
  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      value: "100+",
      label: "Clients Served",
    },
    { icon: <Globe className="w-8 h-8" />, value: "Global", label: "Reach" },
    {
      icon: <Award className="w-8 h-8" />,
      value: "5-Star",
      label: "Support Rating",
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      value: "3",
      label: "Major Initiatives",
    },
  ];

  return (
    <section className="relative py-20 border-y border-border/30">
      <div className="absolute inset-0 bg-gradient-to-r from-background via-secondary/30 to-background" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-bold font-display text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============= PROJECT SECTION COMPONENT =============
interface FeaturePoint {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface ProjectLink {
  type: "website" | "linkedin";
  url: string;
  label: string;
}

interface ProjectSectionProps {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  icon: React.ReactNode;
  features: FeaturePoint[];
  highlights: string[];
  links: ProjectLink[];
  reverse?: boolean;
}

const ProjectSection = ({
  id,
  title,
  subtitle,
  description,
  image,
  icon,
  features,
  highlights,
  links,
  reverse = false,
}: ProjectSectionProps) => {
  return (
    <section id={id} className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0">
        <div
          className={`floating-orb w-96 h-96 opacity-10 ${
            reverse ? "-left-48 top-20" : "-right-48 top-40"
          }`}
        />
        <div
          className={`floating-orb w-64 h-64 opacity-10 animate-float-delayed ${
            reverse ? "right-20 bottom-20" : "left-20 bottom-40"
          }`}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className={`flex flex-col ${
            reverse ? "lg:flex-row-reverse" : "lg:flex-row"
          } gap-12 lg:gap-20 items-center mb-16`}
        >
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gray-100 dark:bg-gray-800">
                <img
                  src={image || getDummyImage(title, "#3b82f6")}
                  alt={title}
                  className="w-full h-72 md:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = getDummyImage(title, "#3b82f6");
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 project-icon">
                  {icon}
                </div>
              </div>
            </motion.div>
          </div>

          <div className="w-full lg:w-1/2 space-y-6">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20"
            >
              {subtitle}
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold font-display"
            >
              {title.split(" ").slice(0, -1).join(" ")}{" "}
              <span className="gradient-text">
                {title.split(" ").slice(-1)}
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-muted-foreground leading-relaxed"
            >
              {description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              {links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                    link.type === "website"
                      ? "btn-primary"
                      : "bg-muted hover:bg-muted/80 text-foreground border border-border/50"
                  }`}
                >
                  {link.type === "linkedin" ? (
                    <Linkedin className="w-4 h-4" />
                  ) : (
                    <ExternalLink className="w-4 h-4" />
                  )}
                  {link.label}
                </a>
              ))}
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-6 group hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl  flex items-center justify-center text-primary bg-blue-primary transition-all duration-300 flex-shrink-0">
                  {feature.icon}
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold font-display text-foreground">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {highlights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <Accordion type="single" collapsible className="glass-card p-6">
              <AccordionItem value="highlights" className="border-none">
                <AccordionTrigger className="text-lg font-semibold font-display text-foreground hover:text-primary py-0">
                  Key Highlights & Achievements
                </AccordionTrigger>
                <AccordionContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
};

// ============= ALL PROJECTS =============
const AllProjectsSections = () => {
  return (
    <div id="projects">
      <ProjectSection
        id="data-experts"
        title="Data Experts 360"
        subtitle="Smart IT | Agri Tech | Sustainable Growth"
        description="A global platform advancing data literacy and scientific communication through the Data Ambassadors Program. We offer analytics services, training, dashboards, and digital solutions."
        image={dataExpertsLogo}
        icon={<Database className="w-7 h-7 text-primary-foreground" />}
        features={[
          {
            icon: <Globe className="w-6 h-6" />,
            title: "Web Development",
            description:
              "Cutting-edge web applications built with modern technologies.",
          },
          {
            icon: <Cpu className="w-6 h-6" />,
            title: "App Development",
            description: "Native and cross-platform mobile applications.",
          },
          {
            icon: <TrendingUp className="w-6 h-6" />,
            title: "Digital Marketing",
            description: "Strategic digital marketing and SEO optimization.",
          },
          {
            icon: <Target className="w-6 h-6" />,
            title: "Project Management",
            description: "Agile methodology ensuring timely delivery.",
          },
          {
            icon: <Shield className="w-6 h-6" />,
            title: "Quality Assurance",
            description: "Comprehensive QA testing for robust deployments.",
          },
          {
            icon: <Lightbulb className="w-6 h-6" />,
            title: "Data Science & AI",
            description: "Advanced AI/ML solutions for business intelligence.",
          },
        ]}
        highlights={[
          "Trusted by 100+ clients worldwide",
          "5-Star support rating with proven results",
          "Enterprise-grade, cloud-native solutions",
          "End-to-end services from concept to deployment",
        ]}
        links={[
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
        ]}
        reverse={false}
      />

      <ProjectSection
        id="triisum"
        title="Triisum Tourism"
        subtitle="Sustainability-Focused Travel Marketplace"
        description="A sustainability-focused tourism marketplace powered by Eco Ambassadors who promote responsible travel. Connecting travellers with eco-experiences and community-led adventures."
        image={triisumImage}
        icon={<Compass className="w-7 h-7 text-primary-foreground" />}
        features={[
          {
            icon: <Leaf className="w-6 h-6" />,
            title: "Eco-Friendly Travel",
            description:
              "Sustainable travel experiences minimizing environmental impact.",
          },
          {
            icon: <Map className="w-6 h-6" />,
            title: "Local Guides Network",
            description: "Authentic local guides sharing indigenous knowledge.",
          },
          {
            icon: <Heart className="w-6 h-6" />,
            title: "Community Adventures",
            description: "Experiences that benefit local economies.",
          },
          {
            icon: <Users className="w-6 h-6" />,
            title: "Eco Ambassadors",
            description: "Join our ambassador program for rewards.",
          },
          {
            icon: <TreePine className="w-6 h-6" />,
            title: "Nature Conservation",
            description: "Bookings contribute to conservation efforts.",
          },
          {
            icon: <Mountain className="w-6 h-6" />,
            title: "Unique Experiences",
            description: "Off-the-beaten-path adventures.",
          },
        ]}
        highlights={[
          "Eco Ambassador program promoting sustainable tourism",
          "Unique eco-experiences curated by local experts",
          "Community-led adventures protecting local culture",
          "Supporting indigenous communities and economies",
        ]}
        links={[
          {
            type: "linkedin",
            url: "https://www.linkedin.com/company/triisumofficial/",
            label: "Follow on LinkedIn",
          },
        ]}
        reverse={true}
      />

      <ProjectSection
        id="agri-experts"
        title="Agri Experts 360"
        subtitle="Agricultural Innovation Hub"
        description="A comprehensive hub providing agri-tech solutions, advisory services, and expert connections for smart farming and on-ground impact."
        image={agriExpertsImage}
        icon={<Wheat className="w-7 h-7 text-primary-foreground" />}
        features={[
          {
            icon: <Cpu className="w-6 h-6" />,
            title: "Agri-Tech Solutions",
            description: "Technology solutions for modern agriculture.",
          },
          {
            icon: <Sprout className="w-6 h-6" />,
            title: "Smart Farming",
            description: "IoT-enabled farming for optimized yield.",
          },
          {
            icon: <Users className="w-6 h-6" />,
            title: "Expert Network",
            description: "Connect with agricultural professionals worldwide.",
          },
          {
            icon: <BarChart3 className="w-6 h-6" />,
            title: "Advisory Services",
            description: "Data-driven agricultural advisory.",
          },
          {
            icon: <Truck className="w-6 h-6" />,
            title: "Supply Chain",
            description: "Connecting farmers directly to markets.",
          },
          {
            icon: <Settings className="w-6 h-6" />,
            title: "On-Ground Impact",
            description: "Practical implementation for farming communities.",
          },
        ]}
        highlights={[
          "Cutting-edge agri-tech solutions for modern farming",
          "Expert advisory services for agricultural innovation",
          "Network connecting farmers and consultants",
          "Sustainable agricultural practices and training",
        ]}
        links={[]}
        reverse={false}
      />
    </div>
  );
};

// ============= FOOTER =============
const Footer = () => {
  return (
    <footer className="relative py-16 border-t border-border/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold font-display mb-2">
              Dr. Muhammad <span className="gradient-text">Kamran</span>
            </h3>
            <p className="text-muted-foreground text-sm">
              Empowering communities through tech-driven solutions
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://imkamran.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              <Globe className="w-4 h-4" />
              Portfolio
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <a
              href="https://www.linkedin.com/in/drmuhammadkamran/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>

          <div className="text-muted-foreground text-sm text-center md:text-right">
            © {new Date().getFullYear()} All rights reserved
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

// ============= MAIN PROJECTS PAGE COMPONENT =============
const ProjectsPage = () => {
  return (
    <main className="  overflow-x-hidden">
      {/* <HeroSection /> */}
      <StatsSection />
      <AllProjectsSections />
      {/* <Footer /> */}
    </main>
  );
};

export default ProjectsPage;
