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
    description: "Videos on productivity, business & tech.",
    href: "#",
    icon: "fa-brands fa-youtube",
  },
  {
    title: "Newsletter",
    description: "Weekly insights to boost your learning.",
    href: "#",
    icon: "fa-solid fa-envelope",
  },
  {
    title: "Research Articles",
    description: "Weekly insights to boost your learning.",
    href: "/free-resources/articles",
    icon: "fa-solid fa-newspaper",
  },
  {
    title: "Podcast",
    description: "Inspiring chats with creators & experts.",
    href: "#",
    icon: "fa-solid fa-microphone",
    
  },
  {
    title: "Downloadables /Linkedin PDFs",
    description: "Deep dives into creativity & entrepreneurship.",
    href: "https://www.linkedin.com/in/kam09/",
    target: "_blank",
    icon: "fa-solid fa-file-pdf",
  },
  {
    title: "Buy me a coffee",
    description: "Deep dives into creativity & entrepreneurship.",
    href: "https://buymeacoffee.com/drkamran",
    target: "_blank",
    bgColor: "bg-[#FFDD00]",
    icon: "/icons/buy-me-coffee-icon.svg",
  },
];

