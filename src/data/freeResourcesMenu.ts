export interface FreeResourceItem {
  title: string;
  description: string;
  href: string;
  icon: string; // path to icon in /public/icons
  target?: string;
  bgColor?: string;
}

export const freeResources: FreeResourceItem[] = [
  {
    title: "YouTube Channel",
    description: "Personal experiences, scientific insights, adventures and conversations worth sharing.",
    href: "https://www.youtube.com/@MKamran09",
    target: "_blank",
    icon: "/images/yt-logo.jpeg",
  },
  {
    title: "Newsletter",
    description: "Thoughts, stories and practical insights bridging research, technology and real world impact.",
    href: "/newsletter",
    icon: "fa-solid fa-envelope",
  },
  {
    title: "Research Publications",
    description: "A collection of my scientific publications, research papers and academic contributions.",
    href: "/free-resources/articles",
    bgColor: "bg-blue-600",
    icon: "fa-solid fa-newspaper",
  },
  {
    title: "Podcast",
    description: "Discussions with researchers, creators, entrepreneurs and curious minds.",
    href: "/coming-soon",
    bgColor: "bg-red-600",
    icon: "fa-solid fa-microphone",
    
  },
  {
    title: "Beyond the Lab",
    description: "Explore my LinkedIn newsletter featuring insights on science, innovation, agriculture, entrepreneurship and life beyond research.",
    href: "https://www.linkedin.com/newsletters/beyond-the-lab-7384192301260230656/",
    target: "_blank",
    icon: "/images/beyond-the-lab.png",
  },
  {
    title: "Buy me a coffee",
    description: "Enjoying the content? A coffee helps support future ideas, projects and creative experiments.",
    href: "https://buymeacoffee.com/drkamran",
    target: "_blank",
    bgColor: "bg-[#FFDD00]",
    icon: "/icons/buy-me-coffee-icon.svg",
  },
];

