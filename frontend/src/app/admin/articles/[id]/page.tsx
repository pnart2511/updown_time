"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Layout, 
  Search, 
  FileText, 
  Type, 
  Link as LinkIcon, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id === "new" ? null : params.id;

  const [loading, setLoading] = useState(id ? true : false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    summary: "",
    thumbnail_url: "",
    status: "draft",
    author: "Admin",
    seo_title: "",
    seo_keywords: "",
    seo_description: "",
  });

  useEffect(() => {
    if (id) fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/admin/articles`, {
          headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      const article = data.find((a: any) => a.id.toString() === id);
      if (article) setFormData(article);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-slug if empty
    if (name === "title" && !id) {
        const slug = value.toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
        setFormData(prev => ({ ...prev, title: value, slug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const token = localStorage.getItem("token");
      const url = id ? `${API_URL}/api/admin/articles/${id}` : `${API_URL}/api/admin/articles`;
      const method = id ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setMessage({ type: "success", text: id ? "Cập nhật thành công!" : "Tạo bài viết mới thành công!" });
        if (!id) {
            setTimeout(() => router.push("/admin/articles"), 1500);
        }
      } else {
        throw new Error();
      }
    } catch (err) {
      setMessage({ type: "error", text: "Đã có lỗi xảy ra." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-slate-900">Đang tải...</div>;

  return (
    <div className="p-6 md:p-10 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-slate-900">
          <Link href="/admin/articles" className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <ArrowLeft className="h-5 w-5 text-slate-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{id ? "Chỉnh sửa bài viết" : "Viết bài SEO mới"}</h1>
            <p className="text-slate-500 text-sm">{id ? "Cập nhật nội dung cho bài viết hiện tại." : "Tạo bài viết mới chuẩn SEO cho blog."}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="hidden md:flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-5 py-2.5 rounded-xl font-bold transition-all">
            <Eye className="h-4 w-4" />
            Xem thử
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 bg-[#F6821F] hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Đang lưu..." : "Lưu bài viết"}
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium border animate-in fade-in slide-in-from-top-2 ${
          message.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-700 border-red-100"
        }`}>
          {message.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-slate-900">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                   <Type className="h-3.5 w-3.5" />
                   Tiêu đề bài viết
                </label>
                <input 
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Nhập tiêu đề thu hút người đọc..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all placeholder:font-normal"
                />
             </div>

             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                   <LinkIcon className="h-3.5 w-3.5" />
                   Đường dẫn (Slug)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-sm">/blog/</span>
                  <input 
                    required
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="tieu-de-bai-viet" 
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-mono"
                  />
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                   <FileText className="h-3.5 w-3.5" />
                   Nội dung bài viết
                </label>
                <textarea 
                  required
                  name="content"
                  rows={15}
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Bắt đầu viết nội dung tại đây..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
                />
             </div>
          </section>

          {/* SEO ADVANCED */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <Search className="h-5 w-5 text-emerald-500" />
              <h2 className="font-bold text-slate-800 text-sm">Cấu hình SEO cho bài viết</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">SEO Title</label>
                <input 
                  name="seo_title"
                  value={formData.seo_title}
                  onChange={handleChange}
                  placeholder="Tiêu đề hiển thị trên Google..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:bg-white outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Từ khóa (Keywords)</label>
                    <input 
                      name="seo_keywords"
                      value={formData.seo_keywords}
                      onChange={handleChange}
                      placeholder="tag1, tag2..." 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:bg-white outline-none"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Trạng thái</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:bg-white outline-none font-bold text-slate-700"
                    >
                      <option value="draft">Bản nháp (Draft)</option>
                      <option value="published">Công khai (Published)</option>
                    </select>
                 </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Mô tả SEO (Meta Description)</label>
                <textarea 
                  name="seo_description"
                  rows={3}
                  value={formData.seo_description}
                  onChange={handleChange}
                  placeholder="Mô tả ngắn gọn thu hút tìm kiếm..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:bg-white outline-none"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar settings */}
        <div className="space-y-6">
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
             <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase block">Ảnh đại diện bài viết</label>
                <div className="aspect-video bg-slate-100 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 overflow-hidden relative group">
                  {formData.thumbnail_url ? (
                    <img src={formData.thumbnail_url} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
                      <p className="text-[10px] font-medium">Chưa có ảnh</p>
                    </>
                  )}
                </div>
                <input 
                  name="thumbnail_url"
                  value={formData.thumbnail_url}
                  onChange={handleChange}
                  placeholder="Dán link ảnh tại đây..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs focus:bg-white outline-none transition-all"
                />
             </div>

             <div className="space-y-2 pt-4">
                <label className="text-xs font-bold text-slate-500 uppercase block text-slate-900	">Tóm tắt ngắn (Summary)</label>
                <textarea 
                  name="summary"
                  rows={4}
                  value={formData.summary}
                  onChange={handleChange}
                  placeholder="Mô tả ngắn hiển thị ở danh sách bài viết..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white outline-none transition-all text-slate-900	"
                />
             </div>

             <div className="pt-4">
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 italic text-slate-900	">
                   <p className="text-[10px] text-orange-700 leading-relaxed font-medium block text-slate-900	">
                     Mẹo: Hãy đảm bảo tiêu đề bài viết chứa từ khóa chính để đạt điểm SEO cao nhất.
                   </p>
                </div>
             </div>
          </section>
        </div>
      </form>
    </div>
  );
}
