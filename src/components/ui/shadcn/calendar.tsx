'use client';

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { isSameDay, startOfToday } from "date-fns";

export interface CalendarProps {
  className?: string;
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
}

export function Calendar({
  className,
  selected,
  onSelect,
  disabled,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(() => {
    return selected || new Date();
  });

  const today = startOfToday();

  // Get start of the month
  const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  // Get day of the week the month starts on (0 = Sunday, ..., 6 = Saturday)
  const startDayOfWeek = startOfMonth.getDay();
  // Get number of days in current month
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const days: (Date | null)[] = [];
  // Fill empty days for previous month padding
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }
  // Fill days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
  }

  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className={cn("p-4 w-full bg-white dark:bg-slate-900", className)}>
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
          {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
        </h4>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-100 dark:border-slate-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-100 dark:border-slate-800"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekdays Header */}
      <div className="grid grid-cols-7 gap-y-2 mb-4">
        {weekdays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-y-2">
        {days.map((date, idx) => {
          if (!date) {
            return <div key={`empty-${idx}`} />;
          }

          const isSelected = selected ? isSameDay(date, selected) : false;
          const isTodayDate = isSameDay(date, today);
          const isDisabled = disabled ? disabled(date) : false;

          return (
            <div key={date.toISOString()} className="flex justify-center">
              <button
                type="button"
                disabled={isDisabled}
                onClick={() => onSelect && onSelect(date)}
                className={cn(
                  "w-10 h-10 rounded-full font-bold text-sm flex items-center justify-center transition-all duration-200 relative",
                  isSelected
                    ? "bg-[#059669] text-white shadow-lg shadow-emerald-500/20 scale-105 font-black"
                    : isTodayDate
                    ? "border-2 border-[#059669] text-[#059669] font-black"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800",
                  isDisabled &&
                    "text-slate-300 dark:text-slate-700 cursor-not-allowed hover:bg-transparent dark:hover:bg-transparent opacity-40 line-through"
                )}
              >
                {date.getDate()}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
Calendar.displayName = "Calendar";
