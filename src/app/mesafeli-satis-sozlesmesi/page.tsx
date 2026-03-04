'use client';

import { Header } from '@/components/Header';

export default function MesafeliSatisSozlesmesiPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-green-900 mb-8 tracking-wide">Mesafeli Satış Sözleşmesi</h1>

        <div className="bg-white rounded-xl shadow p-8 border border-green-100 prose prose-green max-w-none">
          <h2 className="text-2xl font-semibold text-green-800 mt-6 mb-4">1. Taraflar</h2>
          <p className="text-gray-700">
            <strong>Satıcı:</strong> Mimoza Botanik Peyzaj ve Tarım Ürünleri Tic. Ltd. Şti.<br />
            Adres: [Örn: Mimoza Mahallesi, Botanik Sokak No:12, Kadıköy, İstanbul]<br />
            Vergi No: [Vergi numaranızı buraya yazın]<br />
            Telefon: [Örn: 0216 555 44 33]<br />
            E-posta: info@mimozabotanik.com
          </p>
          <p className="text-gray-700 mt-2">
            <strong>Alıcı:</strong> [Kullanıcı Adı Soyadı / Unvan], [Teslimat Adresi], [Telefon], [E-posta]
          </p>

          <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">2. Sözleşme Konusu ve Ürün Bilgileri</h2>
          <p className="text-gray-700">
            Ürün(ler): [Sipariş edilen ürünlerin adı, modeli, miktarı, birim fiyatı, KDV dahil toplam tutar]<br />
            Teslimat Şekli: Kargo ile [tahmini teslim süresi: 1-3 iş günü]<br />
            Ödeme Şekli: Kredi kartı / Havale / Diğer
          </p>

          <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">3. Cayma Hakkı</h2>
          <p className="text-gray-700">
            Alıcı, ürünün teslim tarihinden itibaren <strong>14 gün</strong> içinde cayma hakkına sahiptir (ayıplı mal hariç). 
            Cayma bildirimi <strong>info@mimozabotanik.com</strong> adresine yapılmalıdır. 
            Ürün orijinal ambalajında, kullanılmamış ve hasarsız olmalıdır. 
            Cayma halinde kargo ücreti alıcıya aittir.
          </p>

          <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">4. Cayma Hakkı Kullanılamayacak Ürünler</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Kişiye özel üretilen ürünler</li>
            <li>Hijyen ürünleri (kullanıldıktan sonra)</li>
            <li>Ses/kayıt/görüntü içeren ürünler (ambalaj açıldıysa)</li>
            <li>Diğer Mesafeli Sözleşmeler Yönetmeliği md. 15 kapsamındaki ürünler</li>
          </ul>

          <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">5. Genel Hükümler</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Ürün teslimi sırasında hasar varsa tutanak tutulmalı.</li>
            <li>Uyuşmazlıklarda İstanbul Tüketici Hakem Heyeti / Mahkemeleri yetkilidir.</li>
            <li>İşbu sözleşme elektronik ortamda kabul edilmiştir.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">6. Yürürlük</h2>
          <p className="text-gray-700">
            Sipariş onaylandığı anda yürürlüktedir.
          </p>

          <p className="text-gray-600 mt-10 text-sm italic">
            Tarih: [Sipariş Tarihi]<br />
            Alıcı Onayı: [Ödeme sayfasındaki checkbox ile kabul edilmiştir]
          </p>
        </div>
      </div>
    </div>
  );
}