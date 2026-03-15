"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Activity,
  AlertCircle,
  Bell,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Globe,
  LayoutDashboard,
  LogOut,
  Mail,
  Send,
  Settings,
  Shield,
  Zap,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarGroupLabel,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/animate-ui/components/radix/sidebar";

const navItems = [
  { icon: LayoutDashboard, label: "Tổng quan", href: "/dashboard" },
  { icon: Activity, label: "Monitors", href: "/dashboard/monitors" },
  { icon: AlertCircle, label: "Sự cố", href: "/dashboard/incidents" },
  { icon: Globe, label: "Trang trạng thái", href: "/dashboard/status-pages" },
  { icon: Shield, label: "SSL / Domain", href: "/dashboard/ssl" },
  { icon: Zap, label: "Tích hợp", href: "/dashboard/integrations" },
  { icon: CreditCard, label: "Gói dịch vụ", href: "/dashboard/plans" },
];

const settingsSubItems = [
  { icon: Mail, label: "Cấu hình Email", href: "/dashboard/settings/email" },
  { icon: Send, label: "Cấu hình Telegram", href: "/dashboard/settings/telegram" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; full_name?: string } | null>(null);

  // Settings submenu open state — auto-open when inside /dashboard/settings
  const isInSettings = pathname.startsWith("/dashboard/settings");
  const [settingsOpen, setSettingsOpen] = useState(isInSettings);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);

  // Keep submenu open when navigating inside settings
  useEffect(() => {
    if (isInSettings) setSettingsOpen(true);
  }, [isInSettings]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const initials = user?.full_name
    ? user.full_name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? "U";

  const allNavForHeader = [
    ...navItems,
    { label: "Cài đặt", href: "/dashboard/settings" },
    { label: "Hồ sơ cá nhân", href: "/dashboard/profile" },
    ...settingsSubItems,
  ];
  const currentNav = allNavForHeader.find(
    (item) => pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
  );

  return (
    <SidebarProvider className="font-sans">
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/dashboard">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#F6821F] text-white">
                    <span className="font-black text-sm leading-none">U</span>
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-bold text-lg tracking-tight">UpMonitor</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {/* Regular nav items */}
                {navItems.map(({ icon: Icon, label, href }) => {
                  const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
                  return (
                    <SidebarMenuItem key={href}>
                      <SidebarMenuButton asChild isActive={isActive} tooltip={label}>
                        <Link href={href}>
                          <Icon />
                          <span>{label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}

                {/* Settings — expandable item */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={isInSettings}
                    tooltip="Cài đặt"
                    onClick={() => setSettingsOpen((v) => !v)}
                    className="cursor-pointer w-full"
                  >
                    <Settings />
                    <span>Cài đặt</span>
                    <ChevronDown
                      className="h-4 w-4 opacity-50 ml-auto transition-transform duration-300 ease-in-out"
                      style={{ transform: settingsOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                    />
                  </SidebarMenuButton>

                  {/* Sub-menu — animated slide down/up */}
                  {settingsOpen && (
                    <SidebarMenuSub>
                      {settingsSubItems.map(({ icon: SubIcon, label, href }) => {
                        const isSubActive = pathname === href || pathname.startsWith(href);
                        return (
                          <SidebarMenuSubItem key={href}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isSubActive}
                              className={`transition-all duration-200 ${
                                isSubActive
                                  ? "bg-[#F6821F]/10 text-[#F6821F] font-semibold"
                                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                              }`}
                            >
                              <Link href={href}>
                                <SubIcon className={`h-3.5 w-3.5 shrink-0 transition-colors ${isSubActive ? "text-[#F6821F]" : "text-slate-400"}`} />
                                <span className="truncate">{label}</span>
                                {isSubActive && <ChevronRight className="h-3 w-3 ml-auto opacity-50 shrink-0" />}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                <div className="flex w-full items-center">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-[#1D3557] text-white text-xs font-bold">
                    {initials}
                  </div>
                  <Link href="/dashboard/profile" className="flex flex-col gap-0.5 leading-none flex-1 overflow-hidden ml-2 hover:opacity-80 transition-opacity">
                    <span className="font-semibold truncate text-[#1D3557]">{user?.full_name ?? "Người dùng"}</span>
                    <span className="text-xs truncate opacity-70 text-slate-500">{user?.email}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    title="Đăng xuất"
                    className="ml-auto flex items-center justify-center p-2 rounded-md hover:bg-red-100 hover:text-red-500 text-gray-500 transition-colors"
                  >
                    <LogOut className="size-4" />
                  </button>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 bg-white sticky top-0 z-10 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <div className="h-4 w-px bg-gray-200" />
            <span className="text-sm font-medium text-gray-500 ml-2">{currentNav ? currentNav.label : "Tổng quan"}</span>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#F6821F] rounded-full" />
            </button>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 bg-[#F0F4F8]">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
