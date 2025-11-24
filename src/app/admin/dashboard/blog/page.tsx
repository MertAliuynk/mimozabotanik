'use client';

import { useState, useCallback } from 'react';
import { api } from '../../../../utils/api';
import { FileUpload } from '../../../../components/admin/FileUpload';
import Image from 'next/image';
import { debounce } from 'lodash';

interface Post {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  published: boolean;
  featured: boolean;
  slug: string;
  authorId: string;
  categoryId: string | null;
  category?: { id: string; name: string; } | null;
  author: { id: string; name?: string | null; email?: string; avatar?: string | null; };
  images?: { id: string; url: string; alt?: string; }[];
  tags?: { id: string; name: string; }[];
  _count?: { images: number; };
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface Category {
  id: string;
  name: string;
}

export default function AdminBlogPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    slug: '',
    published: false,
    featured: false,
    categoryId: '',
    image: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'featured'>('all');

  // tRPC Queries
  const { 
    data: postsData, 
    isLoading, 
    refetch 
  } = api.post.getAllAdmin.useQuery({ 
    page: 1, 
    limit: 100,
    search: searchTerm
  }, {
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const posts = postsData?.posts || [];
  const { data: categories = [] } = api.category.getAll.useQuery();

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      void refetch();
      closeModal();
    },
    onError: (error: any) => {
      alert(`Hata: ${error.message}`);
    }
  });

  const updatePost = api.post.update.useMutation({
    onSuccess: () => {
      void refetch();
      closeModal();
    },
    onError: (error: any) => {
      alert(`Hata: ${error.message}`);
    }
  });

  const deletePost = api.post.delete.useMutation({
    onSuccess: () => {
      void refetch();
    },
    onError: (error: any) => {
      alert(`Hata: ${error.message}`);
    }
  });

  const debouncedSearch = useCallback(
    debounce((term: string) => setSearchTerm(term), 300),
    []
  );

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (post.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesFilter = filter === 'all' ||
                         (filter === 'published' && post.published) ||
                         (filter === 'draft' && !post.published) ||
                         (filter === 'featured' && post.featured);
    return matchesSearch && matchesFilter;
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const postData = {
      title: formData.title,
      description: formData.description,
      content: formData.content,
      slug: formData.slug || generateSlug(formData.title),
      published: formData.published,
      featured: formData.featured,
      categoryId: formData.categoryId || undefined,
    };
    
    if (editingPost) {
      await updatePost.mutateAsync({
        id: editingPost.id,
        ...postData,
      });
    } else {
      await createPost.mutateAsync(postData);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" blog yazısını silmek istediğinize emin misiniz?`)) return;
    await deletePost.mutateAsync({ id });
  };

  const openModal = (post?: Post) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        description: post.description || '',
        content: post.content || '',
        slug: post.slug,
        published: post.published,
        featured: post.featured,
        categoryId: post.categoryId || '',
        image: (post as any).images?.[0]?.url || '',
      });
    } else {
      setEditingPost(null);
      setFormData({
        title: '',
        description: '',
        content: '',
        slug: '',
        published: false,
        featured: false,
        categoryId: '',
        image: '',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
  };

  const togglePublished = async (post: Post) => {
    await updatePost.mutateAsync({
      id: post.id,
      published: !post.published
    });
  };

  const toggleFeatured = async (post: Post) => {
    await updatePost.mutateAsync({
      id: post.id,
      featured: !post.featured
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Yönetimi</h1>
          <p className="text-gray-600">Blog yazılarını yönetin ({filteredPosts.length} yazı)</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Yeni Yazı Ekle
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Blog yazısı ara..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'Tümü' },
              { key: 'published', label: 'Yayında' },
              { key: 'draft', label: 'Taslak' },
              { key: 'featured', label: 'Öne Çıkan' }
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key as any)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === filterOption.key
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Blog yazısı bulunamadı</h3>
            <p className="text-gray-500">Arama kriterlerinize uygun yazı bulunmuyor.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredPosts.map((post) => (
              <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Featured Image */}
                  <div className="shrink-0">
                    {(post as any).images?.[0] ? (
                      <div className="relative w-20 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={(post as any).images?.[0]?.url || ''}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {post.title}
                          {post.featured && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Öne Çıkan
                            </span>
                          )}
                        </h3>
                        {post.description && (
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                            {post.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Slug: /{post.slug}</span>
                          {post.category && (
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {post.category.name}
                            </span>
                          )}
                          <span>{new Date(post.createdAt).toLocaleDateString('tr-TR')}</span>
                        </div>
                      </div>
                      
                      {/* Status and Actions */}
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => togglePublished(post)}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                              post.published
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            {post.published ? 'Yayında' : 'Taslak'}
                          </button>
                          
                          <button
                            onClick={() => toggleFeatured(post)}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                              post.featured
                                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            ★ Öne Çıkar
                          </button>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => openModal(post)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"
                          >
                            Düzenle
                          </button>
                          <button
                            onClick={() => handleDelete(post.id, post.title)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingPost ? 'Blog Yazısı Düzenle' : 'Yeni Blog Yazısı'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Başlık *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => {
                          const title = e.target.value;
                          setFormData({ 
                            ...formData, 
                            title,
                            slug: formData.slug || generateSlug(title)
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Blog yazısı başlığı..."
                      />
                    </div>

                    {/* Slug */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL Slug
                      </label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="url-slug"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kategori
                      </label>
                      <select
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="">Kategori seçin</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Featured Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Öne Çıkan Görsel
                      </label>
                      <FileUpload
                        onUpload={(url) => setFormData({ ...formData, image: url })}
                        currentImage={formData.image}
                      />
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="published"
                          checked={formData.published}
                          onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                          Hemen yayınla
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={formData.featured}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                          className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                        />
                        <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                          Öne çıkar
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kısa Açıklama
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="SEO için kısa açıklama..."
                      />
                    </div>

                    {/* Content */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        İçerik *
                      </label>
                      <textarea
                        required
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        rows={15}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Blog yazısı içeriği... (Markdown desteklenir)"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={createPost.isPending || updatePost.isPending}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 text-gray-700 py-3 px-4 rounded-lg transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={createPost.isPending || updatePost.isPending}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    {(createPost.isPending || updatePost.isPending) ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Kaydediliyor...
                      </>
                    ) : (
                      'Kaydet'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}