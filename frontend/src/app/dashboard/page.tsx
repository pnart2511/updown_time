"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Globe,
  Plus,
  TrendingUp,
  Wifi,
  WifiOff,
} from "lucide-react";

// ── Mock data ──────────────────────────────────────────────────────────────────
const stats = [
  {
    label: "Monitors",
    value: "12",
    sub: "Đang hoạt động",
    icon: Activity,
    color: "bg-blue-50 text-blue-600",
    trend: "+2 tuần này",
  },
  {
    label: "Uptime trung bình",
    value: "99.97%",
    sub: "30 ngày qua",
    icon: TrendingUp,
    color: "bg-emerald-50 text-emerald-600",
    trend: "↑ 0.02%",
  },
  {
    label: "Sự cố",
    value: "1",
    sub: "Đang mở",
    icon: AlertCircle,
    color: "bg-red-50 text-red-500",
    trend: "3 trong 30 ngày",
  },
  {
    label: "Phản hồi TB",
    value: "182ms",
    sub: "Trung bình toàn cầu",
    icon: Clock,
    color: "bg-purple-50 text-purple-600",
    trend: "↓ 12ms so với tuần trước",
  },
];

const monitors = [
  { name: "api.upmonitor.vn", url: "https://api.upmonitor.vn", status: "up", uptime: "100%", ping: "95ms", lastCheck: "30s" },
  { name: "app.upmonitor.vn", url: "https://app.upmonitor.vn", status: "up", uptime: "99.98%", ping: "120ms", lastCheck: "1m" },
  { name: "cdn.upmonitor.vn", url: "https://cdn.upmonitor.vn", status: "up", uptime: "100%", ping: "40ms", lastCheck: "45s" },
  { name: "dashboard.internal", url: "https://dashboard.internal", status: "down", uptime: "97.2%", ping: "—", lastCheck: "2m" },
  { name: "webhook.upmonitor.vn", url: "https://webhook.upmonitor.vn", status: "up", uptime: "99.91%", ping: "210ms", lastCheck: "30s" },
];

const incidents = [
  { title: "dashboard.internal không phản hồi", severity: "critical", started: "2 giờ trước", status: "open" },
  { title: "Độ trễ cao tại khu vực Singapore", severity: "warning", started: "1 ngày trước", status: "resolved" },
];

