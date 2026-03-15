"use client";

import { useState, useEffect } from "react";
import { Plus, Search, MoreVertical, Edit2, Trash2, FileText, Globe, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function AdminArticlesPage() {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/admin/articles`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setArticles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8">Đang tải...</div>;

  return (
    <div className="p-6 md:p-10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý bài viết (CMS)</h1>
          <p className="text-slate-500 mt-1 text-sm">Viết bài chuẩn SEO và quản lý nội dung blog.</p>
        </div>
        <Link href="/admin/articles/new" className="flex items-center gap-2 bg-[#F6821F] hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all active:scale-95">
          <Plus className="h-4 w-4" />
          Viết bài mới
        </Link>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-600">Bài viết</th>
                <th className="px-6 py-4 font-bold text-slate-600">Trạng thái</th>
                <th className="px-6 py-4 font-bold text-slate-600">Ngày tạo</th>
                <th className="px-6 py-4 font-bold text-slate-600">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-400">
                    <FileText className="h-10 w-10 mx-auto mb-3 opacity-20" />
                    Chưa có bài viết nào.
                  </td>
                </tr>
              ) : (
                filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden">
                          {article.thumbnail_url ? (
                            <img src={article.thumbnail_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <FileText className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 line-clamp-1">{article.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5">/{article.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        article.status === 'published' 
                          ? 'bg-emerald-50 text-emerald-600' 
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {article.status === 'published' ? 'Đã đăng' : 'Nháp'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                       {new Date(article.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Link href={`/admin/articles/${article.id}`} className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-slate-400 transition-colors">
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg text-slate-400 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
