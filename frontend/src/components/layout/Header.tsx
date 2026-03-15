"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Ping Monitor",
    href: "/san-pham/ping",
    description: "Giám sát HTTP, ICMP Ping, TCP và MySQL từ 10+ vị trí toàn cầu.",
  },
  {
    title: "Cảnh Báo",
    href: "/san-pham/canh-bao",
    description: "Nhận thông báo qua Slack, Discord, Telegram, Email hay Webhook.",
  },
  {
    title: "Trang Trạng Thái",
    href: "/san-pham/trang-thai-trang",
    description: "Trang trạng thái công khai tự động cập nhật, tùy chỉnh thương hiệu.",
  },
  {
    title: "Phân Tích",
    href: "/san-pham/phan-tich",
    description: "Xu hướng thời gian phản hồi, uptime theo vùng, xuất báo cáo SLA.",
  },
];

export function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [logoUrl, setLogoUrl] = React.useState<string | null>(null);
  const [siteName, setSiteName] = React.useState<string>("UpMonitor");
  const pathname = usePathname();
  const isHome = pathname === "/";

  React.useEffect(() => {
    // Fetch dynamic logo on mount
    const fetchSettings = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const res = await fetch(`${API_URL}/api/public/settings`);
        if (res.ok) {
          const data = await res.json();
          if (data.public_logo) setLogoUrl(data.public_logo);
          if (data.website_name) setSiteName(data.website_name);
        }
      } catch (e) {}
    };
    fetchSettings();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    // Re-check immediately when route changes (client-side nav doesn't re-mount)
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]); // re-run on every route change

  // Transparent only on the landing page when not yet scrolled
  const isTransparent = isHome && !isScrolled;

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isTransparent
          ? "border-b border-transparent bg-transparent"
          : "bg-white/95 dark:bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-950/60"
      )}
    >
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8 mx-auto">
        <div className="flex items-center gap-6 md:gap-8">
          {/* Logo - Dynamic or Default */}
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-8 w-auto object-contain rounded" />
            ) : (
              <div className="w-8 h-8 rounded bg-gradient-to-tr from-[#F6821F] to-[#FF9E4A] flex items-center justify-center shadow-sm">
                <span className="text-white font-bold leading-none -mt-0.5">U</span>
              </div>
            )}
            <span className="hidden font-bold sm:inline-block text-xl tracking-tight text-[#1D3557]">
              {siteName}
            </span>
          </Link>

          {/* Desktop Marketing Nav */}
          <div className="hidden lg:flex">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-[#1D3557] hover:text-[#F6821F] font-medium">Sản Phẩm</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                      {components.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-[#1D3557] hover:text-[#F6821F] font-medium">Giải Pháp</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/giai-phap/saas"
                        >
                          <div className="w-8 h-8 rounded bg-gradient-to-tr from-[#F6821F] to-[#FF9E4A] mb-4 flex items-center justify-center">
                            <span className="text-white font-bold leading-none -mt-0.5">U</span>
                          </div>
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Enterprise UpMonitor
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Đảm bảo thời gian SLA chặt chẽ, hỗ trợ ưu tiên trực tiếp cho các đội ngũ quy mô rải rác toàn cầu.
                          </p>
                        </NavigationMenuLink>
                      </li>
                      <ListItem href="/giai-phap/thuong-mai-dien-tu" title="Thương Mại Điện Tử">
                        Đảm bảo tốc độ giỏ hàng và checkout luôn mượt mà.
                      </ListItem>
                      <ListItem href="/giai-phap/saas" title="Dịch Vụ SaaS / PaaS">
                        Nâng cao uy tín với trang trạng thái và báo cáo SLA tự động.
                      </ListItem>
                      <ListItem href="/giai-phap/api" title="API & Hệ Thống Lớn">
                        Giám sát microservices, TCP port, SSL và toàn bộ chuỗi phụ thuộc.
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/pricing"
                    className={cn(navigationMenuTriggerStyle(), "bg-transparent text-[#1D3557] hover:text-[#F6821F] font-medium")}
                  >
                    Bảng Giá
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/blog"
                    className={cn(navigationMenuTriggerStyle(), "bg-transparent text-[#1D3557] hover:text-[#F6821F] font-medium")}
                  >
                    Blog
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/docs"
                    className={cn(navigationMenuTriggerStyle(), "bg-transparent text-[#1D3557] hover:text-[#F6821F] font-medium")}
                  >
                    Tài Liệu
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          <div className="hidden md:flex items-center gap-4 border-l border-gray-200 pl-4">
            <Link href="/login" className="text-sm font-medium text-[#1D3557] hover:text-[#F6821F] transition-colors whitespace-nowrap">
              Đăng Nhập
            </Link>
            <Link href="/dashboard" className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-[#F6821F] hover:bg-[#e0721a] text-white font-semibold text-sm transition-colors">
              Trang Quản Trị
            </Link>
          </div>

          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink
        ref={ref}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
        {...props}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
