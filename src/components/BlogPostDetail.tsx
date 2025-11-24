'use client';

import Image from 'next/image';
import Link from 'next/link';
import { api } from '../utils/providers';

interface BlogPostDetailProps {
  slug: string;
}

export function BlogPostDetail({ slug }: BlogPostDetailProps) {
  const { data: post, isLoading, error } = api.post.getBySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog yazısı bulunamadı</h1>
          <Link 
            href="/blog"
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Blog'a dön
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const featuredImage = post.images && post.images.length > 0 ? post.images[0] : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-green-600 transition-colors">
              Ana Sayfa
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/blog" className="hover:text-green-600 transition-colors">
              Blog
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium">{post.title}</li>
        </ol>
      </nav>
      
      {/* Post Header */}
      <header className="mb-8">
        {/* Category Badge */}
        {post.category && (
          <div className="mb-4">
            <span 
              className="inline-block px-3 py-1 rounded-full text-white text-sm font-medium"
              style={{ backgroundColor: post.category.color }}
            >
              {post.category.name}
            </span>
          </div>
        )}
        
        {/* Post Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>
        
        {/* Post Meta */}
        <div className="flex items-center space-x-6 text-gray-500 text-sm mb-8">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span>{post.author.name || 'Admin'}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span>{formatDate(post.createdAt)}</span>
          </div>
          
          {post.updatedAt !== post.createdAt && (
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              <span>Güncellendi: {formatDate(post.updatedAt)}</span>
            </div>
          )}
        </div>
        
        {/* Featured Image */}
        {featuredImage && (
          <div className="relative h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={featuredImage.url}
              alt={featuredImage.alt || post.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        
        {/* Post Description */}
        {post.description && (
          <div className="text-xl text-gray-600 leading-relaxed mb-8 p-4 bg-gray-50 rounded-lg border-l-4 border-green-600">
            {post.description}
          </div>
        )}
      </header>
      
      {/* Post Content */}
      <div 
        className="prose prose-lg max-w-none
          prose-headings:text-gray-900 prose-headings:font-bold
          prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
          prose-p:text-gray-700 prose-p:leading-relaxed
          prose-strong:text-gray-900 prose-strong:font-semibold
          prose-ul:text-gray-700 prose-ol:text-gray-700
          prose-li:text-gray-700 prose-li:leading-relaxed
          prose-blockquote:border-l-4 prose-blockquote:border-green-600 
          prose-blockquote:bg-green-50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg
          prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded
          prose-pre:bg-gray-900 prose-pre:text-gray-100
          prose-a:text-green-600 prose-a:no-underline hover:prose-a:text-green-700 hover:prose-a:underline
        "
        dangerouslySetInnerHTML={{ __html: post.content || '' }}
      />
      
      {/* Back to Blog Button */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <Link 
          href="/blog"
          className="inline-flex items-center text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Tüm Blog Yazıları
        </Link>
      </div>
    </div>
  );
}