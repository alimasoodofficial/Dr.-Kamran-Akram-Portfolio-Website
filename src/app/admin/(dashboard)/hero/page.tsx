"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";
import GradientText from "@/components/ui/GradientText";
import { ArrowLeft, Save, Upload, X, AlertCircle, Sparkles, Database, Link as LinkIcon, Eye, LayoutGrid } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

const SQL_INSTRUCTIONS = `CREATE TABLE IF NOT EXISTS hero_settings (
    id VARCHAR(50) PRIMARY KEY,
    card_type VARCHAR(20) NOT NULL DEFAULT 'image',
    category VARCHAR(255) DEFAULT '',
    title TEXT DEFAULT '',
    image_url TEXT,
    bg_color VARCHAR(100) DEFAULT 'bento-card-green',
    button_text VARCHAR(100),
    button_link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default values for all 7 hero bento cards
INSERT INTO hero_settings (id, card_type, category, title, image_url, bg_color, button_text, button_link)
VALUES 
(
    'card_1',
    'info',
    'Ph.D',
    'Animal Sciences||Bridging livestock research, innovation and real world agricultural impact.',
    NULL,
    'bento-card-green',
    'View Publications',
    '/free-resources/articles'
),
(
    'card_2',
    'strip',
    '',
    'Science Communicator||Making science, agriculture and innovation easier to understand and share.',
    NULL,
    'bento-card-emerald',
    'Play a Game',
    '#'
),
(
    'specialization',
    'image',
    'Specialization',
    'Building Meaningful Ideas Across Science, Agriculture & Innovation',
    'https://images.unsplash.com/photo-1710322928695-c7fb49886cb1',
    'bento-card-green',
    '',
    ''
),
(
    'card_4',
    'stat',
    'Years of Experience',
    '10+',
    NULL,
    'bento-card-dark',
    'Hire for Consulting',
    '/consulting'
),
(
    'card_5',
    'image',
    'Research',
    'Microbiology Research on Bioplastic Producing Bacteria (PHAs), and PhD Research in Parasitology, Buffalo Fly, Cattle Phenotyping, Proteomics & Genomics.',
    'https://images.unsplash.com/photo-1587355760421-b9de3226a046?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0MDZ8MHwxfHNlYXJjaHwyMnx8cmVzZWFyY2h8ZW58MHx8fHwxNzY3Mjk4OTQ4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    'bento-card-green',
    '',
    '/free-resources/articles'
),
(
    'card_6',
    'info',
    '',
    'eBooks||Explore free and premium eBooks covering science, agriculture, innovation, research and practical insights.',
    NULL,
    'bento-card-teal',
    'Browse eBooks',
    '/ebooks'
),
(
    'card_7',
    'strip',
    '',
    'MLA Red Meat Industry Ambassador||',
    NULL,
    'bento-card-emerald',
    '',
    ''
)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE hero_settings ENABLE ROW LEVEL SECURITY;

-- Policies for public access (Select)
CREATE POLICY "Allow public read access to hero_settings"
ON hero_settings FOR SELECT
USING (true);

-- Policies for admin access (All)
CREATE POLICY "Allow full admin access to hero_settings"
ON hero_settings FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);`;



function parseTitleAndDesc(titleVal: string | null | undefined, defaultTitle: string, defaultDesc: string) {
  if (!titleVal) return [defaultTitle, defaultDesc];
  const idx = titleVal.indexOf("||");
  if (idx === -1) return [titleVal, defaultDesc];
  return [titleVal.slice(0, idx), titleVal.slice(idx + 2)];
}

