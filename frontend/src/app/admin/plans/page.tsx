"use client";

import { useState, useEffect } from "react";
import { Plus, CreditCard, DollarSign, Check, Trash2, Edit2, AlertCircle } from "lucide-react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function AdminPlansPage() {
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/admin/plans`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setPlans(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Đang tải...</div>;

  return (
    <div className="p-6 md:p-10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý Gói dịch vụ</h1>
          <p className="text-slate-500 mt-1 text-sm">Cấu hình các gói thành viên và tính năng đi kèm.</p>
        </div>
        <Link href="/admin/plans/new" className="flex items-center gap-2 bg-[#1D3557] hover:bg-[#2b4b7a] text-white px-5 py-2.5 rounded-xl font-bold shadow-lg transition-all active:scale-95">
          <Plus className="h-4 w-4" />
          Thêm gói mới
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.length === 0 ? (
          <div className="col-span-full py-12 bg-white rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
             <CreditCard className="h-12 w-12 mb-4 opacity-20" />
             <p className="font-medium text-slate-500">Chưa có gói dịch vụ nào được cấu hình.</p>
          </div>
        ) : (
          plans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col group hover:border-[#F6821F]/30 hover:shadow-xl hover:shadow-orange-500/5 transition-all">
              <div className="p-6 border-b border-slate-50 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900">${plan.price}</span>
                    <span className="text-slate-400 text-xs font-medium">/{plan.interval}</span>
                  </div>
                </div>
                {plan.is_default && (
                  <span className="bg-orange-50 text-[#F6821F] text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider">Default</span>
                )}
              </div>
              
              <div className="p-6 flex-1 space-y-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                   <Check className="h-4 w-4 text-emerald-500" />
                   <span>Max Monitors: <strong>{plan.max_monitors}</strong></span>
                </div>
                {plan.features?.split(',').map((f: string, i: number) => (
                   <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span>{f.trim()}</span>
                   </div>
                ))}
              </div>

              <div className="p-6 pt-0 flex gap-2">
                <Link href={`/admin/plans/${plan.id}`} className="flex-1 flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                  <Edit2 className="h-3.5 w-3.5" />
                  Sửa
                </Link>
                <button className="flex flex-center items-center justify-center p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex gap-4 text-slate-900">
        <AlertCircle className="h-6 w-6 text-blue-500 shrink-0" />
        <div>
          <h4 className="font-bold text-blue-900 text-sm">Hướng dẫn quản lý gói</h4>
          <p className="text-xs text-blue-800/70 mt-1 leading-relaxed">
            Các thay đổi về gói dịch vụ sẽ áp dụng ngay lập tức cho các người dùng đăng ký mới. Đối với các người dùng hiện tại, quyền lợi của họ sẽ được cập nhật trong chu kỳ thanh toán tiếp theo.
          </p>
        </div>
      </div>
    </div>
  );
}
