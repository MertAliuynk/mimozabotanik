'use client';

import { Header } from '@/components/Header';

export default function GizlilikPolitikasiPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-green-900 mb-8 tracking-wide">Gizlilik Politikası ve Kişisel Verilerin Korunması Aydınlatma Metni</h1>

        <div className="bg-white rounded-xl shadow p-8 border border-green-100 prose prose-green max-w-none">
          <p className="text-gray-700 mb-6">
            Mimoza Botanik ("Biz", "Şirketimiz") olarak kişisel verilerinizin korunmasına büyük önem veriyoruz. 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) kapsamında veri sorumlusu sıfatıyla işlediğimiz kişisel verileriniz hakkında sizi bilgilendirmek istiyoruz.
          </p>

          <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">1. Hangi Kişisel Verilerinizi İşliyoruz?</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Kimlik bilgileri (ad-soyad, T.C. kimlik no vb.)</li>
            <li>İletişim bilgileri (e-posta, telefon, adres)</li>
            <li>Finansal bilgiler (ödeme bilgileri – kart bilgileri iyzico tarafından işlenir, biz saklamayız)</li>
            <li>İşlem bilgileri (sipariş geçmişi, IP adresi, tarayıcı bilgileri)</li>
            <li>Pazarlama verileri (ticari ileti onayı varsa)</li>
          </ul>

          <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">2. Kişisel Verilerinizi Hangi Amaçla İşliyoruz?</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Siparişlerin işlenmesi, teslimat ve faturalandırma</li>
            <li>Ödeme işlemlerinin güvenliği (iyzico ile paylaşım)</li>
            <li>Yasal yükümlülükler (vergi, muhasebe)</li>
            <li>Müşteri hizmetleri ve şikayet yönetimi</li>
            <li>Ticari iletişim (onayınız varsa)</li>
          </ul>

          <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">3. Kişisel Verileriniz Kimlerle Paylaşılıyor?</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Ödeme için iyzico Ödeme Hizmetleri A.Ş. (gizlilik politikası: <a href="https://www.iyzico.com/gizlilik-politikasi" target="_blank" className="text-green-700 underline hover:text-green-900">https://www.iyzico.com/gizlilik-politikasi</a>)</li>
            <li>Kargo firmaları (teslimat için)</li>
            <li>Yasal zorunluluk hallerinde kamu kurumları</li>
          </ul>

          <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">4. Kişisel Verilerinizin Güvenliği</h2>
          <p className="text-gray-700">
            Verileriniz güvenli sunucularda saklanır, SSL ile şifrelenir. Veri ihlali durumunda KVKK gereği 72 saat içinde Kişisel Verileri Koruma Kurumu'na bildirilir.
          </p>

          <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">5. Haklarınız</h2>
          <p className="text-gray-700 mb-4">
            KVKK md. 11 uyarınca:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Veri işlenip işlenmediğini öğrenme</li>
            <li>Erişim, düzeltme, silme, kısıtlama talebi</li>
            <li>İşlemeye itiraz</li>
            <li>Zarar tazmini</li>
          </ul>
          <p className="text-gray-700 mt-4">
            Başvurularınızı <strong>info@mimozabotanik.com</strong> adresine iletebilirsiniz. Cevap süresi en geç 30 gündür.
          </p>

          <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">6. Çerezler</h2>
          <p className="text-gray-700">
            Sitemizde çerez kullanıyoruz. Detaylar için Çerez Politikamızı inceleyin.
          </p>

          <p className="text-gray-600 mt-10 text-sm italic">
            Bu politika 04 Mart 2026 tarihinde güncellenmiştir. Değişiklikler sitede yayınlandığı anda geçerlidir.
          </p>
        </div>
      </div>
    </div>
  );
}