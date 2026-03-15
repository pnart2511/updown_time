import { Globe, CheckCircle2, Clock, Zap, Shield, Bell } from "lucide-react";
import Link from "next/link";

export default function TrangThaiTrangPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="border-b border-gray-100 py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 border border-orange-100 px-3 py-1 text-xs font-semibold text-[#F6821F] mb-6">
            <Globe className="h-3.5 w-3.5" />
            Trang Trạng Thái
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1D3557] tracking-tight mb-5 max-w-3xl leading-tight">
            Trang trạng thái công khai<br />
            <span className="text-[#F6821F]">tự động cập nhật.</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl leading-relaxed mb-8">
            Xây dựng niềm tin với khách hàng bằng trang trạng thái hiện đại, tự động hiển thị uptime thời gian thực và lịch sử sự cố — không cần tự cập nhật thủ công.
          </p>
          <div className="flex gap-4">
            <Link href="/register" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#F6821F] hover:bg-[#e0721a] text-white font-semibold text-sm transition-colors">
              Tạo trang trạng thái
            </Link>
            <Link href="/status" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-[#1D3557] text-[#1D3557] hover:bg-[#1D3557] hover:text-white font-semibold text-sm transition-colors">
              Xem ví dụ
            </Link>
          </div>
        </div>
      </section>

      {/* Mock status page preview */}
      <section className="py-16 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="font-bold text-[#1D3557] text-sm">Tất cả hệ thống đang hoạt động bình thường</div>
                  <div className="text-xs text-gray-400">Cập nhật lúc 01:00 SA — 12 Th3 2026</div>
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-50">
              {[
                { name: "API Server", uptime: "99.98%", status: "operational" },
                { name: "Web App", uptime: "100%", status: "operational" },
                { name: "Database", uptime: "99.95%", status: "operational" },
                { name: "CDN", uptime: "100%", status: "operational" },
              ].map((s) => (
                <div key={s.name} className="px-8 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-sm font-medium text-[#1D3557]">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 30 }).map((_, i) => (
                        <div key={i} className="w-1.5 h-6 rounded-sm bg-emerald-400 opacity-80" />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 w-14 text-right">{s.uptime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <h2 className="text-2xl font-extrabold text-[#1D3557] mb-12">Tính năng nổi bật</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Zap className="h-5 w-5 text-[#F6821F]" />, title: "Tên miền tùy chỉnh", desc: "Dùng domain riêng của bạn: status.yourdomain.com. Nhận diện thương hiệu hoàn toàn." },
              { icon: <Bell className="h-5 w-5 text-[#F6821F]" />, title: "Thông báo sự cố", desc: "Khách hàng có thể đăng ký nhận email khi có sự cố. Chủ động truyền thông, giảm ticket hỗ trợ." },
              { icon: <Clock className="h-5 w-5 text-[#F6821F]" />, title: "Lịch sử 90 ngày", desc: "Biểu đồ uptime theo ngày, tuần, tháng. Hiển thị mức độ tin cậy theo thời gian thực." },
              { icon: <Shield className="h-5 w-5 text-[#F6821F]" />, title: "Bảo vệ bằng mật khẩu", desc: "Giới hạn quyền truy cập trang trạng thái cho nội bộ hoặc khách hàng cụ thể." },
              { icon: <Globe className="h-5 w-5 text-[#F6821F]" />, title: "Đa ngôn ngữ", desc: "Hỗ trợ tiếng Việt, tiếng Anh và nhiều ngôn ngữ khác cho trang trạng thái của bạn." },
              { icon: <CheckCircle2 className="h-5 w-5 text-[#F6821F]" />, title: "Nhúng widget", desc: "Nhúng badge trạng thái trực tiếp vào website hoặc footer của bạn bằng một dòng code." },
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

      <section className="py-16 text-center border-t border-gray-100">
        <h2 className="text-3xl font-extrabold text-[#1D3557] mb-4">Xây dựng niềm tin với khách hàng</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">Tạo trang trạng thái chuyên nghiệp miễn phí trong vòng 2 phút.</p>
        <Link href="/register" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#F6821F] hover:bg-[#e0721a] text-white font-bold transition-colors shadow-lg shadow-orange-100">
          Tạo miễn phí →
        </Link>
      </section>
    </div>
  );
}
