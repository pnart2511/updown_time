"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Save, 
  Settings, 
  CreditCard, 
  DollarSign, 
  Target,
  Clock,
  Bell,
  Monitor,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function EditPlanPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id === "new" ? null : params.id;

  const [loading, setLoading] = useState(id ? true : false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    currency: "USD",
    interval: "monthly",
    features: "",
    max_monitors: 5,
    check_interval: 300,
    max_status_pages: 1,
    allowed_channels: "email",
    is_default: false,
  });

  useEffect(() => {
    if (id) fetchPlan();
  }, [id]);

  const fetchPlan = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/admin/plans`, {
          headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      const plan = data.find((p: any) => p.id.toString() === id);
      if (plan) setFormData(plan);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === "checkbox" 
      ? (e.target as HTMLInputElement).checked 
      : (["price", "max_monitors", "check_interval", "max_status_pages"].includes(name) ? Number(value) : value);
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const token = localStorage.getItem("token");
      const url = id ? `${API_URL}/api/admin/plans/${id}` : `${API_URL}/api/admin/plans`;
      const method = id ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setMessage({ type: "success", text: id ? "Cập nhật thành công!" : "Tạo gói mới thành công!" });
        if (!id) {
            setTimeout(() => router.push("/admin/plans"), 1500);
        }
      } else {
        throw new Error();
      }
    } catch (err) {
      setMessage({ type: "error", text: "Đã có lỗi xảy ra." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-slate-900">Đang tải...</div>;

  return (
    <div className="p-6 md:p-10 space-y-6 max-w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-slate-900">
          <Link href="/admin/plans" className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <ArrowLeft className="h-5 w-5 text-slate-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{id ? "Chỉnh sửa gói dịch vụ" : "Thêm gói dịch vụ mới"}</h1>
            <p className="text-slate-500 text-sm">Cài đặt mức giá và giới hạn tài nguyên của gói.</p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 bg-[#1D3557] hover:bg-[#2b4b7a] text-white px-6 py-2.5 rounded-xl font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Đang lưu..." : "Lưu gói dịch vụ"}
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium border animate-in fade-in slide-in-from-top-2 ${
          message.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-700 border-red-100"
        }`}>
          {message.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        {/* Basic Info */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-slate-900">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-blue-500" />
            <h2 className="font-bold text-slate-800">Thông tin cơ bản</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Tên gói (Plan Name)</label>
              <input 
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ví dụ: Free, Pro, Enterprise" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> Giá tiền ({formData.currency})</label>
              <input 
                required
                type="number"
                name="price"
                min={0}
                value={formData.price}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Chu kỳ thanh toán</label>
              <select
                name="interval"
                value={formData.interval}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white outline-none font-bold text-slate-700"
              >
                <option value="monthly">Hàng tháng (Monthly)</option>
                <option value="yearly">Hàng năm (Yearly)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Tiền tệ</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white outline-none font-bold text-slate-700"
              >
                <option value="USD">USD ($)</option>
                <option value="VND">VND (₫)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Resource Limits */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-slate-900">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <Settings className="h-5 w-5 text-orange-500" />
            <h2 className="font-bold text-slate-800">Giới hạn tài nguyên (được thực thi bởi hệ thống)</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                <Monitor className="h-3.5 w-3.5" /> Số Monitor tối đa
              </label>
              <input 
                required
                type="number"
                name="max_monitors"
                min={1}
                value={formData.max_monitors}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
              />
              <p className="text-[10px] text-slate-400">User sẽ bị chặn khi tạo Monitor vượt quá số này.</p>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> Chu kỳ kiểm tra tối thiểu (giây)
              </label>
              <input 
                required
                type="number"
                name="check_interval"
                min={30}
                step={30}
                value={formData.check_interval}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
              />
              <p className="text-[10px] text-slate-400">300 = 5 phút | 60 = 1 phút | 30 = 30 giây. Monitor nào cài thấp hơn sẽ bị ép lên mức này.</p>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5" /> Số trang trạng thái tối đa (Status Pages)
              </label>
              <input 
                required
                type="number"
                name="max_status_pages"
                min={0}
                value={formData.max_status_pages}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                <Bell className="h-3.5 w-3.5" /> Các kênh thông báo được phép
              </label>
              <input
                name="allowed_channels"
                value={formData.allowed_channels}
                onChange={handleChange}
                placeholder="email,telegram,slack"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
              />
              <p className="text-[10px] text-slate-400">Ngăn cách bằng dấu phẩy. Ví dụ: email,telegram,slack</p>
            </div>
          </div>
        </section>

        {/* Feature Display */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-slate-900">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <h2 className="font-bold text-slate-800">Danh sách tính năng hiển thị (cho Trang bảng giá)</h2>
          </div>
          <div className="p-6 space-y-4">
            <textarea 
              name="features"
              rows={4}
              value={formData.features}
              onChange={handleChange}
              placeholder="5 màn hình giám sát, Chu kỳ kiểm tra 5 phút, 1 trang trạng thái, Thông báo qua Email"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
            />
            <p className="text-[10px] text-slate-400">Ngăn cách bằng dấu phẩy. Mỗi tính năng sẽ hiển thị kèm dấu tích ở trang bảng giá người dùng.</p>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3">
            <input 
              id="is_default"
              type="checkbox"
              name="is_default"
              checked={formData.is_default}
              onChange={handleChange}
              className="w-5 h-5 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
            />
            <label htmlFor="is_default" className="text-sm font-bold text-slate-700 cursor-pointer">
              Đặt làm gói mặc định (Default Plan) — Gói này được áp dụng tự động cho User mới đăng ký.
            </label>
          </div>
        </section>
      </div>
    </div>
  );
}
