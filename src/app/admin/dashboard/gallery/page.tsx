'use client';

import { useState, useCallback } from 'react';
import { api } from '../../../../utils/api';
import { FileUpload } from '../../../../components/admin/FileUpload';
import Image from 'next/image';
import { debounce } from 'lodash';

interface Gallery {
  id: string;
  title: string;
  description: string | null;
  order: number;
  published: boolean;
  images: {
    id: string;
    url: string;
    alt: string | null;
    order: number;
    createdAt: string;
    updatedAt: string;
    galleryId: string;
  }[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export default function AdminGalleryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: 0,
    published: true,
    images: [] as string[],
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  // tRPC Queries
  const { 
    data: galleries = [], 
    isLoading, 
    refetch 
  } = api.gallery.getAllAdmin.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const createGallery = api.gallery.create.useMutation({
    onSuccess: () => {
      refetch();
      closeModal();
    },
    onError: (error) => {
      alert(`Hata: ${error.message}`);
    }
  });

  const updateGallery = api.gallery.update.useMutation({
    onSuccess: () => {
      refetch();
      closeModal();
    },
    onError: (error) => {
      alert(`Hata: ${error.message}`);
    }
  });

  const deleteGallery = api.gallery.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      alert(`Hata: ${error.message}`);
    }
  });

  const debouncedSearch = useCallback(
    debounce((term: string) => setSearchTerm(term), 300),
    []
  );

  const filteredGalleries = galleries.filter(gallery => {
    const matchesSearch = gallery.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' ||
                         (filter === 'published' && gallery.published) ||
                         (filter === 'draft' && !gallery.published);
    return matchesSearch && matchesFilter;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const galleryData = {
      title: formData.title,
      description: formData.description,
      order: formData.order,
      published: formData.published,
      images: formData.images.map((url, index) => ({
        url,
        alt: `${formData.title} - Resim ${index + 1}`,
        order: index,
      }))
    };
    
    if (editingGallery) {
      await updateGallery.mutateAsync({
        id: editingGallery.id,
        ...galleryData,
      });
    } else {
      await createGallery.mutateAsync(galleryData);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" galerisini silmek istediğinize emin misiniz?`)) return;
    await deleteGallery.mutateAsync(id);
  };

  const openModal = (gallery?: Gallery) => {
    if (gallery) {
      setEditingGallery(gallery);
      setFormData({
        title: gallery.title,
        description: gallery.description || '',
        order: gallery.order,
        published: gallery.published,
        images: gallery.images.map(img => img.url),
      });
    } else {
      setEditingGallery(null);
      setFormData({
        title: '',
        description: '',
        order: (galleries.length > 0 ? Math.max(...galleries.map(g => g.order)) + 1 : 1),
        published: true,
        images: [],
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingGallery(null);
  };

  const handleImageUpload = (url: string) => {
    setFormData({
      ...formData,
      images: [...formData.images, url]
    });
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const togglePublished = async (gallery: Gallery) => {
    await updateGallery.mutateAsync({
      id: gallery.id,
      published: !gallery.published
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
          <h1 className="text-2xl font-bold text-gray-900">Galeri Yönetimi</h1>
          <p className="text-gray-600">Proje galerilerini yönetin ({filteredGalleries.length} galeri)</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Yeni Galeri Ekle
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Galeri ara..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div className="flex gap-2">
            {[{ key: 'all', label: 'Tümü' }, { key: 'published', label: 'Yayında' }, { key: 'draft', label: 'Taslak' }].map((filterOption) => (
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

      {/* Galleries Grid */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredGalleries.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Galeri bulunamadı</h3>
            <p className="text-gray-500">Arama kriterlerinize uygun galeri bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {filteredGalleries.map((gallery) => (
              <div
                key={gallery.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Gallery Preview */}
                <div className="relative h-48 bg-gray-100">
                  {gallery.images.length > 0 ? (
                    <div className="relative h-full">
                      <Image
                        src={gallery.images[0].url}
                        alt={gallery.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      {gallery.images.length > 1 && (
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end p-2">
                          <span className="text-white text-sm font-medium">
                            +{gallery.images.length - 1} fotoğraf
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                        </svg>
                        <p className="text-sm">Resim yok</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{gallery.title}</h3>
                    {gallery.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {gallery.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Sıra: {gallery.order}</span>
                    <span className="text-gray-500">{gallery.images.length} resim</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => togglePublished(gallery)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                        gallery.published
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {gallery.published ? 'Yayında' : 'Taslak'}
                    </button>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={() => openModal(gallery)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(gallery.id, gallery.title)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                    >
                      Sil
                    </button>
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
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingGallery ? 'Galeri Düzenle' : 'Yeni Galeri Ekle'}
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

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Galeri Başlığı *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Örn: Villa Bahçe Tasarımı"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Galeri hakkında kısa açıklama..."
                  />
                </div>

                {/* Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Galeri Resimleri
                  </label>
                  
                  {/* Current Images */}
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {formData.images.map((url, index) => (
                        <div key={index} className="relative group">
                          <div className="relative h-20 rounded-lg overflow-hidden border border-gray-200">
                            <Image
                              src={url}
                              alt={`Resim ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="150px"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <FileUpload
                    onUpload={handleImageUpload}
                    multiple={true}
                  />
                </div>

                {/* Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sıralama
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                {/* Published */}
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

                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={createGallery.isPending || updateGallery.isPending}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={createGallery.isPending || updateGallery.isPending || formData.images.length === 0}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    {(createGallery.isPending || updateGallery.isPending) ? (
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