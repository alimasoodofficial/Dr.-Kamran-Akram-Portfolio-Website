export interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  description: string;
}

export const timelineData: TimelineEvent[] = [
  {
    id: 1,
    date: "2009 – 2012",
    title: "Global Exposure & Fellowships",
    description: "Selected for prestigious international fellowships, including Fulbright and Eisenhower. This experience broadened global perspective, ethical thinking, and commitment to public impact."
  },
  {
    id: 2,
    date: "2013 – 2016",
    title: "Global Impact",
    description: "Collaborated with governments, global institutions, and private sector teams on projects in AI, analytics, policy, and innovation."
  },
  {
    id: 3,
    date: "2017 – 2025",
    title: "Sharing Knowledge",
    description: "Focused on teaching, writing, and mentoring across disciplines. Launched learning initiatives and authored books and research."
  },
  {
    id: 4,
    date: "2025 – 2030",
    title: "Future Vision",
    description: "Continuing to advance AI, data science, and human centered systems for public good. Focused on building ethical frameworks."
  }
];