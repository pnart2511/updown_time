"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, Edit2, Plus, Search, Trash2, Wifi, WifiOff, BarChart2, AlertTriangle, X } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function MonitorsListPage() {
  const router = useRouter();
  const [monitors, setMonitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [monitorToDelete, setMonitorToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMonitors = async (isInitial = false) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(`${API_URL}/api/monitors`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      if (res.ok) {
        const json = await res.json();
        setMonitors(json);
      }
    } catch (e) {
      console.error("Failed to fetch monitors:", e);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitors(true);
    
    const interval = setInterval(() => fetchMonitors(false), 10000);
    return () => clearInterval(interval);
  }, [router]);

  const confirmDelete = async () => {
    if (!monitorToDelete) return;

    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/monitors/${monitorToDelete.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setMonitors(prev => prev.filter(m => m.id !== monitorToDelete.id));
        setShowDeleteModal(false);
        setMonitorToDelete(null);
      } else {
        alert("Xóa thất bại!");
      }
    } catch (e) {
      console.error("Delete failed:", e);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredMonitors = monitors.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.target.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-full space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1D3557]">Quản lý Monitors</h1>
          <p className="text-gray-500 text-sm mt-1">Danh sách tất cả các điểm kiểm tra hệ thống của bạn.</p>
        </div>
        <Link
          href="/dashboard/monitors/new"
          className="inline-flex items-center gap-2 bg-[#F6821F] hover:bg-[#e0721a] text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-md shadow-orange-200"
        >
          <Plus className="h-4 w-4" />
          Thêm mới Monitor
        </Link>
      </div>

      {/* ── Search & Filter ── */}
      <div className="flex bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc target..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-transparent border-none focus:ring-0 outline-none text-sm text-[#1D3557] placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* ── List ── */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden text-sm">
        {loading ? (
          <div className="p-12 flex justify-center">
            <svg className="animate-spin h-8 w-8 text-[#F6821F]" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : filteredMonitors.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-gray-500 mb-4">Không tìm thấy Monitor nào phù hợp.</p>
            {monitors.length === 0 && (
              <Link href="/dashboard/monitors/new" className="text-[#F6821F] font-semibold hover:underline">
                Bấm vào đây để tạo Monitor đầu tiên!
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs text-gray-400 uppercase font-semibold text-left">
                <tr>
                  <th className="px-6 py-4">Tên Monitor</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-center">Biểu đồ (20 ping)</th>
                  <th className="px-6 py-4">Cấu hình</th>
                  <th className="px-6 py-4">Ngày tạo</th>
                  <th className="px-6 py-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredMonitors.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#1D3557]">{m.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-mono">
                            {m.monitor_type}
                          </span>
                          <span className="text-[10px] text-gray-400 max-w-[200px] truncate" title={m.target}>
                            {m.target}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {m.status === "UP" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                          <Wifi className="h-3 w-3" /> UP
                        </span>
                      ) : m.status === "PAUSED" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200">
                          Tạm dừng
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
                          <WifiOff className="h-3 w-3" /> DOWN
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        {m.ping_logs && m.ping_logs.length > 1 ? (
                          <div className="w-[140px] h-[35px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={m.ping_logs.map((l: any) => ({ v: l.latency_ms }))}
                                margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
                              >
                                <Tooltip
                                  content={({ active, payload }: any) =>
                                    active && payload?.length ? (
                                      <div className="bg-white border border-gray-100 shadow-sm rounded-lg px-2 py-1 text-xs font-mono text-[#1D3557]">
                                        {payload[0].value}ms
                                      </div>
                                    ) : null
                                  }
                                />
                                <Line
                                  type="monotone"
                                  dataKey="v"
                                  stroke={m.status === "UP" ? "#10b981" : "#ef4444"}
                                  strokeWidth={1.5}
                                  dot={false}
                                  isAnimationActive={false}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-300">Chưa có data</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[11px] text-gray-500 font-medium">Mỗi {m.check_interval}s</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 italic">Timeout {m.timeout}s</p>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-[11px]">
                      {new Date(m.created_at).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/dashboard/monitors/${m.id}/details`} className="p-2 text-gray-400 hover:text-emerald-600 hover:border-emerald-100 bg-white border border-transparent rounded-lg transition-all" title="Xem chi tiết & Biểu đồ">
                          <BarChart2 className="h-4 w-4" />
                        </Link>
                        <Link href={`/dashboard/monitors/${m.id}`} className="p-2 text-gray-400 hover:text-blue-600 hover:border-blue-100 bg-white border border-transparent rounded-lg transition-all" title="Chỉnh sửa cấu hình">
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button 
                          onClick={() => {
                            setMonitorToDelete(m);
                            setShowDeleteModal(true);
                          }} 
                          className="p-2 text-gray-400 hover:text-red-600 hover:border-red-100 bg-white border border-transparent rounded-lg transition-all" title="Xóa Monitor"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Delete Confirmation Modal ── */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setShowDeleteModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-slate-900/20 overflow-hidden"
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <button 
                    disabled={isDeleting}
                    onClick={() => setShowDeleteModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <h3 className="text-xl font-bold text-[#1D3557] mb-2">Xác nhận xóa Monitor?</h3>
                <p className="text-gray-500 mb-6 leading-relaxed">
                  Bạn đang chuẩn bị xóa Monitor <span className="font-bold text-[#1D3557]">"{monitorToDelete?.name}"</span>. 
                  Hành động này sẽ xóa vĩnh viễn mọi dữ liệu lịch sử ping và incidents. 
                  <span className="block mt-2 text-red-500 font-medium">Hành động này không thể hoàn tác.</span>
                </p>
                
                <div className="flex items-center gap-3">
                  <button
                    disabled={isDeleting}
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-6 py-3 rounded-2xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    disabled={isDeleting}
                    onClick={confirmDelete}
                    className="flex-1 px-6 py-3 rounded-2xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2"
                  >
                    {isDeleting ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Đang xóa...
                      </>
                    ) : (
                      "Xác nhận xóa"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
