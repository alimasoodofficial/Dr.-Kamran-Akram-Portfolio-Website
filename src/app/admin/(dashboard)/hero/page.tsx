"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";
import GradientText from "@/components/ui/GradientText";
import { ArrowLeft, Save, Upload, X, AlertCircle, Sparkles, Database, Link as LinkIcon, Eye } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

const SQL_INSTRUCTIONS = `CREATE TABLE IF NOT EXISTS hero_settings (
    id VARCHAR(50) PRIMARY KEY,
    card_type VARCHAR(20) NOT NULL DEFAULT 'image',
    category VARCHAR(255) DEFAULT 'Specialization',
    title TEXT DEFAULT '',
    image_url TEXT,
    bg_color VARCHAR(100) DEFAULT 'bento-card-green',
    button_text VARCHAR(100),
    button_link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default value for specialization card
INSERT INTO hero_settings (id, card_type, category, title, image_url, bg_color, button_text, button_link)
VALUES (
    'specialization',
    'image',
    'Specialization',
    '',
    'https://images.unsplash.com/photo-1710322928695-c7fb49886cb1',
    'bento-card-green',
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

export default function AdminHeroSettings() {
  const [cardType, setCardType] = useState("image");
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [bgColor, setBgColor] = useState("bento-card-green");
  const [buttonText, setButtonText] = useState("");
  const [buttonLink, setButtonLink] = useState("");
  
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

      if (json) {
        setCardType(json.card_type || "image");
        setCategory(json.category || "Specialization");
        setTitle(json.title || "");
        setImageUrl(json.image_url || "");
        setBgColor(json.bg_color || "bento-card-green");
        setButtonText(json.button_text || "");
        setButtonLink(json.button_link || "");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load hero settings");
    } finally {
      setFetching(false);
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
    if (!title) {
      toast.error("Card title is required");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Saving specialization card settings...");

    try {
      let finalImageUrl = imageUrl;
      if (file) {
        const uploadedUrl = await handleUpload();
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
          setImageUrl(uploadedUrl);
          // reset file preview states
          setFile(null);
          setPreviewUrl(null);
        }
      }

      const body = {
        card_type: cardType,
        category,
        title,
        image_url: finalImageUrl,
        bg_color: bgColor,
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

      toast.success("Settings saved successfully!", { id: toastId });
      router.refresh();
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

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
          <GradientText colors={["#2563EB", "#7C3AED"]}>Hero Section Settings</GradientText>
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Side */}
          <div className="lg:col-span-7 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" /> Hero Card Editor
              </h2>

              <div className="space-y-4">
                {/* Card Type Toggle */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Card Type</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setCardType("image")}
                      className={`py-3 px-4 rounded-xl border text-center font-medium transition-all ${
                        cardType === "image"
                          ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      📷 Background Image
                    </button>
                    <button
                      type="button"
                      onClick={() => setCardType("text")}
                      className={`py-3 px-4 rounded-xl border text-center font-medium transition-all ${
                        cardType === "text"
                          ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      ✏️ Normal Background (Text)
                    </button>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category / Tag</label>
                  <input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="e.g. Specialization"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title / Description Text</label>
                  <textarea
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[100px]"
                    placeholder="Enter the message displayed on the card..."
                  />
                </div>

                {/* Image Upload section (conditional) */}
                {cardType === "image" && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Card Image</label>
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
                          {previewUrl && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                setFile(null);
                                setPreviewUrl(null);
                              }}
                              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg pointer-events-none">
                            <p className="text-white text-xs font-semibold">Click or drag to change image</p>
                          </div>
                        </div>
                      ) : (
                        <div className="py-6 text-slate-400">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                          <p className="text-sm font-medium">Click or Drag to upload new background image</p>
                          <p className="text-xs text-slate-400 mt-1">PNG, JPG or WEBP (rec. 4:3 ratio)</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Text card specific options */}
                {cardType === "text" && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Card Theme Background</label>
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
                          onClick={() => setBgColor(theme.class)}
                          className={`p-3 rounded-lg border text-center flex flex-col items-center gap-2 transition-all ${
                            bgColor === theme.class
                              ? "border-blue-500 ring-2 ring-blue-500/10 shadow-sm"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full ${theme.preview} border border-white/20`} />
                          <span className="text-xs font-medium text-slate-700">{theme.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Button Option / Links */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <h3 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <LinkIcon className="w-4 h-4 text-slate-500" /> Card Action Link / Button
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Button Text (Optional)</label>
                      <input
                        value={buttonText}
                        onChange={(e) => setButtonText(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                        placeholder="e.g. View Publications"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">Leave empty to not show a button (text card only)</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Link Destination URL</label>
                      <input
                        value={buttonLink}
                        onChange={(e) => setButtonLink(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                        placeholder="e.g. /free-resources/articles"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">Internal path (e.g. /ebooks) or external link</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                <Link
                  href="/admin/dashboard"
                  className="px-6 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-colors text-sm"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50 shadow-lg shadow-blue-500/20 text-sm"
                >
                  <Save className="w-4 h-4" />
                  {loading ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview Side */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-100 rounded-xl p-4 border border-slate-200/60">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> Live Card Preview
              </h2>

              <div className="flex justify-center items-center py-6 bg-slate-950/40 rounded-xl backdrop-blur-md border border-slate-800">
                <div className="w-[300px] select-none">
                  {cardType === "text" ? (
                    // Text Card Preview
                    <div
                      className={`rounded-3xl p-6 relative overflow-hidden h-[460px] flex flex-col justify-between text-white shadow-2xl transition-all duration-300 ${bgColor}`}
                    >
                      <div className="flex flex-col text-white">
                        <span className="block text-2xl font-bold mb-1 opacity-90 text-white font-heading">
                          {category}
                        </span>
                        <h3 className="text-lg md:text-xl font-medium leading-snug !text-white mt-4 font-body">
                          {title}
                        </h3>
                      </div>
                      
                      {buttonText && buttonLink ? (
                        <div className="bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm p-3 rounded-full flex justify-between items-center px-5 font-semibold text-xs mt-4">
                          <span className="text-white w-full h-full flex items-center font-body">
                            <i className="fa-solid fa-arrow-right px-2"></i>
                            {buttonText}
                          </span>
                        </div>
                      ) : (
                        <div className="text-[10px] text-white/40 italic text-center">No action button enabled</div>
                      )}
                    </div>
                  ) : (
                    // Image Card Preview
                    <div
                      className="rounded-3xl p-6 relative overflow-hidden h-[460px] flex flex-col justify-end text-white shadow-2xl transition-all duration-300 bg-cover bg-center group"
                      style={{
                        backgroundImage: (previewUrl || imageUrl)
                          ? `linear-gradient(rgba(1, 28, 22, 0.85) 0%, rgba(6, 78, 59, 0.6) 35%, rgba(16, 185, 129, 0.4) 100%), url('${previewUrl || imageUrl}')`
                          : `linear-gradient(rgba(1, 28, 22, 0.85) 0%, rgba(6, 78, 59, 0.6) 35%, rgba(16, 185, 129, 0.4) 100%)`,
                      }}
                    >
                      <div className="relative z-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <span className="block text-2xl font-bold mb-1 opacity-90 text-white font-heading">
                          {category}
                        </span>
                        <h3 className="text-sm md:text-md font-medium leading-tight !text-white font-body">
                          {title}
                        </h3>
                      </div>
                      {buttonLink && (
                        <div className="absolute top-3 right-3 text-[10px] bg-black/40 backdrop-blur-md px-2 py-1 rounded-md text-white/80 border border-white/10 flex items-center gap-1 font-body">
                          <LinkIcon className="w-2.5 h-2.5" /> Link Enabled
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2 text-center">
                This is how the card will look in the Hero section bento grid (hover to see text).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
