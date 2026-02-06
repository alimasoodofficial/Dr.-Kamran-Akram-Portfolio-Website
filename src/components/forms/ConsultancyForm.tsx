"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type FormInputs = {
  name: string;
  email: string;
  phone: string;
  message: string;
  date: Date;
  time: string;
  timezone: string;
};

export default function ConsultancyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormInputs>({
    defaultValues: {
      timezone:
        typeof Intl !== "undefined"
          ? Intl.DateTimeFormat().resolvedOptions().timeZone
          : "UTC",
    },
  });

  const [timezones, setTimezones] = useState<string[]>([]);

  useEffect(() => {
    if (typeof Intl !== "undefined") {
      setTimezones(Intl.supportedValuesOf("timeZone"));
    }
  }, []);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Disable weekends
  const isDateAvailable = (date: Date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  // 🗓️ Fetch available slots when date changes
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedDate) return;

      const formattedDate = selectedDate.toISOString().split("T")[0];
      const res = await fetch(`/api/availability?date=${formattedDate}`);
      const data = await res.json();

      setAvailableTimes(data.availableTimes || []);
    };

    fetchAvailability();
  }, [selectedDate]);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setLoading(true);
    setSuccess(false);

    const payload = {
      ...data,
      date: selectedDate ? selectedDate.toISOString() : null,
    };

    console.log("📤 Sending to API:", payload);

    const response = await fetch("/api/book-consultation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (response.ok) {
      setSuccess(true);
      reset();
      setSelectedDate(null);
    } else {
      const error = await response.json();
      alert(`❌ Error: ${error.error || "Failed to book"}`);
    }
  };

  return (
    <section className="w-full bg-white dark:bg-[#0b0c12] py-16 px-4">
      <div className="max-w-2xl mx-auto bg-gray-50 dark:bg-[#12121a] shadow-xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl font-heading font-bold text-center mb-8">
          Book a Consultation
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              {...register("name", { required: "Name is required" })}
              type="text"
              placeholder="John Doe"
              className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
              })}
              type="email"
              placeholder="you@example.com"
              className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              {...register("phone", {
                required: "Phone number is required",
                minLength: { value: 10, message: "Invalid phone number" },
              })}
              type="tel"
              placeholder="+1 234 567 890"
              className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Select Date
            </label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              filterDate={isDateAvailable}
              placeholderText="Click to open calendar"
              className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
              minDate={new Date()}
              dateFormat="MMMM d, yyyy"
            />
          </div>

          {/* Time Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Select Time
            </label>
            <select
              {...register("time", { required: "Please select a time" })}
              disabled={!availableTimes.length}
              className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none disabled:opacity-50"
              defaultValue=""
            >
              <option value="" disabled>
                {availableTimes.length
                  ? "Choose a time slot"
                  : "No available slots for this day"}
              </option>
              {availableTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {errors.time && (
              <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>
            )}
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-sm font-medium mb-1">Timezone</label>
            <select
              {...register("timezone", {
                required: "Please select a timezone",
              })}
              className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="" disabled>
                Choose a timezone
              </option>
              {timezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz.replace(/_/g, " ")}
                </option>
              ))}
            </select>
            {errors.timezone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.timezone.message}
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              {...register("message")}
              rows={4}
              placeholder="Tell us about your concerns..."
              className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          {/* Success Message */}
          {success && (
            <p className="text-green-600 text-center font-medium">
              ✅ Your consultation has been booked successfully!
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-transform duration-300 hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? "Booking..." : "Book Consultation"}
          </button>
        </form>
      </div>
    </section>
  );
}
