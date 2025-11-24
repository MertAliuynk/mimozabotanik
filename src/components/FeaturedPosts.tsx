'use client';

import { api } from '../utils/providers';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Heart } from 'lucide-react';
import { formatDate } from '../utils/helpers';
import { Button } from './ui/Button';

export function FeaturedPosts() {
  const { data: posts, isLoading } = api.post.getFeatured.useQuery({ limit: 6 });

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Öne Çıkan Yazılar
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              En popüler ve güncel botanik yazılarımızı keşfedin
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-video rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Öne Çıkan Yazılar
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            En popüler ve güncel botanik yazılarımızı keşfedin
          </p>
        </div>
        
        {posts && posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {posts.map((post) => (
                <article key={post.id} className="group cursor-pointer">
                  <Link href={`/blog/${post.slug}`}>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                      {post.images?.[0] ? (
                        <div className="aspect-video bg-linear-to-br from-green-100 to-emerald-100 relative overflow-hidden">
                          <img 
                            src={post.images[0].url} 
                            alt={post.images[0].alt || post.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
                        </div>
                      ) : (
                        <div className="aspect-video bg-linear-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                          <Heart className="w-12 h-12 text-green-600" />
                        </div>
                      )}
                      
                      <div className="p-6">
                        {post.category && (
                          <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full mb-3">
                            {post.category.name}
                          </span>
                        )}
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors">
                          {post.title}
                        </h3>
                        
                        {post.description && (
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {post.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>{post.author.name}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(post.createdAt)}</span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-green-600 transform transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
            
            <div className="text-center">
              <Link href="/blog">
                <Button size="lg" variant="secondary" className="px-8">
                  Tüm Yazıları Görüntüle
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Henüz öne çıkan yazı bulunmuyor.</p>
          </div>
        )}
      </div>
    </section>
  );
}