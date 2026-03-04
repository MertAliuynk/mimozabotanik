'use client';

import { trpc } from '@/utils/trpc';
import { formatDate } from '@/utils/helpers';

export default function AdminSiparislerPage() {
  const { data: orders, isLoading, refetch } = trpc.order.getAllAdmin.useQuery();
  const updateStatus = trpc.order.updateStatus.useMutation({
    onSuccess: () => refetch(),
  });

  const handleStatusChange = async (id: string, newStatus: string) => {
    if (confirm(`Status'ü "${newStatus}" olarak değiştirmek istiyor musunuz?`)) {
      await updateStatus.mutateAsync({ id, status: newStatus as any });
    }
  };

  if (isLoading) {
    return <div className="container mx-auto py-12 text-center">Yükleniyor...</div>;
  }

  if (!orders?.length) {
    return (
      <div className="container mx-auto py-12 text-center text-gray-500">
        Henüz sipariş yok.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sipariş Yönetimi ({orders.length} adet)</h1>

      <div className="space-y-6">
        {orders.map((order: {
          id: string;
          customerName: string;
          customerSurname?: string;
          address: string;
          note?: string;
          status: string;
          totalPrice: number;
          createdAt: Date | string;
          items: {
            id: string;
            name: string;
            price: number;
            quantity: number;
          }[];
        }) => (
          <div
            key={order.id}
            className="bg-white border rounded-lg shadow-sm overflow-hidden"
          >
            {/* Üst Bilgi */}
            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b">
              <div>
                <h3 className="font-semibold text-lg">
                  Sipariş #{order.id.slice(0, 8)}...
                </h3>
                <p className="text-sm text-gray-600">
                  {formatDate(order.createdAt)} • {order.status}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Bekliyor">Bekliyor</option>
                  <option value="Gönderildi">Gönderildi</option>
                  <option value="Iptal">İptal Edildi</option>
                </select>
              </div>
            </div>

            {/* İçerik */}
            <div className="p-6">
              {/* Müşteri Bilgileri */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-800 mb-2">Müşteri Bilgileri</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">İsim Soyisim:</span>{' '}
                    {order.customerName} {order.customerSurname || ''}
                  </div>
                  <div>
                    <span className="font-medium">Adres:</span>{' '}
                    {order.address}
                  </div>
                  {order.note && (
                    <div className="col-span-2">
                      <span className="font-medium">Not:</span>{' '}
                      <span className="text-gray-700">{order.note}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Ürünler */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-800 mb-2">Ürünler</h4>
                <div className="space-y-3">
                  {order.items.map((item: {
                    id: string;
                    name: string;
                    price: number;
                    quantity: number;
                  }) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center border-b pb-3 last:border-b-0"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Adet: {item.quantity} × {item.price.toFixed(2)} TL
                        </p>
                      </div>
                      <div className="font-medium">
                        {(item.price * item.quantity).toFixed(2)} TL
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toplam */}
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-lg font-bold">Toplam Tutar</span>
                <span className="text-xl font-bold text-green-700">
                  {order.totalPrice.toFixed(2)} TL
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}