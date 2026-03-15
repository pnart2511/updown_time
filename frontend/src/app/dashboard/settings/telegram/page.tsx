"use client";

import { useState, useEffect } from "react";
import {
  Send, Key, Hash, MessageSquare, Info, Eye, EyeOff,
  CheckCircle2, ShieldAlert, Loader2, ArrowRight, Bot,
  BookOpen, Zap, Shield
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const DEFAULT_MSG = "⚠️ Website {domain} của bạn đang bị DOWNTIME!\nHãy kiểm tra ngay để tránh ảnh hưởng người dùng.";

type NC = { id: number; type: string; target: string; bot_token: string; message_template: string; enabled: boolean };

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${checked ? "bg-[#0088cc]" : "bg-gray-200"}`}>
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${checked ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}

export default function TelegramSettingsPage() {
  const [botToken, setBotToken] = useState("");
  const [chatId, setChatId] = useState("");
  const [msgTemplate, setMsgTemplate] = useState(DEFAULT_MSG);
  const [enabled, setEnabled] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch(`${API_URL}/api/notifications`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const data: NC[] = await res.json();
          const ch = data.find(c => c.type === "TELEGRAM");
          if (ch) {
            setChatId(ch.target);
            setBotToken(ch.bot_token || "");
            setMsgTemplate(ch.message_template || DEFAULT_MSG);
            setEnabled(ch.enabled);
          }
        }
      } catch { } finally { setLoading(false); }
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/notifications`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ type: "TELEGRAM", target: chatId, bot_token: botToken, message_template: msgTemplate, enabled }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      setToast({ text: "Đã lưu cấu hình Telegram thành công!", ok: true });
    } catch (e: any) {
      setToast({ text: e.message || "Lỗi lưu cấu hình", ok: false });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  const insertVar = (v: string) => setMsgTemplate(prev => prev + " " + v);

  if (loading) return (
    <div className="flex justify-center items-center min-h-64">
      <Loader2 className="h-7 w-7 animate-spin text-[#0088cc]" />
    </div>
  );

  return (
    <div className="p-6 md:p-8 max-w-full">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl shadow-black/10 text-sm font-medium border backdrop-blur-sm ${toast.ok ? "bg-emerald-50/95 border-emerald-200 text-emerald-800" : "bg-red-50/95 border-red-200 text-red-700"}`}>
          {toast.ok ? <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" /> : <ShieldAlert className="h-5 w-5 text-red-500 shrink-0" />}
          {toast.text}
        </div>
      )}

      {/* Page title */}
      <div className="flex items-center gap-3 mb-7">
        <div className="w-10 h-10 rounded-2xl bg-[#0088cc]/10 border border-[#0088cc]/20 flex items-center justify-center shadow-sm">
          <Send className="h-5 w-5 text-[#0088cc]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Cấu hình Telegram</h1>
          <p className="text-xs text-slate-400 mt-0.5">Nhận cảnh báo qua Telegram Bot tức thời</p>
        </div>
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 items-start">

        {/* ── LEFT: Form card ── (3/5) */}
        <div className="xl:col-span-3 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#0088cc] to-[#54a9eb]" />
          <div className="p-7 space-y-6">

            {/* Enable toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <p className="text-sm font-semibold text-slate-700">Kích hoạt Telegram</p>
                <p className="text-xs text-slate-400 mt-0.5">Bật để nhận thông báo qua Telegram Bot</p>
              </div>
              <div className="flex items-center gap-2.5">
                <span className={`text-xs font-semibold min-w-[52px] text-right ${enabled ? "text-emerald-600" : "text-slate-400"}`}>
                  {enabled ? "Đang bật" : "Đã tắt"}
                </span>
                <Toggle checked={enabled} onChange={setEnabled} />
              </div>
            </div>

            {/* Bot Token */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5" /> Bot Token
              </label>
              <div className="relative">
                <input
                  type={showToken ? "text" : "password"}
                  value={botToken}
                  onChange={e => setBotToken(e.target.value)}
                  placeholder="1234567890:ABCDEFGHIJKLMNOPQ..."
                  className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 pr-10 text-sm font-mono outline-none focus:border-[#0088cc] focus:ring-4 focus:ring-[#0088cc]/10 focus:bg-white transition-all placeholder:text-slate-300"
                />
                <button type="button" onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Lấy token từ{" "}
                <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="text-[#0088cc] underline hover:text-blue-700">@BotFather</a>
              </p>
            </div>

            {/* Chat ID */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Hash className="h-3.5 w-3.5" /> Chat ID
              </label>
              <input
                type="text"
                value={chatId}
                onChange={e => setChatId(e.target.value)}
                placeholder="-100123456789 hoặc 123456789"
                className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-[#0088cc] focus:ring-4 focus:ring-[#0088cc]/10 focus:bg-white transition-all placeholder:text-slate-300"
              />
              <p className="text-[11px] text-slate-400">
                Dùng{" "}
                <a href="https://t.me/userinfobot" target="_blank" rel="noreferrer" className="text-[#0088cc] underline hover:text-blue-700">@userinfobot</a>
                {" "}để lấy Chat ID của bạn hoặc nhóm/kênh.
              </p>
            </div>

            {/* Message template */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5" /> Nội dung thông báo
              </label>
              <textarea
                value={msgTemplate}
                onChange={e => setMsgTemplate(e.target.value)}
                rows={4}
                placeholder={DEFAULT_MSG}
                className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0088cc] focus:ring-4 focus:ring-[#0088cc]/10 focus:bg-white resize-none transition-all placeholder:text-slate-300"
              />
              {/* Variable chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { code: "{name}", desc: "Tên Monitor" },
                  { code: "{domain}", desc: "Tên miền / URL" },
                  { code: "{status}", desc: "DOWN/UP" },
                  { code: "{status_code}", desc: "Mã lỗi" },
                  { code: "{time}", desc: "Thời điểm" },
                  { code: "{response_time}", desc: "ms" },
                ].map(v => (
                  <button key={v.code} onClick={() => insertVar(v.code)}
                    title={`Chèn ${v.code}`}
                    className="flex items-center gap-1.5 bg-white border border-slate-200 hover:border-[#0088cc]/40 hover:bg-[#0088cc]/5 rounded-lg px-2.5 py-1.5 text-[10px] shadow-sm transition-all">
                    <code className="font-mono font-bold text-[#0088cc]">{v.code}</code>
                    <span className="text-slate-400">— {v.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Save */}
            <button
              onClick={save}
              disabled={saving || !botToken || !chatId}
              className="w-full flex items-center justify-center gap-2 bg-[#0088cc] hover:bg-[#0077b3] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-sm hover:shadow-md"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Lưu cấu hình Telegram
            </button>
          </div>
        </div>

        {/* ── RIGHT: Guide panel ── (2/5) */}
        <div className="xl:col-span-2 space-y-4">

          {/* Setup guide */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#0088cc]" /> Hướng dẫn thiết lập
            </h3>
            <div className="space-y-4">
              {[
                {
                  step: "01",
                  title: "Tạo Bot mới",
                  desc: 'Mở Telegram, tìm @BotFather, gõ /newbot và đặt tên cho bot.',
                  color: "text-[#0088cc] bg-[#0088cc]/10",
                },
                {
                  step: "02",
                  title: "Lấy Bot Token",
                  desc: "BotFather sẽ cung cấp token dạng 1234567:ABCD... — sao chép vào ô bên trên.",
                  color: "text-purple-600 bg-purple-50",
                },
                {
                  step: "03",
                  title: "Lấy Chat ID",
                  desc: "Nhắn tin cho @userinfobot để lấy ID của bạn. Với nhóm: thêm bot vào, dùng @getidsbot.",
                  color: "text-emerald-600 bg-emerald-50",
                },
                {
                  step: "04",
                  title: "Kích hoạt & Lưu",
                  desc: "Bật toggle, điền thông tin và nhấn Lưu. Bot sẽ bắt đầu gửi cảnh báo.",
                  color: "text-[#F6821F] bg-orange-50",
                },
              ].map(s => (
                <div key={s.step} className="flex gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-black ${s.color}`}>{s.step}</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{s.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Variables reference */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Bot className="h-4 w-4 text-slate-400" /> Biến trong tin nhắn
            </h3>
            <div className="space-y-2">
              {[
                { code: "{name}", desc: "Tên gợi nhớ của monitor" },
                { code: "{domain}", desc: "URL hoặc tên miền đang được giám sát" },
                { code: "{status}", desc: "Trạng thái hiện tại: DOWN hoặc UP" },
                { code: "{status_code}", desc: "Mã trạng thái phản hồi (ví dụ: 404, 500)" },
                { code: "{time}", desc: "Thời điểm phát hiện sự cố" },
                { code: "{response_time}", desc: "Thời gian phản hồi tính bằng ms" },
              ].map(v => (
                <div key={v.code} className="flex gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <code className="text-[11px] font-mono font-bold text-[#0088cc] shrink-0 w-[130px]">{v.code}</code>
                  <p className="text-[11px] text-slate-500">{v.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 bg-[#0088cc]/5 border border-[#0088cc]/15 rounded-xl p-3 flex gap-2">
              <Info className="h-3.5 w-3.5 text-[#0088cc] shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#0077b3]">Nhấn vào chip biến để chèn tự động vào nội dung tin nhắn.</p>
            </div>
          </div>

          {/* Example message */}
          <div className="bg-gradient-to-br from-[#0088cc] to-[#54a9eb] rounded-2xl p-5 text-white">
            <p className="text-xs font-bold mb-3 flex items-center gap-2">
              <Zap className="h-3.5 w-3.5" /> Ví dụ tin nhắn mẫu
            </p>
            <div className="bg-white/15 backdrop-blur rounded-xl p-3 font-mono text-xs leading-relaxed">
              ⚠️ Website <span className="bg-white/20 px-1 rounded">example.com</span> đang bị DOWNTIME!<br />
              📅 Phát hiện lúc: <span className="bg-white/20 px-1 rounded">18:05:00</span><br />
              ⏱ Phản hồi: <span className="bg-white/20 px-1 rounded">timeout</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
