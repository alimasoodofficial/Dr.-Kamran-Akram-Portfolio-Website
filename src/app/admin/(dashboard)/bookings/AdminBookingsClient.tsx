"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { format, addDays, startOfDay, endOfDay } from "date-fns";
import {
  formatTimeAEST,
  formatDateAEST,
  formatShortDateAEST,
  formatFullDateTimeAEST,
  getAESTDayRange,
} from "@/lib/timezone";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  User,
  Mail,
  FileText,
  Clock,
  TrendingUp,
  Loader2,
  Trash2,
  Plus,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Globe,
  RefreshCw,
  X,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { BookingWithSlot, TimeSlot } from "@/types/booking";

type AdminBookingsClientProps = {
  initialBookings: BookingWithSlot[];
};

export default function AdminBookingsClient({
  initialBookings,
}: AdminBookingsClientProps) {
  const [activeTab, setActiveTab] = useState<"bookings" | "slots">("bookings");
  const [bookings, setBookings] = useState<BookingWithSlot[]>(initialBookings);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const router = useRouter();

  const [stats, setStats] = useState({
    total: initialBookings.length,
    today: 0,
    upcoming: 0,
  });

  // Bulk generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [genConfig, setGenConfig] = useState({
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(addDays(new Date(), 7), "yyyy-MM-dd"),
    startHour: 9,
    endHour: 17,
    duration: 30,
  });

  // Reschedule modal state
  const [rescheduleModal, setRescheduleModal] = useState<{
    open: boolean;
    booking: BookingWithSlot | null;
    availableSlots: TimeSlot[];
    selectedNewSlotId: string | null;
    loadingSlots: boolean;
    submitting: boolean;
    selectedDate: Date;
  }>({
    open: false,
    booking: null,
    availableSlots: [],
    selectedNewSlotId: null,
    loadingSlots: false,
    submitting: false,
    selectedDate: new Date(),
  });

  useEffect(() => {
    calculateStats(bookings);
  }, [bookings]);

  useEffect(() => {
    if (activeTab === "slots") {
      fetchSlots();
    }
  }, [activeTab, selectedDate]);

  useEffect(() => {
    const channel = supabase
      .channel("admin-booking-mgmt")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        () => {
          router.refresh(); // Refresh server data
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "time_slots" },
        () => {
          if (activeTab === "slots") fetchSlots();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeTab]);

  const confirmAction = (message: string, onConfirm: () => void) => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible
              ? "animate-in fade-in zoom-in duration-300"
              : "animate-out fade-out zoom-out duration-300"
          } max-w-md w-full bg-white dark:bg-slate-900 shadow-2xl rounded-2xl pointer-events-auto ring-1 ring-black/5 p-6 border border-slate-100 dark:border-slate-800 z-[9999]`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Are you sure?
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {message}
              </p>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                toast.dismiss(t.id);
              }}
              className="px-6 py-2 text-sm font-bold bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg shadow-red-500/20 transition-all active:scale-95"
            >
              Confirm
            </button>
          </div>
        </div>
      ),
      { duration: Infinity, position: "top-center" },
    );
  };

  const fetchSlots = async () => {
    setSlotsLoading(true);
    try {
      // Use Australian date for the query boundaries
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const { start, end } = getAESTDayRange(dateStr);

      const { data, error } = await supabase
        .from("time_slots")
        .select("*")
        .gte("start_time", start)
        .lte("start_time", end)
        .order("start_time", { ascending: true });

      if (error) throw error;
      setSlots(data || []);
    } catch (error) {
      console.error("Error fetching slots:", error);
      toast.error("Failed to fetch time slots");
    } finally {
      setSlotsLoading(false);
    }
  };

  const calculateStats = (bookingsList: BookingWithSlot[]) => {
    const now = new Date();
    const today = startOfDay(now);
    const tomorrow = addDays(today, 1);

    const todayBookings = bookingsList.filter((b) => {
      const bDate = new Date(b.time_slots.start_time);
      return bDate >= today && bDate < tomorrow;
    });

    const upcomingBookings = bookingsList.filter((b) => {
      return new Date(b.time_slots.start_time) > now;
    });

    setStats({
      total: bookingsList.length,
      today: todayBookings.length,
      upcoming: upcomingBookings.length,
    });
  };

  const handleDeleteBooking = async (bookingId: string, slotId: string) => {
    confirmAction(
      "Are you sure you want to cancel this booking? This will notify the client.",
      async () => {
        try {
          const response = await fetch(
            `/api/admin/bookings?id=${bookingId}&slotId=${slotId}`,
            {
              method: "DELETE",
            },
          );

          if (!response.ok) throw new Error("Failed to cancel booking");

          toast.success("Booking cancelled successfully");
          router.refresh();
        } catch (error: any) {
          toast.error(error.message || "Failed to cancel booking");
        }
      },
    );
  };

  const handleDeleteSlot = async (slotId: string, isBooked: boolean) => {
    if (isBooked) {
      toast.error("Cannot delete a booked slot. Cancel the booking first.");
      return;
    }

    confirmAction(
      "Are you sure you want to delete this time slot?",
      async () => {
        try {
          const response = await fetch(`/api/admin/slots?id=${slotId}`, {
            method: "DELETE",
          });

          if (!response.ok) throw new Error("Failed to delete slot");

          toast.success("Time slot deleted");
          
          fetchSlots();
        } catch (error: any) {
          toast.error(error.message || "Failed to delete time slot");
        }
      },
    );
  };

  const handleBulkGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/admin/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start_date: genConfig.startDate,
          end_date: genConfig.endDate,
          start_hour: genConfig.startHour,
          end_hour: genConfig.endHour,
          slot_duration_minutes: genConfig.duration,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate slots");

      toast.success("Time slots generated successfully!");
      if (activeTab === "slots") fetchSlots();
    } catch (error: any) {
      toast.error(error.message || "Failed to generate slots");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCleanup = async () => {
    confirmAction(
      "Delete all unbooked slots older than 1 week? This cannot be undone.",
      async () => {
        setIsCleaning(true);
        try {
          const response = await fetch("/api/admin/slots/cleanup", {
            method: "POST",
          });

          const data = await response.json();

          if (!response.ok)
            throw new Error(data.error || "Failed to cleanup slots");

          toast.success(`Cleanup successful! Deleted ${data.count} old slots.`);
          if (activeTab === "slots") fetchSlots();
        } catch (error: any) {
          toast.error(error.message || "Failed to cleanup slots");
        } finally {
          setIsCleaning(false);
        }
      },
    );
  };

  // --- Reschedule Functions ---
  const openRescheduleModal = (booking: BookingWithSlot) => {
    setRescheduleModal({
      open: true,
      booking,
      availableSlots: [],
      selectedNewSlotId: null,
      loadingSlots: false,
      submitting: false,
      selectedDate: new Date(),
    });
  };

  const fetchRescheduleSlots = async (date: Date) => {
    setRescheduleModal((prev) => ({
      ...prev,
      loadingSlots: true,
      selectedDate: date,
      selectedNewSlotId: null,
    }));

    try {
      const start = startOfDay(date).toISOString();
      const end = endOfDay(date).toISOString();

      const { data, error } = await supabase
        .from("time_slots")
        .select("*")
        .gte("start_time", start)
        .lte("start_time", end)
        .eq("is_booked", false)
        .order("start_time", { ascending: true });

      if (error) throw error;

      // Filter out past slots
      const now = new Date();
      const futureSlots = (data || []).filter(
        (slot) => new Date(slot.start_time) > now,
      );

      setRescheduleModal((prev) => ({
        ...prev,
        availableSlots: futureSlots,
        loadingSlots: false,
      }));
    } catch (error) {
      console.error("Error fetching slots for reschedule:", error);
      toast.error("Failed to fetch available slots");
      setRescheduleModal((prev) => ({
        ...prev,
        loadingSlots: false,
      }));
    }
  };

  const handleReschedule = async () => {
    if (!rescheduleModal.booking || !rescheduleModal.selectedNewSlotId) return;

    setRescheduleModal((prev) => ({ ...prev, submitting: true }));

    try {
      const response = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: rescheduleModal.booking.id,
          newSlotId: rescheduleModal.selectedNewSlotId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reschedule");
      }

      toast.success("Booking rescheduled! Notification emails sent.");
      setRescheduleModal({
        open: false,
        booking: null,
        availableSlots: [],
        selectedNewSlotId: null,
        loadingSlots: false,
        submitting: false,
        selectedDate: new Date(),
      });
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to reschedule booking");
      setRescheduleModal((prev) => ({ ...prev, submitting: false }));
    }
  };

  const getStatusColor = (startTime: string) => {
    const now = new Date();
    const bTime = new Date(startTime);
    if (bTime < now) return "bg-slate-100 text-slate-500";
    if (format(bTime, "yyyy-MM-dd") === format(now, "yyyy-MM-dd"))
      return "bg-emerald-100 text-emerald-700";
    return "bg-blue-100 text-blue-700";
  };

  return (
    <div className="space-y-8 pb-20">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Booking Management
          </h1>
          <p className="text-slate-500">
            Manage appointments and availability slots
          </p>
          <div className="flex items-center gap-4 mt-2">
            <Link
              href="/consulting"
              target="_blank"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View Public Page
            </Link>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
              🇦🇺 Australian Eastern Time
            </span>
          </div>
        </div>

        <div className="flex bg-white rounded-xl p-1 shadow-sm border border-slate-200 self-start">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "bookings"
                ? "bg-slate-900 text-white shadow-md"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Bookings
          </button>
          <button
            onClick={() => setActiveTab("slots")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "slots"
                ? "bg-slate-900 text-white shadow-md"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Time Slots
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Total Bookings",
            value: stats.total,
            icon: Calendar,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Today's",
            value: stats.today,
            icon: Clock,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Upcoming",
            value: stats.upcoming,
            icon: TrendingUp,
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {activeTab === "bookings" ? (
          <motion.div
            key="bookings"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-400" />
                Recent Appointments
              </h2>
              <div className="text-xs text-slate-400 animate-pulse flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                Live Updates Enabled
              </div>
            </div>

            {bookings.length === 0 ? (
              <div className="p-20 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-slate-200" />
                </div>
                <h3 className="text-slate-900 font-bold">No bookings yet</h3>
                <p className="text-slate-500 mt-1 max-w-xs mx-auto">
                  When clients book appointments, they will appear here in
                  real-time.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                      <th className="px-6 py-4">Client</th>
                      <th className="px-6 py-4">Date & Time (AEST)</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Country</th>
                      <th className="px-6 py-4">Notes</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {bookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold uppercase">
                              {booking.user_name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">
                                {booking.user_name}
                              </p>
                              <p className="text-xs text-slate-500 flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {booking.user_email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <p className="font-medium text-slate-900">
                              {formatShortDateAEST(
                                booking.time_slots.start_time,
                              )}
                            </p>
                            <p className="text-slate-500">
                              {formatTimeAEST(booking.time_slots.start_time)} -{" "}
                              {formatTimeAEST(booking.time_slots.end_time)}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-tight ${getStatusColor(booking.time_slots.start_time)}`}
                          >
                            {new Date(booking.time_slots.start_time) <
                            new Date()
                              ? "Past"
                              : "Upcoming"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-full flex items-center gap-1 w-fit">
                            <Globe className="w-3 h-3" />
                            {booking.country || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {booking.notes ? (
                            <div
                              className="max-w-[200px] truncate text-xs text-slate-500 italic"
                              title={booking.notes}
                            >
                              &quot;{booking.notes}&quot;
                            </div>
                          ) : (
                            <span className="text-slate-300 text-xs">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openRescheduleModal(booking)}
                              className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                              title="Reschedule Booking"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteBooking(booking.id, booking.slot_id)
                              }
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              title="Cancel Booking"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="slots"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid lg:grid-cols-3 gap-8"
          >
            {/* Slot Generation Form */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-500" />
                  Generate Slots
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Times are in Australian Eastern Time (AEST/AEDT)
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={genConfig.startDate}
                      onChange={(e) =>
                        setGenConfig({
                          ...genConfig,
                          startDate: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={genConfig.endDate}
                      onChange={(e) =>
                        setGenConfig({ ...genConfig, endDate: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">
                        Start Hour
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="23"
                        value={genConfig.startHour}
                        onChange={(e) =>
                          setGenConfig({
                            ...genConfig,
                            startHour: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">
                        End Hour
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="23"
                        value={genConfig.endHour}
                        onChange={(e) =>
                          setGenConfig({
                            ...genConfig,
                            endHour: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">
                      Duration (min)
                    </label>
                    <select
                      value={genConfig.duration}
                      onChange={(e) =>
                        setGenConfig({
                          ...genConfig,
                          duration: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">60 minutes</option>
                    </select>
                  </div>
                  <button
                    onClick={handleBulkGenerate}
                    disabled={isGenerating}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Generate Slots"
                    )}
                  </button>
                  <p className="text-[10px] text-slate-400 text-center">
                    Note: Weekends are automatically skipped. Times in AEST.
                  </p>
                </div>
              </div>

              {/* Maintenance Section */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mt-6">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm">
                  <Trash2 className="w-4 h-4 text-slate-400" />
                  Maintenance
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Keep your database clean by removing old, unbooked time slots.
                </p>
                <button
                  onClick={handleCleanup}
                  disabled={isCleaning}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200"
                >
                  {isCleaning ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Cleanup Old Slots
                    </>
                  )}
                </button>
                <p className="text-[10px] text-slate-400 text-center mt-3">
                  Deletes unbooked slots older than 7 days.
                </p>
              </div>
            </div>

            {/* Slots List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSelectedDate(addDays(selectedDate, -1))}
                    className="p-2 hover:bg-slate-50 rounded-lg transition-colors border border-slate-100"
                  >
                    <ChevronLeft className="w-5 h-5 text-slate-400" />
                  </button>
                  <div className="text-center min-w-[150px]">
                    <p className="text-sm font-bold text-slate-900">
                      {format(selectedDate, "EEEE")}
                    </p>
                    <p className="text-xs text-slate-500">
                      {format(selectedDate, "MMMM d, yyyy")}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedDate(addDays(selectedDate, 1))}
                    className="p-2 hover:bg-slate-50 rounded-lg transition-colors border border-slate-100"
                  >
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
                <button
                  onClick={() => setSelectedDate(new Date())}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Jump to Today
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 text-sm">
                    Slots for {format(selectedDate, "MMM d")}
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {slots.length} available
                  </span>
                </div>

                {slotsLoading ? (
                  <div className="p-20 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-10 h-10 text-slate-300 animate-spin" />
                  </div>
                ) : slots.length === 0 ? (
                  <div className="p-16 text-center">
                    <p className="text-slate-400 text-sm">
                      No slots generated for this date.
                    </p>
                    <p className="text-xs text-slate-300 mt-1">
                      Use the generator tool on the left.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {slots.map((slot) => (
                      <div
                        key={slot.id}
                        className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-2 h-2 rounded-full ${slot.is_booked ? "bg-amber-500 shadow-lg shadow-amber-500/20" : "bg-emerald-500 shadow-lg shadow-emerald-500/20"}`}
                          ></div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">
                              {formatTimeAEST(slot.start_time)} -{" "}
                              {formatTimeAEST(slot.end_time)}
                            </p>
                            <p className="text-[10px] text-slate-400 flex items-center gap-1">
                              {slot.is_booked ? (
                                <>
                                  <AlertCircle className="w-2 h-2 text-amber-500" />
                                  Booked by Client
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="w-2 h-2 text-emerald-500" />
                                  Available for Booking
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleDeleteSlot(slot.id, slot.is_booked)
                            }
                            disabled={slot.is_booked}
                            className={`p-2 rounded-lg transition-all ${
                              slot.is_booked
                                ? "text-slate-200 cursor-not-allowed"
                                : "text-slate-400 hover:text-red-500 hover:bg-red-50"
                            }`}
                            title={
                              slot.is_booked
                                ? "Cannot delete booked slot"
                                : "Delete Slot"
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reschedule Modal */}
      <AnimatePresence>
        {rescheduleModal.open && rescheduleModal.booking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() =>
              setRescheduleModal((prev) => ({ ...prev, open: false }))
            }
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-blue-500" />
                    Reschedule Booking
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Move <strong>{rescheduleModal.booking.user_name}</strong>
                    &apos;s appointment to a new time
                  </p>
                </div>
                <button
                  onClick={() =>
                    setRescheduleModal((prev) => ({ ...prev, open: false }))
                  }
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Current Booking Info */}
              <div className="p-6 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">
                  Current Time
                </p>
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="font-bold text-red-700">
                    {formatFullDateTimeAEST(
                      rescheduleModal.booking.time_slots.start_time,
                    )}
                  </p>
                </div>
              </div>

              {/* Date Picker */}
              <div className="p-6 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">
                  Select New Date
                </p>
                <input
                  type="date"
                  value={format(rescheduleModal.selectedDate, "yyyy-MM-dd")}
                  min={format(new Date(), "yyyy-MM-dd")}
                  onChange={(e) => {
                    const date = new Date(e.target.value + "T00:00:00");
                    fetchRescheduleSlots(date);
                  }}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              {/* Available Slots */}
              <div className="p-6">
                <p className="text-xs font-bold text-slate-400 uppercase mb-3">
                  Available Slots (AEST)
                </p>

                {rescheduleModal.loadingSlots ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                  </div>
                ) : rescheduleModal.availableSlots.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-400 text-sm">
                      {rescheduleModal.selectedDate
                        ? "No available slots for this date. Pick a date above."
                        : "Select a date to see available slots."}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto">
                    {rescheduleModal.availableSlots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() =>
                          setRescheduleModal((prev) => ({
                            ...prev,
                            selectedNewSlotId: slot.id,
                          }))
                        }
                        className={`p-3 rounded-xl text-sm font-semibold transition-all ${
                          rescheduleModal.selectedNewSlotId === slot.id
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-slate-50 text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                      >
                        {formatTimeAEST(slot.start_time)}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  onClick={() =>
                    setRescheduleModal((prev) => ({ ...prev, open: false }))
                  }
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReschedule}
                  disabled={
                    !rescheduleModal.selectedNewSlotId ||
                    rescheduleModal.submitting
                  }
                  className="px-6 py-2 text-sm font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  {rescheduleModal.submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Rescheduling...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Confirm Reschedule
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
