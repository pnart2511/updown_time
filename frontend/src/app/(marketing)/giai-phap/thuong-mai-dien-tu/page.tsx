import { ShoppingCart, Zap, Shield, Globe, BarChart3, Bell, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";

export default function ThuongMaiDienTuPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="border-b border-gray-100 py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 border border-orange-100 px-3 py-1 text-xs font-semibold text-[#F6821F] mb-6">
            <ShoppingCart className="h-3.5 w-3.5" />
            Thương Mại Điện Tử
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1D3557] tracking-tight mb-5 max-w-3xl leading-tight">
            Không để downtime<br />
            <span className="text-[#F6821F]">cướp mất doanh thu của bạn.</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl leading-relaxed mb-8">
            Mỗi giây downtime của sàn thương mại điện tử là tiền mất đi. UpMonitor theo dõi toàn bộ hạ tầng — từ trang chủ, API giỏ hàng đến cổng thanh toán — và cảnh báo ngay khi có vấn đề.
          </p>
          <div className="flex gap-4">
            <Link href="/register" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#F6821F] hover:bg-[#e0721a] text-white font-semibold text-sm transition-colors">
              Bắt đầu miễn phí
            </Link>
          </div>
        </div>
      </section>

      {/* Pain points → solutions */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <h2 className="text-2xl font-extrabold text-[#1D3557] mb-12">Bảo vệ toàn bộ hành trình mua sắm</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: <ShoppingCart className="h-5 w-5 text-[#F6821F]" />,
                title: "Giỏ hàng & Checkout",
                desc: "Theo dõi luồng checkout end-to-end, phát hiện ngay khi quy trình thanh toán bị gián đoạn trước khi khách hàng bỏ giỏ hàng.",
              },
              {
                icon: <Globe className="h-5 w-5 text-[#F6821F]" />,
                title: "CDN & Tốc độ tải trang",
                desc: "Kiểm tra thời gian tải từ Hà Nội, TP.HCM và toàn cầu — đảm bảo tốc độ đồng đều trên mọi khu vực.",
              },
              {
                icon: <Shield className="h-5 w-5 text-[#F6821F]" />,
                title: "SSL & Bảo mật",
                desc: "Cảnh báo tự động khi chứng chỉ SSL sắp hết hạn. Không để khách thấy cảnh báo bảo mật đỏ trên site của bạn.",
              },
              {
                icon: <Zap className="h-5 w-5 text-[#F6821F]" />,
                title: "API cổng thanh toán",
                desc: "Giám sát endpoint của VNPAY, Momo, ZaloPay để phát hiện sự cố cổng thanh toán trước khi đơn hàng thất bại.",
              },
              {
                icon: <Bell className="h-5 w-5 text-[#F6821F]" />,
                title: "Cảnh báo đa kênh",
                desc: "Nhận ngay thông báo qua Slack, Telegram hoặc SMS khi bất kỳ dịch vụ nào trong stack của bạn gặp sự cố.",
              },
              {
                icon: <BarChart3 className="h-5 w-5 text-[#F6821F]" />,
                title: "Báo cáo uptime cho sếp",
                desc: "Tạo báo cáo PDF hàng tháng với số liệu SLA chuyên nghiệp để báo cáo lên ban quản trị hoặc gửi đối tác.",
              },
            ].map((f) => (
              <div key={f.title} className="group flex gap-4 p-6 rounded-2xl border border-gray-100 hover:border-orange-100 hover:bg-orange-50/30 transition-all">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">{f.icon}</div>
                <div>
                  <h3 className="font-bold text-[#1D3557] mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#1D3557] py-14">
        <div className="container mx-auto px-6 max-w-5xl grid grid-cols-3 gap-8 text-center text-white">
          {[
            { v: "$5,600", l: "Doanh thu mất mỗi phút downtime*" },
            { v: "< 60s", l: "Phát hiện sự cố" },
            { v: "99.9%", l: "Uptime SLA cam kết" },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-3xl md:text-4xl font-black text-[#F6821F] mb-1">{s.v}</div>
              <div className="text-white/60 text-xs md:text-sm">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 text-center">
        <h2 className="text-3xl font-extrabold text-[#1D3557] mb-4">Bảo vệ doanh thu ngay hôm nay</h2>
        <p className="text-gray-500 mb-8">Thiết lập trong 2 phút. Không cần thẻ tín dụng.</p>
        <Link href="/register" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#F6821F] hover:bg-[#e0721a] text-white font-bold transition-colors shadow-lg shadow-orange-100">
          Bắt đầu miễn phí →
        </Link>
      </section>
    </div>
  );
}
