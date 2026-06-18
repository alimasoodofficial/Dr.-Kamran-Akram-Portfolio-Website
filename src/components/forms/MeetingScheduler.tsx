'use client';

import { useState, useEffect } from "react";
import { format, addMinutes, isSameDay, parse, isAfter, startOfToday, setHours, setMinutes, areIntervalsOverlapping } from "date-fns";
import { Calendar } from "@/components/ui/shadcn/calendar";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import { Textarea } from "@/components/ui/shadcn/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import {
  Clock,
  Video,
  Users,
  CheckCircle2,
  CalendarIcon,
  User,
  ChevronRight,
  ArrowLeft,
  Mail,
  Timer
} from "lucide-react";
import { AvailabilitySlot, BlockedDate, getTimeSlots } from "@/app/actions/availability";
import { createBooking, Booking } from "@/app/actions/bookings";
import { createConsultingCheckoutSession } from "@/app/actions/payments";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const ZoomIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="6" fill="#2D8CFF" />
    <path d="M6 15.5C6 16.328 6.672 17 7.5 17H13.5C14.328 17 15 16.328 15 15.5V10.5C15 9.672 14.328 9 13.5 9H7.5C6.672 9 6 9.672 6 10.5V15.5Z" fill="white" />
    <path d="M16 11.1L18.4 9.3C18.8 9 19.4 9.3 19.4 9.8V14.2C19.4 14.7 18.8 15 18.4 14.7L16 12.9V11.1Z" fill="white" />
  </svg>
);

const GoogleMeetIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 256 211" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g>
      <polygon fill="#00832D" points="144.822496 105.321856 169.778926 133.848796 203.341343 155.294133 209.178931 105.50196 203.341343 56.8331137 169.136495 75.6715889" />
      <path d="M0.000557021739,150.659712 L0.000557021739,193.089915 C0.000557021739,202.77838 7.86384724,210.643527 17.5541688,210.643527 L59.9843714,210.643527 L68.7704609,178.585069 L59.9843714,150.659712 L30.8744153,141.873623 L0.000557021739,150.659712 Z" fill="#0066DA" />
      <polygon fill="#E94235" points="59.9838143 0 0 59.9838143 30.875715 68.7494798 59.9838143 59.9838143 68.6102243 32.4390893" />
      <polygon fill="#2684FC" points="0.000557021739 150.679394 59.9843714 150.679394 59.9843714 59.9832573 0.000557021739 59.9832573" />
      <path d="M241.658683,25.3977775 L203.341157,56.8342278 L203.341157,155.29339 L241.818362,186.852385 C247.577967,191.364261 256.003849,187.251584 256.003849,179.930462 L256.003849,32.1785888 C256.003849,24.7757699 247.377439,20.6835169 241.658683,25.3977775" fill="#00AC47" />
      <path d="M144.822496,105.321856 L144.822496,150.659712 L59.9843714,150.659712 L59.9843714,210.643527 L185.787731,210.643527 C195.478053,210.643527 203.341343,202.77838 203.341343,193.089915 L203.341343,155.294133 L144.822496,105.321856 Z" fill="#00AC47" />
      <path d="M185.787731,0 L59.9843714,0 L59.9843714,59.9838143 L144.822496,59.9838143 L144.822496,105.32167 L203.341343,56.832928 L203.341343,17.5536117 C203.341343,7.86329022 195.478053,0 185.787731,0" fill="#FFBA00" />
    </g>
  </svg>
);

interface MeetingSchedulerProps {
  availability: AvailabilitySlot[];
  blockedDates: BlockedDate[];
  selectedPlan?: { name: string; duration: number } | null;
}

type Step = "info" | "calendar" | "success";

