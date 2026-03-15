import { BarChart3, TrendingUp, Clock, Globe, Zap, Download, AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function PhanTichPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="border-b border-gray-100 py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 border border-orange-100 px-3 py-1 text-xs font-semibold text-[#F6821F] mb-6">
            <BarChart3 className="h-3.5 w-3.5" />
            Phân Tích
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1D3557] tracking-tight mb-5 max-w-3xl leading-tight">
            Dữ liệu hiệu suất chi tiết<br />
            <span className="text-[#F6821F]">để đưa ra quyết định đúng.</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl leading-relaxed mb-8">
            Theo dõi xu hướng thời gian phản hồi, uptime theo vùng địa lý, phát hiện suy giảm hiệu năng âm thầm và tạo báo cáo SLA chuyên nghiệp.
          </p>
          <Link href="/register" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#F6821F] hover:bg-[#e0721a] text-white font-semibold text-sm transition-colors">
            Xem số liệu của bạn
          </Link>
        </div>
      </section>

      {/* Mock chart */}
      <section className="py-16 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-[#1D3557]">Thời gian phản hồi — api.example.com</h3>
                <p className="text-sm text-gray-400">30 ngày gần nhất — Trung bình: 48ms</p>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">▲ 99.97% uptime</span>
            </div>
            {/* Fake bar chart */}
            <div className="flex items-end gap-1 h-32">
              {[40, 52, 38, 45, 60, 42, 35, 55, 48, 41, 63, 37, 44, 50, 39, 58, 43, 36, 47, 53, 41, 38, 62, 45, 40, 55, 48, 37, 44, 50].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h * 1.8}px`, background: h > 55 ? "#F6821F" : "#1D3557", opacity: h > 55 ? 1 : 0.3 }} />
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-3">
              <span>10 Th2</span><span>17 Th2</span><span>24 Th2</span><span>03 Th3</span><span>10 Th3</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <h2 className="text-2xl font-extrabold text-[#1D3557] mb-12">Tính năng phân tích</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <TrendingUp className="h-5 w-5 text-[#F6821F]" />, title: "Phân tích xu hướng", desc: "Phát hiện sớm sự suy giảm hiệu năng dần dần trước khi thành sự cố thực sự." },
              { icon: <Globe className="h-5 w-5 text-[#F6821F]" />, title: "Uptime theo vùng địa lý", desc: "Xem hiệu suất từng khu vực riêng biệt: châu Á, châu Âu, Bắc Mỹ." },
              { icon: <Clock className="h-5 w-5 text-[#F6821F]" />, title: "Lịch sử 90 ngày", desc: "Dữ liệu lưu đầy đủ 90 ngày với độ phân giải đến từng phút." },
              { icon: <AlertTriangle className="h-5 w-5 text-[#F6821F]" />, title: "Root cause analysis", desc: "Xem chính xác sự cố bắt đầu từ đâu, từ vị trí nào, kéo dài bao lâu." },
              { icon: <Download className="h-5 w-5 text-[#F6821F]" />, title: "Xuất báo cáo PDF/CSV", desc: "Tạo báo cáo SLA hàng tháng gửi khách hàng hoặc ban lãnh đạo chỉ với một nút." },
              { icon: <Zap className="h-5 w-5 text-[#F6821F]" />, title: "API dữ liệu thô", desc: "Kéo toàn bộ dữ liệu qua REST API để tích hợp vào Grafana hoặc dashboard nội bộ." },
            ].map((f) => (
              <div key={f.title} className="group p-6 rounded-2xl border border-gray-100 hover:border-orange-100 hover:bg-orange-50/30 transition-all">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">{f.icon}</div>
                <h3 className="font-bold text-[#1D3557] mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SLA callout */}
      <section className="py-14 bg-[#1D3557]">
        <div className="container mx-auto px-6 max-w-5xl grid md:grid-cols-3 gap-8 text-center text-white">
          {[
            { v: "90 ngày", l: "Lưu trữ dữ liệu" },
            { v: "1 phút", l: "Độ phân giải tối thiểu" },
            { v: "PDF/CSV", l: "Định dạng xuất báo cáo" },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-4xl font-black text-[#F6821F] mb-1">{s.v}</div>
              <div className="text-white/60 text-sm">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 text-center">
        <h2 className="text-3xl font-extrabold text-[#1D3557] mb-4">Dữ liệu là sức mạnh</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">Bắt đầu thu thập số liệu hiệu suất ngay hôm nay, hoàn toàn miễn phí.</p>
        <Link href="/register" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#F6821F] hover:bg-[#e0721a] text-white font-bold transition-colors shadow-lg shadow-orange-100">
          Bắt đầu miễn phí →
        </Link>
      </section>
    </div>
  );
}
