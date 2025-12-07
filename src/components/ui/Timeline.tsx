"use client";
import { motion } from "framer-motion";

interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  position: "top" | "bottom";
}

const timelineEvents: TimelineEvent[] = [
  {
    year: 1971,
    title: "Ramsar Convention",
    description: "Convention on Wetlands of International Importance adopted",
    position: "bottom",
  },
  {
    year: 1972,
    title: "World Heritage",
    description:
      "Convention for the Protection of the World Cultural and Natural Heritage adopted",
    position: "top",
  },

  {
    year: 1974,
    title: "Regional Seas",
    description: "Regional Seas Programme established",
    position: "top",
  },
  {
    year: 1979,
    title: "Migratory Species",
    description: "Convention on Migratory Species adopted",
    position: "bottom",
  },

  {
    year: 1989,
    title: "Basel Convention",
    description:
      "Control of Transboundary Movements of Hazardous Wastes adopted",
    position: "top",
  },
  {
    year: 1992,
    title: "CBD",
    description: "Convention on Biological Diversity signed",
    position: "top",
  },
  {
    year: 1992,
    title: "UNFCCC",
    description: "UN Framework Convention on Climate Change signed",
    position: "bottom",
  },
  {
    year: 1994,
    title: "Desertification",
    description: "UN Convention to Combat Desertification adopted",
    position: "bottom",
  },
  {
    year: 1998,
    title: "Rotterdam",
    description: "Rotterdam Convention adopted",
    position: "top",
  },
  {
    year: 2001,
    title: "Stockholm",
    description: "Convention on Persistent Organic Pollutants adopted",
    position: "bottom",
  },
  {
    year: 2013,
    title: "Minamata",
    description: "Minamata Convention on Mercury adopted",
    position: "top",
  },
  {
    year: 2015,
    title: "Paris Agreement",
    description: "Paris Agreement on climate change signed",
    position: "bottom",
  },

  {
    year: 2023,
    title: "High Seas Treaty",
    description: "High Seas Treaty adopted",
    position: "bottom",
  },
  {
    year: 2025,
    title: "Science-Policy Panel",
    description: "Intergovernmental Science-Policy Panel on Chemicals agreed",
    position: "top",
  },
];

const decades = [
  { label: "70's", start: 1970, end: 1979, color: "bg-purple-700" },
  { label: "80's", start: 1980, end: 1989, color: "bg-red-700" },
  { label: "90's", start: 1990, end: 1999, color: "bg-green-700" },
  { label: "2000's", start: 2000, end: 2030, color: "bg-blue-700" },
];

// Calculate spread positions to avoid overlaps
const getSpreadPositions = (
  events: TimelineEvent[],
  position: "top" | "bottom"
) => {
  const filtered = events.filter((e) => e.position === position);
  const minSpacing = 9; // Minimum percentage spacing between events
  const positions: { event: TimelineEvent; left: number }[] = [];

  filtered.forEach((event, index) => {
    const naturalPos = ((event.year - 1970) / (2030 - 1970)) * 100;
    let adjustedPos = naturalPos;

    // Check for overlap with previous events and adjust
    if (positions.length > 0) {
      const lastPos = positions[positions.length - 1].left;
      if (adjustedPos - lastPos < minSpacing) {
        adjustedPos = lastPos + minSpacing;
      }
    }

    // Clamp to valid range
    adjustedPos = Math.min(adjustedPos, 92);

    positions.push({ event, left: adjustedPos });
  });

  return positions;
};

const topPositions = getSpreadPositions(timelineEvents, "top");
const bottomPositions = getSpreadPositions(timelineEvents, "bottom");

export const Timeline = () => {
  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        

        {/* Timeline Container (responsive): horizontal scroll on small screens, full layout on md+ */}
        <div className="relative w-full overflow-x-auto">
          <div className=" h-[700px]">
            {/* Top Events */}
            <div className="absolute top-0 left-0 right-0 h-[260px] md:h-[280px]">
              {topPositions.map(({ event, left }, index) => (
                <motion.div
                  key={`${event.year}-${event.title}`}
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.15, duration: 0.5 }}
                  className="absolute flex flex-col items-center"
                  style={{ left: `${left}%`, bottom: 0 }}
                >
                  <div className="text-center max-w-[140px] md:max-w-[120px] mb-2">
                    <p className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100">
                      {event.year}
                    </p>
                    <p className="text-sm md:text-xs text-gray-700 dark:text-gray-300 leading-tight">
                      {event.description}
                    </p>
                  </div>
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.8 + index * 0.15, duration: 0.4 }}
                    className="w-px h-12 bg-gray-300 dark:bg-gray-600 origin-bottom"
                  />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1 + index * 0.15, duration: 0.3 }}
                    className="w-4 h-4 rounded-full bg-amber-500 border-2 border-white dark:border-gray-900 shadow-lg"
                  />
                </motion.div>
              ))}
            </div>

            {/* Timeline Bar */}
            <div className="absolute top-[280px] md:top-[300px] left-0 right-0 h-12 flex">
              {decades.map((decade, index) => (
                <motion.div
                  key={decade.label}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.2 + index * 0.2, duration: 0.6 }}
                  className={`flex-1 ${
                    decade.color
                  } flex items-center justify-center origin-left ${
                    index === 0 ? "rounded-l-sm" : ""
                  }`}
                >
                  <span className="text-foreground font-semibold text-lg">
                    {decade.label}
                  </span>
                </motion.div>
              ))}
              {/* Arrow */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.4 }}
                className="w-0 h-0 border-t-[24px] border-b-[24px] border-l-[30px] border-t-transparent border-b-transparent border-l-amber-500"
              />
            </div>

            {/* Bottom Events */}
            <div className="absolute top-[320px] md:top-[360px] left-0 right-0 h-[340px]">
              {bottomPositions.map(({ event, left }, index) => (
                <motion.div
                  key={`${event.year}-${event.title}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.15, duration: 0.5 }}
                  className="absolute flex flex-col items-center"
                  style={{ left: `${left}%`, top: 0 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1 + index * 0.15, duration: 0.3 }}
                    className="w-4 h-4 rounded-full bg-amber-500 border-2 border-white dark:border-gray-900 shadow-lg"
                  />
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.8 + index * 0.15, duration: 0.4 }}
                    className="w-px h-12 bg-gray-300 dark:bg-gray-600 origin-top"
                  />
                  <div className="text-center max-w-[140px] md:max-w-[120px] mt-2">
                    <p className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100">
                      {event.year}
                    </p>
                    <p className="text-sm md:text-xs text-gray-700 dark:text-gray-300 leading-tight">
                      {event.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
