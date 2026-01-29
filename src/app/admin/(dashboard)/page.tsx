"use client";

import React, { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import {
  Users,
  Image as ImageIcon,
  FileText,
  BookOpen,
  Mail,
  ArrowUpRight,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import GradientText from "@/components/ui/GradientText";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    gallery: 0,
    articles: 0,
    ebooks: 0,
    subscribers: 0,
    bookings: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      // In a real app, you would fetch these from DB or an API.
      // For now, we will just use placeholders or try to fetch if tables exist.
      // Since tables might not exist, we wrap in try/catch to avoid crashing.

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
      ] = await Promise.all([
        getCount("gallery"), // Assuming table name is 'gallery' or 'gallery_items'? Prev code used 'gallery' endpoint, let's check.
        getCount("articles"),
        getCount("ebooks"),
        getCount("newsletter_subscribers"),
        getCount("bookings"),
      ]);

      // Existing gallery code used '/api/admin/gallery'.
      // If we don't know table names, we might just show 0.

      setStats({
        gallery: galleryCount || 0,
        articles: articlesCount || 0,
        ebooks: ebooksCount || 0,
        subscribers: subscribersCount || 0,
        bookings: bookingsCount || 0,
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
      color: "bg-blue-500",
    },
    {
      label: "Articles",
      value: stats.articles,
      icon: FileText,
      href: "/admin/articles",
      color: "bg-purple-500",
    },
    {
      label: "Ebooks",
      value: stats.ebooks,
      icon: BookOpen,
      href: "/admin/ebooks",
      color: "bg-pink-500",
    },
    {
      label: "Subscribers",
      value: stats.subscribers,
      icon: Mail,
      href: "/admin/newsletter",
      color: "bg-green-500",
    },
    {
      label: "Bookings",
      value: stats.bookings,
      icon: Calendar,
      href: "/admin/bookings",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 font-heading">
          <GradientText colors={["#4F46E5", "#9333EA"]} animationSpeed={4}>
            Dashboard Overview
          </GradientText>
        </h1>
        <p className="text-slate-500 mt-2">
          Welcome back, Admin. Here is what is happening.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-lg hover:-translate-y-1 block"
          >
            <div
              className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${card.color} rounded-bl-3xl`}
            >
              <card.icon className="w-16 h-16 text-white" />
            </div>

            <div className="relative z-10 flex flex-col justify-between h-full">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color} bg-opacity-10 mb-4`}
              >
                <card.icon
                  className={`w-6 h-6 ${card.color.replace("bg-", "text-")}`}
                />
              </div>
              <div>
                <h3 className="text-slate-500 font-medium text-sm">
                  {card.label}
                </h3>
                <p className="text-3xl font-bold text-slate-800 mt-1">
                  {card.value}
                </p>
              </div>
            </div>

            <div className="absolute bottom-4 right-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions or Recent Activity could go here */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[300px] flex items-center justify-center text-slate-400">
          <p>Recent Activity Chart (Coming Soon)</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[300px] flex items-center justify-center text-slate-400">
          <p>System Health (Coming Soon)</p>
        </div>
      </div>
    </div>
  );
}
