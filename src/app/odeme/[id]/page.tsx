'use client';
import { useParams, useRouter } from 'next/navigation';
import { trpc } from '@/utils/trpc';
import { useState } from 'react';

export default function OdemePage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: order, isLoading } = trpc.order.getById.useQuery(id);
  const updateStatus = trpc.order.updateStatus.useMutation();

  const [formData, setFormData] = useState({
    customerName: '',
    customerSurname: '',
    address: '',
    phone: '',
    note: '',
  });

  if (isLoading) return <div>Yükleniyor...</div>;
  if (!order) return <div>Sipariş bulunamadı.</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerName || !formData.address || !formData.phone) {
      return alert('Lütfen tüm zorunlu alanları doldurun.');
    }

    // Kullanıcı bilgilerini order'a kaydet
    await updateStatus.mutateAsync({ id: order.id, status: 'Bekliyor' });

    // Ödeme linkine yönlendir (tek ürün mantığı)
    const iyzicoLink = order.items[0].product.iyzicoLink;
    if (!iyzicoLink) return alert('Ödeme linki mevcut değil!');
    window.location.href = iyzicoLink;
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ödeme Bilgileri</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="İsim *"
          value={formData.customerName}
          onChange={e => setFormData({ ...formData, customerName: e.target.value })}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Soyisim"
          value={formData.customerSurname}
          onChange={e => setFormData({ ...formData, customerSurname: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="tel"
          placeholder="Telefon *"
          value={formData.phone}
          onChange={e => setFormData({ ...formData, phone: e.target.value })}
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Adres *"
          value={formData.address}
          onChange={e => setFormData({ ...formData, address: e.target.value })}
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Sipariş notu"
          value={formData.note}
          onChange={e => setFormData({ ...formData, note: e.target.value })}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
        >
          Ödemeye Devam Et
        </button>
      </form>
    </div>
  );
}