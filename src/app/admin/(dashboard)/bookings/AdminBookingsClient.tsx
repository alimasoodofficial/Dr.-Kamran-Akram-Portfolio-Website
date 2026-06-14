"use client";

import { useState, useMemo } from "react";
import { format, parse, isSameDay, isAfter, addMinutes } from "date-fns";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/shadcn/card";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/shadcn/tabs";
import { Badge } from "@/components/ui/shadcn/badge";
import { Switch } from "@/components/ui/shadcn/switch";
import { Calendar } from "@/components/ui/shadcn/calendar";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  Users, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  XCircle,
  MoreVertical,
  Check,
  X,
  Download,
  Search,
  SlidersHorizontal,
  Filter
} from "lucide-react";
import { Booking, updateBookingStatus, deleteBooking, updateBooking, createBooking } from "@/app/actions/bookings";
import { AvailabilitySlot, BlockedDate, updateAvailability, addBlockedDate, removeBlockedDate, getTimeSlots, saveDateOverride } from "@/app/actions/availability";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/shadcn/dialog";
import { Label } from "@/components/ui/shadcn/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/shadcn/select";

interface Props {
  initialBookings: Booking[];
  initialAvailability: AvailabilitySlot[];
  initialBlockedDates: BlockedDate[];
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const generateSlotsForRange = (start: string, end: string): string[] => {
  const slots: string[] = [];
  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);
  
  let currentH = startH;
  let currentM = startM;
  
  while (currentH < endH || (currentH === endH && currentM < endM)) {
    const formatted = `${String(currentH).padStart(2, "0")}:${String(currentM).padStart(2, "0")}`;
    slots.push(formatted);
    
    currentM += 30;
    if (currentM >= 60) {
      currentH += 1;
      currentM -= 60;
    }
  }
  return slots;
};

