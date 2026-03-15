"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Globe, Activity, Clock, PlayCircle, BookOpen } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function NewMonitorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    target: "",
    monitor_type: "HTTP",
    check_interval: 60,
    timeout: 30,
    max_retries: 0,
    resend_interval: 0,
    http_method: "GET",
    http_accepted_codes: "200-299",
    db_query: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["check_interval", "timeout", "max_retries", "resend_interval"].includes(name) ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(`${API_URL}/api/monitors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Tạo Monitor thất bại.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/monitors");
      }, 1500);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-full  space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/monitors" className="p-2 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 text-gray-500 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#1D3557]">Tạo Monitor mới</h1>
          <p className="text-gray-500 text-sm mt-1">Cấu hình điểm theo dõi cho dịch vụ của bạn.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          Tạo thành công! Đang chuyển hướng về danh sách...
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* ── Form ── */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">

              {/* Section 1: Basic Info */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-[#1D3557] flex items-center gap-2">
                  <Globe className="h-5 w-5 text-[#F6821F]" />
                  Thông tin chung
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tên nhận diện</label>
                    <input
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Giao diện chính (Landing Page)"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-[#F6821F]/20 focus:border-[#F6821F] outline-none transition-all placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Loại Monitor</label>
                    <select
                      name="monitor_type"
                      value={formData.monitor_type}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-[#F6821F]/20 focus:border-[#F6821F] outline-none transition-all text-[#1D3557] font-bold"
                    >
                      <option value="HTTP">HTTP(s) / API</option>
                      <option value="PING">Ping (ICMP/IP)</option>
                      <option value="MYSQL">MySQL / MariaDB</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {formData.monitor_type === "HTTP" ? "Đích kiểm tra (URL)" : formData.monitor_type === "PING" ? "Địa chỉ IP / Hostname" : "MySQL Connection String (DSN)"}
                    </label>
                    <input
                      required
                      name="target"
                      value={formData.target}
                      onChange={handleChange}
                      placeholder={
                        formData.monitor_type === "HTTP" ? "https://example.com" : 
                        formData.monitor_type === "PING" ? "8.8.8.8" : 
                        "user:password@tcp(127.0.0.1:3306)/dbname"
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-[#F6821F]/20 focus:border-[#F6821F] outline-none transition-all placeholder:text-gray-400 font-mono text-blue-600"
                    />
                    {formData.monitor_type === "MYSQL" && (
                      <p className="text-[10px] text-gray-400 mt-1 italic">Lưu ý: Bạn nên cung cấp user có quyền Read-only để đảm bảo an toàn.</p>
                    )}
                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Section 2: Timer & Advanced */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-[#1D3557] flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  Tần suất & Chu kỳ
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tần suất kiểm tra (giây)</label>
                    <input
                      required
                      type="number"
                      name="check_interval"
                      min="5"
                      value={formData.check_interval}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-[#F6821F]/20 focus:border-[#F6821F] outline-none transition-all font-semibold text-[#1D3557]"
                    />
                    <p className="text-[11px] text-gray-400">Cách bao lâu thì gọi web 1 lần.</p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Thời gian chờ Timeout</label>
                    <input
                      required
                      type="number"
                      name="timeout"
                      min="1"
                      max="60"
                      value={formData.timeout}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-[#F6821F]/20 focus:border-[#F6821F] outline-none transition-all font-semibold text-[#1D3557]"
                    />
                    <p className="text-[11px] text-gray-400">Quá thời gian sẽ tính là phản hồi trễ.</p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Thử lại khi lỗi (Retries)</label>
                    <input
                      required
                      type="number"
                      name="max_retries"
                      min="0"
                      max="10"
                      value={formData.max_retries}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-[#F6821F]/20 focus:border-[#F6821F] outline-none transition-all font-semibold text-[#1D3557]"
                    />
                    <p className="text-[11px] text-gray-400">Số lần xác minh DOWN trước khi báo.</p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Gửi lại cảnh báo (phút)</label>
                    <input
                      required
                      type="number"
                      name="resend_interval"
                      min="0"
                      value={formData.resend_interval}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-[#F6821F]/20 focus:border-[#F6821F] outline-none transition-all font-semibold text-[#1D3557]"
                    />
                    <p className="text-[11px] text-gray-400">Gửi lại tin nhắn nếu vẫn DOWN (0 = Tắt).</p>
                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Section 3: Specialized Config */}
              {formData.monitor_type === "HTTP" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <h2 className="text-lg font-bold text-[#1D3557] flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-500" />
                    Cấu hình HTTP nâng cao
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phương thức</label>
                      <select
                        name="http_method"
                        value={formData.http_method}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-[#F6821F]/20 focus:border-[#F6821F] outline-none transition-all text-[#1D3557] font-mono"
                      >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="PATCH">PATCH</option>
                        <option value="DELETE">DELETE</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mã trạng thái hợp lệ</label>
                      <input
                        name="http_accepted_codes"
                        value={formData.http_accepted_codes}
                        onChange={handleChange}
                        placeholder="200-299"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-[#F6821F]/20 focus:border-[#F6821F] outline-none transition-all placeholder:text-gray-400 font-mono"
                      />
                      <p className="text-[11px] text-gray-400">Ghi "200-299" hoặc các mã phẩy (VD: "200, 201, 302")</p>
                    </div>
                  </div>
                </div>
              )}

              {formData.monitor_type === "MYSQL" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <h2 className="text-lg font-bold text-[#1D3557] flex items-center gap-2">
                    <Activity className="h-5 w-5 text-emerald-500" />
                    Kiểm tra Database thông qua Query
                  </h2>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Câu lệnh SQL (Tuỳ chọn)</label>
                    <textarea
                      name="db_query"
                      value={formData.db_query}
                      onChange={handleChange}
                      placeholder="SELECT 1"
                      rows={3}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-[#F6821F]/20 focus:border-[#F6821F] outline-none transition-all placeholder:text-gray-400 font-mono"
                    />
                    <p className="text-[11px] text-gray-400">Lưu ý: Để trống nếu chỉ muốn kiểm tra kết nối tới Database. Nếu nhập query, CMS sẽ chạy câu lệnh này và đo thời gian phản hồi.</p>
                  </div>
                </div>
              )}

              {/* ── Submit ── */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#F6821F] hover:bg-[#e0721a] disabled:opacity-50 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-95"
                >
                  {loading ? "Đang lưu..." : "Lưu Monitor"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ── Tutorial Sidebar ── */}
        <div className="col-span-1 space-y-6">
          {/* Video Section */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-[#1D3557] flex items-center gap-2">
                <PlayCircle className="h-5 w-5 text-[#F6821F]" />
                Video Hướng Dẫn
              </h3>
            </div>
            <div className="p-4">
              <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden relative shadow-inner">
                <iframe
                  className="w-full h-full absolute inset-0"
                  src="https://www.youtube.com/embed/6AEF4pnrf6E?si=Q7tST_Bxhunf-wiP"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
              <p className="text-sm text-gray-500 mt-4 leading-relaxed">
                Đoạn video ngắn gọn này giới thiệu lợi ích của từng thông số, giúp bạn cấu hình cảnh báo linh hoạt và tránh báo động giả lúc đêm.
              </p>
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-[#1D3557] flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
                Hướng Dẫn Cấu Hình
              </h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#1D3557]">1. Tần suất là gì?</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Là thời gian nghỉ giữa các lần bot kiểm tra website của bạn. Đặt càng nhỏ (ví dụ 10 giây) hệ thống sẽ phản ứng càng nhanh khi có sự cố, nhưng đồng thời gửi nhiều request hơn.
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#1D3557]">2. Timeout chờ phản hồi</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Thông thường một web load mất 1-3 giây. Nếu nó xoay vòng quá lâu (Vượt mốc Timeout 30 giây), hệ thống sẽ coi đó là lỗi truy cập.
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#1D3557]">3. Thử lại khi lỗi (Retries)</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Tránh các cảnh báo giả do lag mạng tạm thời. Nếu bạn đặt thử lại 2 lần, khi trang web bị chập chờn lần 1, UpMonitor sẽ ngay lập tức ping lại liên tục 2 lần nữa, nếu vẫn lỗi mới xác nhận là DOWN thật sự để báo cho bạn qua Email.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
