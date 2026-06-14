"use client";

import React, { useEffect, useState } from "react";
import { getDashboardStats } from "@/app/actions/dashboard";
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
    confirmedBookings: 0,
    cancelledBookings: 0,
    ebooksSales: 0,
    consultationsSales: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      }
    }

    fetchStats();
  }, []);

  const totalSales = stats.ebooksSales + stats.consultationsSales;
  const ebookPercentage = totalSales > 0 ? (stats.ebooksSales / totalSales) * 100 : 0;
  const consultationsPercentage = totalSales > 0 ? (stats.consultationsSales / totalSales) * 100 : 0;

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
              <div className={`absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br ${card.color}  blur-2xl opacity-30 transition-opacity`} />
              
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

      {/* Booking Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Column 1: Bookings Status Breakdown */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 text-blue-600 text-sm font-semibold tracking-wider uppercase mb-2">
              <Calendar className="w-4 h-4" />
              Bookings Status
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Booking Overview</h3>
            <p className="text-slate-500 mt-1">Status of scheduled consultation meetings</p>
          </div>

          <div className="grid grid-cols-2 gap-6 my-8">
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl translate-x-4 -translate-y-4" />
              <span className="text-sm font-medium text-emerald-600">Confirmed</span>
              <div className="text-4xl font-extrabold text-slate-900 mt-2">{stats.confirmedBookings}</div>
            </div>
            
            <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-6 relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl translate-x-4 -translate-y-4" />
              <span className="text-sm font-medium text-rose-600">Cancelled</span>
              <div className="text-4xl font-extrabold text-slate-900 mt-2">{stats.cancelledBookings}</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-slate-400 border-t border-slate-100 pt-4">
            <span>Total booked sessions: {stats.bookings}</span>
            <Link href="/admin/bookings" className="text-blue-600 hover:underline font-medium flex items-center gap-1">
              Manage Bookings
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>

        {/* Column 2: Sales Breakdown Pie Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 text-purple-600 text-sm font-semibold tracking-wider uppercase mb-2">
              <CreditCard className="w-4 h-4" />
              Revenue Distribution
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Sales Overview</h3>
            <p className="text-slate-500 mt-1">Sales breakdown between eBooks and consultations</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 my-6">
            {/* Conic Gradient Donut Chart */}
            <div 
              className="w-40 h-40 rounded-full relative flex items-center justify-center shadow-lg transition-transform hover:scale-105 duration-300 flex-shrink-0" 
              style={{
                background: totalSales > 0 
                  ? `conic-gradient(#8B5CF6 0% ${ebookPercentage}%, #2563EB ${ebookPercentage}% 100%)`
                  : '#E2E8F0'
              }}
            >
              <div className="w-28 h-28 rounded-full bg-white flex flex-col items-center justify-center shadow-inner">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Total Sales</span>
                <span className="text-xl font-black text-slate-800 mt-0.5">
                  ${totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-4 w-full sm:w-auto min-w-[200px]">
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-purple-500 shadow-sm" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800">eBooks</span>
                    <span className="text-xs text-slate-400 font-medium">{ebookPercentage.toFixed(1)}% of sales</span>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-slate-900">
                  ${stats.ebooksSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-blue-600 shadow-sm" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800">Consultations</span>
                    <span className="text-xs text-slate-400 font-medium">{consultationsPercentage.toFixed(1)}% of sales</span>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-slate-900">
                  ${stats.consultationsSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-slate-400 border-t border-slate-100 pt-4">
            <span>Total transactions logged: {stats.transactions}</span>
            <Link href="/admin/transactions" className="text-blue-600 hover:underline font-medium flex items-center gap-1">
              View Transactions
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
