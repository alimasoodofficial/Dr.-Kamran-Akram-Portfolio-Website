"use client";

import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { format } from "date-fns";
import { formatTimeAEST, formatDateAEST } from "@/lib/timezone";
import { supabase } from "@/lib/supabase";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  Mail,
  FileText,
  CheckCircle,
  Loader2,
  Globe,
} from "lucide-react";

import {
  TimeSlot,
  Booking,
  CreateBookingResponse,
  GetSlotsResponse,
  RealtimeBookingPayload,
} from "@/types/booking";

const COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Argentina",
  "Australia",
  "Austria",
  "Bangladesh",
  "Belgium",
  "Brazil",
  "Canada",
  "Chile",
  "China",
  "Colombia",
  "Czech Republic",
  "Denmark",
  "Egypt",
  "Ethiopia",
  "Finland",
  "France",
  "Germany",
  "Ghana",
  "Greece",
  "Hungary",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Japan",
  "Jordan",
  "Kenya",
  "Kuwait",
  "Lebanon",
  "Libya",
  "Malaysia",
  "Mexico",
  "Morocco",
  "Netherlands",
  "New Zealand",
  "Nigeria",
  "Norway",
  "Oman",
  "Pakistan",
  "Palestine",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Saudi Arabia",
  "Singapore",
  "South Africa",
  "South Korea",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Thailand",
  "Tunisia",
  "Turkey",
  "UAE",
  "United Kingdom",
  "United States",
  "Vietnam",
  "Yemen",
  "Other",
];

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    country: "",
    notes: "",
  });

  // Fetch available slots when date is selected
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    } else {
      setAvailableSlots([]);
      setSelectedSlot(null);
    }
  }, [selectedDate]);

  // Real-time subscription to bookings
  useEffect(() => {
    const channel = supabase
      .channel("bookings-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
        },
        (payload) => {
          console.log("New booking received:", payload);
          if (selectedDate) {
            fetchAvailableSlots(selectedDate);
          }
          toast.success("Booking list updated!", { icon: "🔄" });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedDate]);

  const fetchAvailableSlots = async (date: Date) => {
    setLoading(true);
    try {
      const dateStr = format(date, "yyyy-MM-dd");
      const response = await fetch(`/api/slots?date=${dateStr}`);
      const data = await response.json();

      if (data.success) {
        setAvailableSlots(data.slots);
      } else {
        toast.error("Failed to fetch available slots");
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
      toast.error("An error occurred while fetching slots");
    } finally {
      setLoading(false);
    }
  };

  const handleSlotClick = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setBookingSuccess(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSlot) {
      toast.error("Please select a time slot");
      return;
    }

    if (!formData.userName || !formData.userEmail || !formData.country) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slotId: selectedSlot.id,
          userName: formData.userName,
          userEmail: formData.userEmail,
          country: formData.country,
          notes: formData.notes,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("🎉 Booking confirmed! Check your email for details.");
        setBookingSuccess(true);
        setFormData({
          userName: "",
          userEmail: "",
          country: "",
          notes: "",
        });
        setSelectedSlot(null);

        if (selectedDate) {
          fetchAvailableSlots(selectedDate);
        }
      } else {
        toast.error(data.error || "Failed to create booking");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (dateString: string) => {
    return formatTimeAEST(dateString);
  };

  const formatDate = (dateString: string) => {
    return formatDateAEST(dateString);
  };

  return (
    <div className=" bg-gradient-to-br from-green-100 via-white to-green-50 dark:from-gray-900 dark:via-green-900 dark:to-teal-900">
      <Toaster position="top-center" />

      <div className="max-w-7xl mx-auto py-12 ">
        {/* Australian Timezone Banner */}
        <div className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-4 mb-8 flex items-center gap-3">
          <Clock className="w-5 h-5 text-indigo-600 flex-shrink-0" />
          <p className="text-sm text-indigo-700 dark:text-indigo-300">
            <strong>
              All times are displayed in Australian Eastern Time (AEST/AEDT).
            </strong>{" "}
            Please convert to your local timezone when scheduling.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Calendar & Slots */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Calendar */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="w-6 h-6 text-indigo-600" />
                <h2 className="text-2xl font-bold ">Select a Date</h2>
              </div>

              <div className="calendar-container flex justify-center">
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={{ before: new Date() }}
                  className="border-0"
                  modifiersClassNames={{
                    selected: "bg-indigo-600 text-white rounded-lg",
                    today: "font-bold text-indigo-600",
                  }}
                  classNames={{
                    day: "hover:bg-indigo-100 hover:text-indigo-700 transition-colors rounded-lg",
                  }}
                />
              </div>
            </div>

            {/* Available Slots */}
            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-800"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-2xl font-bold text-gray-800">
                      Available Times
                    </h2>
                  </div>
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                    AEST/AEDT
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  {selectedDate.toLocaleDateString("en-AU", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>

                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                      No available slots for this date
                    </p>
                    <p className="text-gray-400 mt-2">
                      Please select another date
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {availableSlots.map((slot) => (
                      <motion.button
                        key={slot.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSlotClick(slot)}
                        className={`p-4 rounded-xl font-semibold transition-all ${
                          selectedSlot?.id === slot.id
                            ? "bg-indigo-600 text-white shadow-lg"
                            : "bg-gray-50 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                        }`}
                      >
                        {formatTime(slot.start_time)}
                      </motion.button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Right Column - Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-800 h-fit sticky top-8"
          >
            <AnimatePresence mode="wait">
              {bookingSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-12"
                >
                  <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">
                    Booking Confirmed!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    A confirmation email has been sent to your inbox.
                  </p>
                  <button
                    onClick={() => {
                      setBookingSuccess(false);
                      setSelectedDate(undefined);
                    }}
                    className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Book Another Appointment
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Your Information
                  </h2>

                  {selectedSlot && (
                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6">
                      <p className="text-sm text-indigo-600 font-semibold mb-1">
                        Selected Time (Australian Eastern Time)
                      </p>
                      <p className="text-lg font-bold text-indigo-900">
                        {formatDate(selectedSlot.start_time)} at{" "}
                        {formatTime(selectedSlot.start_time)}
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <User className="w-4 h-4" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="userName"
                        value={formData.userName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <Mail className="w-4 h-4" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="userEmail"
                        value={formData.userEmail}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <Globe className="w-4 h-4" />
                        Country *
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      >
                        <option value="" disabled>
                          Select your country
                        </option>
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <FileText className="w-4 h-4" />
                        Notes (Optional)
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                        placeholder="Any specific topics or questions you'd like to discuss..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!selectedSlot || submitting}
                      className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                        !selectedSlot || submitting
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-xl hover:scale-105 cursor-pointer"
                      }`}
                    >
                      {submitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Booking...
                        </span>
                      ) : (
                        "Confirm Booking"
                      )}
                    </button>

                    {!selectedSlot && (
                      <p className="text-center text-sm text-gray-500">
                        Please select a date and time slot to continue
                      </p>
                    )}
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        .rdp {
          --rdp-cell-size: 50px;
          --rdp-accent-color: #4f46e5;
          --rdp-background-color: #eef2ff;
        }

        .rdp-day_selected {
          background-color: #4f46e5 !important;
          color: white !important;
        }

        .rdp-day_today {
          font-weight: bold;
          color: #4f46e5;
        }

        .rdp-day:hover:not(.rdp-day_selected) {
          background-color: #eef2ff;
        }
      `}</style>
    </div>
  );
}
