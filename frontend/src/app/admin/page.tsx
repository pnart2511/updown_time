"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Activity,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Clock,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface Stats {
  total_users: number;
  total_monitors: number;
  up_monitors: number;
  down_monitors: number;
  open_incidents: number;
  recent_incidents: {
    id: number;
    monitor_name: string;
    cause: string;
    start_time: string;
  }[];
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    try {
      const res = await fetch(`${API_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 403) { router.push("/dashboard"); return; }
      const data = await res.json();
      setStats(data);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const cards = stats ? [
    { label: "Người dùng", value: stats.total_users, icon: Users, color: "blue", bg: "bg-blue-50", iconCol: "text-blue-500" },
    { label: "Monitors", value: stats.total_monitors, icon: Activity, color: "purple", bg: "bg-purple-50", iconCol: "text-purple-500" },
    { label: "Đang UP", value: stats.up_monitors, icon: CheckCircle2, color: "emerald", bg: "bg-emerald-50", iconCol: "text-emerald-500" },
    { label: "Đang DOWN", value: stats.down_monitors, icon: AlertCircle, color: "red", bg: "bg-red-50", iconCol: "text-red-500" },
    { label: "Sự cố mở", value: stats.open_incidents, icon: TrendingUp, color: "orange", bg: "bg-orange-50", iconCol: "text-orange-500" },
  ] : [];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1D3557]">Tổng quan Hệ thống</h1>
        <p className="text-gray-500 mt-1 text-sm">Thống kê toàn hệ thống UpMonitor.</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-16">
          <div className="h-8 w-8 border-4 border-[#F6821F] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {cards.map((c) => (
              <div key={c.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                <div className={`p-3 rounded-xl ${c.bg}`}>
                  <c.icon className={`h-6 w-6 ${c.iconCol}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{c.label}</p>
                  <p className="text-2xl font-bold text-[#1D3557]">{c.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Incidents Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-bold text-[#1D3557] flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#F6821F]" />
                Sự cố gần đây (Toàn hệ thống)
              </h2>
            </div>
            {stats?.recent_incidents?.length === 0 ? (
              <div className="p-10 text-center text-gray-400 text-sm">
                <CheckCircle2 className="h-10 w-10 text-emerald-300 mx-auto mb-2" />
                Không có sự cố nào gần đây!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs text-gray-400 uppercase font-semibold">
                    <tr>
                      <th className="px-5 py-3 text-left">Monitor</th>
                      <th className="px-5 py-3 text-left">Nguyên nhân</th>
                      <th className="px-5 py-3 text-left">Thời gian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {stats?.recent_incidents?.map((inc) => (
                      <tr key={inc.id} className="hover:bg-gray-50/50">
                        <td className="px-5 py-3 font-semibold text-[#1D3557]">{inc.monitor_name}</td>
                        <td className="px-5 py-3">
                          <span className="px-2 py-0.5 bg-orange-50 text-orange-700 text-xs rounded-md border border-orange-100">
                            {inc.cause || "Không rõ"}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-gray-500 text-xs">
                          {new Date(inc.start_time).toLocaleString("vi-VN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