export function MeetingScheduler({ availability, blockedDates, selectedPlan }: MeetingSchedulerProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("info");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    platform: "Zoom" as "Zoom" | "Google Meet",
    duration: 30 as 15 | 30 | 60,
    notes: "",
    acceptedTerms: false,
  });

  const [errors, setErrors] = useState<{ fullName?: string, email?: string, acceptedTerms?: string }>({});

  useEffect(() => {
    if (selectedPlan) {
      setFormData(prev => {
        const cleanedNotes = prev.notes.startsWith("Selected Package:")
          ? prev.notes.split("\n").slice(1).join("\n")
          : prev.notes;

        return {
          ...prev,
          duration: selectedPlan.duration as 15 | 30 | 60,
          notes: `Selected Package: ${selectedPlan.name}\n${cleanedNotes}`.trim()
        };
      });
    }
  }, [selectedPlan]);

  useEffect(() => {
    if (selectedDate) {
      const fetchSlots = async () => {
        setIsLoadingSlots(true);
        const slots = await getTimeSlots(format(selectedDate, "yyyy-MM-dd"), formData.duration);

        const now = new Date();
        const filtered = slots.map(slot => {
          if (isSameDay(selectedDate, now)) {
            const slotTime = parse(slot.start_time, "HH:mm:ss", selectedDate);
            return {
              ...slot,
              isBooked: slot.is_booked || !isAfter(slotTime, addMinutes(now, 30))
            };
          }
          return {
            ...slot,
            isBooked: slot.is_booked
          };
        });

        setAvailableSlots(filtered);
        setIsLoadingSlots(false);
      };
      fetchSlots();
    }
  }, [selectedDate, formData.duration]);

  const handleNextStep = () => {
    const newErrors: { fullName?: string, email?: string, acceptedTerms?: string } = {};
    if (!formData.fullName) {
      newErrors.fullName = "Please provide your full name.";
    }
    if (!formData.email) {
      newErrors.email = "Please provide your email address.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address.";
      }
    }
    if (!formData.acceptedTerms) {
      newErrors.acceptedTerms = "You must accept the Terms and Conditions and Privacy Policy to continue.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast({
        title: "Required Fields",
        description: "Please correct the errors before proceeding.",
        variant: "destructive"
      });
      return;
    }

    setStep("calendar");
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Selection Required",
        description: "Please select both a date and a time slot.",
        variant: "destructive"
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    const packageName = selectedPlan?.name || (formData.duration === 60 ? "Deep-Dive" : formData.duration === 15 ? "Quick Chat" : "Quick-Fire");

    setIsSubmitting(true);
    try {
      if (packageName === "Quick Chat") {
        const result = await createBooking({
          full_name: formData.fullName,
          email: formData.email,
          phone: "",
          message: formData.notes,
          date: format(selectedDate, "yyyy-MM-dd"),
          time_slot: selectedTime,
          platform: formData.platform,
          duration: formData.duration,
          service: "Professional Consultation",
        });

        if (result.success) {
          setStep("success");
        } else {
          toast({
            title: "Booking Failed",
            description: result.error || "Something went wrong.",
            variant: "destructive",
          });
        }
      } else {
        const origin = window.location.origin;
        const result = await createConsultingCheckoutSession({
          fullName: formData.fullName,
          email: formData.email,
          platform: formData.platform,
          duration: formData.duration,
          notes: formData.notes,
          date: format(selectedDate, "yyyy-MM-dd"),
          time_slot: selectedTime,
          packageName,
        }, origin);

        if (result.success && result.url) {
          window.location.href = result.url;
        } else {
          toast({
            title: "Payment Error",
            description: result.error || "Could not initiate payment session.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-12 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl h-full min-h-[500px] flex flex-col items-center justify-center"
      >
        <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-8 shadow-inner">
          <CheckCircle2 className="w-12 h-12 text-primary" />
        </div>
        <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Meeting Scheduled!</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-10 text-lg max-w-md mx-auto font-medium">
          Check your email (<span className="text-slate-900 dark:text-white font-bold">{formData.email}</span>) for the
          <span className="text-primary font-bold"> {formData.platform}</span> invitation link and calendar details.
        </p>
        <Button
          variant="outline"
          className="rounded-2xl px-12 h-16 border-2 font-black uppercase tracking-[0.2em] text-xs hover:bg-primary hover:text-white transition-all dark:text-white dark:hover:bg-primary"
          onClick={() => {
            setStep("info");
            setSelectedDate(undefined);
            setSelectedTime(null);
            setFormData({ fullName: "", email: "", platform: "Zoom", duration: 30, notes: "", acceptedTerms: false });
          }}
        >
          Schedule another meeting
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <AnimatePresence mode="wait">
        {step === "info" ? (
          <motion.div
            key="info"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Sidebar Info */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#022c22] text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
                <h3 className="text-3xl text-white! font-black mb-6 relative z-10">Consultation Details</h3>
                <p className="text-emerald-100 mb-8 font-medium leading-relaxed opacity-80">
                  Start by telling us who you are and how you'd like to meet. We'll find the perfect slot for you in the next step.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl">
                      <Timer className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-emerald-200 opacity-70">Duration</p>
                      <p className="font-bold">Flexible 15/30/60 Mins</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl">
                      <Video className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-emerald-200 opacity-70">Platform</p>
                      <p className="font-bold">Zoom or Google Meet</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-emerald-200 opacity-70">For Queries</p>
                      <p className="font-bold"><a href="mailto:bookingsimkamran@gmail.com">bookingsimkamran@gmail.com</a></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Form */}
            <div className="lg:col-span-8">
              <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                  <User className="text-primary" /> Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest ml-1">Full Name *</label>
                    <Input
                      className={cn(
                        "h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:ring-primary transition-all dark:text-white",
                        errors.fullName && "border-red-500 focus:ring-red-500 focus:border-red-500"
                      )}
                      placeholder="Jane Smith"
                      value={formData.fullName}
                      onChange={(e) => {
                        setFormData({ ...formData, fullName: e.target.value });
                        if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                      }}
                    />
                    {errors.fullName && <p className="text-red-500 text-xs font-bold ml-1">{errors.fullName}</p>}
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest ml-1">Work Email *</label>
                    <Input
                      type="email"
                      className={cn(
                        "h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:ring-primary transition-all dark:text-white",
                        errors.email && "border-red-500 focus:ring-red-500 focus:border-red-500"
                      )}
                      placeholder="jane@company.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: undefined });
                      }}
                    />
                    {errors.email && <p className="text-red-500 text-xs font-bold ml-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8 mb-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest ml-1">Preferred Platform *</label>
                    <Select value={formData.platform} onValueChange={(v: string) => setFormData({ ...formData, platform: v as any })}>
                      <SelectTrigger className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-700 dark:text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700">
                        <SelectItem value="Zoom">
                          <span className="flex items-center gap-3">
                            <ZoomIcon />
                            <span>Zoom Video</span>
                          </span>
                        </SelectItem>
                        <SelectItem value="Google Meet">
                          <span className="flex items-center gap-3">
                            <GoogleMeetIcon />
                            <span>Google Meet</span>
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3 mb-10">
                  <label className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest ml-1">Notes (Optional)</label>
                  <Textarea
                    className="rounded-2xl bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:ring-primary transition-all min-h-[120px] pt-4 dark:text-white"
                    placeholder="Briefly describe your enquiry..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                <div className="space-y-3 mb-10">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-1 w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                      checked={formData.acceptedTerms}
                      onChange={(e) => {
                        setFormData({ ...formData, acceptedTerms: e.target.checked });
                        if (errors.acceptedTerms) setErrors({ ...errors, acceptedTerms: undefined });
                      }}
                    />
                    <label htmlFor="terms" className="text-sm text-slate-600 dark:text-slate-300 leading-tight">
                      I accept the <a href="/terms" target="_blank" className="text-primary hover:underline font-bold">Terms and Conditions</a> and <a href="/privacy" target="_blank" className="text-primary hover:underline font-bold">Privacy Policy</a>.
                    </label>
                  </div>
                  {errors.acceptedTerms && <p className="text-red-500 text-xs font-bold ml-1">{errors.acceptedTerms}</p>}
                </div>

                <Button
                  onClick={handleNextStep}
                  className="w-full h-16 rounded-[1.25rem] bg-primary hover:bg-[#064e3b] text-white font-black uppercase tracking-[0.2em] text-sm transition-all shadow-xl shadow-primary/20"
                >
                  Pick a Time Slot <CalendarIcon className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {/* Header / Back */}
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <button
                onClick={() => setStep("info")}
                className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to details
              </button>
              <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-500">
                  <Mail className="w-4 h-4 text-primary" /> {formData.email}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <Timer className="w-4 h-4 text-primary" /> {formData.duration} mins
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Calendar Card */}
              <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl h-fit">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl">
                    <CalendarIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Select Date</h3>
                </div>

                <Calendar
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setSelectedTime(null);
                  }}
                  className="w-full dark:text-white dark:bg-slate-950"
                  disabled={(date) => {
                    if (date < startOfToday()) return true;

                    // Check if date has an override in blockedDates
                    const block = blockedDates.find(bd => isSameDay(new Date(bd.date), date));
                    if (block && (!block.reason || !block.reason.startsWith("CUSTOM:"))) {
                      return true; // Date is marked off/unavailable
                    }

                    // A date is enabled if either its weekly weekday is enabled OR it has a custom hours override
                    const hasWeekly = availability.some(a => a.day_of_week === date.getDay() && a.is_enabled);
                    const hasCustom = !!(block && block.reason && block.reason.startsWith("CUSTOM:"));

                    return !hasWeekly && !hasCustom;
                  }}
                />
              </div>

              {/* Slots Card */}
              <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Available Slots</h3>
                </div>

                {selectedDate ? (
                  <div className="space-y-6">
                    {isLoadingSlots ? (
                      <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Slots...</p>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {availableSlots.map((slot) => (
                            <button
                              key={slot.id}
                              disabled={slot.isBooked}
                              onClick={() => setSelectedTime(slot.start_time.slice(0, 5))}
                              className={cn(
                                "h-14 rounded-2xl text-sm font-black tracking-widest border-2 transition-all duration-300 relative group overflow-hidden",
                                selectedTime === slot.start_time.slice(0, 5)
                                  ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                                  : slot.isBooked
                                    ? "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-60"
                                    : "border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-primary/30 hover:bg-primary/5"
                              )}
                            >
                              {slot.start_time.slice(0, 5)}
                              {slot.isBooked && (
                                <span className="absolute inset-0 flex items-center justify-center bg-red-50/50 backdrop-blur-[1px]">
                                  <span className="text-[9px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter shadow-sm border border-red-200">Booked</span>
                                </span>
                              )}
                            </button>
                          ))}
                        </div>

                        {availableSlots.length === 0 && (
                          <div className="text-center py-20 bg-slate-50 dark:bg-slate-800 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
                            <p className="text-sm font-bold text-slate-400">No availability found for this day.</p>
                          </div>
                        )}

                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                          <Button
                            onClick={handleBooking}
                            disabled={isSubmitting || !selectedDate || !selectedTime}
                            className={cn(
                              "w-full h-16 rounded-[1.25rem] font-black uppercase tracking-[0.2em] text-sm transition-all duration-500 shadow-xl",
                              (!selectedDate || !selectedTime)
                                ? "bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed"
                                : "bg-primary hover:bg-[#064e3b] text-white shadow-primary/20"
                            )}
                          >
                            {isSubmitting ? "Finalizing..." : "Confirm My Meeting"}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center border border-slate-100 dark:border-slate-700">
                      <CalendarIcon className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-slate-400 font-bold max-w-[200px]">Please select a date on the calendar to view available times.</p>
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