export default function AdminHeroSettings() {
  const [allCards, setAllCards] = useState<Record<string, any>>({});
  const [selectedCardId, setSelectedCardId] = useState("card_1");

  // Form states
  const [cardType, setCardType] = useState("info");
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [bgColor, setBgColor] = useState("bento-card-green");
  const [buttonText, setButtonText] = useState("");
  const [buttonLink, setButtonLink] = useState("");
  const [enableGradient, setEnableGradient] = useState<boolean>(true);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [tableMissing, setTableMissing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      const { data } = await supabaseClient.auth.getSession();
      if (!data.session?.access_token) {
        toast.error("Unauthorized");
        router.push("/admin/login");
        return;
      }
      setToken(data.session.access_token);
      await loadSettings(data.session.access_token);
    } catch (err) {
      console.error(err);
      setFetching(false);
    }
  };

  const loadSettings = async (authToken: string) => {
    try {
      const res = await fetch("/api/admin/hero", {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const json = await res.json();
      if (!res.ok) {
        if (json.code === "TABLE_NOT_FOUND") {
          setTableMissing(true);
        } else {
          toast.error(json.error || "Failed to load hero settings");
        }
        return;
      }

      if (json && Array.isArray(json)) {
        const cardsMap: Record<string, any> = {};
        json.forEach((card: any) => {
          cardsMap[card.id] = card;
        });
        setAllCards(cardsMap);
        
        // Initial selected card setup
        handleSelectCard("card_1", cardsMap);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load hero settings");
    } finally {
      setFetching(false);
    }
  };

  const handleSelectCard = (id: string, cardsList = allCards) => {
    setSelectedCardId(id);
    setFile(null);
    setPreviewUrl(null);

    const card = cardsList[id];
    if (card) {
      setCardType(card.card_type || "info");
      setCategory(card.category || "");
      setImageUrl(card.image_url || "");
      
      const rawBgColor = card.bg_color || "bento-card-green";
      if (rawBgColor.includes("no-gradient")) {
        setEnableGradient(false);
        setBgColor(rawBgColor.replace("no-gradient-", ""));
      } else {
        setEnableGradient(true);
        setBgColor(rawBgColor);
      }

      setButtonText(card.button_text || "");
      setButtonLink(card.button_link || "");

      if (card.card_type === "info" || card.card_type === "strip") {
        const [sub, desc] = parseTitleAndDesc(card.title, "", "");
        setSubtitle(sub);
        setDescription(desc);
        setTitle("");
      } else {
        setTitle(card.title || "");
        setSubtitle("");
        setDescription("");
      }
    } else {
      // Setup default form states dynamically if database entry is not created yet
      let defaultType = "info";
      if (id === "card_2" || id === "card_7") defaultType = "strip";
      else if (id === "specialization") defaultType = "text";
      else if (id === "card_4") defaultType = "stat";
      else if (id === "card_5") defaultType = "image";

      setCardType(defaultType);
      setCategory("");
      setImageUrl("");
      setEnableGradient(true);
      setBgColor(id === "card_4" ? "bento-card-dark" : "bento-card-green");
      setButtonText("");
      setButtonLink("");
      setTitle("");
      setSubtitle("");
      setDescription("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreviewUrl(URL.createObjectURL(f));
    }
  };

  const handleUpload = async (): Promise<string | null> => {
    if (!file) return null;
    if (!token) throw new Error("Unauthorized");

    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Upload failed");
    return json.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    const toastId = toast.loading(`Saving card settings...`);

    try {
      let finalImageUrl = imageUrl;
      if (file) {
        const uploadedUrl = await handleUpload();
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
          setImageUrl(uploadedUrl);
          setFile(null);
          setPreviewUrl(null);
        }
      }

      let finalTitle = title;
      if (cardType === "info" || cardType === "strip") {
        finalTitle = `${subtitle}||${description}`;
      }

      let finalBgColor = bgColor;
      if (!enableGradient) {
        if (!finalBgColor.startsWith("no-gradient-")) {
          finalBgColor = `no-gradient-${finalBgColor}`;
        }
      } else {
        finalBgColor = finalBgColor.replace("no-gradient-", "");
      }

      const body = {
        id: selectedCardId,
        card_type: cardType,
        category,
        title: finalTitle,
        image_url: finalImageUrl,
        bg_color: finalBgColor,
        button_text: buttonText,
        button_link: buttonLink,
      };

      const res = await fetch("/api/admin/hero", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok) {
        if (json.code === "TABLE_NOT_FOUND") {
          setTableMissing(true);
          throw new Error("Database table not initialized yet");
        }
        throw new Error(json.error || "Failed to save settings");
      }

      // Update local state map
      const updatedCards = {
        ...allCards,
        [selectedCardId]: json,
      };
      setAllCards(updatedCards);

      toast.success("Settings saved successfully!", { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error saving settings", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(SQL_INSTRUCTIONS);
    toast.success("SQL script copied to clipboard!");
  };

  const getCardDisplayText = (id: string) => {
    const card = allCards[id];
    if (!card) {
      if (id === "card_1") return "Card 1 (Ph.D Info)";
      if (id === "card_2") return "Card 2 (Science Communicator)";
      if (id === "specialization") return "Card 3 (Specialization)";
      if (id === "card_4") return "Card 4 (Experience Stat)";
      if (id === "card_5") return "Card 5 (Research Image)";
      if (id === "card_6") return "Card 6 (eBooks Info)";
      if (id === "card_7") return "Card 7 (Ambassador Strip)";
      return "Untitled Card";
    }
    if (card.card_type === "info" || card.card_type === "strip") {
      const [sub] = parseTitleAndDesc(card.title, "", "");
      return sub || card.category || "Untitled Card";
    }
    return card.category || card.title || "Untitled Card";
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">
          <GradientText colors={["#10B981", "#059669"]}>Hero Bento Grid Settings</GradientText>
        </h1>
      </div>

      {tableMissing ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 md:p-8 space-y-6">
          <div className="flex gap-4">
            <div className="p-3 bg-red-100 rounded-lg text-red-600 h-fit shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-800">Database Table Missing</h3>
              <p className="text-sm text-red-700 mt-1">
                The database table <code>hero_settings</code> has not been created in Supabase yet.
                To activate the Hero Section settings, please copy the SQL query below and run it in the SQL Editor of your Supabase Dashboard.
              </p>
            </div>
          </div>

          <div className="relative bg-slate-900 rounded-lg p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-[300px] border border-slate-800">
            <button
              onClick={copySqlToClipboard}
              className="absolute top-2 right-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[10px] uppercase font-sans font-semibold transition-colors"
            >
              Copy SQL
            </button>
            <pre className="whitespace-pre">{SQL_INSTRUCTIONS}</pre>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setTableMissing(false);
                checkAuthAndLoadData();
              }}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-md shadow-red-600/10"
            >
              I have run the SQL, Retry
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-fadeIn">
          {/* Visual Bento Selector Grid */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-800 font-heading">Select Hero Card to Edit</h2>
            </div>
            <p className="text-xs text-slate-500 font-body">
              Click on a card in the visual representation below to select and edit its content.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-900 rounded-2xl border border-slate-850">
              {/* Column 1 */}
              <div className="flex flex-col gap-4">
                <button
                  type="button"
                  onClick={() => handleSelectCard("card_1")}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selectedCardId === "card_1"
                      ? "border-emerald-500 bg-emerald-950/40 text-emerald-300 shadow-md shadow-emerald-500/10"
                      : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75 font-body">Card 1 (Info)</span>
                  <span className="text-sm font-semibold truncate block mt-1 font-heading">{getCardDisplayText("card_1")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectCard("card_2")}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selectedCardId === "card_2"
                      ? "border-emerald-500 bg-emerald-950/40 text-emerald-300 shadow-md shadow-emerald-500/10"
                      : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75 font-body">Card 2 (Strip)</span>
                  <span className="text-sm font-semibold truncate block mt-1 font-heading">{getCardDisplayText("card_2")}</span>
                </button>
              </div>

              {/* Column 2 */}
              <div className="h-full flex">
                <button
                  type="button"
                  onClick={() => handleSelectCard("specialization")}
                  className={`p-4 rounded-xl border text-left transition-all w-full flex flex-col justify-between min-h-[160px] ${
                    selectedCardId === "specialization"
                      ? "border-emerald-500 bg-emerald-950/40 text-emerald-300 shadow-md shadow-emerald-500/10"
                      : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75 font-body">Card 3 (Specialization)</span>
                    <span className="text-sm font-semibold block mt-1 leading-snug font-heading">{getCardDisplayText("specialization")}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase mt-2 font-body font-semibold">Double Height</span>
                </button>
              </div>

              {/* Column 3 */}
              <div className="flex flex-col gap-4">
                <button
                  type="button"
                  onClick={() => handleSelectCard("card_4")}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selectedCardId === "card_4"
                      ? "border-emerald-500 bg-emerald-950/40 text-emerald-300 shadow-md shadow-emerald-500/10"
                      : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75 font-body">Card 4 (Stat)</span>
                  <span className="text-sm font-semibold truncate block mt-1 font-heading">{getCardDisplayText("card_4")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectCard("card_5")}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selectedCardId === "card_5"
                      ? "border-emerald-500 bg-emerald-950/40 text-emerald-300 shadow-md shadow-emerald-500/10"
                      : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75 font-body">Card 5 (Image)</span>
                  <span className="text-sm font-semibold truncate block mt-1 font-heading">{getCardDisplayText("card_5")}</span>
                </button>
              </div>

              {/* Column 4 */}
              <div className="flex flex-col gap-4">
                <button
                  type="button"
                  onClick={() => handleSelectCard("card_6")}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selectedCardId === "card_6"
                      ? "border-emerald-500 bg-emerald-950/40 text-emerald-300 shadow-md shadow-emerald-500/10"
                      : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75 font-body">Card 6 (Info)</span>
                  <span className="text-sm font-semibold truncate block mt-1 font-heading">{getCardDisplayText("card_6")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectCard("card_7")}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selectedCardId === "card_7"
                      ? "border-emerald-500 bg-emerald-950/40 text-emerald-300 shadow-md shadow-emerald-500/10"
                      : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75 font-body">Card 7 (Strip)</span>
                  <span className="text-sm font-semibold truncate block mt-1 font-heading">{getCardDisplayText("card_7")}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Side */}
            <div className="lg:col-span-7 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2 font-heading">
                  <Sparkles className="w-5 h-5 text-emerald-600" /> Card Editor: <span className="text-emerald-600 font-semibold">{selectedCardId}</span>
                </h2>

                <div className="space-y-4">
                  {/* Card Layout / Component Selector */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 font-body font-semibold">Card Layout Type</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {[
                        { id: "info", label: "Info Card", emoji: "ℹ️" },
                        { id: "strip", label: "Strip Card", emoji: "🎫" },
                        { id: "image", label: "Image Card", emoji: "📷" },
                        { id: "stat", label: "Stat Card", emoji: "📈" }
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            setCardType(t.id);
                          }}
                          className={`py-2 px-3 rounded-lg border text-center text-xs font-semibold transition-all ${
                            cardType === t.id
                              ? "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm"
                              : "border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <span className="block text-lg mb-0.5">{t.emoji}</span>
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Context Sensitive Fields */}
                  
                  {/* Category Field: used for Info, Image, Stat, Specialization */}
                  {(cardType === "info" || cardType === "image" || cardType === "stat") && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1 font-body">
                        {cardType === "stat" ? "Stat Label (e.g. Years of Experience)" : "Category / Top Header (e.g. Ph.D)"}
                      </label>
                      <input
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-body text-sm"
                        placeholder={cardType === "stat" ? "e.g. Years of Experience" : "e.g. Ph.D"}
                      />
                    </div>
                  )}

                  {/* Subtitle Field: used for Info and Strip cards */}
                  {(cardType === "info" || cardType === "strip") && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1 font-body">
                        {cardType === "strip" ? "Card Title / Text (e.g. Science Communicator)" : "Card Subtitle (e.g. Animal Sciences)"}
                      </label>
                      <input
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-body text-sm"
                        placeholder="Enter card subtitle..."
                      />
                    </div>
                  )}

                  {/* Description / Title Text Field */}
                  {cardType === "image" && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1 font-body">Overlay Description Text</label>
                      <textarea
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 min-h-[100px] font-body text-sm"
                        placeholder="Enter descriptive paragraph overlay..."
                      />
                    </div>
                  )}

                  {cardType === "stat" && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1 font-body">Stat Value (e.g. 10+)</label>
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-body text-sm font-semibold"
                        placeholder="e.g. 10+"
                      />
                    </div>
                  )}

                  {(cardType === "info" || cardType === "strip") && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1 font-body font-semibold">Card Description / Paragraph</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 min-h-[100px] font-body text-sm"
                        placeholder="Enter the body text for this bento card..."
                      />
                    </div>
                  )}

                  {/* Image Upload section (Always available) */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 font-body font-semibold">Background Image (Optional)</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors relative group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {previewUrl || imageUrl ? (
                        <div className="relative">
                          <img
                            src={previewUrl || imageUrl}
                            alt="Card Background"
                            className="w-full h-44 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setFile(null);
                              setPreviewUrl(null);
                              setImageUrl("");
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg pointer-events-none">
                            <p className="text-white text-xs font-semibold font-body">Click or drag to change image</p>
                          </div>
                        </div>
                      ) : (
                        <div className="py-6 text-slate-400 font-body">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                          <p className="text-sm font-medium">Click or Drag to upload background image</p>
                          <p className="text-xs text-slate-400 mt-1">PNG, JPG or WEBP</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Gradient Overlay Option */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <div>
                      <label className="text-sm font-bold text-slate-800 font-body block">Enable Gradient Overlay</label>
                      <span className="text-xs text-slate-500 font-body">If checked, applies dark-green glassmorphism gradient overlay over background image/fallback.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enableGradient}
                        onChange={(e) => setEnableGradient(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  {/* Color background selector */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 font-body font-semibold">Card Theme Background</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { name: "Emerald Gradient", class: "bento-card-green", preview: "bg-gradient-to-br from-emerald-500 to-teal-700" },
                        { name: "Teal Gradient", class: "bento-card-teal", preview: "bg-gradient-to-br from-teal-500 to-emerald-700" },
                        { name: "Bright Emerald", class: "bento-card-emerald", preview: "bg-gradient-to-br from-emerald-400 to-green-500" },
                        { name: "Slate Dark", class: "bento-card-dark", preview: "bg-gradient-to-br from-slate-900 to-black" }
                      ].map((theme) => (
                        <button
                          key={theme.class}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setBgColor(theme.class);
                          }}
                          className={`p-3 rounded-lg border text-center flex flex-col items-center gap-2 transition-all ${
                            bgColor === theme.class
                              ? "border-emerald-500 ring-2 ring-emerald-500/10 shadow-sm"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full ${theme.preview} border border-white/20`} />
                          <span className="text-[10px] font-semibold text-slate-700 font-body">{theme.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action Link & Button Section */}
                  <div className="pt-4 border-t border-slate-100 space-y-4">
                    <h3 className="text-sm font-bold text-slate-700 flex items-center gap-1.5 font-heading">
                      <LinkIcon className="w-4 h-4 text-slate-500" /> Card Action Link / Button
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1 font-body">Button Text (Optional)</label>
                        <input
                          value={buttonText}
                          onChange={(e) => setButtonText(e.target.value)}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-body"
                          placeholder="e.g. View Publications"
                        />
                        <p className="text-[10px] text-slate-400 mt-1 font-body font-light">Leave empty to hide link button</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1 font-body">Link Destination URL (Optional)</label>
                        <input
                          value={buttonLink}
                          onChange={(e) => setButtonLink(e.target.value)}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-body font-light"
                          placeholder="e.g. /free-resources/articles"
                        />
                        <p className="text-[10px] text-slate-400 mt-1 font-body font-light">Relative path (e.g. /consulting) or full URL</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                  <Link
                    href="/admin/dashboard"
                    className="px-6 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-colors text-sm font-body"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors disabled:opacity-50 shadow-lg shadow-emerald-500/20 text-sm font-body"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? "Saving..." : "Save Card Settings"}
                  </button>
                </div>
              </form>
            </div>

            {/* Live Preview Side */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-100 rounded-xl p-4 border border-slate-200/60 h-fit sticky top-6">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5 font-body">
                  <Eye className="w-3.5 h-3.5" /> Live Card Preview
                </h2>

                <div className="flex justify-center items-center py-6 bg-slate-950/40 rounded-xl backdrop-blur-md border border-slate-800">
                  <div className="w-[300px] select-none">
                    
                    {cardType === "info" && (
                      <div
                        className={`rounded-3xl p-6 relative overflow-hidden h-[320px] flex flex-col justify-between text-white shadow-2xl transition-all duration-300 bg-cover bg-center ${bgColor}`}
                        style={
                          previewUrl || imageUrl
                            ? {
                                backgroundImage: enableGradient
                                  ? `linear-gradient(rgba(1, 28, 22, 0.75) 0%, rgba(5, 150, 105, 0.5) 100%), url('${previewUrl || imageUrl}')`
                                  : `url('${previewUrl || imageUrl}')`,
                              }
                            : undefined
                        }
                      >
                        <div className="flex flex-col text-white">
                          {category && <span className="block text-lg font-bold mb-1 opacity-95 text-white font-heading">{category}</span>}
                          {subtitle && <h3 className="text-2xl font-heading mb-3 !text-white leading-tight">{subtitle}</h3>}
                          {description && <p className="text-sm leading-relaxed text-white/90 font-light font-body">{description}</p>}
                        </div>
                        {buttonText && buttonLink && (
                          <div className="bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm p-3 rounded-full flex justify-between items-center px-5 font-semibold text-xs mt-4">
                            <span className="text-white w-full h-full flex items-center font-body">
                              <i className="fa-solid fa-arrow-right px-2"></i>
                              {buttonText}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {cardType === "strip" && (
                      <div
                        className={`rounded-3xl p-6 relative overflow-hidden min-h-[120px] flex flex-col justify-center text-white shadow-2xl transition-all duration-300 bg-cover bg-center ${bgColor}`}
                        style={
                          previewUrl || imageUrl
                            ? {
                                backgroundImage: enableGradient
                                  ? `linear-gradient(rgba(1, 28, 22, 0.75) 0%, rgba(5, 150, 105, 0.5) 100%), url('${previewUrl || imageUrl}')`
                                  : `url('${previewUrl || imageUrl}')`,
                              }
                            : undefined
                        }
                      >
                        <div className="flex flex-col gap-2">
                          <h3 className="text-lg font-semibold !text-white leading-tight font-heading">{subtitle || "Communicator"}</h3>
                          {description && (
                            <p className="text-sm text-white/90 text-left font-light leading-relaxed font-body">
                              {description}
                            </p>
                          )}
                        </div>
                        {buttonText && buttonLink && (
                          <div className="bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm p-3 rounded-full flex justify-between items-center px-5 font-semibold text-xs mt-4">
                            <span className="text-white w-full h-full flex items-center font-body">
                              <i className="fa-solid fa-arrow-right px-2"></i>
                              {buttonText}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {cardType === "stat" && (
                      <div
                        className={`rounded-3xl p-6 relative overflow-hidden h-[240px] flex flex-col justify-center items-center text-center text-white shadow-2xl transition-all duration-300 bg-cover bg-center ${bgColor}`}
                        style={
                          previewUrl || imageUrl
                            ? {
                                backgroundImage: enableGradient
                                  ? `linear-gradient(rgba(1, 28, 22, 0.75) 0%, rgba(5, 150, 105, 0.5) 100%), url('${previewUrl || imageUrl}')`
                                  : `url('${previewUrl || imageUrl}')`,
                              }
                            : undefined
                        }
                      >
                        <h3 className="text-5xl font-bold mb-1 !text-white font-heading">{title || "10+"}</h3>
                        {category && <p className="font-medium mb-6 text-white/90 text-sm font-body">{category}</p>}
                        {buttonText && buttonLink && (
                          <div className="bg-white/10 hover:bg-white/20 transition-colors w-full py-2.5 rounded-full font-semibold text-xs flex justify-center items-center gap-2">
                            <span className="text-white font-body">{buttonText}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {cardType === "image" && (
                      <div
                        className={`rounded-3xl p-6 relative overflow-hidden h-[320px] flex flex-col justify-between text-white shadow-2xl transition-all duration-300 bg-contain bg-no-repeat bg-center group ${bgColor}`}
                        style={{
                          backgroundImage: (previewUrl || imageUrl)
                            ? enableGradient
                              ? `linear-gradient(rgba(1, 28, 22, 0.75) 0%, rgba(5, 150, 105, 0.5) 100%), url('${previewUrl || imageUrl}')`
                              : `url('${previewUrl || imageUrl}')`
                            : undefined,
                        }}
                      >
                        <div className="relative z-10 text-white">
                          {category && (
                            <span className="block text-2xl font-bold mb-1 opacity-90 text-white font-heading">
                              {category}
                            </span>
                          )}
                          {title && <h3 className="text-sm font-medium leading-tight !text-white font-body mt-2">{title}</h3>}
                        </div>
                        {buttonLink && (
                          <div className="bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm p-3 rounded-full flex justify-between items-center px-5 font-semibold text-xs mt-4 relative z-10">
                            <span className="text-white w-full h-full flex items-center font-body">
                              <i className="fa-solid fa-arrow-right px-2"></i>
                              {buttonText || "Learn More"}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-2 text-center font-body">
                  Preview mirrors design styling on the live homepage.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
