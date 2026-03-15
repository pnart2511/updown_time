import Link from "next/link";

const solutions = [
  { label: "Thương Mại Điện Tử", href: "/giai-phap/thuong-mai-dien-tu" },
  { label: "SaaS / PaaS", href: "/giai-phap/saas" },
  { label: "API & Hệ Thống Lớn", href: "/giai-phap/api" },
];

export default function GiaiPhapLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-16">
      {/* Solution sub-nav */}
      <div className="border-b border-gray-100 bg-white sticky top-16 z-40">
        <div className="container mx-auto px-6 max-w-7xl">
          <nav className="flex gap-1 overflow-x-auto">
            {solutions.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="px-4 py-3.5 text-sm font-medium text-gray-500 hover:text-[#1D3557] border-b-2 border-transparent hover:border-[#F6821F] transition-all whitespace-nowrap"
              >
                {s.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      {children}
    </div>
  );
}
