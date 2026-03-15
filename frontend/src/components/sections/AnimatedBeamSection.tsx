"use client";

import { forwardRef, useRef } from "react";
import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { CheckCircle2 } from "lucide-react";

/* ── Icon circle node ───────────────────────────────────────────── */
const Node = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode; label?: string }
>(({ className, children, label }, ref) => (
  <div className="flex flex-col items-center gap-2">
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-2xl border border-gray-100 bg-white shadow-md shadow-gray-100 text-xl",
        className
      )}
    >
      {children}
    </div>
    {label && (
      <span className="text-[11px] font-semibold text-[#4A5568] whitespace-nowrap">{label}</span>
    )}
  </div>
));
Node.displayName = "Node";

/* ── Center brand node ──────────────────────────────────────────── */
const CenterNode = forwardRef<HTMLDivElement, { className?: string }>(
  ({ className }, ref) => (
    <div className="flex flex-col items-center gap-2">
      <div
        ref={ref}
        className={cn(
          "z-10 flex size-16 items-center justify-center rounded-2xl bg-[#F6821F] shadow-xl shadow-orange-200 text-white font-black text-xl border-4 border-orange-300",
          className
        )}
      >
        U
      </div>
      <span className="text-xs font-bold text-[#1D3557]">UpMonitor</span>
    </div>
  )
);
CenterNode.displayName = "CenterNode";

/* ── Main section ────────────────────────────────────────────────── */
export function AnimatedBeamSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);

  const httpRef = useRef<HTMLDivElement>(null);
  const mysqlRef = useRef<HTMLDivElement>(null);
  const icmpRef = useRef<HTMLDivElement>(null);
  const tcpRef = useRef<HTMLDivElement>(null);

  const slackRef = useRef<HTMLDivElement>(null);
  const discordRef = useRef<HTMLDivElement>(null);
  const telegramRef = useRef<HTMLDivElement>(null);
  const webhookRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-28 bg-gray-50 border-y border-gray-100">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Two-column: text LEFT, diagram RIGHT */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left — Text content ─────────────────────────────── */}
          <div>
            <p className="text-sm font-bold text-[#F6821F] uppercase tracking-widest mb-4">Kết Nối Toàn Diện</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1D3557] tracking-tight mb-6 leading-tight">
              Giám sát mọi dịch vụ,<br />
              <span className="text-[#F6821F]">cảnh báo mọi kênh</span>
            </h2>
            <p className="text-[#4A5568] text-lg leading-relaxed mb-10">
              UpMonitor nằm trung tâm kết nối hạ tầng của bạn — tự động phát hiện sự cố từ bất kỳ dịch vụ nào và gửi cảnh báo tức thì đến đúng nơi bạn cần.
            </p>
            <div className="space-y-4">
              {[
                "Theo dõi HTTP, ICMP Ping, TCP Port, MySQL",
                "Gửi cảnh báo qua Slack, Discord, Telegram",
                "Webhook tùy chỉnh cho mọi hệ thống bên ngoài",
                "Cảnh báo chỉ sau 60 giây phát hiện sự cố",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-[#4A5568] font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right — Beam diagram ─────────────────────────────── */}
          <div
            ref={containerRef}
            className="relative flex items-center justify-between overflow-hidden rounded-3xl border border-gray-100 bg-white p-10 shadow-sm min-h-[380px]"
          >
            {/* Left nodes */}
            <div className="flex flex-col justify-center gap-7">
              <Node ref={httpRef} label="HTTP">🌐</Node>
              <Node ref={mysqlRef} label="MySQL">🗄️</Node>
              <Node ref={icmpRef} label="ICMP Ping">📡</Node>
              <Node ref={tcpRef} label="TCP Port">🔌</Node>
            </div>

            {/* Center */}
            <CenterNode ref={centerRef} />

            {/* Right nodes */}
            <div className="flex flex-col justify-center gap-7">
              <Node ref={slackRef} label="Slack">
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                  <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.122 2.521a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.268 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zm-2.523 10.122a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#E01E5A"/>
                </svg>
              </Node>
              <Node ref={discordRef} label="Discord">
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#5865F2">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.099 18.084.108 18.11.128 18.128a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                </svg>
              </Node>
              <Node ref={telegramRef} label="Telegram">
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#26A5E4">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </Node>
              <Node ref={webhookRef} label="Webhook">🔗</Node>
            </div>

            {/* Beams: services → center */}
            <AnimatedBeam containerRef={containerRef} fromRef={httpRef} toRef={centerRef} duration={3} gradientStartColor="#F6821F" gradientStopColor="#FF9E4A" />
            <AnimatedBeam containerRef={containerRef} fromRef={mysqlRef} toRef={centerRef} duration={3} delay={0.5} gradientStartColor="#F6821F" gradientStopColor="#FF9E4A" />
            <AnimatedBeam containerRef={containerRef} fromRef={icmpRef} toRef={centerRef} duration={3} delay={1} gradientStartColor="#F6821F" gradientStopColor="#FF9E4A" />
            <AnimatedBeam containerRef={containerRef} fromRef={tcpRef} toRef={centerRef} duration={3} delay={1.5} gradientStartColor="#F6821F" gradientStopColor="#FF9E4A" />

            {/* Beams: center → channels */}
            <AnimatedBeam containerRef={containerRef} fromRef={centerRef} toRef={slackRef} duration={3} gradientStartColor="#1D3557" gradientStopColor="#03b3c3" />
            <AnimatedBeam containerRef={containerRef} fromRef={centerRef} toRef={discordRef} duration={3} delay={0.5} gradientStartColor="#1D3557" gradientStopColor="#5865F2" />
            <AnimatedBeam containerRef={containerRef} fromRef={centerRef} toRef={telegramRef} duration={3} delay={1} gradientStartColor="#1D3557" gradientStopColor="#26A5E4" />
            <AnimatedBeam containerRef={containerRef} fromRef={centerRef} toRef={webhookRef} duration={3} delay={1.5} gradientStartColor="#1D3557" gradientStopColor="#03b3c3" />
          </div>
        </div>
      </div>
    </section>
  );
}
