'use client';

import Link from 'next/link';
import Image from 'next/image';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  description?: string;
  slug: string;
  published: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    name?: string;
    email: string;
  };
  category?: {
    name: string;
    slug: string;
    color: string;
  };
  images: {
    id: string;
    url: string;
    alt?: string;
  }[];
}

interface BlogPostCardProps {
  post: BlogPost;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Extract the first image if available
  const featuredImage = post.images && post.images.length > 0 ? post.images[0] : null;

  // Create excerpt from content (remove HTML tags and limit words)
  const createExcerpt = (content: string, wordLimit: number = 30) => {
    const plainText = content.replace(/<[^>]*>/g, '');
    const words = plainText.split(' ');
    if (words.length <= wordLimit) return plainText;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  return (
    <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link href={`/blog/${post.slug}`}>
        {/* Featured Image */}
        <div className="relative h-64 overflow-hidden">
          {featuredImage ? (
            <Image
              src={featuredImage.url}
              alt={featuredImage.alt || post.title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                </svg>
              </div>
            </div>
          )}
          
          {/* Category Badge */}
          {post.category && (
            <div 
              className="absolute top-4 left-4 px-3 py-1 rounded-full text-white text-sm font-medium"
              style={{ backgroundColor: post.category.color }}
            >
              {post.category.name}
            </div>
          )}
          
          {/* Featured Badge */}
          {post.featured && (
            <div className="absolute top-4 right-4 bg-yellow-500 text-white px-2 py-1 rounded text-sm font-medium">
              Öne Çıkan
            </div>
          )}
        </div>
        
        {/* Post Content */}
        <div className="p-6">
          {/* Post Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4 line-clamp-2 hover:text-green-600 transition-colors duration-200">
            {post.title}
          </h2>
          
          {/* Post Description/Excerpt */}
          <div className="text-gray-700 mb-4 line-clamp-3">
            {post.description || createExcerpt(post.content)}
          </div>
          
          {/* Post Meta */}
          <div className="flex items-center justify-between text-sm text-gray-500">
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
          </div>
          
          {/* Read More Button */}
          <div className="mt-6">
            <span className="inline-flex items-center text-green-600 font-medium hover:text-green-700 transition-colors duration-200">
              Devamını Oku
              <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}