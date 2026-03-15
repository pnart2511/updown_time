"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export default function RegisterPage() {
  const router = useRouter();
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const passwordMatch = confirm === "" || password === confirm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordMatch) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailRef.current?.value,
          password,
          full_name: nameRef.current?.value || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Đăng ký thất bại. Vui lòng thử lại.");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 1500);
    } catch {
      setError("Không thể kết nối tới máy chủ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10">

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 mb-8">
        <div className="w-9 h-9 rounded-xl bg-[#F6821F] flex items-center justify-center">
          <span className="text-white font-black text-lg leading-none">U</span>
        </div>
        <span className="text-[#1D3557] font-bold text-xl tracking-tight">UpMonitor</span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h1 className="text-xl font-bold text-[#1D3557] mb-1">Tạo tài khoản</h1>
        <p className="text-sm text-gray-500 mb-6">Miễn phí, không cần thẻ tín dụng.</p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Success banner */}
          {success && (
            <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium px-4 py-3 rounded-lg">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Đăng ký thành công! Đang chuyển hướng...
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên</label>
            <input
              ref={nameRef}
              type="text"
              required
              placeholder="Nguyễn Văn A"
              className="w-full h-10 px-3.5 rounded-lg border border-gray-200 text-sm text-[#1D3557] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F6821F]/30 focus:border-[#F6821F] transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              ref={emailRef}
              type="email"
              required
              placeholder="ban@example.com"
              className="w-full h-10 px-3.5 rounded-lg border border-gray-200 text-sm text-[#1D3557] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F6821F]/30 focus:border-[#F6821F] transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tối thiểu 8 ký tự"
                minLength={8}
                className="w-full h-10 px-3.5 pr-10 rounded-lg border border-gray-200 text-sm text-[#1D3557] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F6821F]/30 focus:border-[#F6821F] transition-all"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" tabIndex={-1}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Xác nhận mật khẩu</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Nhập lại mật khẩu"
                className={`w-full h-10 px-3.5 pr-10 rounded-lg border text-sm text-[#1D3557] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  passwordMatch
                    ? "border-gray-200 focus:ring-[#F6821F]/30 focus:border-[#F6821F]"
                    : "border-red-300 focus:ring-red-200 focus:border-red-400"
                }`}
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" tabIndex={-1}>
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {!passwordMatch && (
              <p className="text-xs text-red-500 mt-1">Mật khẩu không khớp</p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2.5">
            <input type="checkbox" id="terms" required
              className="w-4 h-4 mt-0.5 rounded border-gray-300 accent-[#F6821F] cursor-pointer shrink-0" />
            <label htmlFor="terms" className="text-xs text-gray-500 cursor-pointer leading-relaxed">
              Tôi đồng ý với{" "}
              <Link href="#" className="text-[#F6821F] hover:underline font-medium">Điều khoản sử dụng</Link>
              {" "}và{" "}
              <Link href="#" className="text-[#F6821F] hover:underline font-medium">Chính sách bảo mật</Link>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !passwordMatch}
            className="w-full h-10 rounded-lg bg-[#F6821F] hover:bg-[#e0721a] text-white font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : "Tạo tài khoản"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400">hoặc</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <button type="button"
          className="w-full h-10 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center gap-2.5 text-sm font-medium text-gray-700 transition-colors">
          <svg viewBox="0 0 24 24" className="h-4 w-4">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Đăng ký với Google
        </button>
      </div>

      {/* Login link */}
      <p className="text-sm text-gray-500 mt-6">
        Đã có tài khoản?{" "}
        <Link href="/login" className="text-[#F6821F] font-semibold hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
