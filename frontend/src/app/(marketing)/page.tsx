"use client";

import Link from "next/link";
import React from "react";
import {
  ArrowRight, Activity, Shield, Zap, Globe, Github,
  CheckCircle2, Clock, BarChart3, Bell,
} from "lucide-react";
import { AnimatedBeamSection } from "@/components/sections/AnimatedBeamSection";
import { LogoLoop } from "@/components/ui/logo-loop";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-[#1D3557] dark:text-slate-200 selection:bg-orange-100">

      {/* ─── HERO ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-950">
        {/* Orange top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 " />

        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#1D3557 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />

        {/* Soft glow bg */}
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-orange-50 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3 pointer-events-none" />

        <div className="container mx-auto px-6 pt-28 pb-16 md:pt-40 md:pb-20 max-w-7xl relative z-10">
          {/* Two-column grid: text left | mockup right */}
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Left — Copy */}
            <div>
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 border border-orange-100 px-4 py-1.5 text-sm font-semibold text-[#F6821F] mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F6821F] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F6821F]" />
                </span>
                Giám sát hạ tầng theo thời gian thực
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-[#1D3557] mb-6 leading-[1.08]">
                Giữ cho{" "}
                <span className="relative whitespace-nowrap">
                  <span className="relative z-10 text-[#F6821F]">ứng dụng</span>
                  <svg className="absolute -bottom-1 left-0 w-full h-3 text-orange-200" viewBox="0 0 300 12" preserveAspectRatio="none">
                    <path d="M0 10 Q 75 2 150 10 Q 225 18 300 10" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </svg>
                </span>{" "}
                của bạn luôn hoạt động & nhanh chóng.
              </h1>

              <p className="text-lg text-[#4A5568] mb-10 leading-relaxed max-w-lg">
                UpMonitor theo dõi endpoint HTTP, mạng ICMP và cơ sở dữ liệu MySQL từ nhiều vùng toàn cầu — để bạn biết vấn đề trước khi khách hàng nhận ra.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 h-13 px-8 text-[16px] font-bold rounded-full bg-[#F6821F] hover:bg-[#e0721a] text-white shadow-lg shadow-orange-200 transition-all hover:scale-105"
                >
                  Bắt Đầu Miễn Phí
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/status"
                  className="inline-flex items-center justify-center h-13 px-8 text-[16px] font-semibold rounded-full border-2 border-[#1D3557] text-[#1D3557] hover:bg-[#1D3557] hover:text-white transition-all"
                >
                  Xem Trang Trạng Thái Mẫu
                </Link>
              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-[#4A5568]">
                {[
                  { label: "Uptime SLA", value: "99.9%+" },
                  { label: "Vị trí kiểm tra", value: "10+ Quốc gia" },
                  { label: "Cảnh báo", value: "< 60 giây" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>
                      <strong className="text-[#1D3557] font-semibold">{stat.value}</strong>{" "}
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Dashboard Mockup (normal flow, no overlap) */}
            <div className="hidden lg:block">
              <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-2xl shadow-[#1D3557]/10 bg-white">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <div className="ml-4 flex-1 bg-white rounded-md h-6 border border-gray-200 flex items-center px-3">
                    <span className="text-xs text-gray-400 font-mono">app.upmonitor.io/dashboard</span>
                  </div>
                </div>
                {/* Mock content */}
                <div className="bg-gray-50 p-6 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-[#1D3557]">Tất cả Monitor</span>
                    <span className="text-xs text-emerald-600 font-medium bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">5/5 Online</span>
                  </div>
                  {[
                    { name: "api.example.com", ms: "42ms" },
                    { name: "shop.example.com", ms: "66ms" },
                    { name: "db.internal", ms: "11ms" },
                  ].map((m) => (
                    <div key={m.name} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-sm font-medium text-[#1D3557] font-mono">{m.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-[#4A5568]">{m.ms}</span>
                    </div>
                  ))}
                  <div className="h-2 bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-200 rounded-full mt-2" />
                  <div className="flex items-center gap-2 pt-1">
                    <BarChart3 className="h-4 w-4 text-[#F6821F]" />
                    <span className="text-xs text-[#4A5568]">Uptime 30 ngày: <strong className="text-[#1D3557]">99.98%</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS BAND ──────────────────────────────────────────────────── */}
      <section className="bg-[#1D3557] py-14">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { value: "99.9%", label: "Uptime Guarantee" },
              { value: "10+", label: "Vùng Kiểm Tra" },
              { value: "<60s", label: "Thời Gian Cảnh Báo" },
              { value: "24/7", label: "Giám Sát Liên Tục" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-4xl md:text-5xl font-black text-[#F6821F] mb-2">{s.value}</div>
                <div className="text-sm text-white/60 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LOGO LOOP (trust strip) ─────────────────────────────────── */}
      <section className="py-10 bg-white dark:bg-slate-950 border-b border-gray-100 dark:border-slate-800">
        <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-8">
          Tin tưởng bởi hàng trăm đội ngũ kỹ thuật
        </p>
        <LogoLoop
          fadeOutColor="#ffffff"
          duration={25}
          gap={72}
          items={[
            <Wordmark key="vercel">Vercel</Wordmark>,
            <Wordmark key="supabase">Supabase</Wordmark>,
            <Wordmark key="railway">Railway</Wordmark>,
            <Wordmark key="planetscale">PlanetScale</Wordmark>,
            <Wordmark key="cloudflare">Cloudflare</Wordmark>,
            <Wordmark key="render">Render</Wordmark>,
            <Wordmark key="digitalocean">DigitalOcean</Wordmark>,
            <Wordmark key="aws">AWS</Wordmark>,
            <Wordmark key="gcp">Google Cloud</Wordmark>,
            <Wordmark key="fly">Fly.io</Wordmark>,
          ]}
        />
      </section>

      {/* ─── FEATURES ────────────────────────────────────────────────────── */}
      <section className="py-28 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-20 max-w-2xl mx-auto">
            <p className="text-sm font-bold text-[#F6821F] uppercase tracking-widest mb-4">Nền Tảng Tất Cả Trong Một</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1D3557] tracking-tight mb-5">
              Mọi công cụ bạn cần để duy trì tính sẵn sàng cao
            </h2>
            <p className="text-[#4A5568] text-lg leading-relaxed">
              Từ kiểm tra uptime cơ bản đến phân tích hiệu suất chuyên sâu — tất cả trong một nơi duy nhất.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            {[
              { icon: <Zap className="h-6 w-6 text-[#F6821F]" />, title: "Mạng Lưới Toàn Cầu", description: "Đo lường độ trễ từ góc độ người dùng thực, với máy chủ kiểm tra trải đều toàn thế giới." },
              { icon: <Bell className="h-6 w-6 text-emerald-500" />, title: "Cảnh Báo Thông Minh", description: "Xác minh chéo từ nhiều nơi trước khi gửi cảnh báo. Không còn false alarm lúc nửa đêm." },
              { icon: <Activity className="h-6 w-6 text-blue-500" />, title: "Phân Tích Chuỗi Thời Gian", description: "Theo dõi xu hướng và phát hiện sự suy giảm hiệu năng âm thầm theo thời gian." },
              { icon: <Globe className="h-6 w-6 text-purple-500" />, title: "Trang Trạng Thái Công Khai", description: "Xây dựng niềm tin bằng trang trạng thái hiện đại, tự động cập nhật cho khách hàng." },
              { icon: <Clock className="h-6 w-6 text-pink-500" />, title: "Lịch Sử 90 Ngày", description: "Tra cứu toàn bộ lịch sử sự cố, thời gian phản hồi và uptime bất cứ lúc nào." },
              { icon: <Shield className="h-6 w-6 text-[#1D3557]" />, title: "Bảo Mật SSL", description: "Theo dõi ngày hết hạn chứng chỉ SSL và nhận cảnh báo trước khi certificate lỗi." },
            ].map((f) => (
              <FeatureCell key={f.title} icon={f.icon} title={f.title} description={f.description} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── ANIMATED BEAM INTEGRATIONS ─────────────────────────────── */}
      <AnimatedBeamSection />

      {/* ─── CTA BANNER ──────────────────────────────────────────────────── */}
      <section className="py-24 bg-[#F6821F] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: `radial-gradient(white 1px, transparent 1px)`, backgroundSize: "24px 24px" }}
        />
        <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Sẵn sàng bắt đầu giám sát?
          </h2>
          <p className="text-white/80 text-xl mb-10 max-w-xl mx-auto">
            Thiết lập monitor đầu tiên của bạn trong vòng chưa đầy 2 phút. Hoàn toàn miễn phí.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 h-14 px-10 text-lg font-bold rounded-full bg-white text-[#F6821F] hover:bg-gray-50 shadow-xl transition-all hover:scale-105"
          >
            Bắt Đầu Ngay — Miễn Phí
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>


    </div>
  );
}

function FeatureCell({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group bg-white p-8 hover:bg-orange-50/60 transition-colors duration-200 cursor-pointer">
      <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-orange-200 transition-transform duration-200">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-[#1D3557] mb-3 tracking-tight">{title}</h3>
      <p className="text-[#4A5568] text-[15px] leading-relaxed">{description}</p>
    </div>
  );
}

function Wordmark({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-gray-300 font-bold text-base tracking-tight whitespace-nowrap hover:text-gray-400 transition-colors">
      {children}
    </span>
  );
}
