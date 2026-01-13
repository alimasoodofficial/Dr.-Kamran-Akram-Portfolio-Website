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
    title: "Blog",
    description: "Deep dives into creativity & entrepreneurship.",
    href: "#",
    icon: "fa-solid fa-blog",
  },
];
