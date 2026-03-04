'use client';

import { useCartStore } from '@/stores/cartStore';
import { trpc } from '@/utils/trpc';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import Link from 'next/link';
import Image from 'next/image';

// Test modu kontrolü (gerçek iyzico entegrasyonu gelene kadar true bırak)
const IS_TEST_MODE = true; // .env'den çekmek istersen: process.env.NEXT_PUBLIC_TEST_MODE === 'true'

export default function OdemePage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const router = useRouter();
  const createOrder = trpc.order.create.useMutation({
    onSuccess: () => {
      alert(
        IS_TEST_MODE
          ? 'Sipariş başarıyla kaydedildi! (Test modu: Gerçek ödeme alınmadı)'
          : 'Sipariş alındı! Teşekkürler.'
      );
      clearCart();
      router.push('/'); // veya /tesekkurler sayfasına yönlendir
    },
    onError: (err) => {
      alert(err.message || 'Sipariş kaydedilirken bir hata oluştu.');
    },
  });

  const [formData, setFormData] = useState({
    customerName: '',
    customerSurname: '',
    address: '',
    note: '',
    phone: '',
  });

  const [agreements, setAgreements] = useState({
    mesafeliSatis: false,
    gizlilik: false,
    iletisim: false, // opsiyonel ticari ileti
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) return;

    if (!agreements.mesafeliSatis || !agreements.gizlilik) {
      alert('Mesafeli Satış Sözleşmesi ve Gizlilik Politikasını kabul etmelisiniz.');
      return;
    }

    // Test modu uyarısı
    if (IS_TEST_MODE) {
      const confirmed = confirm(
        'Şu anlık ödeme sistemi aktif değil (iyzico entegrasyonu tamamlanmadı).\n\n' +
        'Bu bir test siparişi olarak kaydedilsin mi? (Gerçek ödeme alınmayacak)'
      );

      if (!confirmed) {
        alert('İşlem iptal edildi.');
        return;
      }
    }

    try {
      await createOrder.mutateAsync({
        customerName: formData.customerName,
        customerSurname: formData.customerSurname,
        address: formData.address,
        note: formData.note + (IS_TEST_MODE ? ' [TEST SİPARİŞİ - ÖDEME ALINMADI]' : ''),
        items: items.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalPrice: totalPrice(),
      });
    } catch (err) {
      console.error('Sipariş hatası:', err);
      alert('Sipariş kaydedilirken hata oluştu.');
    }
  };

  const allRequiredChecked = agreements.mesafeliSatis && agreements.gizlilik;

  if (items.length === 0) {
    router.push('/sepet');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-green-900 mb-8 tracking-wide">Ödeme Bilgileri</h1>

        {/* Test Modu Uyarısı */}
        {IS_TEST_MODE && (
          <div className="mb-8 p-5 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 rounded-lg">
            <p className="font-medium text-lg mb-1">Uyarı: Test Modu Aktif</p>
            <p className="text-sm">
              Ödeme sistemi henüz entegre edilmedi. Butona bastığınızda sipariş veritabanına kaydedilecek ama gerçek ödeme alınmayacak.
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-10">
          {/* Sol Taraf: Form */}
          <div className="bg-white rounded-xl shadow p-6 border border-green-100">
            <h2 className="text-xl font-semibold mb-4 text-green-900">Teslimat Bilgileri</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                placeholder="İsim *"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full p-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white shadow-sm"
                required
              />
              <input
                type="text"
                placeholder="Soyisim"
                value={formData.customerSurname}
                onChange={(e) => setFormData({ ...formData, customerSurname: e.target.value })}
                className="w-full p-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white shadow-sm"
              />
              <input
                type="tel"
                placeholder="Telefon *"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white shadow-sm"
                required
              />
              <textarea
                placeholder="Adres *"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-3 border border-green-200 rounded-lg min-h-[120px] focus:outline-none focus:ring-2 focus:ring-green-400 bg-white shadow-sm"
                required
              />
              <textarea
                placeholder="Sipariş notu (isteğe bağlı)"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="w-full p-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white shadow-sm"
              />

              {/* Checkbox'lar */}
              <div className="mt-6 space-y-3 border-t pt-5">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreements.mesafeliSatis}
                    onChange={(e) => setAgreements({ ...agreements, mesafeliSatis: e.target.checked })}
                    className="mt-1 w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    required
                  />
                  <span className="text-sm text-gray-700">
                    <Link href="/mesafeli-satis-sozlesmesi" target="_blank" className="text-green-700 underline hover:text-green-900">
                      Mesafeli Satış Sözleşmesi
                    </Link>
                    'ni okudum ve kabul ediyorum. *
                  </span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreements.gizlilik}
                    onChange={(e) => setAgreements({ ...agreements, gizlilik: e.target.checked })}
                    className="mt-1 w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    required
                  />
                  <span className="text-sm text-gray-700">
                    <Link href="/gizlilik-politikasi" target="_blank" className="text-green-700 underline hover:text-green-900">
                      Gizlilik Politikası ve Kişisel Verilerin Korunması Aydınlatma Metni
                    </Link>
                    'ni okudum ve kabul ediyorum. *
                  </span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreements.iletisim}
                    onChange={(e) => setAgreements({ ...agreements, iletisim: e.target.checked })}
                    className="mt-1 w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">
                    Mimoza Botanik'ten kampanya, indirim ve yeni ürün bildirimleri almak istiyorum (isteğe bağlı).
                  </span>
                </label>
              </div>

              {/* Onay Butonu */}
              <button
                type="submit"
                disabled={createOrder.isPending || !allRequiredChecked}
                className={`w-full py-4 rounded-lg text-lg font-semibold mt-6 shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                  allRequiredChecked
                    ? 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
                    : 'bg-gray-400 text-white cursor-not-allowed'
                }`}
              >
                {createOrder.isPending ? 'İşleniyor...' : `Siparişi Onayla (${totalPrice().toFixed(2)} TL)`}
              </button>

              {/* Ödeme Logoları */}
              <div className="mt-6 flex flex-col items-center gap-3">
                <p className="text-sm text-gray-600 font-medium">
                  {IS_TEST_MODE ? 'Güvenli Ödeme (Test Modu)' : 'Güvenli Ödeme'}
                </p>
                <div className="flex items-center justify-center gap-6">
                  <Image
                    src="/mastercard.png"
                    alt="Mastercard"
                    width={60}
                    height={40}
                    className="object-contain"
                  />
                  <Image
                    src="/visa.jpeg"
                    alt="Visa"
                    width={60}
                    height={40}
                    className="object-contain"
                  />
                  <Image
                    src="/iyzico-white-bg.png"
                    alt="iyzico"
                    width={80}
                    height={40}
                    className="object-contain"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Sağ Taraf: Sipariş Özeti */}
          <div className="bg-white rounded-xl shadow p-6 border border-green-100 h-fit">
            <h2 className="text-xl font-semibold mb-4 text-green-900">Sipariş Özeti</h2>
            {/* Buraya mevcut sipariş özeti kodunuzu yapıştırın */}
            {/* Örnek placeholder: */}
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span>{item.name} × {item.quantity}</span>
                  <span>{(item.price * item.quantity).toFixed(2)} TL</span>
                </div>
              ))}
              <div className="border-t pt-3 mt-3 font-bold text-green-900">
                Toplam: {totalPrice().toFixed(2)} TL
              </div>
            </div>

            {/* Logoları özet altına da ekledik (isteğe bağlı) */}
            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-center gap-6 opacity-80">
              <Image src="/mastercard.png" alt="Mastercard" width={50} height={35} className="object-contain" />
              <Image src="/visa.jpeg" alt="Visa" width={50} height={35} className="object-contain" />
              <Image src="/iyzico-white-bg.png" alt="iyzico" width={70} height={35} className="object-contain" />
            </div>
          </div>
        </div>

        {/* Teslimat & İade Kısa Özet */}
        <div className="mt-10 text-sm text-gray-600 bg-white p-6 rounded-xl border border-green-100 shadow-sm">
          <h3 className="text-lg font-semibold text-green-900 mb-3">Teslimat ve İade Bilgileri</h3>
          <ul className="space-y-2 list-disc pl-5">
            <li>Teslimat süresi genellikle 1-3 iş günüdür (stok durumuna göre değişebilir).</li>
            <li>Ürünler kargo ile gönderilir. Kargo ücreti sipariş toplamına göre hesaplanır.</li>
            <li>14 gün içinde cayma hakkınız vardır (ayıplı mal hariç). Detaylar için <Link href="/mesafeli-satis-sozlesmesi" className="text-green-700 underline">Mesafeli Satış Sözleşmesi</Link> sayfamızı inceleyin.</li>
            <li>İade durumunda ürün orijinal ambalajında, kullanılmamış olmalıdır. Kargo ücreti alıcıya aittir.</li>
            <li>Herhangi bir sorun için info@mimozabotanik.com adresinden ulaşabilirsiniz.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}