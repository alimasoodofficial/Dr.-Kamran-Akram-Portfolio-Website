"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { slugify } from "@/lib/utils";
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Download, 
  Maximize2, 
  Minimize2, 
  Search, 
  List, 
  Compass, 
  RotateCcw,
  Sparkles,
  PhoneCall,
  Volume2,
  VolumeX,
  BookMarked
} from "lucide-react";
import toast from "react-hot-toast";

type Ebook = {
  id: string;
  title: string;
  description?: string;
  cover_url?: string;
  file_url?: string;
};

type FlipbookClientProps = {
  ebook: Ebook;
};

// Generates dynamic professional e-book content slides based on title
const generateBookChapters = (title: string, description: string) => {
  return [
    {
      title: "Title Page",
      type: "cover",
      subtitle: "Dr. Kamran Akram Knowledge Series",
      tagline: "Academic Integrity • Industrial Compliance • Environmental Engineering",
      author: "Dr. Muhammad Kamran Akram",
      credentials: "Chief Environmental Specialist & Industry Consultant",
    },
    {
      title: "Table of Contents",
      type: "toc",
      chapters: [
        { num: 1, title: "Foundations & Ecosystem Dynamics", page: "03" },
        { num: 2, title: "Methodologies & Laboratory Analysis", page: "04" },
        { num: 3, title: "Case Studies & Real-World Compliance", page: "05" },
        { num: 4, title: "Strategic Remediation & Action Plans", page: "06" },
        { num: 5, title: "Future Outlook & Digital Engineering", page: "07" },
      ],
      intro: "This publication serves as a cornerstone resource for environmental scientists, technical researchers, and engineering compliance officers seeking standard protocols and advanced spatial modeling approaches."
    },
    {
      title: "Chapter 1: Ecosystem Foundations",
      type: "content",
      subtitle: "Understanding environmental pressure points",
      paragraphs: [
        "In the contemporary landscape of environmental research, characterizing localized pollutants is crucial to securing regional regulatory approvals. By modeling chemical, biological, and geological stressors, we can trace pollutant transport dynamics accurately.",
        "Establishing a granular base-level reference enables researchers to separate anthropogenic waste streams from natural ecosystem cycles, which is critical for formulating effective legal defenses during environmental audits."
      ],
      tip: "💡 Key Takeaway: Base-level references are the baseline of defense during heavy environmental compliance audits."
    },
    {
      title: "Chapter 2: Methods & Laboratory Data",
      type: "content",
      subtitle: "Analytical standard operating procedures",
      paragraphs: [
        "Precision in laboratory extraction and isolation processes prevents sample contamination and preserves original material structures.",
        "Utilizing advanced tools like FTIR spectroscopy, gas chromatography, and high-performance raster GIS calculations allows our researchers to obtain certified data pools that satisfy state and federal compliance targets."
      ],
      dataGrid: [
        { parameter: "Sample Resolution", val: "0.2 microns" },
        { parameter: "Analytical Confidence", val: "99.84%" },
        { parameter: "Variance Tolerance", val: "< 0.05%" }
      ]
    },
    {
      title: "Chapter 3: Compliance & Audits",
      type: "content",
      subtitle: "Navigating international standards",
      paragraphs: [
        "Achieving compliant standing demands a thorough review of localized environmental codes, chemical waste storage protocols, and exhaust filter parameters.",
        "Our field investigations indicate that proactive compliance modeling mitigates regulatory penalties by over 80% while establishing robust operational goodwill with municipal environmental agencies."
      ],
      quote: "Compliance is not just about avoiding fines; it is about building sustainable long-term infrastructure that stands the test of time."
    },
    {
      title: "Chapter 4: Strategic Remediation",
      type: "content",
      subtitle: "Developing highly effective action plans",
      paragraphs: [
        "Remediation plans must focus on source reduction, target encapsulation, and continuous bio-monitoring. Deploying specialized filtration materials and green reagents eliminates active chemical hazards without leaving secondary pollutant footprints.",
        "Integrating spatial modeling directly into remediation layouts guarantees that resources are deployed in high-pressure corridors, maximizing return-on-investment."
      ],
      actionBadge: "🚀 Priority Action Checklist Available on Request"
    },
    {
      title: "Chapter 5: Next-Generation Systems",
      type: "content",
      subtitle: "Pioneering the future of ecosystem modeling",
      paragraphs: [
        "The integration of AI diagnostics, remote satellite sensing, and automated real-time water quality sensors marks a major shift in ecosystem defense.",
        "As tools mature, researchers will transition from passive damage control to predictive ecological design, securing resources for generations to come."
      ],
      authorNote: "Dr. Kamran Akram is currently developing spatial models targeting municipal watershed conservation."
    },
    {
      title: "Professional Services",
      type: "cta",
      subtitle: "Take the Next Step in Your Project",
      paragraphs: [
        "Do you need guidance implementing these methodologies in your laboratory or industrial facility? Dr. Kamran Akram offers dedicated consultations and specialized environmental audits.",
        "Schedule an interactive meeting to review your project needs, optimize your compliance frameworks, and explore tailored GIS solutions."
      ],
      buttonText: "Schedule Consulting Session",
      link: "/consulting"
    }
  ];
};

