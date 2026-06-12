"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
// @ts-ignore
import HTMLFlipBook from "react-pageflip";
import { slugify } from "@/lib/utils";
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Maximize2, 
  RotateCcw,
  Volume2,
  VolumeX,
  Lock,
  Mail,
  Key,
  Loader2,
  Sparkles,
  ExternalLink
} from "lucide-react";
import toast from "react-hot-toast";
import { supabaseClient } from "@/lib/supabaseClient";

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

const BookFlip = HTMLFlipBook as any;

export default function FlipbookClient({ ebook }: FlipbookClientProps) {
  // Auth & Access States
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [tokenLoading, setTokenLoading] = useState<boolean>(true);
  // PDF.js States
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0); // 0 = Cover/Spread 0, 1 = Spread 1, etc.
  const [pdfLoading, setPdfLoading] = useState<boolean>(false);
  const [rendering, setRendering] = useState<boolean>(false);
  const [pageAspectRatio, setPageAspectRatio] = useState<number>(0.75); // Default 3:4 aspect ratio

  // Reader Settings
  const [fullScreen, setFullScreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [screenWidth, setScreenWidth] = useState<number>(360);

  // References for react-pageflip and rendering tracking
  const bookRef = useRef<any>(null);
  const flipbookRef = useRef<HTMLDivElement>(null);
  const renderedPagesRef = useRef<{ [key: number]: boolean }>({});
  const lastRenderedZoomRef = useRef<number>(zoomLevel);
  const activeRenderTasksRef = useRef<{ [key: string]: any }>({});

  // 1. Detect screen size (Responsive layout)
  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 768);
      setScreenWidth(window.innerWidth);
    };
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  // 2. Client-Side DOM Protections (Anti-Scraping / Printing)
  useEffect(() => {
    const preventDefault = (e: Event) => e.preventDefault();
    document.addEventListener("contextmenu", preventDefault);
    document.addEventListener("copy", preventDefault);
    document.addEventListener("cut", preventDefault);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable Ctrl+P / Cmd+P
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        toast.error("Printing is disabled for this secure eBook.", { id: "print-err" });
      }
      // Disable Ctrl+S / Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        toast.error("Saving this publication locally is disabled.", { id: "save-err" });
      }
      // Disable Ctrl+C
      if ((e.ctrlKey || e.metaKey) && e.key === "c") {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // CSS to disable user selection and print visibility
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        body { display: none !important; }
      }
      body {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener("contextmenu", preventDefault);
      document.removeEventListener("copy", preventDefault);
      document.removeEventListener("cut", preventDefault);
      window.removeEventListener("keydown", handleKeyDown);
      document.head.removeChild(style);
    };
  }, []);

  // 3. Fetch temporary signed access token/URL
  const fetchAccessUrl = async (isRefreshing = false) => {
    if (!isRefreshing) setTokenLoading(true);
    try {
      const { data: { session } } = await supabaseClient.auth.getSession();
      
      // Look for stripe session cache from sessionStorage
      let stripeSessionId = null;
      try {
        const cached = sessionStorage.getItem("kamran_last_checkout");
        if (cached) {
          const parsed = JSON.parse(cached);
          stripeSessionId = parsed.receiptNo;
        }
      } catch (e) {
        console.error("sessionStorage cache error:", e);
      }

      // Check URL parameters for direct redirect links containing stripe session_id
      const urlParams = new URLSearchParams(window.location.search);
      const urlSessionId = urlParams.get("session_id");
      if (urlSessionId) {
        stripeSessionId = urlSessionId;
      }

      // Check for library token in sessionStorage
      let libraryToken = null;
      try {
        libraryToken = sessionStorage.getItem("kamran_library_token");
      } catch (e) {}

      const res = await fetch("/api/ebooks/read-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ebookId: ebook.id,
          accessToken: session?.access_token || null,
          stripeSessionId: stripeSessionId || null,
          libraryToken: libraryToken || null
        })
      });

      const data = await res.json();

      if (res.ok && data.signedUrl) {
        setSignedUrl(data.signedUrl);
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
    } catch (err) {
      console.error("Error checking authorization:", err);
      setAuthorized(false);
    } finally {
      if (!isRefreshing) setTokenLoading(false);
    }
  };

  // 4. Initial authorization check
  useEffect(() => {
    fetchAccessUrl();
  }, [ebook.id]);

  // 5. 12-Minute Auto-Refreshing Token Interval
  useEffect(() => {
    if (!authorized) return;

    const intervalId = setInterval(() => {
      console.log("Refreshing secure signed read token...");
      fetchAccessUrl(true);
    }, 12 * 60 * 1000); // 12 minutes

    return () => clearInterval(intervalId);
  }, [authorized]);

  // 6. Dynamically Load PDF.js and Load Document
  useEffect(() => {
    if (!authorized || !signedUrl) return;

    const loadPdfDoc = async () => {
      setPdfLoading(true);
      try {
        // Load PDFJS from CDN if not already on window
        const pdfjsLib = await new Promise<any>((resolve, reject) => {
          if ((window as any).pdfjsLib) {
            resolve((window as any).pdfjsLib);
            return;
          }
          const script = document.createElement("script");
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
          script.async = true;
          script.onload = () => {
            const lib = (window as any).pdfjsLib;
            lib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
            resolve(lib);
          };
          script.onerror = (e) => reject(new Error("Failed to load PDF viewer scripts."));
          document.body.appendChild(script);
        });

        const loadingTask = pdfjsLib.getDocument({
          url: signedUrl,
          disableRange: true,
          disableStream: true
        });

        const doc = await loadingTask.promise;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setCurrentPage(0); // Start at cover

        if (doc.numPages > 0) {
          try {
            const firstPage = await doc.getPage(1);
            const viewport = firstPage.getViewport({ scale: 1 });
            if (viewport.width && viewport.height) {
              setPageAspectRatio(viewport.width / viewport.height);
            }
          } catch (aspectErr) {
            console.error("Error reading first page aspect ratio:", aspectErr);
          }
        }
      } catch (err: any) {
        console.error("PDF.js loading error:", err);
        toast.error("Error initializing secure book viewer.");
      } finally {
        setPdfLoading(false);
      }
    };

    loadPdfDoc();
  }, [authorized, signedUrl]);

  // Callback Refs to handle dynamic canvas mounting with AnimatePresence
  // Helper: Render individual PDF page to a canvas with render cancellation protection
  const renderPageToCanvas = async (pageNum: number, canvas: HTMLCanvasElement) => {
    if (!pdfDoc) return;
    const key = `page-${pageNum}`;
    
    // Cancel any active rendering on this canvas key
    if (activeRenderTasksRef.current[key]) {
      activeRenderTasksRef.current[key].cancel();
    }

    try {
      const page = await pdfDoc.getPage(pageNum);
      
      // Determine viewport scale based on layout and zoom
      const baseScale = isMobile ? 1.0 : 1.4;
      const scale = baseScale * zoomLevel;
      const viewport = page.getViewport({ scale });
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const renderContext = {
        canvasContext: ctx,
        viewport: viewport
      };
      
      const renderTask = page.render(renderContext);
      activeRenderTasksRef.current[key] = renderTask;
      
      await renderTask.promise;
      delete activeRenderTasksRef.current[key];
    } catch (err: any) {
      if (err.name === "RenderingCancelledException" || err.message?.includes("cancelled")) {
        // Ignored: expected when rendering is cancelled
      } else {
        console.error("Error rendering PDF page:", err);
      }
    }
  };

  const renderPage = async (pageNum: number, force = false) => {
    if (!pdfDoc || pageNum < 1 || pageNum > numPages) return;
    
    // Avoid double rendering
    if (renderedPagesRef.current[pageNum] && !force) return;
    
    renderedPagesRef.current[pageNum] = true;

    // Wait for the canvas to be in the DOM
    let canvas = document.getElementById(`page-canvas-${pageNum}`) as HTMLCanvasElement;
    if (!canvas) {
      // Retry up to 10 times with a small delay
      for (let i = 0; i < 10; i++) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        canvas = document.getElementById(`page-canvas-${pageNum}`) as HTMLCanvasElement;
        if (canvas) break;
      }
    }

    if (canvas) {
      await renderPageToCanvas(pageNum, canvas);
    } else {
      // Reset rendered status so it can be retried
      delete renderedPagesRef.current[pageNum];
    }
  };

  // Load initial pages and then the rest in the background
  useEffect(() => {
    if (!pdfDoc) return;

    // Reset rendered pages tracker when document changes
    renderedPagesRef.current = {};
    activeRenderTasksRef.current = {};

    const loadSequentially = async () => {
      // Prioritize pages 1, 2, 3, 4, 5
      const initialPages = [1, 2, 3, 4, 5];
      for (const p of initialPages) {
        if (p <= numPages) {
          await renderPage(p);
        }
      }

      // Render the rest in the background with small breaks to keep UI completely smooth
      for (let p = 6; p <= numPages; p++) {
        if (!pdfDoc) break; // if user closed/changed document
        await renderPage(p);
        await new Promise((resolve) => setTimeout(resolve, 60)); // yield thread
      }
    };

    loadSequentially();
  }, [pdfDoc]);

  // Handle zoom changes or active page navigation priority
  useEffect(() => {
    if (!pdfDoc) return;

    const activePageNum = currentPage + 1;
    const forceRerender = zoomLevel !== lastRenderedZoomRef.current;
    
    if (forceRerender) {
      // Reset rendered tracker if zoom changed, so pages will rerender at new scale
      renderedPagesRef.current = {};
      lastRenderedZoomRef.current = zoomLevel;
    }

    // Render current active page and its immediate neighbors (activePageNum - 2 to activePageNum + 3)
    const startPage = Math.max(1, activePageNum - 2);
    const endPage = Math.min(numPages, activePageNum + 3);

    for (let p = startPage; p <= endPage; p++) {
      renderPage(p, forceRerender);
    }
  }, [currentPage, zoomLevel, pdfDoc]);

  // Page Flip Audio Synthesis (White noise bandpass sweep + sine thump)
  const playPageFlipSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const duration = 0.35;
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      
      // White noise generation
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Swept bandpass filter for the page rustle
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + duration);
      filter.Q.setValueAtTime(2.0, ctx.currentTime);

      // Main volume envelope for rustle
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.04);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      // Low frequency thump for the page slap
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(110, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.18);

      oscGain.gain.setValueAtTime(0.0, ctx.currentTime);
      oscGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.03);
      oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      // Connections
      noise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      // Start and Stop
      noise.start();
      osc.start();

      noise.stop(ctx.currentTime + duration);
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Web Audio API page flip sound failed:", e);
    }
  };

  const onFlip = (e: any) => {
    setCurrentPage(e.data);
    playPageFlipSound();
  };

  // Navigation handlers
  const maxSpreadIndex = numPages - 1;

  const handleNext = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipNext();
    }
  };

  const handlePrev = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipPrev();
    }
  };

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      else if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === "Escape" && fullScreen) {
        setFullScreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, numPages, isMobile, fullScreen]);

  // Fullscreen support
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

  useEffect(() => {
    const onFullscreenChange = () => {
      setFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  // Render Loader
  if (tokenLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-slate-500">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
        <p className="font-semibold text-slate-600 dark:text-slate-400">Verifying secure eBook credentials...</p>
      </div>
    );
  }

  // Render Lock Screen if Unauthorized
  if (authorized === false) {
    return (
      <div className="max-w-md w-full mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl text-center space-y-6">
          <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-full w-fit mx-auto">
            <Lock className="w-10 h-10" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight font-heading">Secure Reader Access</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              This digital publication is encrypted and restricted to customers who purchased it.
            </p>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-6 space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Please login to your eBook library to verify ownership and read this book.
            </p>
            <Link
              href="/ebooks/library"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-emerald-500/15 flex items-center justify-center gap-2 cursor-pointer animate-pulse"
            >
              <span>Go to My Library Dashboard</span>
            </Link>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 flex flex-col gap-2">
            <Link 
              href="/ebooks" 
              className="text-xs text-slate-400 hover:text-emerald-500 font-bold transition-colors inline-flex items-center justify-center gap-1 group"
            >
              <span>Return to Publications Store</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render Main Flipbook Viewer (Authorized)
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
          <BookOpen className="w-4 h-4 text-emerald-500" />
          <span>Active Book: <strong className="text-slate-700 dark:text-slate-200">{ebook.title}</strong></span>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 transition-colors cursor-pointer"
            title={soundEnabled ? "Mute Flip Sound" : "Enable Flip Sound"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button 
            onClick={() => setZoomLevel(prev => prev === 1 ? 1.15 : prev === 1.15 ? 1.3 : 1)}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 transition-colors text-xs font-bold cursor-pointer"
            title="Zoom Page"
          >
            {zoomLevel === 1 ? "100%" : zoomLevel === 1.15 ? "115%" : "130%"}
          </button>

          <button 
            onClick={toggleFullScreen}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            {fullScreen ? <Maximize2 className="w-4 h-4 rotate-180" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 📖 The Flipbook Core viewport */}
      <div 
        ref={flipbookRef}
        className={`w-full max-w-[1280px] flex flex-col items-center justify-center relative overflow-hidden select-none bg-[#0c1520] rounded-3xl py-6 px-0 md:p-8 md:px-20 transition-all duration-300 border border-slate-900 shadow-2xl ${fullScreen ? "h-screen rounded-none p-0 bg-[#060b11]" : "min-h-[560px]"}`}
      >
        
        {/* Navigation Overlays */}
        <button
          onClick={handlePrev}
          disabled={currentPage === 0}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-slate-900/80 hover:bg-slate-800 text-white rounded-full shadow-lg border border-slate-800 hover:scale-105 disabled:opacity-20 disabled:scale-100 disabled:hover:scale-100 transition-all cursor-pointer backdrop-blur-sm hidden md:block"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          disabled={currentPage >= maxSpreadIndex}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-slate-900/80 hover:bg-slate-800 text-white rounded-full shadow-lg border border-slate-800 hover:scale-105 disabled:opacity-20 disabled:scale-100 disabled:hover:scale-100 transition-all cursor-pointer backdrop-blur-sm hidden md:block"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Loading Spinner */}
        {pdfLoading && (
          <div className="absolute inset-0 bg-[#0c1520]/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Loading PDF document...</p>
          </div>
        )}

        {/* 📚 Book Body Wrapper */}
        {pdfDoc && numPages > 0 && (
          <div 
            className="w-full flex justify-center items-center relative transition-transform duration-300"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <BookFlip 
              width={isMobile ? screenWidth : 400} 
              height={isMobile ? Math.round(screenWidth / pageAspectRatio) : Math.round(400 / pageAspectRatio)}
              size="stretch"
              minWidth={320}
              maxWidth={800}
              minHeight={400}
              maxHeight={1100}
              maxShadowOpacity={0.4}
              drawShadow={true}
              showCover={true}
              mobileScrollSupport={true}
              ref={bookRef}
              onFlip={onFlip}
              className="shadow-2xl mx-auto"
            >
              {Array.from({ length: numPages }, (_, index) => {
                const pageNum = index + 1;
                const isCover = pageNum === 1;
                const isBackCover = pageNum === numPages;
                const isLeftPage = pageNum % 2 === 0;

                return (
                  <div 
                    key={pageNum} 
                    className="page overflow-hidden relative bg-white dark:bg-slate-950 w-full h-full"
                    data-density={isCover || isBackCover ? "hard" : "soft"}
                  >
                    {isCover ? (
                      /* Cover Page */
                      <div className="w-full h-full relative overflow-hidden bg-slate-900 shadow-2xl border-y border-r border-slate-950">
                        {ebook.cover_url ? (
                          <img 
                            src={ebook.cover_url} 
                            alt={ebook.title} 
                            className="w-full h-full object-cover pointer-events-none"
                          />
                        ) : (
                          <canvas id="page-canvas-1" className="w-full h-full object-contain pointer-events-none" />
                        )}
                        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/45 via-black/15 to-transparent z-10 pointer-events-none" />
                        <div className="absolute left-4 top-0 bottom-0 w-[1px] bg-white/10 z-10 pointer-events-none" />
                      </div>
                    ) : isBackCover ? (
                      /* Back Cover backing */
                      <div className="w-full h-full bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex flex-col justify-between p-8 relative overflow-hidden border-y border-l border-emerald-950/20 shadow-2xl">
                        {/* Premium Textures & Spine Crease Shadows */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute inset-0 bg-black/[0.04] pointer-events-none" />
                        {/* Spine Crease / Shading (Since it's back cover, spine is on the left edge if it's right-hand page) */}
                        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-black/30 via-black/10 to-transparent pointer-events-none z-10" />
                        <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-white/10 z-10 pointer-events-none" />
                        
                        {/* Top Accent */}
                        <div className="flex justify-between items-center opacity-60 text-[9px] font-bold uppercase tracking-widest border-b border-white/10 pb-4">
                          <span>Kamran Publications</span>
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>

                        {/* Center Content */}
                        <div className="text-center space-y-6 my-auto pt-6">
                          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto border border-white/20 shadow-lg">
                            <BookOpen className="w-8 h-8 text-emerald-100" />
                          </div>
                          
                          <div className="space-y-2">
                            <h3 className="font-extrabold !text-white text-xl tracking-tight leading-tight">End of Book</h3>
                            <p className="text-emerald-100/90 text-sm font-medium">Thanks for reading!</p>
                          </div>

                          <div className="w-12 h-[1px] bg-white/20 mx-auto" />

                          <div className="space-y-1">
                            <h4 className="font-bold !text-white text-xs tracking-wider">Dr.Muhamad Kamran </h4>
                            <p className="text-[9px] text-emerald-200/80 uppercase tracking-widest font-mono">Ebook Series</p>
                          </div>
                        </div>

                        {/* Bottom Copyright & Branding */}
                        <div className="text-center space-y-3 pt-6 border-t border-white/10">
                          <p className="text-[8px] text-emerald-100/60 leading-relaxed max-w-[220px] mx-auto font-medium">
                            This secure publication is protected under digital copyright laws. All rights reserved.
                          </p>
                          <div className="text-[8px] text-emerald-200 font-extrabold uppercase tracking-widest font-mono">
                            © {new Date().getFullYear()} Dr. Kamran Akram
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Standard Inner Page */
                      <div 
                        className={`w-full h-full relative overflow-hidden shadow-inner ${
                          isLeftPage 
                            ? "bg-gradient-to-r from-[#fafafa] to-[#f5f5f5] dark:from-slate-900 dark:to-slate-950" 
                            : "bg-gradient-to-l from-[#fafafa] to-[#f5f5f5] dark:from-slate-900 dark:to-slate-950"
                        }`}
                      >
                        {/* Page stack effect */}
                        {isLeftPage ? (
                          <>
                            <div className="absolute left-0 top-1 bottom-1 w-[1px] bg-slate-350 dark:bg-slate-800 pointer-events-none z-10" />
                            <div className="absolute left-[1px] top-2 bottom-2 w-[1px] bg-slate-200 dark:bg-slate-900 pointer-events-none z-10" />
                            <div className="absolute left-[2px] top-3 bottom-3 w-[1px] bg-slate-100 dark:bg-slate-950 pointer-events-none z-10" />
                            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/12 via-black/4 to-transparent pointer-events-none z-10" />
                          </>
                        ) : (
                          <>
                            <div className="absolute right-0 top-1 bottom-1 w-[1px] bg-slate-350 dark:bg-slate-800 pointer-events-none z-10" />
                            <div className="absolute right-[1px] top-2 bottom-2 w-[1px] bg-slate-200 dark:bg-slate-900 pointer-events-none z-10" />
                            <div className="absolute right-[2px] top-3 bottom-3 w-[1px] bg-slate-100 dark:bg-slate-950 pointer-events-none z-10" />
                            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/12 via-black/4 to-transparent pointer-events-none z-10" />
                          </>
                        )}

                        <canvas id={`page-canvas-${pageNum}`} className="w-full h-full object-contain pointer-events-none" />

                        <div className={`absolute bottom-3 ${isLeftPage ? "left-6" : "right-6"} text-[9px] font-bold text-slate-400 font-mono`}>
                          Page {pageNum}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </BookFlip>
          </div>
        )}

        {/* Mobile-only navigation buttons below the book */}
        <div className="flex md:hidden items-center justify-center gap-6 mt-6 pb-2 z-20">
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className="p-3 bg-[#0f172a]/90 hover:bg-slate-800 active:bg-slate-700 text-white rounded-full shadow-lg border border-slate-850 disabled:opacity-20 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentPage >= maxSpreadIndex}
            className="p-3 bg-[#0f172a]/90 hover:bg-slate-800 active:bg-slate-700 text-white rounded-full shadow-lg border border-slate-850 disabled:opacity-20 transition-all cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* 🧭 Control Panel Bottom Progress */}
      <div className="w-full max-w-5xl flex items-center justify-between gap-4 bg-white/80 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-md">
        <button
          onClick={handlePrev}
          disabled={currentPage === 0}
          className="text-xs font-bold text-slate-500 disabled:opacity-30 hover:text-emerald-500 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Prev Page</span>
        </button>

        {/* Progress Bar */}
        <div className="flex-1 max-w-xs mx-auto flex flex-col items-center gap-1.5">
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${(currentPage / maxSpreadIndex) * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
            Page {currentPage + 1} of {numPages}
          </span>
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage >= maxSpreadIndex}
          className="text-xs font-bold text-slate-500 disabled:opacity-30 hover:text-emerald-500 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span>Next Page</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
