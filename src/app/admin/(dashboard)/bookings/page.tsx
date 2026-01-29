"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { format, addDays, startOfDay, endOfDay } from "date-fns";
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
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import { BookingWithSlot, TimeSlot } from "@/types/booking";

export default function BookingsAdminPage() {
  const [activeTab, setActiveTab] = useState<"bookings" | "slots">("bookings");
  const [bookings, setBookings] = useState<BookingWithSlot[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    upcoming: 0,
  });

  // Bulk generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [genConfig, setGenConfig] = useState({
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(addDays(new Date(), 7), "yyyy-MM-dd"),
    startHour: 9,
    endHour: 17,
    duration: 30,
  });

  useEffect(() => {
    fetchBookings();
    subscribeToChanges();
    if (activeTab === "slots") {
      fetchSlots();
    }
  }, [activeTab, selectedDate]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(
          `
          *,
          time_slots (*)
        `,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      setBookings(data as BookingWithSlot[]);
      calculateStats(data as BookingWithSlot[]);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const fetchSlots = async () => {
    setSlotsLoading(true);
    try {
      const start = startOfDay(selectedDate).toISOString();
      const end = endOfDay(selectedDate).toISOString();

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

  const subscribeToChanges = () => {
    const channel = supabase
      .channel("admin-booking-mgmt")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        () => fetchBookings(),
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
  };

  const calculateStats = (bookings: BookingWithSlot[]) => {
    const now = new Date();
    const today = startOfDay(now);
    const tomorrow = addDays(today, 1);

    const todayBookings = bookings.filter((b) => {
      const bDate = new Date(b.time_slots.start_time);
      return bDate >= today && bDate < tomorrow;
    });

    const upcomingBookings = bookings.filter((b) => {
      return new Date(b.time_slots.start_time) > now;
    });

    setStats({
      total: bookings.length,
      today: todayBookings.length,
      upcoming: upcomingBookings.length,
    });
  };

  const handleDeleteBooking = async (bookingId: string, slotId: string) => {
    if (
      !confirm(
        "Are you sure you want to cancel this booking? This will also make the time slot available again.",
      )
    )
      return;

    try {
      const response = await fetch(
        `/api/admin/bookings?id=${bookingId}&slotId=${slotId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to cancel booking");
      }

      toast.success("Booking cancelled successfully");
      fetchBookings();
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error.message || "Failed to cancel booking");
    }
  };

  const handleDeleteSlot = async (slotId: string, isBooked: boolean) => {
    if (isBooked) {
      toast.error("Cannot delete a booked slot. Cancel the booking first.");
      return;
    }

    if (!confirm("Are you sure you want to delete this time slot?")) return;

    try {
      const response = await fetch(`/api/admin/slots?id=${slotId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete slot");
      }

      toast.success("Time slot deleted");
      fetchSlots();
    } catch (error: any) {
      console.error("Delete slot error:", error);
      toast.error(error.message || "Failed to delete time slot");
    }
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

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate slots");
      }

      toast.success("Time slots generated successfully!");
      if (activeTab === "slots") fetchSlots();
    } catch (error: any) {
      console.error("Generation error:", error);
      toast.error(error.message || "Failed to generate slots");
    } finally {
      setIsGenerating(false);
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

            {loading ? (
              <div className="p-20 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-slate-300 animate-spin" />
                <p className="text-slate-400">Loading bookings...</p>
              </div>
            ) : bookings.length === 0 ? (
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
                      <th className="px-6 py-4">Date & Time</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Notes</th>
                      <th className="px-6 py-4 text-right">Action</th>
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
                              {format(
                                new Date(booking.time_slots.start_time),
                                "MMM d, yyyy",
                              )}
                            </p>
                            <p className="text-slate-500">
                              {format(
                                new Date(booking.time_slots.start_time),
                                "h:mm a",
                              )}{" "}
                              -{" "}
                              {format(
                                new Date(booking.time_slots.end_time),
                                "h:mm a",
                              )}
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
                          {booking.notes ? (
                            <div
                              className="max-w-[200px] truncate text-xs text-slate-500 italic"
                              title={booking.notes}
                            >
                              "{booking.notes}"
                            </div>
                          ) : (
                            <span className="text-slate-300 text-xs">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() =>
                              handleDeleteBooking(booking.id, booking.slot_id)
                            }
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Cancel Booking"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
                    Note: Weekends are automatically skipped by the system.
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-3 text-amber-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <div className="text-xs">
                  <p className="font-bold mb-1">Important Info</p>
                  <p>
                    Generating slots will skip any times that already exist to
                    prevent duplicates.
                  </p>
                </div>
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
                              {format(new Date(slot.start_time), "h:mm a")} -{" "}
                              {format(new Date(slot.end_time), "h:mm a")}
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
    </div>
  );
}
