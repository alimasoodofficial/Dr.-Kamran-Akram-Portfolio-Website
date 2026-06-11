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

export default function FlipbookClient({ ebook }: FlipbookClientProps) {
  // Auth & Access States
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [tokenLoading, setTokenLoading] = useState<boolean>(true);
  
  // Login Form States
  const [emailInput, setEmailInput] = useState<string>("");
  const [otpInput, setOtpInput] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [submittingAuth, setSubmittingAuth] = useState<boolean>(false);

  // PDF.js States
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0); // 0 = Cover/Spread 0, 1 = Spread 1, etc.
  const [pdfLoading, setPdfLoading] = useState<boolean>(false);
  const [rendering, setRendering] = useState<boolean>(false);

  // Reader Settings
  const [fullScreen, setFullScreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  // Canvas Refs
  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);
  const singleCanvasRef = useRef<HTMLCanvasElement>(null);
  const flipbookRef = useRef<HTMLDivElement>(null);

  // Active rendering tasks tracking to prevent overlaps
  const activeRenderTasksRef = useRef<{ [key: string]: any }>({});

  // 1. Detect screen size (Responsive layout)
  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 768);
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
      let stripeEmail = null;
      try {
        const cached = sessionStorage.getItem("kamran_last_checkout");
        if (cached) {
          const parsed = JSON.parse(cached);
          stripeSessionId = parsed.receiptNo;
          stripeEmail = parsed.email;
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

      const res = await fetch("/api/ebooks/read-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ebookId: ebook.id,
          accessToken: session?.access_token || null,
          stripeSessionId: stripeSessionId || null,
          email: stripeEmail || null
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
      } catch (err: any) {
        console.error("PDF.js loading error:", err);
        toast.error("Error initializing secure book viewer.");
      } finally {
        setPdfLoading(false);
      }
    };

    loadPdfDoc();
  }, [authorized, signedUrl]);

  // Helper: Render individual PDF page to a canvas with render cancellation protection
  const renderPageToCanvas = async (pageNum: number, canvas: HTMLCanvasElement, key: string) => {
    if (!pdfDoc) return;
    
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
        // Ignored: expected when flipping pages quickly
      } else {
        console.error("Error rendering PDF page:", err);
      }
    }
  };

  // 7. Render dynamic pages on page navigation or zoom changes
  useEffect(() => {
    if (!pdfDoc) return;

    const renderViewer = async () => {
      setRendering(true);
      try {
        if (isMobile) {
          // Mobile: render single page (currentPage is 1-indexed for mobile)
          const pageNum = Math.max(1, Math.min(currentPage + 1, numPages));
          const canvas = singleCanvasRef.current;
          if (canvas) {
            await renderPageToCanvas(pageNum, canvas, "single");
          }
        } else {
          // Desktop: Double Page Spread
          if (currentPage === 0) {
            // Cover: Page 1 in right side/centered
            const rightCanvas = rightCanvasRef.current;
            if (rightCanvas) {
              await renderPageToCanvas(1, rightCanvas, "right-cover");
            }
          } else {
            // Left page: currentPage * 2
            const leftPageNum = currentPage * 2;
            const leftCanvas = leftCanvasRef.current;
            if (leftCanvas && leftPageNum <= numPages) {
              await renderPageToCanvas(leftPageNum, leftCanvas, "left-page");
            }
            
            // Right page: currentPage * 2 + 1
            const rightPageNum = currentPage * 2 + 1;
            const rightCanvas = rightCanvasRef.current;
            if (rightCanvas) {
              if (rightPageNum <= numPages) {
                await renderPageToCanvas(rightPageNum, rightCanvas, "right-page");
              } else {
                // Clear right canvas if past last page
                const ctx = rightCanvas.getContext("2d");
                ctx?.clearRect(0, 0, rightCanvas.width, rightCanvas.height);
              }
            }
          }
        }
      } catch (err) {
        console.error("Render spread error:", err);
      } finally {
        setRendering(false);
      }
    };

    renderViewer();
  }, [currentPage, pdfDoc, zoomLevel, isMobile]);

  // Page Flip Audio Synthesis (pink noise)
  const playPageFlipSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const bufferSize = ctx.sampleRate * 0.15;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      
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
        data[i] *= 0.08; // Volume down
        b6 = white * 0.115926;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(450, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.12);

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      noise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      noise.start();
    } catch (e) {
      console.warn("Web Audio API failed:", e);
    }
  };

  // Navigation handlers
  const maxSpreadIndex = isMobile ? numPages - 1 : Math.ceil((numPages - 1) / 2);

  const handleNext = () => {
    if (currentPage < maxSpreadIndex) {
      setCurrentPage((prev) => prev + 1);
      playPageFlipSound();
    } else {
      toast("You have reached the end of this eBook!", { icon: "📖", id: "end-toast" });
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
      playPageFlipSound();
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

  // Secure Passwordless OTP Login
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setSubmittingAuth(true);
    const toastId = toast.loading("Verifying email and sending access code...");
    try {
      const { error } = await supabaseClient.auth.signInWithOtp({
        email: emailInput.trim(),
        options: {
          shouldCreateUser: true
        }
      });

      if (error) throw error;

      toast.success("Access code sent! Check your inbox.", { id: toastId });
      setOtpSent(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to send access code.", { id: toastId });
    } finally {
      setSubmittingAuth(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput.trim() || !emailInput.trim()) return;

    setSubmittingAuth(true);
    const toastId = toast.loading("Verifying access code...");
    try {
      const { data, error } = await supabaseClient.auth.verifyOtp({
        email: emailInput.trim(),
        token: otpInput.trim(),
        type: "email"
      });

      if (error) throw error;

      toast.success("Identity verified! Loading publication...", { id: toastId });
      
      // Reset state and fetch url
      setOtpSent(false);
      fetchAccessUrl();
    } catch (err: any) {
      toast.error(err.message || "Invalid access code. Please try again.", { id: toastId });
    } finally {
      setSubmittingAuth(false);
    }
  };

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

          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-6">
            {!otpSent ? (
              <form onSubmit={handleRequestOtp} className="space-y-4 text-left">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Purchaser Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-3 border rounded-xl bg-slate-50 dark:bg-slate-950 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    disabled={submittingAuth}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/60 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-emerald-500/15 flex items-center justify-center gap-2 cursor-pointer"
                  disabled={submittingAuth}
                >
                  {submittingAuth ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Request Access Code</span>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4 text-left">
                <div className="space-y-1 text-center bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 mb-2">
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    We sent a 6-digit access code to
                  </p>
                  <p className="text-xs font-bold text-emerald-500 truncate">{emailInput}</p>
                </div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Enter 6-Digit Code
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    className="w-full pl-10 pr-4 py-3 border rounded-xl bg-slate-50 dark:bg-slate-950 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 tracking-[0.2em] font-mono text-center font-bold text-lg"
                    disabled={submittingAuth}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/60 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-emerald-500/15 flex items-center justify-center gap-2 cursor-pointer"
                  disabled={submittingAuth}
                >
                  {submittingAuth ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Verify Code</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="w-full text-center text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mt-2 transition-colors cursor-pointer"
                >
                  Change email address
                </button>
              </form>
            )}
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
        className={`w-full max-w-5xl flex items-center justify-center relative overflow-hidden select-none bg-slate-100 dark:bg-slate-950/40 rounded-3xl p-4 md:p-8 transition-all duration-300 border border-slate-200/50 dark:border-slate-800/40 shadow-inner ${fullScreen ? "h-screen rounded-none p-4 bg-slate-950" : "min-h-[560px]"}`}
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
          disabled={currentPage >= maxSpreadIndex}
          className="absolute right-4 z-20 p-3 bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-white rounded-full shadow-lg border border-slate-200 dark:border-slate-700 hover:scale-105 disabled:opacity-30 disabled:scale-100 transition-all cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Loading Spinner */}
        {(pdfLoading || rendering) && (
          <div className="absolute inset-0 bg-slate-100/60 dark:bg-slate-950/60 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Rendering PDF spreads...</p>
          </div>
        )}

        {/* 📚 Book Body Wrapper */}
        <motion.div 
          className="w-full flex justify-center items-center relative transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
          layout
        >
          <AnimatePresence mode="wait">
            {isMobile ? (
              /* ================== MOBILE SPREAD (Single Page) ================== */
              <motion.div
                key={`mobile-page-${currentPage}`}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-[420px] bg-white dark:bg-slate-950 rounded-2xl overflow-hidden shadow-2xl relative border border-slate-350 dark:border-slate-800 flex justify-center items-center"
              >
                <canvas ref={singleCanvasRef} className="max-w-full h-auto object-contain pointer-events-none" />
              </motion.div>
            ) : (
              /* ================== DESKTOP SPREAD (Double Page) ================== */
              currentPage === 0 ? (
                /* Cover Page (Spread 0) */
                <motion.div
                  key="cover-page"
                  initial={{ opacity: 0, rotateY: 35 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: -35 }}
                  transition={{ duration: 0.4 }}
                  onClick={handleNext}
                  className="w-full max-w-[420px] bg-white dark:bg-slate-950 rounded-2xl shadow-2xl relative flex justify-center items-center border-4 border-slate-300 dark:border-slate-800 cursor-pointer overflow-hidden transform-gpu"
                  style={{ transformStyle: "preserve-3d", perspective: 1200 }}
                >
                  <canvas ref={rightCanvasRef} className="max-w-full h-auto object-contain pointer-events-none" />
                  {/* spine inner shading left */}
                  <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-black/25 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="absolute bottom-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow animate-pulse">
                    Click to open ➔
                  </div>
                </motion.div>
              ) : (
                /* Inner Double Page Spread */
                <motion.div
                  key={`spread-${currentPage}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="w-full grid grid-cols-2 gap-0.5 bg-slate-300 dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative border-4 border-slate-400 dark:border-slate-800 max-w-[860px]"
                >
                  {/* 📖 Middle spine shadows */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-8 -ml-4 bg-gradient-to-r from-black/15 via-black/35 to-black/15 z-10 pointer-events-none" />
                  <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-black/40 z-20 pointer-events-none" />

                  {/* Left Page Canvas */}
                  <div className="bg-white dark:bg-slate-950 flex justify-center items-center relative overflow-hidden aspect-[3/4]">
                    <canvas ref={leftCanvasRef} className="max-w-full h-auto object-contain pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-black/10 to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-4 text-[9px] font-bold text-slate-400 font-mono">
                      Page {currentPage * 2}
                    </div>
                  </div>

                  {/* Right Page Canvas */}
                  <div className="bg-white dark:bg-slate-950 flex justify-center items-center relative overflow-hidden aspect-[3/4]">
                    {currentPage * 2 + 1 <= numPages ? (
                      <>
                        <canvas ref={rightCanvasRef} className="max-w-full h-auto object-contain pointer-events-none" />
                        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />
                        <div className="absolute bottom-3 right-4 text-[9px] font-bold text-slate-400 font-mono">
                          Page {currentPage * 2 + 1}
                        </div>
                      </>
                    ) : (
                      /* End Cover backing */
                      <div className="w-full h-full bg-slate-900 text-white flex flex-col justify-between p-8 relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-black/45 via-transparent to-transparent pointer-events-none" />
                        <div className="text-center pt-12 space-y-3">
                          <BookOpen className="w-10 h-10 text-emerald-500 mx-auto" />
                          <h4 className="font-extrabold text-white text-base">Dr. Kamran Akram</h4>
                          <p className="text-[9px] text-slate-500 uppercase tracking-widest">Ebook Publication Series</p>
                        </div>
                        <p className="text-[10px] text-slate-400 text-center leading-relaxed max-w-[200px] mx-auto">
                          This secure publication is protected under digital copyright laws. All rights reserved.
                        </p>
                        <div className="text-center pb-4 text-[9px] text-slate-600 font-bold uppercase tracking-widest">
                          End of Book
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </motion.div>
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
            {isMobile ? `Page ${currentPage + 1} of ${numPages}` : `Spread ${currentPage} of ${maxSpreadIndex}`}
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
