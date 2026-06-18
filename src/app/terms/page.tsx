"use client";

import { useState, useEffect } from "react";
import {
  Scale,
  Calendar,
  CreditCard,
  Info,
  BookOpen,
  AlertTriangle,
  Globe,
  ArrowRight,
  FileText
} from "lucide-react";

export default function TermsConditionsPage() {
  const lastUpdated = "June 15, 2026";
  const [activeSection, setActiveSection] = useState("acceptance");

  const sections = [
    { id: "acceptance", title: "1. Acceptance of Terms", icon: Scale },
    { id: "bookings", title: "2. Consultations & Bookings", icon: Calendar },
    { id: "payments", title: "3. Payments & Refunds", icon: CreditCard },
    { id: "disclaimer", title: "4. Disclaimer of Advice", icon: Info },
    { id: "intellectual-property", title: "5. Intellectual Property", icon: BookOpen },
    { id: "limitation", title: "6. Limitation of Liability", icon: AlertTriangle },
    { id: "governing-law", title: "7. Governing Law", icon: Globe },
  ];

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* 🌌 Full Width Modern Banner */}
      <div className="relative w-full pt-32 pb-20 px-6 overflow-hidden bg-gradient-to-b from-emerald-50/70 via-transparent to-transparent dark:from-emerald-950/20 border-b border-slate-200/50 dark:border-slate-800/50">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98108_1px,transparent_1px),linear-gradient(to_bottom,#10b98108_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        {/* Radial Glows */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 right-10 w-[200px] h-[200px] bg-teal-500/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-900/30 border border-emerald-200/50 dark:border-emerald-800/30 text-emerald-800 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5 animate-pulse text-primary" /> Terms of Service
          </div>

          <h1 className="text-4xl md:text-6xl font-black font-heading tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-500">
            Terms & Conditions
          </h1>

          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-body text-base md:text-lg">
            Review these terms before booking a call or purchasing eBook products. By using our website, you agree to these guidelines.
          </p>

          {/* Metadata Badges */}
          <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-body pt-2">
            <div className="flex items-center gap-1.5 bg-white/60 dark:bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span>Last Updated: {lastUpdated}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/60 dark:bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
              <Info className="w-3.5 h-3.5 text-primary" />
              <span>Agreement Version: 2.1</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🧱 Grid Body Layout */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar - Sticky Table of Contents */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <div className="glassy p-6 space-y-4">
                <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" /> Sections
                </h3>
                <nav className="flex flex-col space-y-1">
                  {sections.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => {
                        const el = document.getElementById(sec.id);
                        if (el) {
                          const offset = 120;
                          const bodyRect = document.body.getBoundingClientRect().top;
                          const elementRect = el.getBoundingClientRect().top;
                          const elementPosition = elementRect - bodyRect;
                          const offsetPosition = elementPosition - offset;
                          window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth"
                          });
                          setActiveSection(sec.id);
                        }
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-3 border ${activeSection === sec.id
                          ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300 font-semibold"
                          : "border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 hover:text-slate-900 dark:hover:text-white"
                        }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeSection === sec.id ? "bg-primary scale-125" : "bg-slate-300 dark:bg-slate-700"}`} />
                      {sec.title}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Quick Contact Card */}
              <div className="bg-gradient-to-br from-[#f0fdf4] to-emerald-100/50 dark:from-[#064e3b]/20 dark:to-[#011c16]/10 border border-emerald-200/60 dark:border-emerald-800/30 rounded-2xl p-6 text-center space-y-4">
                <p className="text-sm text-slate-700 dark:text-slate-300 font-body">
                  Need clarification on any of our terms or cancellation policies?
                </p>
                <a
                  href="mailto:bookingsimkamran@gmail.com"
                  className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-sm transition-all duration-300 shadow-[0_4px_12px_rgba(16,185,129,0.2)] hover:shadow-[0_6px_16px_rgba(16,185,129,0.3)] hover:-translate-y-0.5"
                >
                  Contact Support <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Main Legal Content */}
          <div className="lg:col-span-8 space-y-10">
            {/* Section 1: Acceptance */}
            <section id="acceptance" className="glassy p-8 space-y-4 scroll-mt-32">
              <div className="flex items-center gap-3 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-primary">
                  <Scale className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                  1. Acceptance of Terms
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-body">
                By accessing, browsing, or using this website (
                <a href="https://imkamran.com" className="text-primary hover:underline font-semibold">
                  imkamran.com
                </a>
                ) and booking appointments or purchasing digital resources, you explicitly agree to comply with and be bound by these
                Terms & Conditions. If you do not agree to these conditions, you should cease using our services immediately.
              </p>
            </section>

            {/* Section 2: Bookings */}
            <section id="bookings" className="glassy p-8 space-y-4 scroll-mt-32">
              <div className="flex items-center gap-3 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-primary">
                  <Calendar className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                  2. Consultations & Bookings
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-body">
                Our platform permits users to book virtual meetings. The following rules govern our scheduling system:
              </p>
              <ul className="space-y-3 font-body text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>
                    <strong>Timezone Conversion:</strong> All slots are listed in Australian Eastern Time (AEST/AEDT). Conversion to your local time is your sole responsibility.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>
                    <strong>Cancellations:</strong> If we cancel your booking due to availability conflicts, you will receive an automatic email specifying instructions and options to reschedule.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>
                    <strong>Rescheduling Limits:</strong> Rescheduling requests must be initiated at least 24 hours prior to the session.
                  </span>
                </li>
              </ul>
            </section>

            {/* Section 3: Payments */}
            <section id="payments" className="glassy p-8 space-y-4 scroll-mt-32">
              <div className="flex items-center gap-3 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-primary">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                  3. Payments & Refund Policies
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-body">
                We use secure integration with Stripe to handle checkouts:
              </p>
              <ul className="space-y-3 font-body text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>
                    <strong>Digital Downloads (eBooks):</strong> Since eBooks are delivered immediately upon successful payment, all digital sales are final and non-refundable.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>
                    <strong>Consultation Refunds:</strong> Refunds are only available for cancellations requested at least 24 hours in advance, or in cases where the consultant cancels the session and you choose not to rebook.
                  </span>
                </li>
              </ul>
            </section>

            {/* Section 4: Disclaimer */}
            <section id="disclaimer" className="glassy p-8 space-y-4 scroll-mt-32">
              <div className="flex items-center gap-3 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-primary">
                  <Info className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                  4. Disclaimer of Advice
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-body">
                The content of our consultation calls, eBooks, templates, newsletters, and articles is provided solely for educational,
                general career guidance, and informational purposes. It does not constitute certified legal, financial, immigration, or professional
                advice. You must exercise your own judgment and consult authorized professionals before making significant decisions.
              </p>
            </section>

            {/* Section 5: Intellectual Property */}
            <section id="intellectual-property" className="glassy p-8 space-y-4 scroll-mt-32">
              <div className="flex items-center gap-3 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-primary">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                  5. Intellectual Property
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-body">
                All digital resources, text, videos, logos, and materials published on this website are protected under copyright laws.
                Purchase of an eBook grants you a single-user, non-transferable license. You may not share, distribute, resell, upload,
                or commercially exploit any content or digital product without prior written consent from Dr. Muhammad Kamran.
              </p>
            </section>

            {/* Section 6: Limitation */}
            <section id="limitation" className="glassy p-8 space-y-4 scroll-mt-32">
              <div className="flex items-center gap-3 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-primary">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                  6. Limitation of Liability
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-body">
                Dr. Muhammad Kamran, his team, or his affiliates shall not be liable for any direct, indirect, incidental, or consequential
                damages arising out of your reliance on the consultation insights, digital goods, or due to scheduling cancellations and platform downtime.
              </p>
            </section>

            {/* Section 7: Governing Law */}
            <section id="governing-law" className="glassy p-8 space-y-4 scroll-mt-32">
              <div className="flex items-center gap-3 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-primary">
                  <Globe className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                  7. Governing Law
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-body">
                These Terms & Conditions are governed by and construed in accordance with the laws of the State of Queensland, Australia.
                Any disputes relating to these services shall be subject to the exclusive jurisdiction of the courts of Queensland.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
