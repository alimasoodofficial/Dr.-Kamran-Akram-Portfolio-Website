export interface EbookMenuItem {
    title: string;
    description: string;
    href: string;
    icon: string;
    bgColor?: string;
}

export const ebookMenuItems: EbookMenuItem[] = [
    {
        title: "Publications Store",
        description: "Browse and purchase technical ebooks and guides.",
        href: "/ebooks",
        icon: "fa-solid fa-store",
        bgColor: "bg-gradient-to-br from-amber-500 to-orange-600",
    },
    {
        title: "Login to Read",
        description: "Access your library and read purchased ebooks.",
        href: "/ebooks/library",
        icon: "fa-solid fa-book-open",
        bgColor: "bg-gradient-to-br from-emerald-500 to-teal-600",
    },
];
