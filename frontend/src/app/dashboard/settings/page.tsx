"use client";

import { useState, useEffect } from "react";
import {
  Mail, Send, CheckCircle2, ShieldAlert, Key, Hash,
  MessageSquare, Info, Eye, EyeOff, Loader2, Bell,
  ChevronRight, Settings2, Zap, Globe
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const DEFAULT_MSG = "⚠️ Website {domain} của bạn đang bị DOWNTIME! Hãy kiểm tra ngay.";

type NotificationChannel = {
  id: number; type: string; target: string;
  bot_token: string; message_template: string; enabled: boolean;
};

type Tab = "overview" | "email" | "telegram";

function Toggle({ checked, onChange, colorClass }: { checked: boolean; onChange: (v: boolean) => void; colorClass: string }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${checked ? colorClass : "bg-gray-200"}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${checked ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}

function InputField({
  label, icon: Icon, value, onChange, placeholder, type = "text", helper, helperLink, mono = false
}: {
  label: string; icon: any; value: string; onChange: (v: string) => void;
  placeholder: string; type?: string; helper?: string; helperLink?: { text: string; href: string }; mono?: boolean;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
        <Icon className="h-3.5 w-3.5" /> {label}
      </label>
      <div className="relative">
        <input
          type={isPassword && !show ? "password" : "text"}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all placeholder:text-slate-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 ${isPassword || mono ? "font-mono pr-10" : ""}`}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {helper && (
        <p className="text-[11px] text-slate-400 mt-1">
          {helper}{" "}
          {helperLink && (
            <a href={helperLink.href} target="_blank" rel="noreferrer" className="text-blue-500 underline hover:text-blue-700">{helperLink.text}</a>
          )}
        </p>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);
  const [emailConfig, setEmailConfig] = useState({ target: "", enabled: false });
  const [tgConfig, setTgConfig] = useState({ target: "", bot_token: "", message_template: DEFAULT_MSG, enabled: false });

  useEffect(() => { fetchChannels(); }, []);

  const showToast = (text: string, ok: boolean) => {
    setToast({ text, ok });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchChannels = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch(`${API_URL}/api/notifications`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data: NotificationChannel[] = await res.json();
        const em = data.find(c => c.type === "EMAIL");
        if (em) setEmailConfig({ target: em.target, enabled: em.enabled });
        const tg = data.find(c => c.type === "TELEGRAM");
        if (tg) setTgConfig({ target: tg.target, bot_token: tg.bot_token || "", message_template: tg.message_template || DEFAULT_MSG, enabled: tg.enabled });
      }
    } catch { } finally { setLoading(false); }
  };

  const save = async (type: "EMAIL" | "TELEGRAM", body: object) => {
    setSaving(type);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/notifications`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ type, ...body }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      showToast(`Đã lưu cấu hình ${type === "EMAIL" ? "Email" : "Telegram"} thành công!`, true);
      fetchChannels();
    } catch (e: any) {
      showToast(e.message || "Lỗi không xác định", false);
    } finally { setSaving(null); }
  };

  const navItems = [
    {
      id: "overview" as Tab,
      label: "Tổng quan",
      icon: Bell,
      description: "Xem trạng thái tất cả kênh",
    },
    {
      id: "email" as Tab,
      label: "Cấu hình Email",
      icon: Mail,
      description: "Nhận cảnh báo qua email",
      badge: emailConfig.enabled ? "Đang bật" : "Tắt",
      badgeColor: emailConfig.enabled ? "text-emerald-600 bg-emerald-50 border-emerald-200" : "text-slate-400 bg-slate-50 border-slate-200",
    },
    {
      id: "telegram" as Tab,
      label: "Cấu hình Telegram",
      icon: Send,
      description: "Nhận tin nhắn qua Telegram Bot",
      badge: tgConfig.enabled ? "Đang bật" : "Tắt",
      badgeColor: tgConfig.enabled ? "text-emerald-600 bg-emerald-50 border-emerald-200" : "text-slate-400 bg-slate-50 border-slate-200",
    },
  ];

  if (loading) return (
    <div className="flex items-center justify-center min-h-96">
      <Loader2 className="h-8 w-8 text-[#F6821F] animate-spin" />
    </div>
  );

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/10">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl shadow-black/10 text-sm font-medium border backdrop-blur-sm animate-in slide-in-from-top-2 transition-all duration-300 ${toast.ok ? "bg-emerald-50/95 border-emerald-200 text-emerald-800" : "bg-red-50/95 border-red-200 text-red-700"}`}>
          {toast.ok ? <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" /> : <ShieldAlert className="h-5 w-5 text-red-500 shrink-0" />}
          {toast.text}
        </div>
      )}

      <div className="p-6 md:p-8 max-w-[1300px]">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-[#F6821F]/10 rounded-xl">
            <Settings2 className="h-5 w-5 text-[#F6821F]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Cài đặt Thông báo</h1>
            <p className="text-xs text-slate-400 mt-0.5">Cấu hình kênh nhận cảnh báo khi website gặp sự cố</p>
          </div>
        </div>

        <div className="flex gap-6 items-start">

          {/* ─── LEFT SIDEBAR NAV ─── */}
          <div className="w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-3 py-3 border-b border-slate-50">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">Kênh thông báo</p>
              </div>
              <nav className="p-2 space-y-0.5">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group ${
                        isActive
                          ? "bg-[#F6821F]/8 text-[#F6821F]"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isActive ? "bg-[#F6821F]/15" : "bg-slate-100 group-hover:bg-slate-200"
                      }`}>
                        <Icon className={`h-4 w-4 ${isActive ? "text-[#F6821F]" : "text-slate-500"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${isActive ? "text-[#F6821F]" : "text-slate-700"}`}>{item.label}</p>
                        {"badge" in item && (
                          <span className={`text-[10px] font-medium border rounded-full px-1.5 py-0.5 inline-block mt-0.5 ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {isActive && <ChevronRight className="h-4 w-4 text-[#F6821F] shrink-0" />}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Quick tip */}
            <div className="mt-4 bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <div className="flex items-start gap-2.5">
                <Zap className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-blue-700 mb-1">Thông báo tức thì</p>
                  <p className="text-[11px] text-blue-500 leading-relaxed">
                    Cảnh báo được gửi ngay khi hệ thống phát hiện trạng thái thay đổi.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ─── MAIN CONTENT ─── */}
          <div className="flex-1 min-w-0">

            {/* ── OVERVIEW TAB ── */}
            {activeTab === "overview" && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h2 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
                    <Bell className="h-4.5 w-4.5 text-[#F6821F]" />
                    Trạng thái kênh thông báo
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Email card */}
                    <button
                      onClick={() => setActiveTab("email")}
                      className="group text-left p-5 bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 rounded-2xl transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                          <Mail className="h-5 w-5 text-blue-500" />
                        </div>
                        <span className={`text-[10px] font-semibold border rounded-full px-2 py-1 ${emailConfig.enabled ? "text-emerald-600 bg-emerald-50 border-emerald-200" : "text-slate-400 bg-white border-slate-200"}`}>
                          {emailConfig.enabled ? "● Đang bật" : "○ Tắt"}
                        </span>
                      </div>
                      <p className="font-bold text-sm text-slate-800">Email Alerts</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">{emailConfig.target || "Chưa cấu hình"}</p>
                      <p className="text-[11px] text-blue-500 mt-3 font-medium group-hover:underline flex items-center gap-1">
                        Cấu hình <ChevronRight className="h-3 w-3" />
                      </p>
                    </button>

                    {/* Telegram card */}
                    <button
                      onClick={() => setActiveTab("telegram")}
                      className="group text-left p-5 bg-slate-50 hover:bg-[#f0f9ff] border border-slate-100 hover:border-[#0088cc]/30 rounded-2xl transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-[#0088cc]/10 flex items-center justify-center">
                          <Send className="h-5 w-5 text-[#0088cc]" />
                        </div>
                        <span className={`text-[10px] font-semibold border rounded-full px-2 py-1 ${tgConfig.enabled ? "text-emerald-600 bg-emerald-50 border-emerald-200" : "text-slate-400 bg-white border-slate-200"}`}>
                          {tgConfig.enabled ? "● Đang bật" : "○ Tắt"}
                        </span>
                      </div>
                      <p className="font-bold text-sm text-slate-800">Telegram Bot</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">{tgConfig.target ? `Chat ID: ${tgConfig.target}` : "Chưa cấu hình"}</p>
                      <p className="text-[11px] text-[#0088cc] mt-3 font-medium group-hover:underline flex items-center gap-1">
                        Cấu hình <ChevronRight className="h-3 w-3" />
                      </p>
                    </button>
                  </div>
                </div>

                {/* Variables reference */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-slate-400" />
                    Biến có thể dùng trong nội dung thông báo
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { code: "{domain}", desc: "Tên miền / URL của monitor" },
                      { code: "{status}", desc: "Trạng thái hiện tại (DOWN / UP)" },
                      { code: "{time}", desc: "Thời điểm phát hiện sự cố" },
                      { code: "{response_time}", desc: "Thời gian phản hồi (ms)" },
                    ].map(v => (
                      <div key={v.code} className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <code className="text-xs font-mono font-bold text-[#0088cc] shrink-0 mt-0.5">{v.code}</code>
                        <p className="text-[11px] text-slate-500">{v.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── EMAIL TAB ── */}
            {activeTab === "email" && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Card header accent */}
                <div className="h-1 bg-gradient-to-r from-blue-400 to-indigo-500" />
                <div className="p-7">
                  <div className="flex items-center justify-between mb-7">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shadow-sm">
                        <Mail className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-800">Email Alerts</h2>
                        <p className="text-xs text-slate-400">Nhận cảnh báo trực tiếp vào hộp thư</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold transition-colors ${emailConfig.enabled ? "text-emerald-600" : "text-slate-400"}`}>
                        {emailConfig.enabled ? "Đang bật" : "Đã tắt"}
                      </span>
                      <Toggle checked={emailConfig.enabled} onChange={v => setEmailConfig(p => ({ ...p, enabled: v }))} colorClass="bg-[#F6821F]" />
                    </div>
                  </div>

                  <div className="space-y-5">
                    <InputField
                      label="Địa chỉ Email nhận thông báo"
                      icon={Mail}
                      value={emailConfig.target}
                      onChange={v => setEmailConfig(p => ({ ...p, target: v }))}
                      placeholder="admin@example.com"
                      helper="Hệ thống sẽ gửi email ngay khi phát hiện DOWN và khi khôi phục UP."
                    />

                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
                      <Info className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <div className="text-[11px] text-amber-700 leading-relaxed space-y-1">
                        <p className="font-semibold">Lưu ý về giới hạn gửi:</p>
                        <p>Mỗi sự cố gửi tối đa <strong>2 email</strong> — 1 khi DOWN và 1 khi khôi phục UP.</p>
                        <p>Email được gửi ngay lập tức, không có độ trễ.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-7 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => save("EMAIL", emailConfig)}
                    disabled={saving === "EMAIL"}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-7 py-2.5 rounded-xl transition-all shadow-sm"
                  >
                    {saving === "EMAIL" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                    Lưu cấu hình Email
                  </button>
                </div>
              </div>
            )}

            {/* ── TELEGRAM TAB ── */}
            {activeTab === "telegram" && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Card header accent */}
                <div className="h-1 bg-gradient-to-r from-[#0088cc] to-[#54a9eb]" />
                <div className="p-7">
                  <div className="flex items-center justify-between mb-7">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-[#0088cc]/10 border border-[#0088cc]/20 flex items-center justify-center shadow-sm">
                        <Send className="h-5 w-5 text-[#0088cc]" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-800">Telegram Bot</h2>
                        <p className="text-xs text-slate-400">Gửi tin nhắn cảnh báo qua bot Telegram</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold transition-colors ${tgConfig.enabled ? "text-emerald-600" : "text-slate-400"}`}>
                        {tgConfig.enabled ? "Đang bật" : "Đã tắt"}
                      </span>
                      <Toggle checked={tgConfig.enabled} onChange={v => setTgConfig(p => ({ ...p, enabled: v }))} colorClass="bg-[#0088cc]" />
                    </div>
                  </div>

                  <div className="space-y-5">
                    <InputField
                      label="Bot Token"
                      icon={Key}
                      type="password"
                      value={tgConfig.bot_token}
                      onChange={v => setTgConfig(p => ({ ...p, bot_token: v }))}
                      placeholder="1234567890:ABCDEFGHIJKLM..."
                      helper="Lấy token từ"
                      helperLink={{ text: "@BotFather", href: "https://t.me/BotFather" }}
                    />

                    <InputField
                      label="Chat ID"
                      icon={Hash}
                      value={tgConfig.target}
                      onChange={v => setTgConfig(p => ({ ...p, target: v }))}
                      placeholder="-100123456789 hoặc 123456789"
                      helper="Dùng"
                      helperLink={{ text: "@userinfobot", href: "https://t.me/userinfobot" }}
                      mono
                    />

                    {/* Message template */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <MessageSquare className="h-3.5 w-3.5" />
                        Nội dung thông báo
                      </label>
                      <textarea
                        value={tgConfig.message_template}
                        onChange={e => setTgConfig(p => ({ ...p, message_template: e.target.value }))}
                        rows={3}
                        placeholder={DEFAULT_MSG}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-300 focus:border-[#0088cc] focus:ring-4 focus:ring-[#0088cc]/10 resize-none"
                      />

                      {/* Variable chips */}
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                        <p className="text-[11px] font-semibold text-slate-500 mb-3 flex items-center gap-1.5">
                          <Info className="h-3.5 w-3.5 text-[#0088cc]" />
                          Biến có thể dùng:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { code: "{domain}", desc: "Tên miền" },
                            { code: "{status}", desc: "DOWN / UP" },
                            { code: "{time}", desc: "Thời điểm" },
                            { code: "{response_time}", desc: "ms" },
                          ].map(v => (
                            <button
                              key={v.code}
                              onClick={() => setTgConfig(p => ({ ...p, message_template: p.message_template + " " + v.code }))}
                              title={`Chèn ${v.code}`}
                              className="flex items-center gap-1.5 bg-white border border-slate-200 hover:border-[#0088cc]/40 hover:bg-blue-50 rounded-lg px-2.5 py-1.5 shadow-sm transition-all cursor-pointer"
                            >
                              <code className="text-[10px] font-mono font-bold text-[#0088cc]">{v.code}</code>
                              <span className="text-[10px] text-slate-400">— {v.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-7 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => save("TELEGRAM", {
                      target: tgConfig.target,
                      bot_token: tgConfig.bot_token,
                      message_template: tgConfig.message_template,
                      enabled: tgConfig.enabled,
                    })}
                    disabled={saving === "TELEGRAM"}
                    className="flex items-center gap-2 bg-[#0088cc] hover:bg-[#0077b3] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-7 py-2.5 rounded-xl transition-all shadow-sm"
                  >
                    {saving === "TELEGRAM" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    Lưu cấu hình Telegram
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
