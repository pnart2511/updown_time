"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Wifi, WifiOff, ExternalLink } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface MonitorRow {
  id: number;
  user_email: string;
  name: string;
  target: string;
  monitor_type: string;
  status: string;
  check_interval: number;
  created_at: string;
}

export default function AdminMonitorsPage() {
  const router = useRouter();
  const [monitors, setMonitors] = useState<MonitorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "UP" | "DOWN">("all");

  const fetchMonitors = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    const res = await fetch(`${API_URL}/api/admin/monitors`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setMonitors(data || []);
    setLoading(false);
  }, [router]);

  useEffect(() => { fetchMonitors(); }, [fetchMonitors]);

  const filtered = filter === "all" ? monitors : monitors.filter((m) => m.status === filter);
  const upCount = monitors.filter((m) => m.status === "UP").length;
  const downCount = monitors.filter((m) => m.status === "DOWN").length;

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1D3557]">Tất cả Monitors</h1>
        <p className="text-gray-500 mt-1 text-sm">Danh sách monitors của toàn hệ thống.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <button onClick={() => setFilter("all")} className={`p-4 rounded-2xl border text-left transition-all ${filter === "all" ? "bg-[#1D3557] text-white border-[#1D3557] shadow-lg" : "bg-white border-gray-100 shadow-sm hover:border-[#1D3557]/30"}`}>
          <p className={`text-sm ${filter === "all" ? "text-white/70" : "text-gray-500"}`}>Tổng</p>
          <p className={`text-2xl font-bold ${filter === "all" ? "text-white" : "text-[#1D3557]"}`}>{monitors.length}</p>
        </button>
        <button onClick={() => setFilter("UP")} className={`p-4 rounded-2xl border text-left transition-all ${filter === "UP" ? "bg-emerald-600 text-white border-emerald-600 shadow-lg" : "bg-white border-gray-100 shadow-sm hover:border-emerald-200"}`}>
          <p className={`text-sm ${filter === "UP" ? "text-white/70" : "text-gray-500"}`}>Đang UP</p>
          <p className={`text-2xl font-bold ${filter === "UP" ? "text-white" : "text-emerald-600"}`}>{upCount}</p>
        </button>
        <button onClick={() => setFilter("DOWN")} className={`p-4 rounded-2xl border text-left transition-all ${filter === "DOWN" ? "bg-red-600 text-white border-red-600 shadow-lg" : "bg-white border-gray-100 shadow-sm hover:border-red-200"}`}>
          <p className={`text-sm ${filter === "DOWN" ? "text-white/70" : "text-gray-500"}`}>Đang DOWN</p>
          <p className={`text-2xl font-bold ${filter === "DOWN" ? "text-white" : "text-red-600"}`}>{downCount}</p>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="h-8 w-8 border-4 border-[#F6821F] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-400 uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3 text-left">Tên Monitor</th>
                  <th className="px-5 py-3 text-left">Chủ sở hữu</th>
                  <th className="px-5 py-3 text-left">Trạng thái</th>
                  <th className="px-5 py-3 text-left">Loại</th>
                  <th className="px-5 py-3 text-left">Target</th>
                  <th className="px-5 py-3 text-left">Ngày tạo</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-semibold text-[#1D3557]">{m.name}</td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{m.user_email}</td>
                    <td className="px-5 py-4">
                      {m.status === "UP" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                          <Wifi className="h-3 w-3" /> UP
                        </span>
                      ) : m.status === "DOWN" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700">
                          <WifiOff className="h-3 w-3" /> DOWN
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">PAUSED</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-mono">{m.monitor_type}</span>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs font-mono max-w-[200px] truncate" title={m.target}>{m.target}</td>
                    <td className="px-5 py-4 text-gray-400 text-xs">
                      {m.created_at ? new Date(m.created_at).toLocaleDateString("vi-VN") : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/dashboard/monitors/${m.id}/details`}
                        className="text-gray-300 hover:text-[#F6821F] transition-colors"
                        title="Xem chi tiết"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
