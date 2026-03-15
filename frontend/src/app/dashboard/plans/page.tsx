"use client";

import { useState, useEffect } from "react";
import {
  Check,
  Zap,
  Crown,
  Package,
  Clock,
  Monitor,
  Bell,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type Plan = {
  id: number;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string;
  max_monitors: number;
  check_interval: number;
  max_status_pages: number;
  allowed_channels: string;
  is_default: boolean;
};

const PLAN_ICONS: Record<string, React.ReactNode> = {
  default: <Package className="h-6 w-6" />,
  free: <Package className="h-6 w-6" />,
  basic: <Package className="h-6 w-6" />,
  pro: <Zap className="h-6 w-6" />,
  enterprise: <Crown className="h-6 w-6" />,
};

const PLAN_COLORS: Record<string, string> = {
  default: "from-slate-600 to-slate-500",
  free: "from-slate-600 to-slate-500",
  basic: "from-blue-600 to-blue-400",
  pro: "from-[#F6821F] to-orange-400",
  enterprise: "from-[#1D3557] to-blue-700",
};

function formatInterval(seconds: number): string {
  if (seconds >= 3600) return `${seconds / 3600} giờ`;
  if (seconds >= 60) return `${seconds / 60} phút`;
  return `${seconds} giây`;
}

function formatPrice(price: number, currency: string) {
  if (price === 0) return <span className="text-4xl font-black">Miễn phí</span>;
  const sym = currency === "VND" ? "₫" : "$";
  return (
    <span>
      <span className="text-4xl font-black">{sym}{price.toLocaleString()}</span>
    </span>
  );
}

export default function DashboardPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState<string | null>(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const token = localStorage.getItem("token");
      const [plansRes, profileRes] = await Promise.all([
        fetch(`${API_URL}/api/public/plans`),
        fetch(`${API_URL}/api/dashboard/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const plansData = await plansRes.json();
      const profileData = await profileRes.json();
      setPlans(Array.isArray(plansData) ? plansData : []);
      setCurrentPlan(profileData.plan || "");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (plan: Plan) => {
    setActivating(plan.name);
    setMessage({ type: "", text: "" });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/dashboard/upgrade-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan_name: plan.name }),
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentPlan(plan.name);
        setMessage({ type: "success", text: `Đã kích hoạt gói ${plan.name} thành công!` });
      } else {
        setMessage({ type: "error", text: data.error || "Không thể kích hoạt gói." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Lỗi kết nối máy chủ." });
    } finally {
      setActivating(null);
    }
  };

  if (loading) return <div className="p-8">Đang tải...</div>;

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-full">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Gói dịch vụ</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Chọn gói phù hợp với nhu cầu giám sát của bạn. Giới hạn sẽ được áp dụng ngay lập tức sau khi chọn.
        </p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium border animate-in fade-in slide-in-from-top-2 ${
          message.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-700 border-red-100"
        }`}>
          {message.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const key = plan.name.toLowerCase();
          const gradientClass = PLAN_COLORS[key] || PLAN_COLORS["default"];
          const icon = PLAN_ICONS[key] || PLAN_ICONS["default"];
          const isCurrent = plan.name.toLowerCase() === currentPlan.toLowerCase();
          const isActivating = activating === plan.name;

          return (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl border shadow-sm flex flex-col overflow-hidden transition-all hover:shadow-xl ${
                isCurrent
                  ? "border-[#F6821F] ring-2 ring-[#F6821F]/20 shadow-orange-500/10"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              {/* Header */}
              <div className={`bg-gradient-to-br ${gradientClass} p-6 text-white`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    {icon}
                  </div>
                  {plan.is_default && (
                    <span className="bg-white/20 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider">
                      Miễn phí
                    </span>
                  )}
                  {isCurrent && (
                    <span className="bg-white text-[#F6821F] text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider">
                      Đang dùng
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-black uppercase tracking-wide">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  {formatPrice(plan.price, plan.currency)}
                  {plan.price > 0 && (
                    <span className="text-white/70 text-sm font-medium">/{plan.interval}</span>
                  )}
                </div>
              </div>

              {/* Limits */}
              <div className="p-5 border-b border-slate-100 grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-slate-50 rounded-xl">
                  <Monitor className="h-4 w-4 text-slate-400 mx-auto mb-1" />
                  <div className="text-lg font-black text-slate-900">{plan.max_monitors}</div>
                  <div className="text-[10px] font-semibold text-slate-500 uppercase">Monitors</div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-xl">
                  <Clock className="h-4 w-4 text-slate-400 mx-auto mb-1" />
                  <div className="text-lg font-black text-slate-900">{formatInterval(plan.check_interval)}</div>
                  <div className="text-[10px] font-semibold text-slate-500 uppercase">Chu kỳ ping</div>
                </div>
              </div>

              {/* Features */}
              <div className="p-5 flex-1 space-y-2.5">
                {plan.features?.split(",").map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{f.trim()}</span>
                  </div>
                ))}
                {plan.allowed_channels && (
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <Bell className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Kênh thông báo: {plan.allowed_channels}</span>
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="p-5 pt-0">
                {isCurrent ? (
                  <div className="w-full py-2.5 rounded-xl text-center text-sm font-bold text-[#F6821F] bg-orange-50 border border-orange-100">
                    ✓ Gói đang sử dụng
                  </div>
                ) : (
                  <button
                    onClick={() => handleActivate(plan)}
                    disabled={isActivating}
                    className="w-full py-2.5 rounded-xl text-sm font-bold text-white bg-[#1D3557] hover:bg-[#2b4b7a] transition-all active:scale-95 disabled:opacity-50 shadow-sm"
                  >
                    {isActivating ? "Đang kích hoạt..." : `Chọn gói ${plan.name}`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-sm text-blue-800">
        <strong className="block mb-1 font-bold">📌 Lưu ý quan trọng:</strong>
        Giới hạn tài nguyên (số Monitor, chu kỳ ping) được hệ thống kiểm tra và thực thi tự động khi bạn thêm mới Monitor. 
        Nếu nhu cầu của bạn vượt quá gói hiện tại, vui lòng chọn gói cao hơn.
      </div>
    </div>
  );
}
