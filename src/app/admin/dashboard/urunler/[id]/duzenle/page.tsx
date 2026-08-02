'use client';

import { trpc } from '@/utils/trpc';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

type ProductImage = {
  filename: string;
  url: string;
  alt?: string;
  order: number;
};

export default function UrunDuzenlePage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: product, isLoading } = trpc.product.getByIdAdmin.useQuery(id as string);
  const updateMutation = trpc.product.update.useMutation();
  const confirmUpload = trpc.upload.confirmUpload.useMutation();

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '0',
    iyzicoLink: '',
  });
  const [images, setImages] = useState<ProductImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!product) return;
    setForm({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      stock: String(product.stock),
      iyzicoLink: product.iyzicoLink || '',
    });
    setImages(
      product.images.map((img: ProductImage) => ({
        filename: img.filename,
        url: img.url,
        alt: img.alt || '',
        order: img.order,
      }))
    );
  }, [product]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setIsUploading(true);

    try {
      for (const file of Array.from(e.target.files)) {
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) throw new Error('Upload failed');

        const { fileName, url } = await uploadResponse.json();

        const savedImage = await confirmUpload.mutateAsync({
          filename: fileName,
          mimeType: file.type,
          size: file.size,
        });

        setImages((prev) => [
          ...prev,
          { filename: fileName, url: savedImage.url || url, alt: '', order: prev.length },
        ]);
      }
    } catch (err) {
      console.error(err);
      alert('Resim yükleme hatası!');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      alert('En az 1 resim gerekli');
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: id as string,
        name: form.name,
        description: form.description || undefined,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        iyzicoLink: form.iyzicoLink || undefined,
        images: images.map((img, index) => ({ ...img, order: index })),
      });

      alert('Ürün güncellendi!');
      router.push('/admin/dashboard/urunler');
    } catch (err) {
      console.error(err);
      alert('Hata oluştu, lütfen tekrar deneyin');
    }
  };

  if (isLoading) return <div className="p-8 text-center">Yükleniyor...</div>;
  if (!product) return <div className="p-8 text-center">Ürün bulunamadı</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Ürünü Düzenle</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium">Ürün Adı *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-3 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Açıklama</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full p-3 border rounded min-h-[120px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-medium">Fiyat (TL) *</label>
            <input
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full p-3 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Stok Adedi *</label>
            <input
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="w-full p-3 border rounded"
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Ürün Linki (opsiyonel)</label>
          <input
            type="url"
            value={form.iyzicoLink}
            onChange={(e) => setForm({ ...form, iyzicoLink: e.target.value })}
            className="w-full p-3 border rounded"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Resimler (birden fazla seçebilirsiniz) *</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            disabled={isUploading}
            className="mb-4"
          />
          {isUploading && <p className="text-sm text-gray-500 mb-4">Yükleniyor...</p>}

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <div key={img.url + idx} className="relative border rounded overflow-hidden">
                <img src={img.url} alt="" className="w-full h-32 object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 rounded-full text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={updateMutation.isPending || isUploading}
          className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {updateMutation.isPending ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </form>
    </div>
  );
}
