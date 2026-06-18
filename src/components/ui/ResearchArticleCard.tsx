"use client";

import React from "react";
import { Book, FileText, Calendar, Users, ExternalLink, Award, Sparkles } from "lucide-react";

interface ResearchArticleCardProps {
  id: string;
  title: string;
  category?: string;
  summary?: string;
  author?: string;
  published_date?: string;
  button_link?: string;
  journal_name?: string;
  book_title?: string;
  tags?: string; // Comma separated tags
  image_url?: string;
}

const ResearchArticleCard: React.FC<ResearchArticleCardProps> = ({
  title,
  category = "Research",
  summary,
  author,
  published_date,
  button_link,
  journal_name,
  book_title,
  tags,
  image_url,
}) => {
  // Parse tags if they exist
  const tagList = tags
    ? tags.split(",").map((t) => t.trim()).filter((t) => t.length > 0)
    : [];

  // Determine category badge styles and icon
  const getCategoryConfig = (cat: string) => {
    const lower = cat.toLowerCase();
    if (lower.includes("book") || lower.includes("chapter")) {
      return {
        badgeBg: "bg-amber-400 dark:bg-amber-500/20 text-amber-950 dark:text-amber-300 border border-amber-400/20 dark:border-amber-500/30",
        icon: Book,
        label: cat,
      };
    }
    if (lower.includes("journal") || lower.includes("article") || lower.includes("paper")) {
      return {
        badgeBg: "bg-sky-100 dark:bg-sky-500/20 text-sky-800 dark:text-sky-300 border border-sky-200/50 dark:border-sky-500/30",
        icon: FileText,
        label: cat,
      };
    }
    if (lower.includes("award") || lower.includes("patent")) {
      return {
        badgeBg: "bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 border border-purple-200/50 dark:border-purple-500/30",
        icon: Award,
        label: cat,
      };
    }
    return {
      badgeBg: "bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 border border-teal-200/50 dark:border-teal-500/30",
      icon: Sparkles,
      label: cat,
    };
  };

  const catConfig = getCategoryConfig(category);
  const BadgeIcon = catConfig.icon;

  return (
    <div className="w-full flex flex-col md:flex-row rounded-3xl overflow-hidden border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 shadow-sm hover:shadow-xl dark:hover:shadow-emerald-950/10 transition-all duration-500 group">
      {/* Left Column (Teal Block / Cover Block) */}
      <div className="w-full md:w-[320px] flex-shrink-0 relative flex flex-col justify-between p-8 text-white min-h-[240px] md:min-h-full overflow-hidden">
        {/* Background Visuals */}
        {image_url ? (
          <>
            <img 
              src={image_url} 
              alt={book_title || title} 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.4]"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-teal-950/90 via-teal-900/80 to-emerald-950/90 z-0 mix-blend-multiply" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-[#026a64] via-[#01524e] to-[#003835] dark:from-[#01403c] dark:via-[#002b28] dark:to-[#001715] z-0" />
            {/* Soft decorative circles */}
            <div className="absolute -right-20 -top-20 w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl z-0 pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-48 h-48 rounded-full bg-teal-400/10 blur-2xl z-0 pointer-events-none" />
          </>
        )}

        {/* Content of Left Column */}
        <div className="relative z-10 w-full">
          {/* Badge */}
          <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide shadow-sm w-fit ${catConfig.badgeBg}`}>
            <BadgeIcon className="w-3.5 h-3.5" />
            {catConfig.label}
          </span>
        </div>

        <div className="relative z-10 w-full mt-10 md:mt-24 space-y-3">
          {book_title && (
            <h4 className="font-bold text-lg leading-snug tracking-tight !text-white line-clamp-3 font-heading drop-shadow-sm">
              {book_title}
            </h4>
          )}
          {(journal_name || published_date) && (
            <p className="text-xs md:text-sm !text-white/90 font-medium flex flex-wrap items-center gap-1.5">
              {journal_name && <span>{journal_name}</span>}
              {journal_name && published_date && <span className="opacity-60">•</span>}
              {published_date && <span>{published_date.split(",").pop()?.trim() || published_date}</span>}
            </p>
          )}
        </div>
      </div>

      {/* Right Column (Details Block) */}
      <div className="flex-1 p-8 flex flex-col justify-between space-y-6 bg-white dark:bg-zinc-950/10">
        <div className="space-y-4">
          {/* Meta Line: Published Date & Authors */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-muted-foreground dark:text-zinc-500 font-medium">
            {published_date && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-emerald-400" />
                <span>Published {published_date}</span>
              </span>
            )}
            {author && (
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-teal-600 dark:text-emerald-400" />
                <span className="line-clamp-1">By {author}</span>
              </span>
            )}
          </div>

          {/* Article Title */}
          <h3 className="text-xl md:text-2xl font-bold font-heading text-slate-800 dark:text-zinc-100 group-hover:text-[#026a64] dark:group-hover:text-emerald-400 transition-colors duration-300 leading-tight">
            {title}
          </h3>

          {/* Abstract / Summary */}
          {summary && (
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase tracking-wider text-teal-600 dark:text-emerald-400 font-bold block">
                Abstract
              </span>
              <p className="text-sm text-muted-foreground dark:text-zinc-400 leading-relaxed text-justify line-clamp-3 md:line-clamp-4 font-light">
                {summary}
              </p>
            </div>
          )}
        </div>

        {/* Footer of Card: Tags & Read Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-50 dark:border-zinc-900">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 max-w-[70%]">
            {tagList.map((tag, i) => (
              <span 
                key={i}
                className="bg-teal-50/50 dark:bg-emerald-950/10 text-teal-700 dark:text-emerald-400 border border-teal-100/30 dark:border-emerald-900/10 px-3 py-1 rounded-full text-xs font-medium tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Button Link */}
          {button_link ? (
            <a
              href={button_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#026a64] hover:bg-[#025651] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl text-xs tracking-wider uppercase transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10 w-full sm:w-auto"
            >
              <span>Read on {journal_name || "Journal"}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <span className="text-xs text-muted-foreground italic">Full text available on request</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResearchArticleCard;
