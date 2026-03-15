"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, X, ArrowRight, Zap, Shield, Globe, Award, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const pricingTiers = [
  {
    name: "Cơ Bản",
    id: "free",
    price: { monthly: 0, yearly: 0 },
    description: "Lý tưởng cho các trang web cá nhân hoặc blog nhỏ.",
    features: [
      "5 màn hình giám sát",
      "Chu kỳ kiểm tra 5 phút",
      "1 trang trạng thái công khai",
      "Thông báo qua Email",
      "Lưu trữ dữ liệu 30 ngày",
      "Hỗ trợ qua cộng đồng",
    ],
    notIncluded: [
      "Giám sát từ nhiều vùng địa lý",
      "Báo cáo SLA",
      "Webhooks & Discord/Slack",
      "Giám sát SSL/Domain",
    ],
    cta: "Bắt Đầu Miễn Phí",
    popular: false,
  },
  {
    name: "Chuyên Nghiệp",
    id: "pro",
    price: { monthly: 290000, yearly: 240000 },
    description: "Phù hợp cho các doanh nghiệp vừa và nhỏ.",
    features: [
      "50 màn hình giám sát",
      "Chu kỳ kiểm tra 1 phút",
      "5 trang trạng thái tùy chỉnh",
      "Tất cả kênh thông báo",
      "Lưu trữ dữ liệu 1 năm",
      "Giám sát từ 3 vùng địa lý",
      "Giám sát SSL & Tên miền",
      "Hỗ trợ ưu tiên (24/7)",
    ],
    notIncluded: [
      "Báo cáo SLA nâng cao",
      "Hỗ trợ đa người dùng (Team)",
    ],
    cta: "Dùng Thử Miễn Phí",
    popular: true,
  },
  {
    name: "Doanh Nghiệp",
    id: "business",
    price: { monthly: 990000, yearly: 820000 },
    description: "Cho các hệ thống quan trọng cần độ tin cậy tuyệt đối.",
    features: [
      "250 màn hình giám sát",
      "Chu kỳ kiểm tra 30 giây",
      "Trang trạng thái không giới hạn",
      "Giám sát từ tất cả vùng địa lý",
      "Hỗ trợ Team (10 thành viên)",
      "Báo cáo SLA & Xuất dữ liệu",
      "API truy cập toàn diện",
      "Cố vấn kỹ thuật riêng",
    ],
    notIncluded: [],
    cta: "Chọn Gói Business",
    popular: false,
  },
];

