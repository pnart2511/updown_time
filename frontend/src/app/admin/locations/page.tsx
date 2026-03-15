"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, CheckCircle2, XCircle, MapPin, Globe } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface Location {
  id: number;
  name: string;
  code: string;
  flag: string;
  region: string;
  is_active: boolean;
}

const REGIONS = ["Asia", "EU", "US", "Oceania", "South America", "Africa"];

const REGION_FLAGS: Record<string, string> = {
  Asia: "🌏",
  EU: "🌍",
  US: "🌎",
  Oceania: "🌏",
  "South America": "🌎",
  Africa: "🌍",
};

const REGION_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Asia: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  EU: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  US: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  Oceania: { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
  "South America": { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
  Africa: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
};

const COMMON_FLAGS = [
  { flag: "🇻🇳", label: "Việt Nam" },
  { flag: "🇸🇬", label: "Singapore" },
  { flag: "🇯🇵", label: "Nhật Bản" },
  { flag: "🇰🇷", label: "Hàn Quốc" },
  { flag: "🇩🇪", label: "Đức" },
  { flag: "🇬🇧", label: "Anh" },
  { flag: "🇫🇷", label: "Pháp" },
  { flag: "🇺🇸", label: "Mỹ" },
  { flag: "🇦🇺", label: "Úc" },
  { flag: "🇧🇷", label: "Brazil" },
  { flag: "🇮🇳", label: "Ấn Độ" },
  { flag: "🇨🇳", label: "Trung Quốc" },
];

const EMPTY_FORM = { name: "", code: "", flag: "🌐", region: "Asia", is_active: true };

export default function AdminLocationsPage() {
  const router = useRouter();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Location | null>(null);
  const [form, setForm] = useState<typeof EMPTY_FORM>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const token = () => localStorage.getItem("token") || "";

  const fetchLocations = useCallback(async () => {
    const res = await fetch(`${API_URL}/api/admin/locations`, {
      headers: { Authorization: `Bearer ${token()}` },
    });
    const data = await res.json();
    setLocations(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) { router.push("/login"); return; }
    fetchLocations();
  }, [fetchLocations, router]);

  const openAdd = () => { setForm(EMPTY_FORM); setEditing(null); setModal("add"); };
  const openEdit = (loc: Location) => {
    setForm({ name: loc.name, code: loc.code, flag: loc.flag, region: loc.region, is_active: loc.is_active });
    setEditing(loc);
    setModal("edit");
  };
  const closeModal = () => { setModal(null); setEditing(null); };

  const handleSave = async () => {
    if (!form.name || !form.code || !form.region) return;
    setSaving(true);
    if (modal === "add") {
      await fetch(`${API_URL}/api/admin/locations`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify(form),
      });
    } else if (editing) {
      await fetch(`${API_URL}/api/admin/locations/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify(form),
      });
    }
    await fetchLocations();
    setSaving(false);
    closeModal();
  };

  const toggleActive = async (loc: Location) => {
    const updated = { ...loc, is_active: !loc.is_active };
    await fetch(`${API_URL}/api/admin/locations/${loc.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
      body: JSON.stringify(updated),
    });
    setLocations((prev) => prev.map((l) => l.id === loc.id ? { ...l, is_active: !l.is_active } : l));
  };

  const deleteLocation = async (id: number, name: string) => {
    if (!confirm(`Xóa địa điểm "${name}"?`)) return;
    await fetch(`${API_URL}/api/admin/locations/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token()}` },
    });
    setLocations((prev) => prev.filter((l) => l.id !== id));
  };

  // Group locations by region
  const grouped = REGIONS.reduce<Record<string, Location[]>>((acc, region) => {
    const locs = locations.filter((l) => l.region === region);
    if (locs.length > 0) acc[region] = locs;
    return acc;
  }, {});
  // Catch any unlisted regions
  locations.forEach((l) => {
    if (!REGIONS.includes(l.region)) {
      if (!grouped["Khác"]) grouped["Khác"] = [];
      grouped["Khác"].push(l);
    }
  });

  const activeCount = locations.filter((l) => l.is_active).length;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1D3557]">Địa điểm Ping</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Quản lý vùng địa lý dùng để ping test.{" "}
            <span className="text-emerald-600 font-medium">{activeCount}/{locations.length} đang hoạt động</span>
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#F6821F] hover:bg-[#e0721a] text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-orange-200 active:scale-95"
        >
          <Plus className="h-4 w-4" /> Thêm địa điểm
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-16">
          <div className="h-8 w-8 border-4 border-[#F6821F] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([region, locs]) => {
            const rc = REGION_COLORS[region] || REGION_COLORS["Asia"];
            return (
              <div key={region}>
                {/* Region header */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xl">{REGION_FLAGS[region] || "🌐"}</span>
                  <h2 className="font-bold text-[#1D3557] text-base">{region}</h2>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${rc.bg} ${rc.text} border ${rc.border}`}>
                    {locs.length} địa điểm
                  </span>
                </div>

                {/* Location Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {locs.map((loc) => (
                    <div
                      key={loc.id}
                      className={`relative bg-white rounded-2xl border-2 shadow-sm p-5 transition-all hover:shadow-md ${
                        loc.is_active ? "border-gray-100 hover:border-[#F6821F]/30" : "border-dashed border-gray-200 opacity-60"
                      }`}
                    >
                      {/* Status badge */}
                      <span
                        className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          loc.is_active ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {loc.is_active ? "LIVE" : "OFF"}
                      </span>

                      {/* Flag + Name */}
                      <div className="flex items-start gap-3 mb-4">
                        <span className="text-4xl leading-none">{loc.flag}</span>
                        <div>
                          <p className="font-bold text-[#1D3557] text-sm leading-tight">{loc.name}</p>
                          <p className="font-mono text-xs text-gray-400 mt-0.5">{loc.code}</p>
                        </div>
                      </div>

                      {/* Region pill */}
                      <div className="mb-4">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${rc.bg} ${rc.text}`}>
                          {loc.region}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleActive(loc)}
                          className={`flex-1 text-xs font-semibold py-1.5 rounded-lg transition-colors ${
                            loc.is_active
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                          }`}
                        >
                          {loc.is_active ? (
                            <span className="flex items-center justify-center gap-1"><CheckCircle2 className="h-3 w-3" /> Bật</span>
                          ) : (
                            <span className="flex items-center justify-center gap-1"><XCircle className="h-3 w-3" /> Tắt</span>
                          )}
                        </button>
                        <button
                          onClick={() => openEdit(loc)}
                          className="p-2 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => deleteLocation(loc.id, loc.name)}
                          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Add/Edit */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-[#F6821F]" />
              </div>
              <h2 className="text-lg font-bold text-[#1D3557]">
                {modal === "add" ? "Thêm địa điểm mới" : `Sửa: ${editing?.name}`}
              </h2>
            </div>

            {/* Flag Picker */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Globe className="h-3 w-3" /> Cờ quốc gia
              </label>
              <div className="grid grid-cols-6 gap-2">
                {COMMON_FLAGS.map(({ flag, label }) => (
                  <button
                    key={flag}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, flag }))}
                    title={label}
                    className={`text-2xl py-1 rounded-xl border-2 transition-all hover:scale-110 ${
                      form.flag === flag ? "border-[#F6821F] bg-orange-50 scale-110" : "border-transparent hover:border-gray-200"
                    }`}
                  >
                    {flag}
                  </button>
                ))}
              </div>
              {/* Custom flag input */}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl">{form.flag}</span>
                <input
                  value={form.flag}
                  onChange={(e) => setForm((p) => ({ ...p, flag: e.target.value }))}
                  placeholder="Hoặc nhập emoji tuỳ chỉnh..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#F6821F]/20 focus:border-[#F6821F] outline-none"
                />
              </div>
            </div>

            {/* Name + Code */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tên hiển thị</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Hà Nội"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#F6821F]/20 focus:border-[#F6821F] outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mã (Code)</label>
                <input
                  value={form.code}
                  onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toLowerCase().replace(/\s+/g, "-") }))}
                  placeholder="hanoi"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:ring-2 focus:ring-[#F6821F]/20 focus:border-[#F6821F] outline-none transition-all"
                />
              </div>
            </div>

            {/* Region Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Khu vực</label>
              <select
                value={form.region}
                onChange={(e) => setForm((p) => ({ ...p, region: e.target.value }))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#F6821F]/20 focus:border-[#F6821F] outline-none transition-all"
              >
                {REGIONS.map((r) => (
                  <option key={r} value={r}>{REGION_FLAGS[r]} {r}</option>
                ))}
              </select>
            </div>

            {/* Toggle Active */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm font-semibold text-[#1D3557]">Trạng thái hoạt động</p>
                <p className="text-xs text-gray-400 mt-0.5">User có thể chọn địa điểm này để ping test</p>
              </div>
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, is_active: !p.is_active }))}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${form.is_active ? "bg-emerald-500" : "bg-gray-200"}`}
              >
                <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form.is_active ? "translate-x-6" : ""}`} />
              </button>
            </div>

            <div className="flex justify-end gap-3 pt-1">
              <button onClick={closeModal} className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors">
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name || !form.code}
                className="px-7 py-2.5 rounded-xl text-sm font-bold bg-[#F6821F] hover:bg-[#e0721a] text-white transition-colors shadow-md shadow-orange-200 disabled:opacity-60 active:scale-95"
              >
                {saving ? "Đang lưu..." : modal === "add" ? "Thêm địa điểm" : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