export default function FlipbookClient({ ebook }: FlipbookClientProps) {
  const chapters = generateBookChapters(ebook.title, ebook.description || "");
  const [currentPage, setCurrentPage] = useState(0); // 0 corresponds to front cover
  const [fullScreen, setFullScreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showToc, setShowToc] = useState(false);
  const flipbookRef = useRef<HTMLDivElement>(null);

  // Play synthetic soft paper flip sound using web audio API to avoid missing file errors!
  const playPageFlipSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      // Setup synthesizers for a soft 'swish' paper sound
      const bufferSize = ctx.sampleRate * 0.15;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      
      // Generate soft pink noise
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[i] *= 0.11; // Volume down
        b6 = white * 0.115926;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Soft lowpass filter
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(400, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.12);

      // Volume envelope
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      noise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      noise.start();
    } catch (e) {
      console.warn("Web Audio API failed:", e);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "Escape" && fullScreen) {
        setFullScreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, fullScreen]);

  const handleNext = () => {
    // Standard book view shows 2 pages at once after the cover
    // So 0 is cover, 1 is (pages 1-2 open), 2 is (pages 3-4 open), etc.
    const maxIndex = Math.ceil((chapters.length - 1) / 2);
    if (currentPage < maxIndex) {
      setCurrentPage((prev) => prev + 1);
      playPageFlipSound();
    } else {
      toast("You've reached the back cover!", { icon: "📖" });
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
      playPageFlipSound();
    }
  };

  const jumpToChapter = (chapterNum: number) => {
    // Map chapters to page indexes
    // chapter 0 -> cover index 0
    // chapter 1 -> toc (index 1 / 2) -> pageIndex 1
    // chapter 2 (ecosystem) -> pageIndex 2
    setCurrentPage(chapterNum);
    setShowToc(false);
    playPageFlipSound();
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      flipbookRef.current?.requestFullscreen().then(() => {
        setFullScreen(true);
      }).catch(err => {
        console.error("Fullscreen error:", err);
      });
    } else {
      document.exitFullscreen();
      setFullScreen(false);
    }
  };

  // Check if fullscreen changed externally (e.g. esc key)
  useEffect(() => {
    const onFullscreenChange = () => {
      setFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  // Compute standard spread page content
  // If currentPage is 0, we show the cover
  // If currentPage > 0, we show page L: (currentPage * 2 - 1) and page R: (currentPage * 2)
  const leftPageIndex = currentPage * 2 - 1;
  const rightPageIndex = currentPage * 2;

  const leftPage = leftPageIndex < chapters.length ? chapters[leftPageIndex] : null;
  const rightPage = rightPageIndex < chapters.length ? chapters[rightPageIndex] : null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] gap-6 p-4">
      
      {/* 🧭 Control Panel Top */}
      <div className="w-full max-w-5xl flex items-center justify-between gap-4 bg-white/80 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-md">
        <Link 
          href={`/ebooks/${slugify(ebook.title)}`}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-500 text-sm font-bold transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Exit Reader</span>
        </Link>

        {/* Dynamic Reader Status */}
        <div className="hidden sm:flex items-center gap-2 text-slate-400 text-xs">
          <BookMarked className="w-4 h-4 text-emerald-500" />
          <span>Active Reader: <strong className="text-slate-700 dark:text-slate-200">{ebook.title}</strong></span>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowToc(!showToc)}
            className={`p-2.5 rounded-xl border transition-all ${showToc ? "bg-emerald-500 border-emerald-500 text-white" : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"}`}
            title="Table of Contents"
          >
            <List className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 transition-colors"
            title={soundEnabled ? "Mute Flip Sound" : "Enable Flip Sound"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button 
            onClick={() => setZoomLevel(prev => prev === 1 ? 1.08 : prev === 1.08 ? 1.15 : 1)}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 transition-colors text-xs font-bold"
            title="Zoom Page"
          >
            {zoomLevel === 1 ? "100%" : zoomLevel === 1.08 ? "110%" : "120%"}
          </button>

          <button 
            onClick={toggleFullScreen}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 transition-colors"
            title="Toggle Fullscreen"
          >
            {fullScreen ? <Maximize2 className="w-4 h-4 rotate-180" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {ebook.file_url && (
            <a 
              href={ebook.file_url}
              download
              className="p-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors shadow-sm"
              title="Download PDF Copy"
            >
              <Download className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* 📖 The Flipbook Core viewport */}
      <div 
        ref={flipbookRef}
        className={`w-full max-w-5xl flex items-center justify-center relative overflow-hidden select-none bg-slate-100 dark:bg-slate-950/40 rounded-3xl p-6 md:p-12 transition-all duration-300 border border-slate-200/50 dark:border-slate-800/40 shadow-inner ${fullScreen ? "h-screen rounded-none p-4 bg-slate-950" : "min-h-[560px]"}`}
      >
        
        {/* Navigation Overlays */}
        <button
          onClick={handlePrev}
          disabled={currentPage === 0}
          className="absolute left-4 z-20 p-3 bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-white rounded-full shadow-lg border border-slate-200 dark:border-slate-700 hover:scale-105 disabled:opacity-30 disabled:scale-100 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          disabled={currentPage >= Math.ceil((chapters.length - 1) / 2)}
          className="absolute right-4 z-20 p-3 bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-white rounded-full shadow-lg border border-slate-200 dark:border-slate-700 hover:scale-105 disabled:opacity-30 disabled:scale-100 transition-all cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* 📚 Book Body Wrapper */}
        <motion.div 
          className="w-full flex justify-center items-center relative transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
          layout
        >
          <AnimatePresence mode="wait">
            {currentPage === 0 ? (
              
              /* ================== COVER PAGE SPREAD ================== */
              <motion.div
                key="cover"
                initial={{ opacity: 0, rotateY: 35 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: -35 }}
                transition={{ duration: 0.4 }}
                onClick={handleNext}
                className="w-full max-w-[420px] aspect-[3/4] bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-950 dark:from-black dark:via-emerald-950 dark:to-slate-900 text-white rounded-2xl shadow-2xl relative flex flex-col justify-between p-8 border-4 border-slate-800/80 cursor-pointer overflow-hidden transform-gpu"
                style={{ transformStyle: "preserve-3d", perspective: 1200 }}
              >
                {/* Visual Accent Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl -ml-20 -mb-20" />
                
                {/* Book spine line */}
                <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/60 via-transparent to-transparent border-r border-white/5" />

                <div className="space-y-4 pt-10">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                    <span className="text-[10px] uppercase font-extrabold tracking-widest">{chapters[0].subtitle}</span>
                  </div>
                  
                  <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-emerald-300 font-heading leading-tight pt-2">
                    {ebook.title}
                  </h1>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans pr-6">
                    {chapters[0].tagline}
                  </p>
                </div>

                <div className="space-y-3 pb-8 border-t border-white/10 pt-6">
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Author</p>
                  <div>
                    <h3 className="font-extrabold text-base text-white">{chapters[0].author}</h3>
                    <p className="text-[10px] text-slate-500">{chapters[0].credentials}</p>
                  </div>
                </div>

                <div className="absolute bottom-4 right-6 text-[9px] uppercase tracking-wider font-extrabold text-emerald-400/80 animate-pulse">
                  Click to open ➔
                </div>
              </motion.div>

            ) : (

              /* ================== OPEN DOUBLE SPREAD ================== */
              <motion.div
                key={`page-${currentPage}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="w-full grid grid-cols-1 md:grid-cols-2 gap-0.5 bg-slate-300 dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative border-4 border-slate-400 dark:border-slate-800 max-w-[860px]"
              >
                
                {/* 📖 Middle spine shadows */}
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-8 -ml-4 bg-gradient-to-r from-black/15 via-black/40 to-black/15 z-10 pointer-events-none" />
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] -ml-[1px] bg-black/50 z-20 pointer-events-none" />

                {/* 📄 Left Page spread */}
                <div className="bg-white dark:bg-slate-950 p-8 md:p-10 flex flex-col justify-between aspect-[3/4] relative overflow-hidden">
                  
                  {/* Spine inner shade left */}
                  <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/5 to-transparent pointer-events-none" />

                  {leftPage ? (
                    <>
                      {/* Page Header */}
                      <div className="flex items-center justify-between border-bottom pb-3 border-slate-100 dark:border-slate-900 mb-6">
                        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider truncate max-w-[150px]">{ebook.title}</span>
                        <span className="text-[9px] font-bold text-slate-400">{String(leftPageIndex).padStart(2, "0")}</span>
                      </div>

                      {/* Content Area */}
                      <div className="flex-1 space-y-5 text-slate-600 dark:text-slate-300">
                        {leftPage.type === "toc" ? (
                          /* TOC Template */
                          <div className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                              <BookOpen className="w-5 h-5 text-emerald-500" />
                              {leftPage.title}
                            </h2>
                            <p className="text-[11px] text-slate-400 leading-relaxed italic">{leftPage.intro}</p>
                            <div className="space-y-2 pt-2">
                              {leftPage.chapters?.map((ch, idx) => (
                                <button 
                                  key={idx}
                                  onClick={() => jumpToChapter(idx + 1)}
                                  className="w-full flex items-center justify-between text-left group py-1.5 border-b border-dashed border-slate-100 dark:border-slate-900/60 hover:text-emerald-500 transition-colors"
                                >
                                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-emerald-500">
                                    {ch.num}. {ch.title}
                                  </span>
                                  <span className="text-xs font-bold text-slate-400 group-hover:text-emerald-500">{ch.page}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          /* Normal Content Template */
                          <div className="space-y-4">
                            <div>
                              <h2 className="text-xl font-bold text-slate-800 dark:text-white leading-tight font-heading">{leftPage.title}</h2>
                              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider mt-0.5">{leftPage.subtitle}</p>
                            </div>
                            
                            <div className="space-y-3.5 text-[11px] md:text-xs leading-relaxed">
                              {leftPage.paragraphs?.map((p, idx) => <p key={idx}>{p}</p>)}
                            </div>

                            {/* Optional Quotes */}
                            {leftPage.quote && (
                              <blockquote className="border-l-4 border-emerald-500 pl-4 py-1.5 bg-slate-50 dark:bg-slate-900 rounded-r-xl text-[11px] font-medium text-slate-500 dark:text-slate-400 italic">
                                "{leftPage.quote}"
                              </blockquote>
                            )}

                            {/* Optional Data Table */}
                            {leftPage.dataGrid && (
                              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-900 rounded-xl overflow-hidden mt-3">
                                {leftPage.dataGrid.map((row, idx) => (
                                  <div key={idx} className="flex justify-between py-1.5 px-3 border-b last:border-0 border-slate-100 dark:border-slate-800 text-[10px]">
                                    <span className="text-slate-400 font-medium">{row.parameter}</span>
                                    <span className="text-slate-700 dark:text-slate-200 font-bold">{row.val}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Footer */}
                      <div className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest pt-4 mt-4 border-t border-slate-100 dark:border-slate-900">
                        Dr. Kamran Akram • Environment
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-300">End of spread</div>
                  )}
                </div>

                {/* 📄 Right Page spread */}
                <div className="bg-white dark:bg-slate-950 p-8 md:p-10 flex flex-col justify-between aspect-[3/4] relative overflow-hidden">
                  
                  {/* Spine inner shade right */}
                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/5 to-transparent pointer-events-none" />

                  {rightPage ? (
                    <>
                      {/* Page Header */}
                      <div className="flex items-center justify-between border-bottom pb-3 border-slate-100 dark:border-slate-900 mb-6">
                        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider truncate max-w-[150px]">{ebook.title}</span>
                        <span className="text-[9px] font-bold text-slate-400">{String(rightPageIndex).padStart(2, "0")}</span>
                      </div>

                      {/* Content Area */}
                      <div className="flex-1 space-y-5 text-slate-600 dark:text-slate-300">
                        {rightPage.type === "cta" ? (
                          /* CTA Template */
                          <div className="space-y-4 h-full flex flex-col justify-center">
                            <div className="text-center space-y-2">
                              <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-full w-fit mx-auto">
                                <PhoneCall className="w-6 h-6" />
                              </div>
                              <h2 className="text-xl font-bold text-slate-800 dark:text-white leading-tight font-heading">{rightPage.title}</h2>
                              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">{rightPage.subtitle}</p>
                            </div>
                            
                            <div className="space-y-3.5 text-[11px] md:text-xs leading-relaxed text-center">
                              {rightPage.paragraphs?.map((p, idx) => <p key={idx}>{p}</p>)}
                            </div>

                            <div className="pt-4 text-center">
                              <Link 
                                href={rightPage.link || "/consulting"}
                                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-102 hover:-translate-y-0.5"
                              >
                                <span>{rightPage.buttonText}</span>
                              </Link>
                            </div>
                          </div>
                        ) : (
                          /* Normal Content Template */
                          <div className="space-y-4">
                            <div>
                              <h2 className="text-xl font-bold text-slate-800 dark:text-white leading-tight font-heading">{rightPage.title}</h2>
                              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider mt-0.5">{rightPage.subtitle}</p>
                            </div>
                            
                            <div className="space-y-3.5 text-[11px] md:text-xs leading-relaxed">
                              {rightPage.paragraphs?.map((p, idx) => <p key={idx}>{p}</p>)}
                            </div>

                            {/* Optional Chapter Highlights */}
                            {rightPage.tip && (
                              <div className="bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-xl border border-emerald-500/10 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                {rightPage.tip}
                              </div>
                            )}

                            {rightPage.actionBadge && (
                              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 text-center uppercase tracking-wider">
                                {rightPage.actionBadge}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Footer */}
                      <div className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest pt-4 mt-4 border-t border-slate-100 dark:border-slate-900">
                        Dr. Kamran Akram • Environment
                      </div>
                    </>
                  ) : (
                    /* Back Cover Template */
                    <div className="w-full h-full bg-slate-900 text-white flex flex-col justify-between p-8 relative overflow-hidden rounded-r-2xl">
                      {/* spine inner shading */}
                      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/45 via-transparent to-transparent pointer-events-none" />

                      <div className="text-center pt-8">
                        <BookOpen className="w-10 h-10 text-emerald-500 mx-auto" />
                        <h2 className="text-lg font-bold mt-4 leading-tight">Dr. Kamran Akram</h2>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Ebook Publication Series</p>
                      </div>

                      <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                        This digital resource is part of Dr. Kamran's open-access curriculum and consulting resources. Distribution of these materials is protected under licensed research regulations.
                      </p>

                      <div className="text-center pb-6">
                        <span className="text-[9px] text-slate-600 uppercase font-bold tracking-widest">End of Publication</span>
                      </div>
                    </div>
                  )}
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 📚 Table of Contents Slide-Out Drawer */}
        <AnimatePresence>
          {showToc && (
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              className="absolute left-4 top-24 bottom-24 w-80 bg-white/95 dark:bg-slate-950/95 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-30 p-6 backdrop-blur-md flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
                  <h4 className="font-extrabold text-slate-950 dark:text-white font-heading text-lg flex items-center gap-2">
                    <Compass className="w-5 h-5 text-emerald-500" />
                    Navigation
                  </h4>
                  <button 
                    onClick={() => setShowToc(false)}
                    className="text-xs text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold"
                  >
                    Close
                  </button>
                </div>

                <div className="space-y-1">
                  {chapters.map((ch, idx) => (
                    <button
                      key={idx}
                      onClick={() => jumpToChapter(Math.ceil(idx / 2))}
                      className={`w-full text-left py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                        (currentPage === Math.ceil(idx / 2))
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold"
                          : "hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <span className="truncate max-w-[200px]">{ch.title}</span>
                      <span className="text-[10px] text-slate-400">P. {String(idx).padStart(2, "0")}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => jumpToChapter(0)}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 mt-4"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Jump to Cover Page</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* 🧭 Control Panel Bottom Progress */}
      <div className="w-full max-w-5xl flex items-center justify-between gap-4 bg-white/80 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-md">
        <button
          onClick={handlePrev}
          disabled={currentPage === 0}
          className="text-xs font-bold text-slate-500 disabled:opacity-30 hover:text-emerald-500 transition-colors flex items-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Prev Page</span>
        </button>

        {/* Progress Bar */}
        <div className="flex-1 max-w-xs mx-auto flex flex-col items-center gap-1.5">
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${(currentPage / Math.ceil((chapters.length - 1) / 2)) * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Spread {currentPage} of {Math.ceil((chapters.length - 1) / 2)}
          </span>
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage >= Math.ceil((chapters.length - 1) / 2)}
          className="text-xs font-bold text-slate-500 disabled:opacity-30 hover:text-emerald-500 transition-colors flex items-center gap-1.5"
        >
          <span>Next Page</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
