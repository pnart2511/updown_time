"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
} from "lucide-react";

interface Incident {
  id: number;
  monitor_name: string;
  monitor_id: number;
  start_time: string;
  end_time: string | null;
  status: "open" | "resolved";
  cause: string | null;
}

export default function IncidentsPage() {
  const router = useRouter();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchIncidents = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/incidents`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to fetch incidents");
      const data = await res.json();
      setIncidents(data.incidents ?? []);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError("Không thể tải dữ liệu sự cố. Hãy thử lại.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 30000);
    return () => clearInterval(interval);
  }, [fetchIncidents]);

  const openIncidents = incidents.filter((i) => i.status === "open");
  const resolvedIncidents = incidents.filter((i) => i.status === "resolved");

  const formatDuration = (start: string, end: string | null) => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    const diffMs = endDate.getTime() - startDate.getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 60) return `${mins} phút`;
    const hrs = Math.floor(mins / 60);
    const remainMins = mins % 60;
    return `${hrs}g ${remainMins}p`;
  };

  const formatDateTime = (dt: string) => {
    return new Date(dt).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1D3557]">Quản lý Sự cố</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Theo dõi và quản lý các sự cố downtime của hệ thống.
          </p>
        </div>
        <button
          onClick={() => {
            setLoading(true);
            fetchIncidents();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <RefreshCw className="h-4 w-4" />
          Làm mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-red-50">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Đang mở</p>
            <p className="text-2xl font-bold text-[#1D3557]">{openIncidents.length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-green-50">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Đã giải quyết</p>
            <p className="text-2xl font-bold text-[#1D3557]">{resolvedIncidents.length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-50">
            <AlertTriangle className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Tổng sự cố</p>
            <p className="text-2xl font-bold text-[#1D3557]">{incidents.length}</p>
          </div>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-[#1D3557] flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-[#F6821F]" />
            Danh sách Sự cố
          </h2>
          {lastUpdated && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Cập nhật: {lastUpdated.toLocaleTimeString("vi-VN")}
            </span>
          )}
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block h-8 w-8 border-4 border-[#F6821F] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 mt-3 text-sm">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        ) : incidents.length === 0 ? (
          <div className="p-16 text-center">
            <CheckCircle2 className="h-14 w-14 text-green-400 mx-auto mb-4" />
            <p className="text-gray-700 font-semibold text-lg">Không có sự cố nào!</p>
            <p className="text-gray-400 text-sm mt-1">Hệ thống của bạn đang hoạt động bình thường.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3 font-semibold">Monitor</th>
                  <th className="text-left px-5 py-3 font-semibold">Trạng thái</th>
                  <th className="text-left px-5 py-3 font-semibold">Nguyên nhân</th>
                  <th className="text-left px-5 py-3 font-semibold">Bắt đầu</th>
                  <th className="text-left px-5 py-3 font-semibold">Kết thúc</th>
                  <th className="text-left px-5 py-3 font-semibold">Thời lượng</th>
                  <th className="text-right px-5 py-3 font-semibold">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {incidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#1D3557]">{inc.monitor_name}</p>
                    </td>
                    <td className="px-5 py-4">
                      {inc.status === "open" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-100">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                          Đang mở
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-600 border border-green-100">
                          <CheckCircle2 className="h-3 w-3" />
                          Đã giải quyết
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {inc.cause ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 text-xs font-medium border border-orange-100">
                          <AlertTriangle className="h-3 w-3" />
                          {inc.cause}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">Không rõ</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                      {formatDateTime(inc.start_time)}
                    </td>
                    <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                      {inc.end_time ? formatDateTime(inc.end_time) : (
                        <span className="text-red-500 font-medium">Chưa kết thúc</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                      {formatDuration(inc.start_time, inc.end_time)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/dashboard/monitors/${inc.monitor_id}/details`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#F6821F] hover:text-[#e06010] transition-colors"
                      >
                        Xem Monitor
                        <ArrowRight className="h-3.5 w-3.5" />
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
