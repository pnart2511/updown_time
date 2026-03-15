import { Zap, Globe, Shield, BarChart3, Bell, CheckCircle2, Users, Clock } from "lucide-react";
import Link from "next/link";

export default function SaasPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="border-b border-gray-100 py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 border border-orange-100 px-3 py-1 text-xs font-semibold text-[#F6821F] mb-6">
            <Zap className="h-3.5 w-3.5" />
            SaaS / PaaS
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1D3557] tracking-tight mb-5 max-w-3xl leading-tight">
            Uptime là tính năng<br />
            <span className="text-[#F6821F]">quan trọng nhất của sản phẩm bạn.</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl leading-relaxed mb-8">
            Với SaaS, downtime không chỉ là mất tiền — đó là mất niềm tin. UpMonitor giúp bạn phát hiện sự cố trước khách hàng, duy trì trang trạng thái minh bạch và hoàn thành mọi cam kết SLA.
          </p>
          <div className="flex gap-4">
            <Link href="/register" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#F6821F] hover:bg-[#e0721a] text-white font-semibold text-sm transition-colors">
              Bắt đầu miễn phí
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <h2 className="text-2xl font-extrabold text-[#1D3557] mb-12">Xây dựng sản phẩm đáng tin cậy hơn</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: <Globe className="h-5 w-5 text-[#F6821F]" />,
                title: "Trang trạng thái công khai",
                desc: "Xây dựng niềm tin với khách hàng bằng trang trạng thái tự động cập nhật. Họ tự kiểm tra được thay vì gửi ticket hỗ trợ.",
              },
              {
                icon: <Shield className="h-5 w-5 text-[#F6821F]" />,
                title: "Báo cáo SLA tự động",
                desc: "Tạo báo cáo PDF hàng tháng với số liệu 99.9% uptime gửi trực tiếp cho khách hàng enterprise. Tăng tỷ lệ gia hạn hợp đồng.",
              },
              {
                icon: <Bell className="h-5 w-5 text-[#F6821F]" />,
                title: "On-call rotation",
                desc: "Định nghĩa lịch trực theo ca, tự động gửi cảnh báo đến đúng người đang on-call. Không ai bị đánh thức vô lý lúc 3 giờ sáng.",
              },
              {
                icon: <Users className="h-5 w-5 text-[#F6821F]" />,
                title: "Multi-team support",
                desc: "Phân quyền theo team — mỗi bộ phận chỉ thấy monitor của họ. Frontend, backend, database hoạt động độc lập.",
              },
              {
                icon: <BarChart3 className="h-5 w-5 text-[#F6821F]" />,
                title: "Xu hướng hiệu năng",
                desc: "Phát hiện suy giảm latency âm thầm trước khi trở thành sự cố. Dashboard cho thấy thời gian phản hồi theo tuần/tháng.",
              },
              {
                icon: <CheckCircle2 className="h-5 w-5 text-[#F6821F]" />,
                title: "Incident management",
                desc: "Theo dõi toàn bộ vòng đời sự cố: phát hiện → thông báo → xử lý → postmortem, tất cả trong một nền tảng.",
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

      {/* Testimonial-style callout */}
      <section className="py-16 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <p className="text-2xl font-bold text-[#1D3557] leading-relaxed mb-6">
            "Khách hàng của chúng tôi biết về sự cố trước khi nhóm kỹ thuật nhận ra — nhờ trang trạng thái UpMonitor."
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F6821F] to-orange-300 flex items-center justify-center text-white font-bold">N</div>
            <div className="text-left">
              <div className="font-semibold text-[#1D3557] text-sm">Nguyễn Minh Tú</div>
              <div className="text-gray-400 text-xs">CTO @ StartupVN</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 text-center">
        <h2 className="text-3xl font-extrabold text-[#1D3557] mb-4">Làm khách hàng luôn tin tưởng bạn</h2>
        <p className="text-gray-500 mb-8">Tham gia cùng hàng trăm SaaS đang dùng UpMonitor.</p>
        <Link href="/register" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#F6821F] hover:bg-[#e0721a] text-white font-bold transition-colors shadow-lg shadow-orange-100">
          Bắt đầu miễn phí →
        </Link>
      </section>
    </div>
  );
}
