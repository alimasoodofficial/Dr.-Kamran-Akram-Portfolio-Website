export interface AboutMeItem {
    title: string;
    description: string;
    href: string;
    icon: string;
    bgColor?: string;
}

export const aboutMeItems: AboutMeItem[] = [
    {
        title: "Resume",
        description: "My professional journey, skills, and qualifications.",
        href: "/resume",
        icon: "fa-solid fa-file-invoice",
        bgColor: "bg-gradient-to-br from-emerald-500 to-green-600",
    },
    {
        title: "Projects",
        description: "A showcase of my research and industry projects.",
        href: "/projects",
        icon: "fa-solid fa-lightbulb",
        bgColor: "bg-gradient-to-br from-yellow-400 to-amber-500",
    },
    {
        title: "Gallery",
        description: "Visual glimpses into my life and professional events.",
        href: "/gallery",
        icon: "fa-solid fa-images",
        bgColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
    },
];
