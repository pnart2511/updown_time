"use client";

import { useState, useEffect } from "react";
import { Save, Mail, Image as ImageIcon, Search, CheckCircle2, AlertCircle, Send } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [settings, setSettings] = useState<any[]>([]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/admin/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getVal = (key: string) => (Array.isArray(settings) ? settings.find(s => s.key === key)?.value : "") || "";

  const setVal = (key: string, value: string, group: string) => {
    setSettings(prev => {
      if (!Array.isArray(prev)) return [{ key, value, group }];
      const existing = prev.find(s => s.key === key);
      if (existing) {
        return prev.map(s => s.key === key ? { ...s, value } : s);
      }
      return [...prev, { key, value, group }];
    });
  };

  const handleTestEmail = async () => {
    setTesting(true);
    setMessage({ type: "", text: "" });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/admin/settings/test-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ to: testEmail })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: data.message });
      } else {
        throw new Error(data.error || "Lỗi gửi email");
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/admin/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setMessage({ type: "success", text: "Cập nhật cài đặt thành công!" });
      } else {
        throw new Error("Lỗi cập nhật");
      }
    } catch (err) {
      setMessage({ type: "error", text: "Đã có lỗi xảy ra khi lưu." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Đang tải...</div>;

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cài đặt hệ thống</h1>
          <p className="text-slate-500 mt-1 text-sm">Cấu hình SMTP, Branding và SEO cho website.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#F6821F] hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all active:scale-95 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium border animate-in fade-in slide-in-from-top-2 ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-700 border-red-100"
          }`}>
          {message.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        {/* SMTP SECTION */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-orange-500" />
              <h2 className="font-bold text-slate-800">Cấu hình SMTP (Email)</h2>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="email"
                placeholder="Email nhận test..."
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-slate-400 transition-all w-48"
              />
              <button
                onClick={handleTestEmail}
                disabled={testing}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 shrink-0"
              >
                <Send className="h-3 w-3" />
                {testing ? "Đang gửi..." : "Gửi email kiểm tra"}
              </button>
            </div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">SMTP Host</label>
              <input
                value={getVal("smtp_host")}
                onChange={e => setVal("smtp_host", e.target.value, "smtp")}
                placeholder="smtp.gmail.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">SMTP Port</label>
              <input
                value={getVal("smtp_port")}
                onChange={e => setVal("smtp_port", e.target.value, "smtp")}
                placeholder="587"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">SMTP User</label>
              <input
                value={getVal("smtp_user")}
                onChange={e => setVal("smtp_user", e.target.value, "smtp")}
                placeholder="example@gmail.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">SMTP Password</label>
              <input
                type="password"
                value={getVal("smtp_pass")}
                onChange={e => setVal("smtp_pass", e.target.value, "smtp")}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
              />
            </div>
          </div>
        </section>

        {/* BRANDING SECTION */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <ImageIcon className="h-5 w-5 text-blue-500" />
            <h2 className="font-bold text-slate-800">Nhận diện thương hiệu</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Tên trang web (Website Name)</label>
              <input
                value={getVal("website_name")}
                onChange={e => setVal("website_name", e.target.value, "branding")}
                placeholder="Ví dụ: UpMonitor, MyCompany..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Favicon URL</label>
              <input
                value={getVal("public_favicon")}
                onChange={e => setVal("public_favicon", e.target.value, "branding")}
                placeholder="https://example.com/favicon.ico"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Logo URL</label>
              <input
                value={getVal("public_logo")}
                onChange={e => setVal("public_logo", e.target.value, "branding")}
                placeholder="https://example.com/logo.png"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Main Website Image (OG Image)</label>
              <input
                value={getVal("public_image_website")}
                onChange={e => setVal("public_image_website", e.target.value, "branding")}
                placeholder="https://example.com/og-image.jpg"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>
        </section>

        {/* SEO SECTION */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <Search className="h-5 w-5 text-emerald-500" />
            <h2 className="font-bold text-slate-800">Cấu hình SEO</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Meta SEO Title</label>
              <input
                value={getVal("seo_title")}
                onChange={e => setVal("seo_title", e.target.value, "seo")}
                placeholder="UpMonitor - Best Website Monitoring Service"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Meta SEO Keywords</label>
              <input
                value={getVal("seo_keywords")}
                onChange={e => setVal("seo_keywords", e.target.value, "seo")}
                placeholder="monitoring, uptime, status page, alerts"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Meta SEO Description</label>
              <textarea
                rows={4}
                value={getVal("seo_description")}
                onChange={e => setVal("seo_description", e.target.value, "seo")}
                placeholder="Theo dõi website của bạn 24/7..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
