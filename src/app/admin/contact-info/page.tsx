'use client';

import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';

interface FormData {
  companyName: string;
  address: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
}

interface WorkingHours {
  monday: { open: string; close: string; isOpen: boolean };
  tuesday: { open: string; close: string; isOpen: boolean };
  wednesday: { open: string; close: string; isOpen: boolean };
  thursday: { open: string; close: string; isOpen: boolean };
  friday: { open: string; close: string; isOpen: boolean };
  saturday: { open: string; close: string; isOpen: boolean };
  sunday: { open: string; close: string; isOpen: boolean };
}

interface ContactInfo {
  id: string;
  companyName: string;
  address: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  workingHours: WorkingHours;
  createdAt: string;
  updatedAt: string;
}

export default function ContactInfoAdmin() {
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    address: '',
    phone: '',
    email: '',
    latitude: 39.9334,
    longitude: 32.8157
  });

  // Queries
  const { data: contactInfo, refetch } = api.contactInfo.get.useQuery() as {
    data: ContactInfo | undefined;
    refetch: () => void;
  };

  // Mutations
  const updateMutation = api.contactInfo.update.useMutation({
    onSuccess: () => {
      void refetch();
      alert('İletişim bilgileri başarıyla güncellendi!');
    },
    onError: (error: any) => {
      alert('Hata: ' + error.message);
    }
  }) as any;

  useEffect(() => {
    if (contactInfo) {
      setFormData({
        companyName: contactInfo.companyName,
        address: contactInfo.address,
        phone: contactInfo.phone,
        email: contactInfo.email,
        latitude: contactInfo.latitude,
        longitude: contactInfo.longitude
      });
    }
  }, [contactInfo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default working hours
    const workingHours: WorkingHours = {
      monday: { open: '09:00', close: '18:00', isOpen: true },
      tuesday: { open: '09:00', close: '18:00', isOpen: true },
      wednesday: { open: '09:00', close: '18:00', isOpen: true },
      thursday: { open: '09:00', close: '18:00', isOpen: true },
      friday: { open: '09:00', close: '18:00', isOpen: true },
      saturday: { open: '09:00', close: '16:00', isOpen: true },
      sunday: { open: '00:00', close: '00:00', isOpen: false }
    };
    
    updateMutation.mutate({ ...formData, workingHours });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">İletişim Bilgileri Yönetimi</h1>
        <p className="text-gray-600 mt-2">Website'de görüntülenecek iletişim bilgilerini buradan yönetebilirsiniz.</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Şirket Adı *
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefon *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adres *
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Location Coordinates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enlem (Latitude) *
              </label>
              <input
                type="number"
                step="0.000001"
                value={formData.latitude}
                onChange={(e) => setFormData(prev => ({ ...prev, latitude: parseFloat(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Boylam (Longitude) *
              </label>
              <input
                type="number"
                step="0.000001"
                value={formData.longitude}
                onChange={(e) => setFormData(prev => ({ ...prev, longitude: parseFloat(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {updateMutation.isPending ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>

      {/* Preview Section */}
      {contactInfo && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Önizleme</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p><strong>Şirket:</strong> {formData.companyName}</p>
              <p><strong>Adres:</strong> {formData.address}</p>
              <p><strong>Telefon:</strong> {formData.phone}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Konum:</strong> {formData.latitude}, {formData.longitude}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}