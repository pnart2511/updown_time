import { Activity, Globe, Clock, CheckCircle2, Zap, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function PingPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="border-b border-gray-100 py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 border border-orange-100 px-3 py-1 text-xs font-semibold text-[#F6821F] mb-6">
            <Activity className="h-3.5 w-3.5" />
            Ping Monitor
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1D3557] tracking-tight mb-5 max-w-3xl leading-tight">
            Biết ngay khi dịch vụ của bạn<br />
            <span className="text-[#F6821F]">ngừng hoạt động.</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl leading-relaxed mb-8">
            UpMonitor kiểm tra endpoint HTTP, ICMP Ping và TCP Port của bạn mỗi 30 giây từ nhiều vị trí toàn cầu. Bất kỳ sự cố nào cũng được phát hiện trong vòng chưa đầy 1 phút.
          </p>
          <div className="flex gap-4">
            <Link href="/register" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#F6821F] hover:bg-[#e0721a] text-white font-semibold text-sm transition-colors">
              Bắt đầu miễn phí
            </Link>
            <Link href="/dashboard" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-[#1D3557] text-[#1D3557] hover:bg-[#1D3557] hover:text-white font-semibold text-sm transition-colors">
              Xem demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <h2 className="text-2xl font-extrabold text-[#1D3557] mb-12">Tính năng nổi bật</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Globe className="h-5 w-5 text-[#F6821F]" />,
                title: "10+ Vị trí toàn cầu",
                desc: "Kiểm tra từ Hà Nội, TP.HCM, Singapore, Tokyo, Frankfurt, New York và nhiều hơn nữa để loại bỏ false positive.",
              },
              {
                icon: <Clock className="h-5 w-5 text-[#F6821F]" />,
                title: "Kiểm tra mỗi 30 giây",
                desc: "Tần suất kiểm tra cao nhất trong phân khúc. Phát hiện sự cố trước khi khách hàng nhận ra.",
              },
              {
                icon: <Zap className="h-5 w-5 text-[#F6821F]" />,
                title: "HTTP / ICMP / TCP / MySQL",
                desc: "Hỗ trợ đầy đủ các loại giám sát: endpoint web, ping mạng, cổng TCP và cơ sở dữ liệu.",
              },
              {
                icon: <CheckCircle2 className="h-5 w-5 text-[#F6821F]" />,
                title: "Xác minh chéo",
                desc: "Cảnh báo chỉ được gửi khi nhiều vị trí đồng thời xác nhận sự cố — không bao giờ false alarm.",
              },
              {
                icon: <BarChart3 className="h-5 w-5 text-[#F6821F]" />,
                title: "Lịch sử 90 ngày",
                desc: "Truy cập toàn bộ dữ liệu uptime, thời gian phản hồi và sự cố trong 90 ngày gần nhất.",
              },
              {
                icon: <Activity className="h-5 w-5 text-[#F6821F]" />,
                title: "SSL Certificate Monitor",
                desc: "Tự động theo dõi ngày hết hạn SSL, nhận cảnh báo trước 30, 14 và 7 ngày.",
              },
            ].map((f) => (
              <div key={f.title} className="group p-6 rounded-2xl border border-gray-100 hover:border-orange-100 hover:bg-orange-50/30 transition-all">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="font-bold text-[#1D3557] mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#1D3557] py-14">
        <div className="container mx-auto px-6 max-w-5xl grid grid-cols-3 gap-8 text-center text-white">
          {[
            { v: "99.9%", l: "SLA Uptime" },
            { v: "< 60s", l: "Thời gian phát hiện" },
            { v: "10+", l: "Vị trí kiểm tra" },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-4xl font-black text-[#F6821F] mb-1">{s.v}</div>
              <div className="text-white/60 text-sm">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-extrabold text-[#1D3557] mb-4">Sẵn sàng bắt đầu?</h2>
        <p className="text-gray-500 mb-8">Thiết lập monitor đầu tiên trong vòng 2 phút. Hoàn toàn miễn phí.</p>
        <Link href="/register" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#F6821F] hover:bg-[#e0721a] text-white font-bold transition-colors shadow-lg shadow-orange-100">
          Bắt đầu miễn phí →
        </Link>
      </section>
    </div>
  );
}
