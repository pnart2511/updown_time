"use client";

import { useState, useEffect } from "react";
import {
  Mail, CheckCircle2, ShieldAlert, Info, Loader2,
  Zap, Clock, RefreshCw, Shield, ArrowRight
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type NC = { id: number; type: string; target: string; enabled: boolean };

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${checked ? "bg-[#F6821F]" : "bg-gray-200"}`}>
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${checked ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}

export default function EmailSettingsPage() {
  const [email, setEmail] = useState("");
  const [enabled, setEnabled] = useState(false);
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
          const ch = data.find(c => c.type === "EMAIL");
          if (ch) { setEmail(ch.target); setEnabled(ch.enabled); }
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
        body: JSON.stringify({ type: "EMAIL", target: email, enabled }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      setToast({ text: "Đã lưu cấu hình Email thành công!", ok: true });
    } catch (e: any) {
      setToast({ text: e.message || "Lỗi lưu cấu hình", ok: false });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-64">
      <Loader2 className="h-7 w-7 animate-spin text-[#F6821F]" />
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
        <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shadow-sm">
          <Mail className="h-5 w-5 text-blue-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Cấu hình Email</h1>
          <p className="text-xs text-slate-400 mt-0.5">Nhận cảnh báo trực tiếp vào hộp thư điện tử</p>
        </div>
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 items-start">

        {/* ── LEFT: Form card ── (3/5 width) */}
        <div className="xl:col-span-3 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-400 to-indigo-500" />
          <div className="p-7 space-y-6">

            {/* Enable toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <p className="text-sm font-semibold text-slate-700">Kích hoạt Email</p>
                <p className="text-xs text-slate-400 mt-0.5">Bật để nhận thông báo qua email</p>
              </div>
              <div className="flex items-center gap-2.5">
                <span className={`text-xs font-semibold min-w-[52px] text-right ${enabled ? "text-emerald-600" : "text-slate-400"}`}>
                  {enabled ? "Đang bật" : "Đã tắt"}
                </span>
                <Toggle checked={enabled} onChange={setEnabled} />
              </div>
            </div>

            {/* Email input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> Địa chỉ Email nhận thông báo
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all placeholder:text-slate-300"
              />
              <p className="text-[11px] text-slate-400">Hệ thống sẽ gửi cảnh báo đến địa chỉ này khi phát hiện sự cố.</p>
            </div>

            {/* Save button */}
            <button
              onClick={save}
              disabled={saving || !email}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-sm hover:shadow-md"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              Lưu cấu hình Email
            </button>
          </div>
        </div>

        {/* ── RIGHT: Description panel ── (2/5 width) */}
        <div className="xl:col-span-2 space-y-4">

          {/* How it works */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <Zap className="h-4 w-4 text-[#F6821F]" /> Cách thức hoạt động
            </h3>
            <div className="space-y-3">
              {[
                { icon: ArrowRight, text: "Monitor phát hiện website DOWN" },
                { icon: Mail, text: "Email cảnh báo được gửi ngay lập tức" },
                { icon: RefreshCw, text: "Website khôi phục → Email UP được gửi" },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                    <step.icon className="h-3 w-3 text-blue-500" />
                  </div>
                  <p className="text-sm text-slate-600">{step.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Timing */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" /> Thời gian gửi
            </h3>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-xs text-slate-500">Gửi khi DOWN</span>
                <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded-lg">Ngay lập tức</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-xs text-slate-500">Gửi khi UP</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">Ngay lập tức</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-xs text-slate-500">Tối đa / sự cố</span>
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">2 email</span>
              </div>
            </div>
          </div>

          {/* Security note */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-300 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold mb-1.5">Bảo mật & Riêng tư</p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Địa chỉ email được lưu trữ an toàn và chỉ được dùng để gửi thông báo hệ thống.
                  Chúng tôi không chia sẻ email với bên thứ ba.
                </p>
              </div>
            </div>
          </div>

          {/* Tip */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3">
            <Info className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">
              <strong>Mẹo:</strong> Dùng địa chỉ nhóm (group email) để nhiều người cùng nhận được cảnh báo.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
