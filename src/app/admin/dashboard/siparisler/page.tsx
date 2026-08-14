'use client';

// NOT: Bu sayfa şimdilik sadece görsel bir iskelet (placeholder).
// Sipariş listesi backend'e bağlanmadı — trpc.order router'ında zaten
// create/getById/updateStatus var, ileride buraya bir `getAll` prosedürü
// eklenip bu tablo gerçek verilerle beslenebilir.

export default function AdminSiparislerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Sipariş Yönetimi</h1>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Müşteri</th>
              <th className="px-6 py-3 text-left">Ürünler</th>
              <th className="px-6 py-3 text-left">Tutar</th>
              <th className="px-6 py-3 text-left">Durum</th>
              <th className="px-6 py-3 text-left">Tarih</th>
              <th className="px-6 py-3 text-center">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="text-center py-12 text-gray-500">
                Henüz sipariş bulunmuyor
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
