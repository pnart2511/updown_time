import React from "react";
import { notFound } from "next/navigation";
import { Calendar, User, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Metadata } from 'next';

async function getArticle(slug: string) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const res = await fetch(`${API_URL}/api/public/articles/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    return null;
  }
}

type Props = {
  params: Promise<{ slug: string }>
}

// Generate SEO metadata based on article fields
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await getArticle(resolvedParams.slug);
  if (!article) return { title: 'Bài viết không tồn tại' };

  return {
    title: article.seo_title || article.title,
    description: article.seo_description || article.summary,
    keywords: article.seo_keywords,
    openGraph: {
      title: article.seo_title || article.title,
      description: article.seo_description || article.summary,
      images: article.thumbnail_url ? [article.thumbnail_url] : [],
      type: 'article',
      publishedTime: article.created_at,
    }
  };
}

export default async function BlogPostPage({ params }: Props) {
  const resolvedParams = await params;
  const article = await getArticle(resolvedParams.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-[#1D3557] dark:text-slate-200">
      <article className="container mx-auto px-6 pt-32 pb-20 max-w-4xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#F6821F] mb-10 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Quay lại Blog
        </Link>
        
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#1D3557] dark:text-white mb-6 leading-tight">
            {article.title}
          </h1>
          
          <div className="flex items-center gap-6 text-sm font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-8">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#F6821F]" />
              {new Date(article.created_at).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#F6821F]" />
              {article.author}
            </span>
          </div>
        </header>

        {article.thumbnail_url && (
          <div className="aspect-video w-full rounded-3xl overflow-hidden mb-12 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
            <img src={article.thumbnail_url} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="prose prose-lg dark:prose-invert prose-orange max-w-none text-slate-700 dark:text-slate-300">
           {/* Fallback to simple preservation of lines if Markdown renderer is not present, though typically you'd use react-markdown here */}
           {article.content.split('\n').map((line: string, i: number) => (
             <p key={i} className="mb-4 leading-relaxed">{line}</p>
           ))}
        </div>
      </article>
    </div>
  );
}
