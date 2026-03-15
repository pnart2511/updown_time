import { Bell, Zap, Mail, MessageSquare, Webhook, Clock, Shield, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function CanhBaoPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="border-b border-gray-100 py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 border border-orange-100 px-3 py-1 text-xs font-semibold text-[#F6821F] mb-6">
            <Bell className="h-3.5 w-3.5" />
            Cảnh Báo
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1D3557] tracking-tight mb-5 max-w-3xl leading-tight">
            Nhận cảnh báo đúng nơi,<br />
            <span className="text-[#F6821F]">đúng thời điểm.</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl leading-relaxed mb-8">
            Gửi thông báo qua Slack, Discord, Telegram, Email hay Webhook tùy chỉnh ngay khi phát hiện sự cố — và cả khi hệ thống phục hồi.
          </p>
          <Link href="/register" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#F6821F] hover:bg-[#e0721a] text-white font-semibold text-sm transition-colors">
            Thiết lập cảnh báo miễn phí
          </Link>
        </div>
      </section>

      {/* Alert channels */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <h2 className="text-2xl font-extrabold text-[#1D3557] mb-4">Kênh thông báo được hỗ trợ</h2>
          <p className="text-gray-500 mb-12">Kết nối với công cụ nhóm bạn đang dùng hàng ngày.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "💬", name: "Slack", desc: "Gửi cảnh báo vào channel Slack, tag trực tiếp người phụ trách." },
              { icon: "🎮", name: "Discord", desc: "Thông báo tới Discord server qua webhook, hỗ trợ embed đẹp." },
              { icon: "✈️", name: "Telegram", desc: "Nhắn tin trực tiếp qua Telegram Bot tới cá nhân hoặc group." },
              { icon: <Mail className="h-6 w-6 text-[#F6821F]" />, name: "Email", desc: "Gửi email HTML đẹp kèm thông tin chi tiết sự cố và thời gian phục hồi." },
              { icon: <Webhook className="h-6 w-6 text-[#F6821F]" />, name: "Webhook", desc: "HTTP POST tùy chỉnh tới bất kỳ hệ thống nào — PagerDuty, OpsGenie, v.v." },
              { icon: <MessageSquare className="h-6 w-6 text-[#F6821F]" />, name: "SMS", desc: "Nhận SMS ngay lập tức cho các sự cố nghiêm trọng cần phản ứng nhanh." },
            ].map((c) => (
              <div key={c.name} className="group p-6 rounded-2xl border border-gray-100 hover:border-orange-100 hover:bg-orange-50/30 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  {typeof c.icon === "string" ? c.icon : c.icon}
                </div>
                <h3 className="font-bold text-[#1D3557] mb-2">{c.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Smart alerting features */}
      <section className="py-16 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-6 max-w-5xl">
          <h2 className="text-2xl font-extrabold text-[#1D3557] mb-12">Cảnh báo thông minh</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />, title: "Xác minh chéo — không false alarm", desc: "Chỉ gửi cảnh báo khi nhiều vị trí toàn cầu đồng thời xác nhận sự cố. Không bao giờ báo động lúc 3 giờ sáng vì lý do vớ vẩn." },
              { icon: <Bell className="h-5 w-5 text-[#F6821F]" />, title: "Escalation tự động", desc: "Nếu không ai phản hồi sau X phút, hệ thống tự leo thang lên cấp cao hơn hoặc kênh khẩn cấp." },
              { icon: <Clock className="h-5 w-5 text-blue-500" />, title: "Lịch trực (On-call schedules)", desc: "Định nghĩa ai trực ca nào, hệ thống tự biết gửi cảnh báo đúng người đang trong ca trực." },
              { icon: <Shield className="h-5 w-5 text-purple-500" />, title: "Maintenance windows", desc: "Tắt cảnh báo tự động trong thời gian bảo trì định kỳ — không bị làm phiền khi deploy." },
            ].map((f) => (
              <div key={f.title} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center shrink-0">{f.icon}</div>
                <div>
                  <h3 className="font-bold text-[#1D3557] mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 text-center">
        <h2 className="text-3xl font-extrabold text-[#1D3557] mb-4">Không bao giờ bỏ lỡ sự cố</h2>
        <p className="text-gray-500 mb-8">Kết nối cảnh báo tới Slack, Discord, Telegram ngay hôm nay.</p>
        <Link href="/register" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#F6821F] hover:bg-[#e0721a] text-white font-bold transition-colors shadow-lg shadow-orange-100">
          Bắt đầu miễn phí →
        </Link>
      </section>
    </div>
  );
}