export default function AdminBookingsClient({ initialBookings, initialAvailability, initialBlockedDates }: Props) {
  const { toast } = useToast();
  const [bookings, setBookings] = useState(initialBookings);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>(() => {
    const base = [...initialAvailability];
    for (let i = 0; i < 7; i++) {
      if (!base.find(a => a.day_of_week === i)) {
        base.push({
          id: `new-${i}`,
          day_of_week: i,
          start_time: "09:00",
          end_time: "17:00",
          is_enabled: false
        });
      }
    }
    return base.sort((a, b) => a.day_of_week - b.day_of_week);
  });
  const [blockedDates, setBlockedDates] = useState(initialBlockedDates);
  const [selectedBlockedDate, setSelectedBlockedDate] = useState<Date | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [newBookingDate, setNewBookingDate] = useState<Date | undefined>(new Date());
  
  // Custom date overrides state
  const [overrideType, setOverrideType] = useState<"standard" | "off" | "custom" >("standard");
  const [customRanges, setCustomRanges] = useState<{ start: string; end: string }[]>([{ start: "09:00", end: "17:00" }]);
  const [blockedSlots, setBlockedSlots] = useState<string[]>([]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPlatform, setFilterPlatform] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Statistics for Enterprise Analytics cards
  const stats = useMemo(() => {
    const total = bookings.length;
    const confirmed = bookings.filter(b => b.status === "confirmed").length;
    const pending = bookings.filter(b => b.status === "pending").length;
    const cancelled = bookings.filter(b => b.status === "cancelled").length;
    return { total, confirmed, pending, cancelled };
  }, [bookings]);

  // Filtered Bookings Memoized list
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const matchesSearch = 
        booking.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (booking.message && booking.message.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = filterStatus === "all" || booking.status === filterStatus;
      
      const platformLower = booking.platform ? booking.platform.toLowerCase() : "";
      const matchesPlatform = 
        filterPlatform === "all" || 
        (filterPlatform === "zoom" && platformLower.includes("zoom")) ||
        (filterPlatform === "meet" && (platformLower.includes("meet") || platformLower.includes("google")));

      let matchesDate = true;
      if (startDate) {
        matchesDate = matchesDate && booking.date >= startDate;
      }
      if (endDate) {
        matchesDate = matchesDate && booking.date <= endDate;
      }

      return matchesSearch && matchesStatus && matchesPlatform && matchesDate;
    });
  }, [bookings, searchQuery, filterStatus, filterPlatform, startDate, endDate]);

  // Download CSV Handler
  const downloadCSV = () => {
    const headers = ["ID", "Client Name", "Email", "Date", "Time Slot", "Platform", "Duration (mins)", "Status", "Notes/Message", "Created At"];
    
    const csvRows = [
      headers.join(","),
      ...filteredBookings.map(b => [
        `"${b.id}"`,
        `"${(b.full_name || "").replace(/"/g, '""')}"`,
        `"${(b.email || "").replace(/"/g, '""')}"`,
        `"${b.date}"`,
        `"${b.time_slot}"`,
        `"${b.platform}"`,
        b.duration,
        `"${b.status}"`,
        `"${(b.message || "").replace(/"/g, '""').replace(/\n/g, ' ')}"`,
        `"${b.created_at}"`
      ].join(","))
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `bookings_export_${format(new Date(), "yyyy-MM-dd_HHmmss")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "CSV Export Successful",
      description: `Downloaded ${filteredBookings.length} booking records based on active filters.`
    });
  };

  // Download JSON Handler
  const downloadJSON = () => {
    const dataStr = JSON.stringify(filteredBookings, null, 2);
    const blob = new Blob([dataStr], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `bookings_export_${format(new Date(), "yyyy-MM-dd_HHmmss")}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "JSON Export Successful",
      description: `Downloaded ${filteredBookings.length} booking records based on active filters.`
    });
  };

  // Clear Filters Handler
  const clearFilters = () => {
    setSearchQuery("");
    setFilterStatus("all");
    setFilterPlatform("all");
    setStartDate("");
    setEndDate("");
  };


  const allPotentialSlots = useMemo(() => {
    if (!selectedBlockedDate) return [];
    if (overrideType === "off") return [];

    if (overrideType === "custom") {
      const slots: string[] = [];
      for (const range of customRanges) {
        if (range.start && range.end) {
          slots.push(...generateSlotsForRange(range.start, range.end));
        }
      }
      return Array.from(new Set(slots)).sort();
    }

    // standard weekly hours fallback
    const dayOfWeek = selectedBlockedDate.getDay();
    const standardSlot = availability.find(a => a.day_of_week === dayOfWeek);
    if (!standardSlot || !standardSlot.is_enabled) return [];
    
    const startStr = standardSlot.start_time.substring(0, 5);
    const endStr = standardSlot.end_time.substring(0, 5);
    return generateSlotsForRange(startStr, endStr);
  }, [selectedBlockedDate, overrideType, customRanges, availability]);

  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [newBookingData, setNewBookingData] = useState({
    fullName: "",
    email: "",
    platform: "Zoom" as "Zoom" | "Google Meet",
    duration: 30 as 15 | 30 | 60,
    timeSlot: "",
    notes: ""
  });

  const handleStatusUpdate = async (id: string, status: string) => {
    const result = await updateBookingStatus(id, status);
    if (result.success) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: status as any } : b));
      toast({ title: "Status updated" });
    }
  };

  const fetchSlotsForManualBooking = async (date: Date, duration: number) => {
    setIsLoadingSlots(true);
    const dateStr = format(date, "yyyy-MM-dd");
    const slots = await getTimeSlots(dateStr, duration);
    
    const now = new Date();
    const filtered = slots.map(slot => ({
      ...slot,
      isBooked: slot.is_booked || (isSameDay(date, now) && !isAfter(parse(slot.start_time, "HH:mm:ss", date), addMinutes(now, 30)))
    }));
    
    setAvailableSlots(filtered);
    setIsLoadingSlots(false);
  };

  const handleEditClick = (booking: Booking) => {
    setEditingBookingId(booking.id);
    const dateObj = new Date(booking.date);
    setNewBookingDate(dateObj);
    setNewBookingData({
      fullName: booking.full_name,
      email: booking.email,
      platform: booking.platform as any,
      duration: booking.duration,
      timeSlot: booking.time_slot,
      notes: booking.message || ""
    });
    fetchSlotsForManualBooking(dateObj, booking.duration);
    setIsCreateDialogOpen(true);
  };

  const resetManualBookingForm = () => {
    setEditingBookingId(null);
    setNewBookingData({
      fullName: "",
      email: "",
      platform: "Zoom",
      duration: 30,
      timeSlot: "",
      notes: ""
    });
    setNewBookingDate(new Date());
    setAvailableSlots([]);
  };

  const handleManualBooking = async () => {
    if (!newBookingDate || !newBookingData.timeSlot || !newBookingData.fullName || !newBookingData.email) {
      toast({ title: "Missing fields", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    
    if (editingBookingId) {
      const result = await updateBooking(editingBookingId, {
        full_name: newBookingData.fullName,
        email: newBookingData.email,
        message: newBookingData.notes,
        date: format(newBookingDate, "yyyy-MM-dd"),
        time_slot: newBookingData.timeSlot,
        platform: newBookingData.platform as any,
        duration: newBookingData.duration,
      });

      if (result.success) {
        toast({ title: "Booking updated successfully" });
        setIsCreateDialogOpen(false);
        window.location.reload();
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    } else {
      const result = await createBooking({
        full_name: newBookingData.fullName,
        email: newBookingData.email,
        phone: "",
        message: newBookingData.notes,
        date: format(newBookingDate, "yyyy-MM-dd"),
        time_slot: newBookingData.timeSlot,
        platform: newBookingData.platform as any,
        duration: newBookingData.duration,
        service: "Manual Admin Booking",
      });

      if (result.success) {
        toast({ title: "Booking created successfully" });
        setIsCreateDialogOpen(false);
        window.location.reload();
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    const result = await deleteBooking(id);
    if (result.success) {
      setBookings(prev => prev.filter(b => b.id !== id));
      toast({ title: "Booking deleted" });
    }
  };

  const handleAvailabilityToggle = (dayOfWeek: number, enabled: boolean) => {
    setAvailability(prev => prev.map(a => a.day_of_week === dayOfWeek ? { ...a, is_enabled: enabled } : a));
  };

  const handleTimeChange = (dayOfWeek: number, field: "start_time" | "end_time", value: string) => {
    setAvailability(prev => prev.map(a => a.day_of_week === dayOfWeek ? { ...a, [field]: value } : a));
  };

  const saveAvailability = async () => {
    setIsSaving(true);
    const slotsToSave = availability.map(({ id, ...rest }) => 
      String(id).startsWith('new-') ? rest : { id, ...rest }
    );
    
    const result = await updateAvailability(slotsToSave as any);
    if (result.success) {
      toast({ title: "Availability saved successfully" });
    } else {
      toast({ 
        title: "Error saving", 
        description: result.error || "Please check the logs.",
        variant: "destructive" 
      });
    }
    setIsSaving(false);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedBlockedDate(date);
    if (!date) {
      setOverrideType("standard");
      return;
    }
    const dateStr = format(date, "yyyy-MM-dd");
    const existing = blockedDates.find(bd => bd.date === dateStr);
    if (existing) {
      // 1. Extract blocked slots
      const blockedMatch = existing.reason.match(/BLOCKED:([^;]+)/);
      if (blockedMatch) {
        setBlockedSlots(blockedMatch[1].split(","));
      } else {
        setBlockedSlots([]);
      }

      // 2. Set override settings
      if (existing.reason.startsWith("CUSTOM:") || existing.reason.includes("CUSTOM:")) {
        setOverrideType("custom");
        const customMatch = existing.reason.match(/CUSTOM:([^;]+)/);
        const rangesPart = customMatch ? customMatch[1] : "";
        const parsed = rangesPart.split(",").map(r => {
          const [start, end] = r.split("-");
          return { start: start || "09:00", end: end || "17:00" };
        });
        setCustomRanges(parsed.length > 0 ? parsed : [{ start: "09:00", end: "17:00" }]);
      } else if (existing.reason === "OFF") {
        setOverrideType("off");
        setCustomRanges([{ start: "09:00", end: "17:00" }]);
      } else if (existing.reason.startsWith("WEEKLY") || existing.reason.includes("WEEKLY")) {
        setOverrideType("standard");
        setCustomRanges([{ start: "09:00", end: "17:00" }]);
      } else {
        setOverrideType("standard");
        setCustomRanges([{ start: "09:00", end: "17:00" }]);
      }
    } else {
      setOverrideType("standard");
      setCustomRanges([{ start: "09:00", end: "17:00" }]);
      setBlockedSlots([]);
    }
  };

  const handleSaveDateOverride = async () => {
    if (!selectedBlockedDate) return;
    setIsSaving(true);
    const dateStr = format(selectedBlockedDate, "yyyy-MM-dd");
    const rangesStr = customRanges.map(r => `${r.start}-${r.end}`).join(",");
    const blockedSlotsStr = blockedSlots.length > 0 ? blockedSlots.join(",") : undefined;
    const result = await saveDateOverride(dateStr, overrideType, rangesStr, blockedSlotsStr);
    
    if (result.success) {
      toast({ title: "Date schedule updated successfully" });
      
      // Update local state blockedDates
      if (overrideType === "standard" && !blockedSlotsStr) {
        setBlockedDates(prev => prev.filter(bd => bd.date !== dateStr));
      } else {
        let reason = "OFF";
        if (overrideType === "custom") {
          reason = `CUSTOM:${rangesStr}`;
          if (blockedSlotsStr) reason += `;BLOCKED:${blockedSlotsStr}`;
        } else if (overrideType === "standard") {
          reason = `WEEKLY;BLOCKED:${blockedSlotsStr}`;
        }
        setBlockedDates(prev => {
          const filtered = prev.filter(bd => bd.date !== dateStr);
          return [...filtered, { id: Math.random().toString(), date: dateStr, reason }];
        });
      }
    } else {
      toast({ 
        title: "Error saving schedule", 
        description: result.error || "Could not save the schedule.", 
        variant: "destructive" 
      });
    }
    setIsSaving(false);
  };

  const handleRemoveBlockedDate = async (id: string) => {
    const result = await removeBlockedDate(id);
    if (result.success) {
      setBlockedDates(prev => prev.filter(bd => bd.id !== id));
      toast({ title: "Override removed" });
    }
  };

  return (
    <div className="space-y-10 p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Schedule <span className="text-primary">Management</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Manage your incoming consultations and set your availability.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetManualBookingForm} className="rounded-xl h-14 px-8 bg-primary hover:bg-[#064e3b] shadow-lg shadow-primary/20 font-black uppercase tracking-widest text-xs transition-all text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Manual Booking
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl rounded-[2.5rem] p-10 border-none shadow-2xl overflow-hidden dark:bg-slate-900">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
              
              <DialogHeader className="relative z-10">
                <DialogTitle className="text-3xl font-black text-slate-900 dark:text-white">{editingBookingId ? "Edit" : "Manual"} <span className="text-primary">Booking</span></DialogTitle>
                <DialogDescription className="font-medium text-slate-500 dark:text-slate-400">{editingBookingId ? "Modify the existing" : "Add a"} consultation directly to your schedule.</DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 relative z-10">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Client Name</Label>
                  <Input 
                    placeholder="Jane Doe" 
                    className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:ring-primary transition-all dark:text-white"
                    value={newBookingData.fullName}
                    onChange={(e) => setNewBookingData({...newBookingData, fullName: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Client Email</Label>
                  <Input 
                    type="email" 
                    placeholder="jane@example.com" 
                    className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:ring-primary transition-all dark:text-white"
                    value={newBookingData.email}
                    onChange={(e) => setNewBookingData({...newBookingData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Platform</Label>
                  <Select 
                    value={newBookingData.platform} 
                    onValueChange={(v: any) => setNewBookingData({...newBookingData, platform: v})}
                  >
                    <SelectTrigger className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Zoom">Zoom Video</SelectItem>
                      <SelectItem value="Google Meet">Google Meet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Duration</Label>
                  <Select 
                    value={newBookingData.duration.toString()} 
                    onValueChange={(v: any) => {
                      const dur = parseInt(v);
                      setNewBookingData({...newBookingData, duration: dur as any});
                      if (newBookingDate) fetchSlotsForManualBooking(newBookingDate, dur);
                    }}
                  >
                    <SelectTrigger className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="15">15 Minutes</SelectItem>
                      <SelectItem value="30">30 Minutes</SelectItem>
                      <SelectItem value="60">60 Minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Select Date</Label>
                    <div className="p-4 border border-slate-100 dark:border-slate-700 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800 flex justify-center">
                      <Calendar
                        selected={newBookingDate}
                        onSelect={(date) => {
                          setNewBookingDate(date);
                          if (date) fetchSlotsForManualBooking(date, newBookingData.duration);
                        }}
                        className="rounded-xl dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Available Times</Label>
                    <div className="h-[280px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                      {isLoadingSlots ? (
                         <div className="flex flex-col items-center justify-center h-full space-y-3">
                           <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Slots...</p>
                         </div>
                      ) : availableSlots.length > 0 ? (
                        <div className="grid grid-cols-1 gap-2">
                          {availableSlots.map((slot) => (
                            <button
                              key={slot.id}
                              disabled={slot.isBooked}
                              type="button"
                              onClick={() => setNewBookingData({...newBookingData, timeSlot: slot.start_time.slice(0, 5)})}
                              className={cn(
                                "w-full p-4 rounded-xl text-sm font-black tracking-widest border-2 transition-all text-left flex justify-between items-center group relative overflow-hidden",
                                newBookingData.timeSlot === slot.start_time.slice(0, 5)
                                  ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                                  : slot.isBooked
                                    ? "bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 border-slate-100 dark:border-slate-700 cursor-not-allowed opacity-50"
                                    : "bg-white dark:bg-slate-900 border-slate-50 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-primary/30 hover:bg-primary/5"
                              )}
                            >
                              <span>{slot.start_time.slice(0, 5)}</span>
                              {slot.isBooked && (
                                <span className="text-[8px] bg-slate-100 dark:bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full uppercase tracking-tighter">Reserved</span>
                              )}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                          <Clock className="w-8 h-8 text-slate-200 mb-2" />
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">Select a date to view<br/>available slots</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 relative z-10">
                <Button variant="ghost" onClick={() => setIsCreateDialogOpen(false)} className="rounded-xl font-bold text-slate-400 hover:text-slate-600">Cancel</Button>
                <Button 
                  onClick={handleManualBooking} 
                  disabled={isSaving || !newBookingData.timeSlot}
                  className="rounded-xl bg-[#022c22] text-white hover:bg-[#064e3b] px-10 h-14 font-black uppercase tracking-widest text-xs shadow-xl transition-all"
                >
                  {isSaving ? "Creating..." : "Confirm Booking"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="bookings" className="w-full">
        <TabsList className="bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm mb-8 h-auto">
          <TabsTrigger value="bookings" className="rounded-xl px-8 py-3 font-black uppercase tracking-widest text-xs data-[state=active]:bg-primary data-[state=active]:text-white transition-all dark:text-slate-400">
            Client Bookings
          </TabsTrigger>
          <TabsTrigger value="availability" className="rounded-xl px-8 py-3 font-black uppercase tracking-widest text-xs data-[state=active]:bg-primary data-[state=active]:text-white transition-all dark:text-slate-400">
            Availability Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-6">
          {/* KPI Analytics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-none shadow-md bg-white dark:bg-slate-900 rounded-2xl overflow-hidden p-6 flex items-center justify-between group hover:shadow-lg transition-all duration-300 border-l-4 border-l-slate-400">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Bookings</p>
                <h3 className="text-3xl font-black text-slate-950 dark:text-white mt-1">{stats.total}</h3>
              </div>
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <Users className="w-6 h-6 text-slate-500" />
              </div>
            </Card>
            
            <Card className="border-none shadow-md bg-white dark:bg-slate-900 rounded-2xl overflow-hidden p-6 flex items-center justify-between group hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Confirmed</p>
                <h3 className="text-3xl font-black text-primary mt-1">{stats.confirmed}</h3>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
            </Card>

            <Card className="border-none shadow-md bg-white dark:bg-slate-900 rounded-2xl overflow-hidden p-6 flex items-center justify-between group hover:shadow-lg transition-all duration-300 border-l-4 border-l-amber-500">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Pending</p>
                <h3 className="text-3xl font-black text-amber-500 mt-1">{stats.pending}</h3>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-xl">
                <Clock className="w-6 h-6 text-amber-500" />
              </div>
            </Card>

            <Card className="border-none shadow-md bg-white dark:bg-slate-900 rounded-2xl overflow-hidden p-6 flex items-center justify-between group hover:shadow-lg transition-all duration-300 border-l-4 border-l-red-500">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Cancelled</p>
                <h3 className="text-3xl font-black text-red-500 mt-1">{stats.cancelled}</h3>
              </div>
              <div className="p-3 bg-red-500/10 rounded-xl">
                <XCircle className="w-6 h-6 text-red-500" />
              </div>
            </Card>
          </div>

          {/* Search & Filter Panel */}
          <Card className="border-none shadow-md bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-8 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Filters & Actions
                </h2>
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  onClick={downloadCSV}
                  disabled={filteredBookings.length === 0}
                  className="rounded-xl h-11 px-4 bg-slate-50 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white text-xs font-black uppercase tracking-wider flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </Button>
                <Button 
                  onClick={downloadJSON}
                  disabled={filteredBookings.length === 0}
                  className="rounded-xl h-11 px-4 bg-slate-50 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white text-xs font-black uppercase tracking-wider flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export JSON
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Search client</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    placeholder="Name, email, message..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-11 pl-9 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Status filter */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Platform Filter */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Type / Platform</label>
                <Select value={filterPlatform} onValueChange={setFilterPlatform}>
                  <SelectTrigger className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="zoom">Zoom</SelectItem>
                    <SelectItem value="meet">Google Meet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Start Date</label>
                <Input 
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 dark:text-white"
                />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">End Date</label>
                <Input 
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 dark:text-white"
                />
              </div>
            </div>

            {(searchQuery || filterStatus !== "all" || filterPlatform !== "all" || startDate || endDate) && (
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-3 px-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Showing <span className="text-primary font-black">{filteredBookings.length}</span> results out of <span className="font-bold">{bookings.length}</span> total
                </p>
                <Button 
                  onClick={clearFilters}
                  variant="ghost" 
                  className="h-8 rounded-lg text-xs font-black uppercase tracking-wider text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <X className="w-3.5 h-3.5 mr-1" />
                  Clear Filters
                </Button>
              </div>
            )}
          </Card>

          {/* Bookings View: Enterprise Grid/Table on Desktop, Cards on Mobile */}
          <div className="space-y-4">
            {filteredBookings.length > 0 ? (
              <>
                {/* Desktop Enterprise Table View */}
                <div className="hidden lg:block bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                        <th className="p-6">Client</th>
                        <th className="p-6">Appointment</th>
                        <th className="p-6">Duration & Platform</th>
                        <th className="p-6">Status</th>
                        <th className="p-6">Client Message</th>
                        <th className="p-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {filteredBookings.map((booking) => {
                        const clientInitials = booking.full_name
                          ? booking.full_name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()
                          : "C";
                        return (
                          <tr key={booking.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all duration-150">
                            {/* Client Column */}
                            <td className="p-6">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm tracking-wider">
                                  {clientInitials}
                                </div>
                                <div>
                                  <h4 className="text-sm font-black text-slate-900 dark:text-white">{booking.full_name}</h4>
                                  <p className="text-xs text-slate-400 mt-0.5 font-medium">{booking.email}</p>
                                </div>
                              </div>
                            </td>
                            {/* Appointment Column */}
                            <td className="p-6">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-xs font-black text-slate-900 dark:text-white">
                                  <CalendarIcon className="w-3.5 h-3.5 text-primary" />
                                  <span>{format(new Date(booking.date), "MMM d, yyyy")}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{booking.time_slot} (AEDT)</span>
                                </div>
                              </div>
                            </td>
                            {/* Duration & Platform */}
                            <td className="p-6">
                              <div className="flex flex-wrap gap-1.5">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary">
                                  <Clock className="w-3 h-3" />
                                  {booking.duration} Min
                                </span>
                                <span className={cn(
                                  "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                                  booking.platform?.toLowerCase().includes("zoom")
                                    ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                                    : "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400"
                                )}>
                                  <Video className="w-3 h-3" />
                                  {booking.platform}
                                </span>
                              </div>
                            </td>
                            {/* Status */}
                            <td className="p-6">
                              <Badge 
                                variant={booking.status === "confirmed" ? "default" : booking.status === "cancelled" ? "destructive" : "secondary"} 
                                className="rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-wider"
                              >
                                {booking.status}
                              </Badge>
                            </td>
                            {/* Message / Notes */}
                            <td className="p-6 max-w-xs">
                              {booking.message ? (
                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed" title={booking.message}>
                                  "{booking.message}"
                                </p>
                              ) : (
                                <span className="text-xs text-slate-300 dark:text-slate-600 italic">No message</span>
                              )}
                            </td>
                            {/* Actions */}
                            <td className="p-6 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                                    <MoreVertical className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 rounded-xl p-1.5 dark:bg-slate-900 dark:border-slate-700">
                                  <DropdownMenuItem onClick={() => handleStatusUpdate(booking.id, "confirmed")} className="rounded-lg p-2.5 font-bold text-xs uppercase tracking-widest text-primary cursor-pointer">
                                    <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Confirmed
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusUpdate(booking.id, "cancelled")} className="rounded-lg p-2.5 font-bold text-xs uppercase tracking-widest text-amber-600 cursor-pointer">
                                    <XCircle className="w-4 h-4 mr-2" /> Mark Cancelled
                                  </DropdownMenuItem>
                                  <div className="h-px bg-slate-100 dark:bg-slate-800 my-1.5" />
                                  <DropdownMenuItem onClick={() => handleEditClick(booking)} className="rounded-lg p-2.5 font-bold text-xs uppercase tracking-widest text-slate-600 dark:text-slate-300 cursor-pointer">
                                    <Plus className="w-4 h-4 mr-2" /> Edit Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDelete(booking.id)} className="rounded-lg p-2.5 font-bold text-xs uppercase tracking-widest text-red-600 cursor-pointer">
                                    <Trash2 className="w-4 h-4 mr-2" /> Delete Booking
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Responsive Cards (Visible on smaller screens) */}
                <div className="grid grid-cols-1 gap-4 lg:hidden">
                  {filteredBookings.map((booking) => (
                    <Card key={booking.id} className="border-none shadow-md bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm tracking-wider">
                              {booking.full_name ? booking.full_name[0].toUpperCase() : "C"}
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-slate-900 dark:text-white">{booking.full_name}</h4>
                              <p className="text-xs text-slate-400 font-medium">{booking.email}</p>
                            </div>
                          </div>
                          <Badge 
                            variant={booking.status === "confirmed" ? "default" : booking.status === "cancelled" ? "destructive" : "secondary"} 
                            className="rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-wider"
                          >
                            {booking.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                          <div>
                            <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400">Date</span>
                            <span className="text-xs font-bold text-slate-850 dark:text-slate-200">
                              {format(new Date(booking.date), "MMM d, yyyy")}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400">Time</span>
                            <span className="text-xs font-bold text-slate-850 dark:text-slate-200">
                              {booking.time_slot}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400">Duration</span>
                            <span className="text-xs font-bold text-slate-850 dark:text-slate-200">
                              {booking.duration} Minutes
                            </span>
                          </div>
                          <div>
                            <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400">Platform</span>
                            <span className="text-xs font-bold text-slate-850 dark:text-slate-200">
                              {booking.platform}
                            </span>
                          </div>
                        </div>

                        {booking.message && (
                          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700/80">
                            <span className="block text-[8px] font-black uppercase tracking-wider text-slate-400 mb-1">Message</span>
                            <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-medium">"{booking.message}"</p>
                          </div>
                        )}

                        <div className="flex justify-end gap-2 pt-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" className="w-full h-10 rounded-xl text-xs font-black uppercase tracking-wider dark:text-white dark:border-slate-700">
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-full min-w-[200px] rounded-xl p-2 dark:bg-slate-900 dark:border-slate-700">
                              <DropdownMenuItem onClick={() => handleStatusUpdate(booking.id, "confirmed")} className="rounded-lg p-2.5 font-bold text-xs uppercase tracking-widest text-primary">
                                <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Confirmed
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusUpdate(booking.id, "cancelled")} className="rounded-lg p-2.5 font-bold text-xs uppercase tracking-widest text-amber-600">
                                <XCircle className="w-4 h-4 mr-2" /> Mark Cancelled
                              </DropdownMenuItem>
                              <div className="h-px bg-slate-100 dark:bg-slate-800 my-1.5" />
                              <DropdownMenuItem onClick={() => handleEditClick(booking)} className="rounded-lg p-2.5 font-bold text-xs uppercase tracking-widest text-slate-600 dark:text-slate-300">
                                <Plus className="w-4 h-4 mr-2" /> Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(booking.id)} className="rounded-lg p-2.5 font-bold text-xs uppercase tracking-widest text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" /> Delete Booking
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-700 shadow-md">
                <CalendarIcon className="w-12 h-12 text-slate-250 mx-auto mb-4" />
                <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest">No bookings found matching filters</h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">Try resetting your filter parameters or search query.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="availability">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-2xl font-black dark:text-white">Weekly Schedule</CardTitle>
                  <CardDescription className="dark:text-slate-400">Set your standard working hours for each day of the week.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  {DAYS.map((day, index) => {
                    const slot = availability.find(a => a.day_of_week === index);
                    return (
                      <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-4">
                          <Switch 
                            checked={slot?.is_enabled ?? false} 
                            onCheckedChange={(checked: boolean) => handleAvailabilityToggle(index, checked)}
                          />
                          <span className={`text-sm font-black uppercase tracking-widest ${slot?.is_enabled ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>
                            {day}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <Input 
                            type="time" 
                            value={slot?.start_time ?? "09:00"} 
                            onChange={(e) => handleTimeChange(index, "start_time", e.target.value)}
                            disabled={!slot?.is_enabled}
                            className="w-32 h-12 rounded-xl bg-white dark:bg-slate-900 dark:text-white"
                          />
                          <span className="text-slate-300 font-bold">to</span>
                          <Input 
                            type="time" 
                            value={slot?.end_time ?? "17:00"} 
                            onChange={(e) => handleTimeChange(index, "end_time", e.target.value)}
                            disabled={!slot?.is_enabled}
                            className="w-32 h-12 rounded-xl bg-white dark:bg-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div className="pt-4">
                    <Button onClick={saveAvailability} disabled={isSaving} className="w-full h-14 rounded-xl bg-primary text-white font-black uppercase tracking-widest shadow-xl hover:bg-[#064e3b]">
                      {isSaving ? "Saving Configuration..." : "Save Weekly Schedule"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-xl font-black dark:text-white">Custom Date Settings</CardTitle>
                  <CardDescription className="dark:text-slate-400">Configure schedule overrides or take specific days off.</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <Calendar
                    selected={selectedBlockedDate}
                    onSelect={handleDateSelect}
                    className="mb-6 rounded-xl border border-slate-100 dark:border-slate-700 p-4 dark:text-white"
                  />

                  {selectedBlockedDate ? (
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-4 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-widest text-primary">
                          Schedule for {format(selectedBlockedDate, "MMM d, yyyy")}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Availability Status</label>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => setOverrideType("standard")}
                            className={cn(
                              "py-2 px-1 text-[9px] font-black uppercase tracking-wider rounded-lg border-2 transition-all",
                              overrideType === "standard"
                                ? "bg-primary border-primary text-white"
                                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary/20"
                            )}
                          >
                            Weekly
                          </button>
                          <button
                            type="button"
                            onClick={() => setOverrideType("off")}
                            className={cn(
                              "py-2 px-1 text-[9px] font-black uppercase tracking-wider rounded-lg border-2 transition-all",
                              overrideType === "off"
                                ? "bg-red-500 border-red-500 text-white"
                                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-red-500/20"
                            )}
                          >
                            Off
                          </button>
                          <button
                            type="button"
                            onClick={() => setOverrideType("custom")}
                            className={cn(
                              "py-2 px-1 text-[9px] font-black uppercase tracking-wider rounded-lg border-2 transition-all",
                              overrideType === "custom"
                                ? "bg-blue-500 border-blue-500 text-white"
                                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-500/20"
                            )}
                          >
                            Custom
                          </button>
                        </div>
                      </div>

                      {overrideType === "custom" && (
                        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-700">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-bold">Custom Hours</label>
                            <button
                              type="button"
                              onClick={() => setCustomRanges(prev => [...prev, { start: "09:00", end: "17:00" }])}
                              className="text-[10px] text-blue-500 hover:text-blue-600 font-black uppercase tracking-wider"
                            >
                              + Add Range
                            </button>
                          </div>
                          <div className="space-y-2">
                            {customRanges.map((range, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Input
                                  type="time"
                                  value={range.start}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setCustomRanges(prev => prev.map((r, i) => i === index ? { ...r, start: val } : r));
                                  }}
                                  className="h-10 rounded-lg text-xs bg-white dark:bg-slate-900 dark:text-white flex-1"
                                />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">to</span>
                                <Input
                                  type="time"
                                  value={range.end}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setCustomRanges(prev => prev.map((r, i) => i === index ? { ...r, end: val } : r));
                                  }}
                                  className="h-10 rounded-lg text-xs bg-white dark:bg-slate-900 dark:text-white flex-1"
                                />
                                {customRanges.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => setCustomRanges(prev => prev.filter((_, i) => i !== index))}
                                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {overrideType !== "off" && allPotentialSlots.length > 0 && (
                        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-700">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-bold">
                              Slot Availability
                            </label>
                            <span className="text-[9px] text-slate-400 font-medium">
                              Click a slot to toggle availability
                            </span>
                          </div>
                          <div className="grid grid-cols-4 gap-1.5 max-h-48 overflow-y-auto p-1 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                            {allPotentialSlots.map((time: string) => {
                              const isBlocked = blockedSlots.includes(time);
                              return (
                                <button
                                  key={time}
                                  type="button"
                                  onClick={() => {
                                    setBlockedSlots(prev =>
                                      isBlocked
                                        ? prev.filter(t => t !== time)
                                        : [...prev, time]
                                    );
                                  }}
                                  className={cn(
                                    "py-1.5 text-[10px] font-bold rounded-lg border transition-all text-center",
                                    isBlocked
                                      ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/40 text-red-500 line-through decoration-red-400"
                                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-primary/50 hover:bg-primary/5"
                                  )}
                                >
                                  {time}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <Button
                        onClick={handleSaveDateOverride}
                        disabled={isSaving}
                        className={cn(
                          "w-full h-11 rounded-xl text-xs font-black uppercase tracking-widest text-white shadow-md transition-all",
                          overrideType === "standard"
                            ? "bg-slate-600 hover:bg-slate-700"
                            : overrideType === "off"
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-blue-500 hover:bg-blue-600"
                        )}
                      >
                        {isSaving ? "Saving..." : "Save Date Schedule"}
                      </Button>
                    </div>
                  ) : (
                    <div className="p-4 mb-6 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider leading-relaxed">
                        Select a date on the calendar<br />to edit its schedule
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Date-Specific Overrides</p>
                    {blockedDates.length > 0 ? (
                      blockedDates.map((bd) => {
                        const isCustom = bd.reason && (bd.reason.startsWith("CUSTOM:") || bd.reason.includes("CUSTOM:"));
                        const hasBlockedSlots = bd.reason && bd.reason.includes("BLOCKED:");
                        let displayReason = "OFF / Unavailable";
                        
                        if (bd.reason === "OFF") {
                          displayReason = "OFF / Unavailable";
                        } else {
                          let baseHours = "Weekly Hours";
                          if (isCustom) {
                            const customMatch = bd.reason.match(/CUSTOM:([^;]+)/);
                            if (customMatch) {
                              baseHours = customMatch[1].split(",").map(range => {
                                const [start, end] = range.split("-");
                                return `${start} to ${end}`;
                              }).join(", ");
                            }
                          }
                          
                          let blockedText = "";
                          if (hasBlockedSlots) {
                            const blockedMatch = bd.reason.match(/BLOCKED:([^;]+)/);
                            if (blockedMatch) {
                              blockedText = ` (Blocked: ${blockedMatch[1]})`;
                            }
                          }
                          
                          displayReason = `${baseHours}${blockedText}`;
                        }
                        
                        return (
                          <div 
                            key={bd.id} 
                            className={cn(
                              "flex items-center justify-between p-3 rounded-xl border transition-all",
                              isCustom 
                                ? "bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20" 
                                : "bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20"
                            )}
                          >
                            <div className="flex flex-col">
                              <span className={cn(
                                "text-xs font-black",
                                isCustom ? "text-blue-700 dark:text-blue-400" : "text-red-700 dark:text-red-400"
                              )}>
                                {format(new Date(bd.date), "MMM d, yyyy")}
                              </span>
                              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 mt-0.5">
                                {displayReason}
                              </span>
                            </div>
                            <button onClick={() => handleRemoveBlockedDate(bd.id)} className="text-slate-400 hover:text-red-600 transition-colors">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-slate-400 italic font-medium">No custom date schedules set.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
