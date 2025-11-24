'use client';

import { useState } from 'react';
import { api } from '../utils/providers';
import { BlogPostCard } from './BlogPostCard';

export function DynamicBlogGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { data: posts, isLoading: postsLoading, error: postsError } = api.post.getAll.useQuery({
    published: true,
    categoryId: selectedCategory || undefined,
  });
  
  const { data: categories, isLoading: categoriesLoading } = api.category.getAll.useQuery();

  if (postsLoading || categoriesLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-96 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (postsError) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">
            Blog yazıları yüklenirken hata oluştu: {postsError.message}
          </div>
        </div>
      </section>
    );
  }

  if (!posts?.posts || posts.posts.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600">
            {selectedCategory ? 'Bu kategoride blog yazısı bulunamadı.' : 'Henüz blog yazısı eklenmemiş.'}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Filter */}
        {categories && categories.length > 0 && (
          <div className="mb-12">
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-6 py-2 rounded-full transition-colors duration-200 ${
                  selectedCategory === null
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Tümü
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-2 rounded-full transition-colors duration-200 ${
                    selectedCategory === category.id
                      ? 'text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  style={{
                    backgroundColor: selectedCategory === category.id ? category.color : undefined
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.posts.map((post) => (
            <BlogPostCard 
              key={post.id} 
              post={{
                ...post,
                description: post.description,
                content: post.content,
                images: post.images.map(img => ({
                  id: img.id,
                  url: img.url,
                  alt: img.alt || undefined
                })),
                author: {
                  id: post.author.id,
                  name: post.author.name,
                  email: undefined,
                  avatar: post.author.avatar
                },
                category: post.category ? {
                  id: post.category.id,
                  name: post.category.name,
                  slug: post.category.slug,
                  color: post.category.color
                } : null
              }}
            />
          ))}
        </div>
        
        {/* Green divider line at bottom */}
        <div className="mt-16">
          <div className="w-full h-1 bg-green-600"></div>
        </div>
      </div>
    </section>
  );
}