'use client';

import { trpc } from '@/utils/trpc';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function YeniUrunPage() {
  const createMutation = trpc.product.create.useMutation();
  const getUploadUrl = trpc.upload.getUploadUrl.useMutation();
  const confirmUpload = trpc.upload.confirmUpload.useMutation();

  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '0',
  });

  const [images, setImages] = useState<
    { file: File; preview: string; alt: string; order: number }[]
  >([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newImages = Array.from(e.target.files).map((file, index) => ({
      file,
      preview: URL.createObjectURL(file),
      alt: '',
      order: images.length + index,
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      alert('En az 1 resim yüklemelisiniz');
      return;
    }

    try {
      const uploadedImages = [];

      for (const img of images) {
        const { uploadUrl, fileUrl, filename } = await getUploadUrl.mutateAsync({
          filename: img.file.name,
          mimeType: img.file.type,
          size: img.file.size,
        });

        await fetch(uploadUrl, {
          method: 'PUT',
          body: img.file,
          headers: { 'Content-Type': img.file.type },
        });

        const savedImage = await confirmUpload.mutateAsync({
          filename,
          mimeType: img.file.type,
          size: img.file.size,
          alt: img.alt,
        });

        uploadedImages.push({
          filename: savedImage.filename,
          url: savedImage.url,
          alt: savedImage.alt || '',
          order: img.order,
        });
      }

      await createMutation.mutateAsync({
        name: form.name,
        description: form.description || undefined,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        images: uploadedImages,
      });

      alert('Ürün başarıyla eklendi!');
      router.push('/admin/dashboard/urunler');
    } catch (err) {
      console.error(err);
      alert('Hata oluştu, lütfen tekrar deneyin');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Yeni Ürün Ekle</h1>

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
          <label className="block mb-2 font-medium">Resimler (birden fazla seçebilirsiniz) *</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="mb-4"
          />

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative border rounded overflow-hidden">
                <img src={img.preview} alt="" className="w-full h-32 object-cover" />
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
          disabled={createMutation.isPending}  // ← isLoading yerine isPending
          className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {createMutation.isPending ? 'Kaydediliyor...' : 'Ürünü Kaydet'}  // ← burası da değişti
        </button>
      </form>
    </div>
  );
}