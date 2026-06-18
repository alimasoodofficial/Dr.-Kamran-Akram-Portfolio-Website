"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  Lock,
  Eye,
  FileText,
  Globe,
  Calendar,
  HelpCircle,
  Activity,
  ArrowRight
} from "lucide-react";

export default function PrivacyPolicyPage() {
  const lastUpdated = "June 15, 2026";
  const [activeSection, setActiveSection] = useState("introduction");

  const sections = [
    { id: "introduction", title: "1. Introduction", icon: FileText },
    { id: "information-collected", title: "2. Information We Collect", icon: Eye },
    { id: "how-we-use", title: "3. How We Use Information", icon: Activity },
    { id: "security-retention", title: "4. Security & Retention", icon: Lock },
    { id: "third-parties", title: "5. Third-Party Services", icon: Globe },
    { id: "your-rights", title: "6. Your Rights & Choice", icon: Shield },
    { id: "contact-us", title: "7. Contact Information", icon: HelpCircle },
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
            <Shield className="w-3.5 h-3.5 animate-pulse text-primary" /> Legal Center
          </div>

          <h1 className="text-4xl md:text-6xl font-black font-heading tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-500">
            Privacy Policy
          </h1>

          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-body text-base md:text-lg">
            We value your trust. Learn how we collect, protect, and respect your personal data when using our consulting and digital services.
          </p>

          {/* Metadata Badges */}
          <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-body pt-2">
            <div className="flex items-center gap-1.5 bg-white/60 dark:bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span>Last Updated: {lastUpdated}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/60 dark:bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
              <Globe className="w-3.5 h-3.5 text-primary" />
              <span>Scope: Global Users</span>
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
                  <FileText className="w-4 h-4 text-primary" /> Navigation
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
                  Have questions or concerns regarding your privacy or personal information?
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
            {/* Section 1: Introduction */}
            <section id="introduction" className="glassy p-8 space-y-4 scroll-mt-32">
              <div className="flex items-center gap-3 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-primary">
                  <FileText className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                  1. Introduction
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-body">
                Welcome to the personal website of Dr. Muhammad Kamran (accessible at{" "}
                <a href="https://imkamran.com" className="text-primary hover:underline font-semibold">
                  imkamran.com
                </a>
                ). We are deeply committed to maintaining the confidentiality, integrity, and security of the personal data you share with us.
                This page explains what information we collect, how it is used, and the choices you can make regarding your data.
              </p>
            </section>

            {/* Section 2: Information We Collect */}
            <section id="information-collected" className="glassy p-8 space-y-4 scroll-mt-32">
              <div className="flex items-center gap-3 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-primary">
                  <Eye className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                  2. Information We Collect
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-body">
                We collect personal information to deliver our services. This happens through the following touchpoints:
              </p>
              <ul className="space-y-3 font-body text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>
                    <strong>Consultation Booking:</strong> When booking a call, we collect details including your name, email address, country, timezone, notes, meeting platform (Zoom or Google Meet), and preferred time.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>
                    <strong>Payment Transactions:</strong> Purchases are securely processed using Stripe. We do not store, see, or directly collect your credit or debit card details.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>
                    <strong>Newsletters & Forms:</strong> If you subscribe to our publications or contact us, we collect your email address and any additional messages provided.
                  </span>
                </li>
              </ul>
            </section>

            {/* Section 3: How We Use Information */}
            <section id="how-we-use" className="glassy p-8 space-y-4 scroll-mt-32">
              <div className="flex items-center gap-3 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-primary">
                  <Activity className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                  3. How We Use Information
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-body">
                The data we collect is strictly used to serve you and improve your overall experience:
              </p>
              <ul className="space-y-3 font-body text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>To set up, manage, and coordinate your private consultation bookings.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>To automate invitations, meeting link generation, and reschedule or cancellation notifications.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>To deliver your purchased digital assets (eBooks) and send verification codes securely.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>To deliver career updates, resources, and newsletters if you have opted in.</span>
                </li>
              </ul>
            </section>

            {/* Section 4: Security & Retention */}
            <section id="security-retention" className="glassy p-8 space-y-4 scroll-mt-32">
              <div className="flex items-center gap-3 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-primary">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                  4. Security & Data Retention
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-body">
                We implement robust security measures, including HTTPS encryption and secure database controls via Supabase.
                Your personal details are stored only for as long as necessary to fulfill your bookings, manage eBook access,
                or until you request deletion. We proactively secure our application routes from unauthorized access.
              </p>
            </section>

            {/* Section 5: Third-Party Services */}
            <section id="third-parties" className="glassy p-8 space-y-4 scroll-mt-32">
              <div className="flex items-center gap-3 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-primary">
                  <Globe className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                  5. Third-Party Services
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-body">
                We work with external service providers to handle payments, databases, and meetings. We do not sell your personal data.
                Our partners include:
              </p>
              <ul className="space-y-3 font-body text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span><strong>Supabase:</strong> For cloud database hosting, verification, and dashboard services.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span><strong>Stripe:</strong> For secure processing of payments and checkouts.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span><strong>Google Meet & Zoom APIs:</strong> To generate video conference slots.</span>
                </li>
              </ul>
            </section>

            {/* Section 6: Your Rights & Choice */}
            <section id="your-rights" className="glassy p-8 space-y-4 scroll-mt-32">
              <div className="flex items-center gap-3 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-primary">
                  <Shield className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                  6. Your Rights & Choices
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-body">
                You have the right to access, edit, or request complete deletion of any personal data we hold.
                You can opt-out of our emails at any time. To submit a deletion or correction request, please send an email to{" "}
                <a href="mailto:bookingsimkamran@gmail.com" className="text-primary hover:underline font-semibold">
                  bookingsimkamran@gmail.com
                </a>.
              </p>
            </section>

            {/* Section 7: Contact Information */}
            <section id="contact-us" className="glassy p-8 space-y-4 scroll-mt-32">
              <div className="flex items-center gap-3 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-primary">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                  7. Contact Information
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-body">
                If you have any questions or clarifications regarding this Privacy Policy or how your data is handled, feel free to contact us:
              </p>
              <div className="bg-[#f0fdf4] dark:bg-[#064e3b]/30 border border-primary/15 rounded-2xl p-6 font-body">
                <p className="font-bold text-slate-900 dark:text-white text-base">Dr. Muhammad Kamran</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Brisbane, Australia</p>
                <p className="text-sm mt-3">
                  Email:{" "}
                  <a href="mailto:bookingsimkamran@gmail.com" className="text-primary hover:underline font-semibold">
                    bookingsimkamran@gmail.com
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
