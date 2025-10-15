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
    href: "/resources/youtube",
    icon: "/icons/cog.svg",
  },
  {
    title: "Newsletter",
    description: "Weekly insights to boost your learning.",
    href: "/resources/newsletter",
    icon: "/icons/cog.svg",
  },
  {
    title: "Podcast",
    description: "Inspiring chats with creators & experts.",
    href: "/resources/podcast",
    icon: "/icons/cog.svg",
    
  },
  {
    title: "Blog",
    description: "Deep dives into creativity & entrepreneurship.",
    href: "/resources/blog",
    icon: "/icons/cog.svg",
  },
];
