// src/data/freeResourcesMenu.ts
export interface FreeResourceItem {
  title: string;
  description: string;
  href: string;
  icon: string; // path to icon in /public/icons
}

export const freeResources: FreeResourceItem[] = [
  {
    title: "YouTube Channel",
    description: "Videos on productivity, business & tech.",
    href: "#",
    icon: "/icons/cog.svg",
  },
  {
    title: "Newsletter",
    description: "Weekly insights to boost your learning.",
    href: "#",
    icon: "/icons/cog.svg",
  },
  {
    title: "Research Articles",
    description: "Weekly insights to boost your learning.",
    href: "/free-resources/articles",
    icon: "/icons/cog.svg",
  },
  {
    title: "Podcast",
    description: "Inspiring chats with creators & experts.",
    href: "#",
    icon: "/icons/cog.svg",
    
  },
  {
    title: "Blog",
    description: "Deep dives into creativity & entrepreneurship.",
    href: "#",
    icon: "/icons/cog.svg",
  },
];
