'use client';

import { trpc } from '@/utils/trpc';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AdminUrunlerPage() {
  const { data: products, isLoading, refetch } = trpc.product.getAllAdmin.useQuery();
  const deleteMutation = trpc.product.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
    await deleteMutation.mutateAsync(id);
  };

  if (isLoading) return <div className="p-8 text-center">Yükleniyor...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Ürün Yönetimi</h1>
        <Link
          href="/admin/dashboard/urunler/yeni"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          Yeni Ürün Ekle
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Resim</th>
              <th className="px-6 py-3 text-left">İsim</th>
              <th className="px-6 py-3 text-left">Fiyat</th>
              <th className="px-6 py-3 text-left">Stok</th>
              <th className="px-6 py-3 text-left">Slug</th>
              <th className="px-6 py-3 text-center">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product: {
              id: string;
              name: string;
              price: number;
              stock: number;
              slug: string;
              images: { url: string }[];
            }) => (
              <tr key={product.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">
                  {product.images[0] && (
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      width={60}
                      height={60}
                      className="object-cover rounded"
                    />
                  )}
                </td>
                <td className="px-6 py-4 font-medium">{product.name}</td>
                <td className="px-6 py-4">{product.price.toFixed(2)} TL</td>
                <td className="px-6 py-4">{product.stock}</td>
                <td className="px-6 py-4 text-gray-600">{product.slug}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => router.push(`/admin/urunler/duzenle/${product.id}`)}
                      className="text-blue-600 hover:underline"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:underline"
                    >
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!products?.length && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-500">
                  Henüz ürün eklenmemiş
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}