// ── Uptime bar (Real data from logs) ─────────────────────────────────────────
function UptimeBar({ logs }: { logs?: any[] }) {
  // If no logs, show gray bars
  if (!logs || logs.length === 0) {
    return (
      <div className="flex gap-[2px] items-center">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="h-5 w-1 rounded-sm bg-gray-100" />
        ))}
      </div>
    );
  }

  // We have up to 40 logs from backend. Map them directly.
  return (
    <div className="flex gap-[2px] items-center">
      {logs.map((log, i) => (
        <div
          key={i}
          className={`h-5 w-1 rounded-sm ${
            log.is_success ? "bg-emerald-400" : "bg-red-400"
          }`}
          title={`${new Date(log.recorded_at).toLocaleString()}: ${log.is_success ? 'UP' : 'DOWN'}`}
        />
      ))}
      {/* Fill remaining with gray if less than 40 */}
      {logs.length < 40 && Array.from({ length: 40 - logs.length }).map((_, i) => (
        <div key={`empty-${i}`} className="h-5 w-1 rounded-sm bg-gray-50" />
      ))}
    </div>
  );
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function DashboardPage() {
  const router = useRouter();
  const [greeting, setGreeting] = useState("Xin chào");
  const [userName, setUserName] = useState("bạn");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    stats: any;
    monitors: any[];
    recent_incidents: any[];
  } | null>(null);

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting("Chào buổi sáng");
    else if (h < 18) setGreeting("Chào buổi chiều");
    else setGreeting("Chào buổi tối");

    const stored = localStorage.getItem("user");
    if (stored) {
      const u = JSON.parse(stored);
      setUserName(u.full_name?.split(" ").slice(-1)[0] ?? u.email.split("@")[0]);
    }

    const fetchData = async (isInitial = false) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const res = await fetch(`${API_URL}/api/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error("Failed to fetch dashboard data:", e);
      } finally {
        if (isInitial) setLoading(false);
      }
    };

    fetchData(true);

    const interval = setInterval(() => fetchData(false), 10000);
    return () => clearInterval(interval);
  }, [router]);

  if (loading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-[#F6821F]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm font-medium text-gray-500">Đang tải dữ liệu gốc...</p>
        </div>
      </div>
    );
  }

  // Lắp ghép stats thực từ API
  const dStats = data?.stats || { total_monitors: 0, up_monitors: 0, open_incidents: 0, avg_ping_ms: 0 };

  // Tính % Uptime tương đối (đơn giản, nếu có UP/Total)
  let uptimeStr = "0%";
  if (dStats.total_monitors > 0) {
    uptimeStr = ((dStats.up_monitors / dStats.total_monitors) * 100).toFixed(1) + "%";
  }

  const dynamicStats = [
    {
      label: "Tổng Monitors",
      value: dStats.total_monitors.toString(),
      sub: `${dStats.up_monitors} đang UP`,
      icon: Activity,
      color: "bg-blue-50 text-blue-600",
      trend: "Hoạt động",
    },
    {
      label: "Trạng thái",
      value: uptimeStr,
      sub: "Monitors đang UP",
      icon: TrendingUp,
      color: "bg-emerald-50 text-emerald-600",
      trend: "Ổn định",
    },
    {
      label: "Sự cố",
      value: dStats.open_incidents.toString(),
      sub: "Đang mở",
      icon: AlertCircle,
      color: dStats.open_incidents > 0 ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-400",
      trend: "Cần chú ý",
    },
    {
      label: "Phản hồi TB",
      value: `${dStats.avg_ping_ms}ms`,
      sub: "Trung bình toàn cục",
      icon: Clock,
      color: "bg-purple-50 text-purple-600",
      trend: "Tốc độ",
    },
  ];

  const monitors = data?.monitors || [];
  const incidents = data?.recent_incidents || [];

  return (
    <div className="p-6 md:p-8 max-w-full space-y-8">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1D3557]">{greeting}, {userName} 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Đây là tổng quan hệ thống của bạn hôm nay.</p>
        </div>
        <Link
          href="/dashboard/monitors/new"
          className="inline-flex items-center gap-2 bg-[#F6821F] hover:bg-[#e0721a] text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-md shadow-orange-200"
        >
          <Plus className="h-4 w-4" />
          Thêm Monitor
        </Link>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {dynamicStats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-500">{s.label}</p>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon className="h-4.5 w-4.5" />
              </div>
            </div>
            <p className="text-3xl font-black text-[#1D3557] mb-1">{s.value}</p>
            <p className="text-xs text-gray-400">{s.sub}</p>
            <p className={`text-xs font-medium mt-2 ${s.trend.includes("Cần chú ý") ? "text-red-600" : "text-emerald-600"}`}>
              {s.trend}
            </p>
          </div>
        ))}
      </div>

      {/* ── Monitors table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-[#1D3557] text-base">Monitors</h2>
          <Link href="/dashboard/monitors" className="text-xs text-[#F6821F] font-semibold flex items-center gap-1 hover:underline">
            Xem tất cả <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <th className="text-left px-6 py-3">Tên</th>
                <th className="text-left px-6 py-3">Trạng thái</th>
                <th className="text-left px-6 py-3 hidden md:table-cell">Lịch sử Uptime</th>
                <th className="text-left px-6 py-3 hidden sm:table-cell">Kiểm tra</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {monitors.map((m: any) => (
                <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${m.status === "UP" ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" : m.status === "PAUSED" ? "bg-gray-400" : "bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.6)]"}`} />
                      <div>
                        <p className="font-semibold text-[#1D3557]">{m.name}</p>
                        <p className="text-xs text-gray-400 truncate max-w-[180px]">{m.target}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {m.status === "UP" ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                        <Wifi className="h-3 w-3" /> UP
                      </span>
                    ) : m.status === "PAUSED" ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full">
                        Tạm dừng
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">
                        <WifiOff className="h-3 w-3" /> DOWN
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <UptimeBar logs={m.ping_logs} />
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className="text-gray-500 text-xs">Mỗi {m.check_interval}s</span>
                  </td>
                </tr>
              ))}
              {monitors.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400 text-sm">
                    Bạn chưa có Monitor nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Incidents ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-[#1D3557] text-base">Sự cố gần đây</h2>
          <Link href="/dashboard/incidents" className="text-xs text-[#F6821F] font-semibold flex items-center gap-1 hover:underline">
            Xem tất cả <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {incidents.map((inc: any) => (
            <div key={inc.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${inc.status === "open" ? "bg-red-400" : "bg-emerald-400"}`} />
                <div>
                  <p className="font-semibold text-[#1D3557] text-sm">
                    {inc.monitor_name} <span className="text-gray-400 font-normal">— {inc.cause ?? "Không phản hồi"}</span>
                  </p>
                  <p className="text-xs text-gray-400">Từ: {new Date(inc.start_time).toLocaleString("vi-VN")}</p>
                </div>
              </div>
              {inc.status === "open" ? (
                <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full shrink-0">Đang mở</span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full shrink-0">
                  <CheckCircle2 className="h-3 w-3" /> Đã đóng
                </span>
              )}
            </div>
          ))}
          {incidents.length === 0 && (
            <div className="px-6 py-10 text-center text-gray-400 text-sm">Không có sự cố nào. Tuyệt vời! 🎉</div>
          )}
        </div>
      </div>

    </div>
  );
}
