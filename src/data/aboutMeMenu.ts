export interface AboutMeItem {
    title: string;
    description: string;
    href: string;
    icon: string;
}

export const aboutMeItems: AboutMeItem[] = [
    {
        title: "Resume",
        description: "My professional journey, skills, and qualifications.",
        href: "/resume",
        icon: "fa-solid fa-file-invoice",
    },
    {
        title: "Projects",
        description: "A showcase of my research and industry projects.",
        href: "/projects",
        icon: "fa-solid fa-lightbulb",
    },
    {
        title: "Gallery",
        description: "Visual glimpses into my life and professional events.",
        href: "/gallery",
        icon: "fa-solid fa-images",
    },
];
