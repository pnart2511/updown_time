import { Zap, Shield, Globe, BarChart3, Bell, CheckCircle2, Code, Clock } from "lucide-react";
import Link from "next/link";

export default function ApiPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="border-b border-gray-100 py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 border border-orange-100 px-3 py-1 text-xs font-semibold text-[#F6821F] mb-6">
            <Code className="h-3.5 w-3.5" />
            API & Hệ Thống Lớn
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1D3557] tracking-tight mb-5 max-w-3xl leading-tight">
            Giám sát API phức tạp<br />
            <span className="text-[#F6821F]">với độ chính xác tuyệt đối.</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl leading-relaxed mb-8">
            Hệ thống microservices, API gateway, message queue hay database cluster — UpMonitor kiểm tra toàn bộ chuỗi phụ thuộc và báo cho bạn biết đúng điểm nào bị vỡ.
          </p>
          <div className="flex gap-4">
            <Link href="/register" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#F6821F] hover:bg-[#e0721a] text-white font-semibold text-sm transition-colors">
              Bắt đầu miễn phí
            </Link>
          </div>
        </div>
      </section>

      {/* Technical features */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <h2 className="text-2xl font-extrabold text-[#1D3557] mb-12">Được xây dựng cho kỹ sư hệ thống</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: <Code className="h-5 w-5 text-[#F6821F]" />,
                title: "HTTP monitors nâng cao",
                desc: "Kiểm tra header, body, response time, status code. Xác thực Bearer token, Basic Auth hay custom headers cho API bảo mật.",
              },
              {
                icon: <Zap className="h-5 w-5 text-[#F6821F]" />,
                title: "TCP & Port scanning",
                desc: "Giám sát trực tiếp database, cache (Redis), message broker (RabbitMQ/Kafka) ở cấp độ port — không cần expose HTTP endpoint.",
              },
              {
                icon: <Globe className="h-5 w-5 text-[#F6821F]" />,
                title: "Multi-region testing",
                desc: "Xác định sự cố chỉ ảnh hưởng một khu vực hay toàn cầu. Phân biệt lỗi network, DNS, hay ứng dụng nhờ dữ liệu từ 10+ điểm kiểm tra.",
              },
              {
                icon: <Shield className="h-5 w-5 text-[#F6821F]" />,
                title: "SSL Certificate monitoring",
                desc: "Theo dõi ngày hết hạn của mọi chứng chỉ SSL/TLS. Nhận cảnh báo trước 30, 14, 7 ngày — không bao giờ bị lỗi HTTPS bất ngờ.",
              },
              {
                icon: <BarChart3 className="h-5 w-5 text-[#F6821F]" />,
                title: "API dữ liệu thô",
                desc: "Kéo toàn bộ metrics qua REST API. Tích hợp vào Grafana, Datadog, hoặc dashboard nội bộ theo format bạn muốn.",
              },
              {
                icon: <Bell className="h-5 w-5 text-[#F6821F]" />,
                title: "Webhook outbound",
                desc: "Gửi sự kiện sự cố ra ngoài qua webhook — tích hợp PagerDuty, OpsGenie, Jira, hoặc hệ thống nội bộ tùy chỉnh.",
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

      {/* Supported protocols */}
      <section className="py-14 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-6 max-w-5xl">
          <h2 className="text-xl font-extrabold text-[#1D3557] mb-8 text-center">Giao thức được hỗ trợ</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {["HTTP / HTTPS", "ICMP Ping", "TCP Port", "MySQL / MariaDB", "SSL/TLS", "DNS", "SMTP", "FTP"].map((p) => (
              <div key={p} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-full text-sm font-medium text-[#1D3557] shadow-sm">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 text-center">
        <h2 className="text-3xl font-extrabold text-[#1D3557] mb-4">Kiểm soát toàn bộ hạ tầng</h2>
        <p className="text-gray-500 mb-8">Theo dõi từng endpoint, port và service trong stack của bạn.</p>
        <Link href="/register" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#F6821F] hover:bg-[#e0721a] text-white font-bold transition-colors shadow-lg shadow-orange-100">
          Bắt đầu miễn phí →
        </Link>
      </section>
    </div>
  );
}
