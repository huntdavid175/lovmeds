"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/app/lib/database";

type PromoMessage = {
  id: string;
  message: string;
  is_active: boolean;
  link_url?: string;
  link_text?: string;
  background_color: string;
  text_color: string;
  created_at: string;
  updated_at: string;
};

export default function PromoPage() {
  const [promo, setPromo] = useState<PromoMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    message: "",
    is_active: false,
    link_url: "",
    link_text: "",
    background_color: "#A33D4A",
    text_color: "#FFFFFF",
  });

  useEffect(() => {
    fetchPromo();
  }, []);

  const fetchPromo = async () => {
    try {
      setIsLoading(true);
      // Get the first promo message (we'll only use one for now)
      const { data, error } = await supabase
        .from("promo_messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 is "no rows returned", which is fine
        throw error;
      }

      if (data) {
        setPromo(data);
        setFormData({
          message: data.message || "",
          is_active: data.is_active || false,
          link_url: data.link_url || "",
          link_text: data.link_text || "",
          background_color: data.background_color || "#A33D4A",
          text_color: data.text_color || "#FFFFFF",
        });
      }
    } catch (error) {
      console.error("Error fetching promo message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (promo) {
        // Update existing promo
        const { error } = await supabase
          .from("promo_messages")
          .update({
            message: formData.message,
            is_active: formData.is_active,
            link_url: formData.link_url || null,
            link_text: formData.link_text || null,
            background_color: formData.background_color,
            text_color: formData.text_color,
          })
          .eq("id", promo.id);

        if (error) throw error;
      } else {
        // Create new promo
        const { error } = await supabase.from("promo_messages").insert({
          message: formData.message,
          is_active: formData.is_active,
          link_url: formData.link_url || null,
          link_text: formData.link_text || null,
          background_color: formData.background_color,
          text_color: formData.text_color,
        });

        if (error) throw error;
      }

      alert("Promo message saved successfully!");
      await fetchPromo();
    } catch (error: any) {
      alert(`Error saving promo message: ${error.message}`);
      console.error("Error saving promo message:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A33D4A] mx-auto mb-4"></div>
          <p className="text-black/60">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl text-black mb-1 ls-title">
            Promo Message
          </h1>
          <p className="text-black/60 text-sm md:text-base">
            Manage the promotional banner displayed at the top of your site
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-black/5">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Preview */}
          {formData.message && (
            <div className="mb-6 p-4 rounded-xl border border-black/10 bg-[#F7F7F7]">
              <p className="text-sm font-medium text-black/70 mb-2">Preview:</p>
              <div
                className="text-center text-sm py-2 rounded-lg"
                style={{
                  backgroundColor: formData.is_active ? formData.background_color : "#E2E8F0",
                  color: formData.is_active ? formData.text_color : "#94A3B8",
                }}
              >
                {formData.message}
                {formData.is_active && formData.link_url && formData.link_text && (
                  <a
                    href={formData.link_url}
                    className="ml-2 underline font-medium"
                    style={{ color: formData.text_color }}
                  >
                    {formData.link_text}
                  </a>
                )}
              </div>
              {!formData.is_active && (
                <p className="text-xs text-black/50 mt-2 text-center">
                  (Inactive - will not display on site)
                </p>
              )}
            </div>
          )}

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Message *
            </label>
            <textarea
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              required
              rows={3}
              placeholder="Enter your promotional message..."
              className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#A33D4A] focus:border-transparent resize-none"
            />
          </div>

          {/* Active Toggle */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-black cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
                className="w-4 h-4 rounded border-black/20 text-[#A33D4A] focus:ring-[#A33D4A] cursor-pointer"
              />
              <span>Enable promo message (display on site)</span>
            </label>
          </div>

          {/* Link URL */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Link URL (Optional)
            </label>
            <input
              type="url"
              value={formData.link_url}
              onChange={(e) =>
                setFormData({ ...formData, link_url: e.target.value })
              }
              placeholder="https://example.com"
              className="w-full h-12 px-4 rounded-xl border border-black/10 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#A33D4A] focus:border-transparent"
            />
            <p className="text-xs text-black/50 mt-1">
              Add a link to make the message clickable
            </p>
          </div>

          {/* Link Text */}
          {formData.link_url && (
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Link Text (Optional)
              </label>
              <input
                type="text"
                value={formData.link_text}
                onChange={(e) =>
                  setFormData({ ...formData, link_text: e.target.value })
                }
                placeholder="Learn More"
                className="w-full h-12 px-4 rounded-xl border border-black/10 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#A33D4A] focus:border-transparent"
              />
            </div>
          )}

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Background Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.background_color}
                  onChange={(e) =>
                    setFormData({ ...formData, background_color: e.target.value })
                  }
                  className="h-12 w-20 rounded-xl border border-black/10 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.background_color}
                  onChange={(e) =>
                    setFormData({ ...formData, background_color: e.target.value })
                  }
                  className="flex-1 h-12 px-4 rounded-xl border border-black/10 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#A33D4A] focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Text Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.text_color}
                  onChange={(e) =>
                    setFormData({ ...formData, text_color: e.target.value })
                  }
                  className="h-12 w-20 rounded-xl border border-black/10 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.text_color}
                  onChange={(e) =>
                    setFormData({ ...formData, text_color: e.target.value })
                  }
                  className="flex-1 h-12 px-4 rounded-xl border border-black/10 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#A33D4A] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="h-12 px-6 rounded-xl bg-[#A33D4A] text-white font-medium transition-colors hover:bg-[#8E3540] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSaving ? "Saving..." : "Save Promo Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
