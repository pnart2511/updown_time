import Link from "next/link";

const features = [
  { label: "Ping Monitor", href: "/san-pham/ping" },
  { label: "Trang Trạng Thái", href: "/san-pham/trang-thai-trang" },
  { label: "Cảnh Báo", href: "/san-pham/canh-bao" },
  { label: "Phân Tích", href: "/san-pham/phan-tich" },
];

export default function SanPhamLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-16">
      {/* Feature sub-nav */}
      <div className="border-b border-gray-100 bg-white sticky top-16 z-40">
        <div className="container mx-auto px-6 max-w-7xl">
          <nav className="flex gap-1 overflow-x-auto">
            {features.map((f) => (
              <Link
                key={f.href}
                href={f.href}
                className="px-4 py-3.5 text-sm font-medium text-gray-500 hover:text-[#1D3557] border-b-2 border-transparent hover:border-[#F6821F] transition-all whitespace-nowrap"
              >
                {f.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      {children}
    </div>
  );
}
