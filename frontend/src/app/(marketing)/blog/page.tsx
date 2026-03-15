import React from "react";
import Link from "next/link";
import { ArrowRight, Calendar, User, FileText } from "lucide-react";

async function getArticles() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const res = await fetch(`${API_URL}/api/public/articles`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    return [];
  }
}

export default async function BlogListPage() {
  const articles = await getArticles();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-[#1D3557] dark:text-slate-200">
      <div className="container mx-auto px-6 pt-32 pb-20 max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 border border-orange-100 px-4 py-1.5 text-sm font-semibold text-[#F6821F] mb-6">
            <FileText className="w-4 h-4" /> Kiến Thức & Blog
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#1D3557] dark:text-white mb-6">
            Góc chia sẻ từ <span className="text-[#F6821F]">UpMonitor</span>
          </h1>
          <p className="text-lg text-[#4A5568] dark:text-slate-400">
            Cập nhật những kỹ thuật mới nhất về DevOps, Giám sát hệ thống và phân tích Downtime.
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center text-slate-500 py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
            Chưa có bài viết nào được xuất bản.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article: any) => (
              <Link key={article.id} href={`/blog/${article.slug}`} className="group flex flex-col bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:border-orange-100 hover:-translate-y-1 transition-all">
                <div className="aspect-video w-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                  {article.thumbnail_url ? (
                    <img src={article.thumbnail_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <FileText className="w-12 h-12" />
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 mb-3">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(article.created_at).toLocaleDateString('vi-VN')}</span>
                    <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {article.author}</span>
                  </div>
                  <h2 className="text-xl font-bold text-[#1D3557] dark:text-white mb-3 line-clamp-2 group-hover:text-[#F6821F] transition-colors">{article.title}</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 mb-6 flex-1">{article.summary}</p>
                  <div className="mt-auto flex items-center text-[#F6821F] font-bold text-sm">
                    Đọc tiếp <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
