"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Activity,
  MapPin,
  LogOut,
  Shield,
  ChevronRight,
  Settings,
  BookOpen,
  CreditCard,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const navItems = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Người dùng", icon: Users },
  { href: "/admin/monitors", label: "Monitors", icon: Activity },
  { href: "/admin/locations", label: "Địa điểm Ping", icon: MapPin },
  { href: "/admin/articles", label: "Bài viết (CMS)", icon: BookOpen },
  { href: "/admin/plans", label: "Gói dịch vụ", icon: CreditCard },
  { href: "/admin/settings", label: "Cài đặt hệ thống", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    // Verify admin role by calling stats endpoint
    fetch(`${API_URL}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      if (res.status === 403 || res.status === 401) {
        router.push("/dashboard");
      }
    });

    // Get user info from JWT decode (simple base64 decode)
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setAdminEmail(payload.email || "Admin");
    } catch {}
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-[#0f172a] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col bg-[#0f172a] border-r border-white/5">
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F6821F] to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">UpMonitor</p>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? "bg-[#F6821F] text-white shadow-lg shadow-orange-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {item.label}
                {isActive && <ChevronRight className="h-3 w-3 ml-auto opacity-70" />}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{adminEmail || "Admin"}</p>
              <p className="text-slate-500 text-[10px]">Super Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl text-sm transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-slate-50/95">
        {children}
      </main>
    </div>
  );
}
