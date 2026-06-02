"use client";

import React, { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import {
  Image as ImageIcon,
  FileText,
  BookOpen,
  Mail,
  Calendar,
  TrendingUp,
  Activity,
  ArrowDownRight,
  Clock,
  ExternalLink,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import GradientText from "@/components/ui/GradientText";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    gallery: 0,
    articles: 0,
    ebooks: 0,
    subscribers: 0,
    bookings: 0,
    transactions: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      const getCount = async (table: string) => {
        try {
          const { count, error } = await supabaseClient
            .from(table)
            .select("*", { count: "exact", head: true });
          if (error) return 0;
          return count || 0;
        } catch {
          return 0;
        }
      };

      const [
        galleryCount,
        articlesCount,
        ebooksCount,
        subscribersCount,
        bookingsCount,
        transactionsCount,
      ] = await Promise.all([
        getCount("gallery"),
        getCount("articles"),
        getCount("ebooks"),
        getCount("newsletter_subscribers"),
        getCount("bookings"),
        getCount("transactions"),
      ]);

      setStats({
        gallery: galleryCount || 0,
        articles: articlesCount || 0,
        ebooks: ebooksCount || 0,
        subscribers: subscribersCount || 0,
        bookings: bookingsCount || 0,
        transactions: transactionsCount || 0,
      });
    }

    fetchStats();
  }, []);

  const cards = [
    {
      label: "Gallery Items",
      value: stats.gallery,
      icon: ImageIcon,
      href: "/admin/gallery",
      color: "from-blue-500 to-cyan-500",
      trend: "+4.5%",
      isUp: true,
    },
    {
      label: "Articles",
      value: stats.articles,
      icon: FileText,
      href: "/admin/articles",
      color: "from-purple-500 to-indigo-500",
      trend: "+2.1%",
      isUp: true,
    },
    {
      label: "Ebooks",
      value: stats.ebooks,
      icon: BookOpen,
      href: "/admin/ebooks",
      color: "from-pink-500 to-rose-500",
      trend: "Stable",
      isUp: true,
    },
    {
      label: "Subscribers",
      value: stats.subscribers,
      icon: Mail,
      href: "/admin/newsletter",
      color: "from-emerald-500 to-teal-500",
      trend: "+12.4%",
      isUp: true,
    },
    {
      label: "Bookings",
      value: stats.bookings,
      icon: Calendar,
      href: "/admin/bookings",
      color: "from-amber-500 to-orange-500",
      trend: "+8.2%",
      isUp: true,
    },
    {
      label: "Transactions",
      value: stats.transactions,
      icon: CreditCard,
      href: "/admin/transactions",
      color: "from-blue-600 to-indigo-600",
      trend: "New",
      isUp: true,
    },
  ];

  const recentActivity = [
    { id: 1, type: 'article', title: 'New article published: Future of AI', time: '2 hours ago', icon: FileText },
    { id: 2, type: 'gallery', title: 'Added 4 new items to Gallery', time: '5 hours ago', icon: ImageIcon },
    { id: 3, type: 'booking', title: 'New consultation booking from John D.', time: 'Yesterday', icon: Calendar },
    { id: 4, type: 'newsletter', title: '3 new newsletter subscribers', time: '2 days ago', icon: Mail },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-blue-600 text-sm font-semibold tracking-wider uppercase mb-2"
          >
            <Activity className="w-4 h-4" />
            System Live
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            <GradientText colors={["#2563EB", "#7C3AED"]} animationSpeed={4}>
              Analytics Dashboard
            </GradientText>
          </h1>
          <p className="text-slate-500 mt-3 text-lg">
            Welcome back, Dr. Kamran. Monitoring your digital ecosystem.
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
          <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-600">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <Link 
            href="/"
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-blue-600"
            title="View Live Site"
          >
            <ExternalLink className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Link
              href={card.href}
              className="group relative overflow-hidden bg-white p-6 rounded-3xl border border-slate-200 transition-all hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5 block"
            >
              {/* Glow Effect */}
              <div className={`absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br ${card.color} opacity-5 blur-2xl group-hover:opacity-10 transition-opacity`} />
              
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${card.color} p-2.5 mb-5 shadow-lg shadow-black/5`}>
                  <card.icon className="w-full h-full text-white" />
                </div>
                
                <h3 className="text-slate-500 font-medium text-sm mb-1">
                  {card.label}
                </h3>
                
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-bold text-slate-900 tracking-tight">
                    {card.value}
                  </p>
                  <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${card.isUp ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                    {card.isUp ? <TrendingUp className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {card.trend}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Analytics Chart Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 relative overflow-hidden h-[400px] shadow-sm">
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Engagement Overview</h3>
                <p className="text-slate-500 text-sm">Interaction trends over the last 30 days</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-xs text-slate-400">Views</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className="text-xs text-slate-400">Actions</span>
                </div>
              </div>
            </div>

            {/* Custom SVG "Chart" Illustration */}
            <div className="absolute inset-0 flex items-end px-8 pb-10 opacity-30">
              <svg className="w-full h-[60%]" viewBox="0 0 1000 300" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gradient-chart-light" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path 
                  d="M0,250 Q100,220 200,240 T400,150 T600,180 T800,80 T1000,120 V300 H0 Z" 
                  fill="url(#gradient-chart-light)"
                />
                <path 
                  d="M0,250 Q100,220 200,240 T400,150 T600,180 T800,80 T1000,120" 
                  stroke="#3B82F6" 
                  strokeWidth="3" 
                  fill="none" 
                  strokeLinecap="round"
                />
                <path 
                  d="M0,280 Q150,260 300,270 T600,200 T900,220 T1000,180" 
                  stroke="#8B5CF6" 
                  strokeWidth="2" 
                  fill="none" 
                  strokeLinecap="round" 
                  strokeDasharray="8 8"
                />
              </svg>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-slate-400 text-sm font-medium bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-100 shadow-lg">
                Analytics module loading detailed metrics...
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 h-full shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-600" />
              Recent Activity
            </h3>
            
            <div className="space-y-8">
              {recentActivity.map((activity, idx) => (
                <div key={activity.id} className="relative pl-8 group">
                  {/* Timeline Line */}
                  {idx !== recentActivity.length - 1 && (
                    <div className="absolute left-[11px] top-8 bottom-[-32px] w-[2px] bg-slate-100" />
                  )}
                  
                  {/* Activity Dot/Icon */}
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:border-blue-500/50 transition-colors">
                    <activity.icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                  </div>
                  
                  <div>
                    <h4 className="text-slate-700 text-sm font-medium leading-tight mb-1 group-hover:text-slate-900 transition-colors">
                      {activity.title}
                    </h4>
                    <span className="text-xs text-slate-400">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-10 py-3 rounded-2xl border border-slate-100 bg-slate-50 text-slate-500 text-sm font-medium hover:bg-slate-100 hover:text-slate-700 transition-all">
              View All Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


