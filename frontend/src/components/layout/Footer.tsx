"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin, Facebook, Mail, ExternalLink } from "lucide-react";

const footerLinks = [
  {
    title: "Sản phẩm",
    links: [
      { name: "Ping Monitor", href: "/san-pham/ping" },
      { name: "Cảnh Báo", href: "/san-pham/canh-bao" },
      { name: "Trang Trạng Thái", href: "/san-pham/trang-thai-trang" },
      { name: "Phân Tích", href: "/san-pham/phan-tich" },
    ],
  },
  {
    title: "Giải pháp",
    links: [
      { name: "Thương Mại Điện Tử", href: "/giai-phap/thuong-mai-dien-tu" },
      { name: "Dịch Vụ SaaS", href: "/giai-phap/saas" },
      { name: "API & Hệ Thống", href: "/giai-phap/api" },
      { name: "Doanh Nghiệp", href: "/giai-phap/saas" },
    ],
  },
  {
    title: "Hỗ trợ",
    links: [
      { name: "Tài Liệu", href: "/docs" },
      { name: "API Reference", href: "/docs/api" },
      { name: "Trạng Hệ Thống", href: "/status" },
      { name: "Hỗ Trợ Trực Tiếp", href: "/contact" },
    ],
  },
  {
    title: "Công ty",
    links: [
      { name: "Về Chúng Tôi", href: "/about" },
      { name: "Bảng Giá", href: "/pricing" },
      { name: "Điều Khoản", href: "/terms" },
      { name: "Bảo Mật", href: "/privacy" },
    ],
  },
];

import * as React from "react";

export function Footer() {
  const [siteName, setSiteName] = React.useState<string>("UpMonitor");

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const res = await fetch(`${API_URL}/api/public/settings`);
        if (res.ok) {
          const data = await res.json();
          if (data.website_name) setSiteName(data.website_name);
        }
      } catch (e) {}
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-[#1D3557] py-16 text-white/70">
      <div className="container max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 md:gap-16">
          {/* Brand Section */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6 transition-opacity hover:opacity-80">
              <div className="w-8 h-8 rounded bg-[#F6821F] flex items-center justify-center text-white font-black text-lg shadow-sm">
                U
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                {siteName}
              </span>
            </Link>
            <p className="text-white/60 text-[15px] leading-relaxed mb-8 max-w-xs">
              Hệ thống giám sát hạ tầng thời gian thực. Giữ cho ứng dụng của bạn luôn hoạt động và nhanh chóng từ mọi vị trí.
            </p>
            <div className="flex gap-5">
              <Link href="#" className="text-white/40 hover:text-[#F6821F] transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-white/40 hover:text-[#F6821F] transition-colors" aria-label="Github">
                <Github className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-white/40 hover:text-[#F6821F] transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-bold text-white mb-6 text-sm uppercase tracking-widest">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="hover:text-[#F6821F] text-[15px] transition-colors flex items-center group font-medium"
                    >
                      {link.name}
                      {link.href.startsWith("http") && (
                        <ExternalLink className="w-3.5 h-3.5 ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm font-medium">
             <p>© {new Date().getFullYear()} {siteName}. Tất cả các quyền được bảo lưu.</p>
             <span className="hidden md:block opacity-30">|</span>
             <Link href="mailto:support@upmonitor.vn" className="hover:text-[#F6821F] transition-colors flex items-center gap-2">
               <Mail className="w-4 h-4" />
               support@upmonitor.vn
             </Link>
          </div>
          
          <div className="flex items-center gap-3">
             <span className="text-[11px] font-bold text-white/40 px-3 py-1 rounded-full bg-white/5 border border-white/10 uppercase tracking-tighter">
               Vn Engine
             </span>
             <span className="text-[11px] font-bold text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 uppercase tracking-tighter">
               99.99% Uptime
             </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