const faqs = [
  {
    question: "Tôi có thể thay đổi gói dịch vụ sau khi đăng ký không?",
    answer: "Có, bạn có thể nâng cấp hoặc hạ cấp gói dịch vụ bất kỳ lúc nào. Phần tiền chênh lệch sẽ được tính toán tự động vào chu kỳ thanh toán tiếp theo.",
  },
  {
    question: "UpMonitor hỗ trợ những kênh thông báo nào?",
    answer: "Chúng tôi hỗ trợ Email, Slack, Discord, Telegram, SMS, Webhooks và các ứng dụng quản lý sự cố như PagerDuty.",
  },
  {
    question: "Các vùng giám sát của UpMonitor ở đâu?",
    answer: "Chúng tôi có các node giám sát tại hơn 15 vị trí trên toàn cầu bao gồm Việt Nam (Hà Nội, HCM), Singapore, Mỹ, Đức, Nhật Bản...",
  },
  {
    question: "Gói miễn phí có yêu cầu thẻ tín dụng không?",
    answer: "Hoàn toàn không. Bạn chỉ cần đăng ký tài khoản và bắt đầu sử dụng gói Cơ Bản ngay lập tức.",
  },
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN").format(price);
};

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [dbPlans, setDbPlans] = useState<any[]>(pricingTiers); // fallback to hardcoded initially

  React.useEffect(() => {
    const fetchPlans = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const res = await fetch(`${API_URL}/api/public/plans`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            const dynamicTiers = data.map((plan: any) => {
              const basePrice = Number(plan.price);
              const monthlyPrice = plan.interval === "monthly" ? basePrice : Math.round(basePrice / 12);
              const yearlyPrice = plan.interval === "yearly" ? basePrice : Math.round(basePrice * 12 * 0.8);

              return {
                id: plan.id,
                name: plan.name,
                price: { monthly: monthlyPrice, yearly: yearlyPrice },
                description: `Sử dụng gói ${plan.name} để có tối đa ${plan.max_monitors} monitors.`,
                features: plan.features ? plan.features.split(",").map((f: string) => f.trim()) : [],
                notIncluded: [],
                cta: basePrice === 0 ? "Bắt Đầu Miễn Phí" : "Đăng Ký Ngay",
                popular: plan.is_default
              };
            });
            setDbPlans(dynamicTiers);
          }
        }
      } catch (e) {
        console.error("Failed to fetch plans", e);
      }
    };
    fetchPlans();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-[#1D3557] dark:text-slate-200 selection:bg-orange-100 relative overflow-hidden">
      
      {/* ─── BACKGROUND PATTERNS (Home Page Style) ────────────────────────── */}
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#1D3557 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />
      {/* Soft glow bg */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />

      <div className="container px-6 pt-32 pb-20 max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 border border-orange-100 px-4 py-1.5 text-sm font-semibold text-[#F6821F] mb-8">
            Bảng giá & Gói dịch vụ
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-[#1D3557] mb-6 leading-tight">
            Giá cả đơn giản, <br />
            <span className="text-[#F6821F]">không ẩn phí.</span>
          </h1>
          <p className="text-lg text-[#4A5568] leading-relaxed mb-10">
            Chọn gói dịch vụ phù hợp để duy trì tính sẵn sàng cao cho hệ thống của bạn. 
            Tiết kiệm 20% khi chọn hình thức thanh toán theo năm.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-5">
            <span className={cn("text-sm font-bold transition-colors", billingCycle === "monthly" ? "text-[#1D3557]" : "text-gray-400")}>
              Thanh toán tháng
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
              className="relative w-16 h-8 bg-gray-100 border border-gray-200 rounded-full p-1 transition-all focus:outline-none"
            >
              <div
                className={cn(
                  "w-6 h-6 bg-[#F6821F] rounded-full transition-transform shadow-md",
                  billingCycle === "yearly" ? "translate-x-8" : "translate-x-0"
                )}
              />
            </button>
            <span className={cn("text-sm font-bold transition-colors flex items-center gap-2", billingCycle === "yearly" ? "text-[#1D3557]" : "text-gray-400")}>
              Thanh toán năm
              <span className="text-[11px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100 font-black">
                -20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-32 items-stretch">
          {dbPlans.map((tier) => (
            <div
              key={tier.id}
              className={cn(
                "relative flex flex-col p-10 rounded-[2rem] border transition-all duration-300",
                tier.popular
                  ? "bg-white border-orange-200 shadow-2xl shadow-orange-200/20 lg:scale-105 z-20"
                  : "bg-white/50 border-gray-100 hover:border-orange-100 z-10"
              )}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#F6821F] text-white text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                  Lựa chọn tốt nhất
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-extrabold text-[#1D3557] mb-3">{tier.name}</h3>
                <p className="text-[#4A5568] text-sm leading-relaxed font-medium">{tier.description}</p>
              </div>

              <div className="mb-10">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-[#1D3557]">
                    {billingCycle === "monthly" ? formatPrice(tier.price.monthly) : formatPrice(tier.price.yearly)}
                  </span>
                  <div className="flex flex-col font-bold text-gray-400 text-xs text-left">
                    <span>VNĐ</span>
                    <span>/tháng</span>
                  </div>
                </div>
                {billingCycle === "yearly" && tier.price.yearly > 0 && (
                  <p className="text-[12px] text-[#F6821F] mt-2 font-bold bg-orange-50 inline-block px-2 py-0.5 rounded text-left">Tiết kiệm VNĐ {formatPrice(tier.price.monthly - tier.price.yearly)}/tháng</p>
                )}
              </div>

              <div className="space-y-4 mb-12 flex-grow">
                {tier.features.map((feature: string) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="shrink-0 w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                      <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                    </div>
                    <span className="text-sm font-bold text-[#1D3557]">{feature}</span>
                  </div>
                ))}
                {tier.notIncluded.map((feature: string) => (
                  <div key={feature} className="flex items-center gap-3 opacity-40">
                    <div className="shrink-0 w-5 h-5 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                      <X className="w-3 h-3 text-gray-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-400">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                className={cn(
                  "w-full h-14 rounded-full font-bold text-base transition-all",
                  tier.popular
                    ? "bg-[#F6821F] hover:bg-[#e0721a] text-white shadow-lg shadow-orange-200"
                    : "bg-[#1D3557] hover:bg-[#2b4b7a] text-white"
                )}
              >
                <Link href="/register" className="flex items-center justify-center w-full h-full">
                  {tier.cta}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Truststrip (LogoLoop Style) */}
        <div className="mb-32 text-center">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-10">Tin dùng bởi đội ngũ tại</p>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-40 grayscale pointer-events-none">
                <span className="text-2xl font-black italic">VERCEL</span>
                <span className="text-2xl font-black italic">SUPABASE</span>
                <span className="text-2xl font-black italic">AWS</span>
                <span className="text-2xl font-black italic">CLOUDFLARE</span>
                <span className="text-2xl font-black italic">STRIPE</span>
            </div>
        </div>

        {/* Feature Grid */}
        <div className="mb-40">
          <div className="text-center mb-20">
            <p className="text-sm font-bold text-[#F6821F] uppercase tracking-widest mb-4">Các Tính Năng</p>
            <h2 className="text-4xl font-extrabold text-[#1D3557] tracking-tight">Vượt xa việc kiểm tra uptime</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Zap, color: "text-[#F6821F]", bg: "bg-orange-50", title: "Siêu nhanh", desc: "Mạng lưới node giám sát toàn cầu với độ trễ thấp." },
              { icon: Shield, color: "text-blue-500", bg: "bg-blue-50", title: "Bảo mật", desc: "Dữ liệu được mã hóa và chứng thực đa lớp." },
              { icon: Globe, color: "text-emerald-500", bg: "bg-emerald-50", title: "Toàn cầu", desc: "Giám sát từ 50+ locations khắp thế giới." },
              { icon: Award, color: "text-purple-500", bg: "bg-purple-50", title: "Độ tin cậy", desc: "Xác minh chéo nhằm loại bỏ báo động giả." },
            ].map((f, i) => (
              <div key={i} className="group p-8 rounded-3xl bg-white border border-gray-100 hover:border-orange-100 transition-all hover:shadow-xl hover:shadow-gray-200/40">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", f.bg, f.color)}>
                  <f.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-extrabold text-[#1D3557] mb-3">{f.title}</h3>
                <p className="text-sm text-[#4A5568] leading-relaxed line-clamp-2">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-[#1D3557] tracking-tight mb-4 flex items-center justify-center gap-4">
              <HelpCircle className="w-10 h-10 text-[#F6821F]" />
              FAQ
            </h2>
            <p className="text-[#4A5568] font-medium">Những điều bạn muốn biết về UpMonitor</p>
          </div>
          <div className="grid gap-4">
            {faqs.map((faq, i) => (
              <div key={i} className="p-8 rounded-[2rem] bg-gray-50/50 border border-gray-100 transition-all hover:bg-white hover:border-orange-100 hover:shadow-lg group">
                <h3 className="text-lg font-bold text-[#1D3557] mb-3">{faq.question}</h3>
                <p className="text-[#4A5568] text-[15px] leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise Banner */}
        <div className="p-12 md:p-16 rounded-[3rem] bg-[#1D3557] overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-[500px] h-full bg-[#F6821F]/10 blur-[120px] pointer-events-none group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left">
            <div className="max-w-2xl">
                <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-[11px] font-black uppercase tracking-widest mb-6 border border-white/10">
                    Enterprise
                </div>
              <h2 className="text-4xl font-extrabold text-white mb-6 tracking-tight">Giải pháp quy mô lớn cho doanh nghiệp?</h2>
              <p className="text-white/70 text-lg leading-relaxed">
                Tùy chỉnh monitor không giới hạn, hỗ trợ dedicate 24/7, SLA chặt chẽ, và tích hợp sâu sắc vào quy trình nội bộ của bạn.
              </p>
            </div>
            <Button className="shrink-0 bg-white text-[#1D3557] hover:bg-[#F6821F] hover:text-white px-10 h-16 rounded-full font-black text-lg shadow-xl shadow-black/10 transition-all hover:scale-105">
              <Link href="/contact" className="flex items-center justify-center w-full h-full">Liên hệ ngay</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
