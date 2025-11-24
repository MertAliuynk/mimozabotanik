'use client';

import { useState, useCallback } from 'react';
import { api } from '../../../../utils/api';
import { FileUpload } from '../../../../components/admin/FileUpload';
import Image from 'next/image';
import { debounce } from 'lodash';

interface Reference {
  id: string;
  companyName: string;
  logo: string | null;
  description: string | null;
  website: string | null;
  order: number;
  published: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export default function AdminReferencesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReference, setEditingReference] = useState<Reference | null>(null);
  const [formData, setFormData] = useState({
    companyName: '',
    logo: '',
    description: '',
    website: '',
    order: 0,
    published: true,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  // tRPC Queries
  const { 
    data: references = [], 
    isLoading, 
    refetch 
  } = api.reference.getAllAdmin.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const createReference = api.reference.create.useMutation({
    onSuccess: () => {
      refetch();
      closeModal();
    },
    onError: (error) => {
      alert(`Hata: ${error.message}`);
    }
  });

  const updateReference = api.reference.update.useMutation({
    onSuccess: () => {
      refetch();
      closeModal();
    },
    onError: (error) => {
      alert(`Hata: ${error.message}`);
    }
  });

  const deleteReference = api.reference.delete.useMutation({
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

  const filteredReferences = references.filter(reference => {
    const matchesSearch = reference.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' ||
                         (filter === 'published' && reference.published) ||
                         (filter === 'draft' && !reference.published);
    return matchesSearch && matchesFilter;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingReference) {
      await updateReference.mutateAsync({
        id: editingReference.id,
        ...formData,
      });
    } else {
      await createReference.mutateAsync(formData);
    }
  };

  const handleDelete = async (id: string, companyName: string) => {
    if (!confirm(`"${companyName}" referansını silmek istediğinize emin misiniz?`)) return;
    await deleteReference.mutateAsync(id);
  };

  const openModal = (reference?: Reference) => {
    if (reference) {
      setEditingReference(reference);
      setFormData({
        companyName: reference.companyName,
        logo: reference.logo || '',
        description: reference.description || '',
        website: reference.website || '',
        order: reference.order,
        published: reference.published,
      });
    } else {
      setEditingReference(null);
      setFormData({
        companyName: '',
        logo: '',
        description: '',
        website: '',
        order: (references.length > 0 ? Math.max(...references.map(r => r.order)) + 1 : 1),
        published: true,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingReference(null);
  };

  const togglePublished = async (reference: Reference) => {
    await updateReference.mutateAsync({
      id: reference.id,
      published: !reference.published
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
          <h1 className="text-2xl font-bold text-gray-900">Referans Yönetimi</h1>
          <p className="text-gray-600">Müşteri referanslarını yönetin ({filteredReferences.length} referans)</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Yeni Referans Ekle
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Şirket adı ara..."
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

      {/* References Grid */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredReferences.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-7.5c0-1.1.9-2 2-2s2 .9 2 2V18h2v-4h3v4h2V9H4v9z"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Referans bulunamadı</h3>
            <p className="text-gray-500">Arama kriterlerinize uygun referans bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
            {filteredReferences.map((reference) => (
              <div
                key={reference.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Logo */}
                <div className="aspect-square bg-gray-50 flex items-center justify-center p-6">
                  {reference.logo ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={reference.logo}
                        alt={reference.companyName}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-center text-sm">
                      {reference.companyName}
                    </h3>
                    {reference.description && (
                      <p className="text-xs text-gray-600 mt-1 text-center line-clamp-2">
                        {reference.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Sıra: {reference.order}</span>
                    <button
                      onClick={() => togglePublished(reference)}
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                        reference.published
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {reference.published ? 'Yayında' : 'Taslak'}
                    </button>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={() => openModal(reference)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(reference.id, reference.companyName)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"
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
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingReference ? 'Referans Düzenle' : 'Yeni Referans Ekle'}
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
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Şirket Adı *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Örn: ANFA Genel Müdürlüğü"
                  />
                </div>

                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Şirket Logosu
                  </label>
                  <FileUpload
                    onUpload={(url) => setFormData({ ...formData, logo: url })}
                    currentImage={formData.logo}
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
                    placeholder="Şirket hakkında kısa açıklama..."
                  />
                </div>

                {/* Website and Order */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="https://..."
                    />
                  </div>
                  
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
                    disabled={createReference.isPending || updateReference.isPending}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={createReference.isPending || updateReference.isPending}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    {(createReference.isPending || updateReference.isPending) ? (
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