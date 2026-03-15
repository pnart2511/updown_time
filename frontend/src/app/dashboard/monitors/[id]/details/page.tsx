"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Activity, AlertTriangle, Wifi, WifiOff, CheckCircle2, XCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type Period = "realtime" | "24h" | "7d" | "30d";

export default function MonitorDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [monitor, setMonitor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pingTab, setPingTab] = useState<"ok" | "fail">("ok");
  const [period, setPeriod] = useState<Period>("realtime");

  // Pagination states
  const [logs, setLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchDetails = useCallback(async (isInitial = false) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(`${API_URL}/api/monitors/${id}?period=${period}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error("Không thể tải dữ liệu chi tiết.");
      }

      const data = await res.json();
      setMonitor(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, [id, router, period]);

  const fetchLogs = useCallback(async (isInitial = false) => {
    try {
      setLogsLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/monitors/${id}/logs?page=${page}&limit=50&status=${pingTab}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.total || 0);
      }
    } catch (err) {
      console.error("Fetch logs error:", err);
    } finally {
      setLogsLoading(false);
    }
  }, [id, page, pingTab]);

  useEffect(() => {
    if (period !== "realtime" && pingTab !== "fail") {
      setPingTab("fail");
    }
  }, [period, pingTab]);

  useEffect(() => {
    setLoading(true);
    fetchDetails(true);
  }, [id, period, fetchDetails]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Reset page when switching tabs
  useEffect(() => {
    setPage(1);
  }, [pingTab, period]);

  // Polling only for realtime
  useEffect(() => {
    if (period !== "realtime") return;
    
    const interval = setInterval(() => fetchDetails(false), 5000);
    return () => clearInterval(interval);
  }, [fetchDetails, period]);

  if (loading) {
    return (
      <div className="p-12 flex justify-center items-center">
        <svg className="animate-spin h-8 w-8 text-[#F6821F]" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (error || !monitor) {
    return (
      <div className="p-8">
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 mb-4">{error || "Monitor không tồn tại"}</div>
        <Link href="/dashboard/monitors" className="text-blue-600 hover:underline">Quay lại danh sách</Link>
      </div>
    );
  }

  // Format chart data
  const chartData = (monitor.ping_logs || []).map((log: any) => {
    const d = new Date(log.recorded_at);
    return {
      fullTime: d.toLocaleString("vi-VN", { 
        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' 
      }),
      timeLabel: period === "realtime" 
        ? `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`
        : `${d.getDate()}/${d.getMonth()+1} ${d.getHours()}:00`,
      ping: log.latency_ms,
      status: log.status_code
    };
  });

  // Calculate avg response time
  const avgResponseTime = chartData.length > 0
    ? Math.round(chartData.reduce((acc: number, val: any) => acc + val.ping, 0) / chartData.length)
    : 0;

  const periods: { id: Period; label: string }[] = [
    { id: "realtime", label: "Realtime" },
    { id: "24h", label: "24 Giờ" },
    { id: "7d", label: "7 Ngày" },
    { id: "30d", label: "30 Ngày" },
  ];

  return (
    <div className="p-6 md:p-8 max-w-full space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/monitors" className="p-2 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 text-gray-500 transition-colors shadow-sm">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#1D3557] flex items-center gap-3">
              {monitor.name}
              {monitor.status === "UP" ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-wider">
                  <Wifi className="h-3 w-3" /> UP
                </span>
              ) : monitor.status === "PAUSED" ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full border border-gray-200 uppercase tracking-wider">
                  PAUSED
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100 uppercase tracking-wider">
                  <WifiOff className="h-3 w-3" /> DOWN
                </span>
              )}
            </h1>
            <a href={monitor.target} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-xs font-mono mt-1 inline-block opacity-80">
              {monitor.target}
            </a>
          </div>
        </div>
        <Link
          href={`/dashboard/monitors/${monitor.id}`}
          className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-[#1D3557] font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm active:scale-95"
        >
          Thiết lập Monitor
        </Link>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-shadow">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Trạng thái</p>
            <p className="text-xl font-extrabold text-[#1D3557] mt-1">
              {monitor.status === "UP" ? "Hoạt động" : monitor.status === "DOWN" ? "Đang lỗi" : "Tạm dừng"}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-shadow">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Trung bình {period}</p>
            <p className="text-xl font-extrabold text-[#1D3557] mt-1">{avgResponseTime} ms</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-shadow">
          <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl group-hover:scale-110 transition-transform">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sự cố {period}</p>
            <p className="text-xl font-extrabold text-[#1D3557] mt-1">{monitor.Incidents?.length || 0} lần</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* ── Chart Section ── */}
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <h2 className="text-lg font-extrabold text-[#1D3557] flex items-center gap-3">
              <div className="w-1.5 h-6 bg-[#F6821F] rounded-full" />
              Hiệu suất phản hồi (ms)
            </h2>
            
            {/* Time Period Tabs */}
            <div className="flex bg-gray-100/80 p-1.5 rounded-2xl">
              {periods.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPeriod(p.id)}
                  className={`px-5 py-2 text-xs font-bold rounded-xl transition-all ${
                    period === p.id 
                    ? "bg-white text-[#F6821F] shadow-sm" 
                    : "text-gray-500 hover:text-[#1D3557]"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {chartData.length > 0 ? (
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                  <defs>
                    <linearGradient id="colorPing" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F6821F" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#F6821F" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#f3f4f6" strokeOpacity={0.8} />
                  <XAxis
                    dataKey="timeLabel"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 700 }}
                    dy={15}
                    interval={period === "realtime" ? 4 : period === "24h" ? 4 : 24}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 600 }}
                    dx={-5}
                    unit="ms"
                  />
                  <Tooltip
                    content={({ active, payload, label }: any) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-[#1D3557] text-white p-4 rounded-2xl shadow-2xl border border-slate-700/50">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{data.fullTime}</p>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-[#F6821F]" />
                              <p className="text-lg font-black">{payload[0].value}ms</p>
                            </div>
                            <p className="text-[10px] mt-1 font-bold text-slate-300">Status: {data.status || 'Success'}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="ping"
                    stroke="#F6821F"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorPing)"
                    dot={{ fill: '#F6821F', r: 3, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, fill: '#1D3557', stroke: '#fff', strokeWidth: 2 }}
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (

            <div className="h-[350px] flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                <Activity className="h-12 w-12 mb-3 opacity-20" />
                <p className="font-semibold px-6 text-center">Chưa có đủ dữ liệu lịch sử trong khoảng thời gian này.</p>
            </div>
          )}
        </div>

        {/* ── Bottom Section: Logs ── */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full max-h-[500px]">
          {/* Tab header */}
          <div className="border-b border-gray-50 flex items-center justify-between px-6 pt-6 pb-0 bg-white">
            <h3 className="font-extrabold text-[#1D3557] flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                <Clock className="h-4 w-4" />
              </div>
              {period === "realtime" ? `Nhật ký kiểm tra ${period}` : `Danh sách sự cố ${period}`}
            </h3>
            
            {period === "realtime" ? (
              <div className="flex gap-1 mb-[-1px]">
                <button
                  onClick={() => setPingTab("ok")}
                  className={`flex items-center gap-2 px-6 py-3 text-[13px] font-bold rounded-t-2xl border-b-4 transition-all ${
                    pingTab === "ok"
                      ? "border-emerald-500 text-emerald-600 bg-emerald-50/50"
                      : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Hoạt động
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${
                    pingTab === "ok" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {totalCount && pingTab === "ok" ? totalCount : 0}
                  </span>
                </button>
                <button
                  onClick={() => setPingTab("fail")}
                  className={`flex items-center gap-2 px-6 py-3 text-[13px] font-bold rounded-t-2xl border-b-4 transition-all ${
                    pingTab === "fail"
                      ? "border-red-500 text-red-600 bg-red-50/50"
                      : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Sự cố
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${
                    pingTab === "fail" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {totalCount && pingTab === "fail" ? totalCount : 0}
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex gap-1 mb-[-1px]">
                  <div className="flex items-center gap-2 px-6 py-3 text-[13px] font-bold rounded-t-2xl border-b-4 border-red-500 text-red-600 bg-red-50/50">
                    Sự cố
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-red-100 text-red-700">
                      {totalCount}
                    </span>
                  </div>
              </div>
            )}
          </div>

          <div className="overflow-y-auto flex-1 custom-scrollbar relative">
            {logsLoading && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-20 flex items-center justify-center">
                 <div className="flex flex-col items-center gap-2">
                    <svg className="animate-spin h-6 w-6 text-[#1D3557]" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span className="text-[10px] font-black text-[#1D3557] uppercase tracking-widest">Đang tải...</span>
                 </div>
              </div>
            )}

            {logs.length > 0 ? (
              <>
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-gray-50/50 text-[10px] text-gray-400 uppercase font-black tracking-widest sticky top-0 backdrop-blur-md z-10">
                    <tr>
                      <th className="px-8 py-4">Thời gian ghi nhận</th>
                      <th className="px-8 py-4">Mã trạng thái</th>
                      <th className="px-8 py-4 text-right">Độ trễ (ms)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {logs.map((log: any) => (
                      <tr key={log.id} className="hover:bg-gray-50/80 transition-colors group">
                        <td className="px-8 py-5 text-gray-500 font-mono text-xs">
                          {new Date(log.recorded_at).toLocaleString("vi-VN")}
                        </td>
                        <td className="px-8 py-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                            log.is_success
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700 shadow-sm shadow-red-100"
                          }`}>
                            {log.status_code || "N/A"}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right font-mono text-sm font-bold text-[#1D3557]">
                          <span className={log.latency_ms > 1000 ? "text-orange-500" : ""}>
                            {log.latency_ms}ms
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="p-6 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
                  <p className="text-xs text-gray-500 font-bold">
                    Hiển thị <span className="text-[#1D3557]">{logs.length}</span> trên <span className="text-[#1D3557]">{totalCount}</span> dòng
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={page <= 1 || logsLoading}
                      onClick={() => setPage(p => p - 1)}
                      className="px-4 py-2 text-xs font-bold rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                    >
                      Trước
                    </button>
                    <span className="text-xs font-black text-[#1D3557] px-2">Trang {page} / {totalPages}</span>
                    <button
                      disabled={page >= totalPages || logsLoading}
                      onClick={() => setPage(p => p + 1)}
                      className="px-4 py-2 text-xs font-bold rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                    >
                      Sau
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-20 text-center">
                {pingTab === "ok" ? (
                  <div className="opacity-30">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-emerald-500" />
                    <p className="font-bold text-gray-500 uppercase text-[11px] tracking-widest">Không tìm thấy dữ liệu OK.</p>
                  </div>
                ) : (
                  <div className="opacity-30">
                    <XCircle className="h-12 w-12 mx-auto mb-3 text-emerald-500" />
                    <p className="font-bold text-emerald-600 uppercase text-[11px] tracking-widest italic">Hệ thống hoàn toàn ổn định! 🎉</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
