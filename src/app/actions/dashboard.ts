"use server";

import { getSupabaseService } from "@/lib/supabaseService";
import { verifyAdminSession } from "@/lib/adminAuth";

export type DashboardStats = {
  gallery: number;
  articles: number;
  ebooks: number;
  subscribers: number;
  bookings: number;
  transactions: number;
  confirmedBookings: number;
  cancelledBookings: number;
  ebooksSales: number;
  consultationsSales: number;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    throw new Error("Unauthorized access: Admin privileges required.");
  }

  const supabase = getSupabaseService();

  const getCount = async (table: string): Promise<number> => {
    try {
      const { count, error } = await supabase
        .from(table)
        .select("*", { count: "exact", head: true });
      if (error) {
        console.error(`Error fetching count for ${table}:`, error.message);
        return 0;
      }
      return count || 0;
    } catch (err) {
      console.error(`Exception fetching count for ${table}:`, err);
      return 0;
    }
  };

  const getBookingsBreakdown = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("status");
      if (error) {
        console.error("Error fetching bookings breakdown:", error.message);
        return { confirmed: 0, cancelled: 0 };
      }
      const confirmed = (data || []).filter(b => b.status === "confirmed").length;
      const cancelled = (data || []).filter(b => b.status === "cancelled").length;
      return { confirmed, cancelled };
    } catch (err) {
      console.error("Exception fetching bookings breakdown:", err);
      return { confirmed: 0, cancelled: 0 };
    }
  };

  const getSalesBreakdown = async () => {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("item_type, price_paid");
      if (error) {
        console.error("Error fetching sales breakdown:", error.message);
        return { ebooksSales: 0, consultationsSales: 0 };
      }
      
      let ebooksSales = 0;
      let consultationsSales = 0;
      
      (data || []).forEach(tx => {
        const amount = Number(tx.price_paid) || 0;
        if (tx.item_type === "ebook") {
          ebooksSales += amount;
        } else if (tx.item_type === "booking") {
          consultationsSales += amount;
        }
      });
      
      return { ebooksSales, consultationsSales };
    } catch (err) {
      console.error("Exception fetching sales breakdown:", err);
      return { ebooksSales: 0, consultationsSales: 0 };
    }
  };

  const [
    galleryCount,
    articlesCount,
    ebooksCount,
    subscribersCount,
    bookingsCount,
    transactionsCount,
    bookingsBreakdown,
    salesBreakdown,
  ] = await Promise.all([
    getCount("gallery"),
    getCount("articles"),
    getCount("ebooks"),
    getCount("subscribers"),
    getCount("bookings"),
    getCount("transactions"),
    getBookingsBreakdown(),
    getSalesBreakdown(),
  ]);

  return {
    gallery: galleryCount,
    articles: articlesCount,
    ebooks: ebooksCount,
    subscribers: subscribersCount,
    bookings: bookingsCount,
    transactions: transactionsCount,
    confirmedBookings: bookingsBreakdown.confirmed,
    cancelledBookings: bookingsBreakdown.cancelled,
    ebooksSales: salesBreakdown.ebooksSales,
    consultationsSales: salesBreakdown.consultationsSales,
  };
}
