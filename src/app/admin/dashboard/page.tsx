'use client';

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    services: 0,
    references: 0,
    galleries: 0,
    posts: 0,
  });

  // In a real app, these would come from tRPC queries
  useEffect(() => {
    // Simulate loading stats
    setStats({
      services: 12,
      references: 8,
      galleries: 6,
      posts: 24,
    });
  }, []);

  const statCards = [
    {
      name: 'Toplam Hizmet',
      value: stats.services,
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ),
      color: 'bg-blue-500',
      href: '/admin/dashboard/services',
    },
    {
      name: 'Toplam Referans',
      value: stats.references,
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-7.5c0-1.1.9-2 2-2s2 .9 2 2V18h2v-4h3v4h2V9H4v9z"/>
        </svg>
      ),
      color: 'bg-green-500',
      href: '/admin/dashboard/references',
    },
    {
      name: 'Toplam Galeri',
      value: stats.galleries,
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
        </svg>
      ),
      color: 'bg-purple-500',
      href: '/admin/dashboard/gallery',
    },
    {
      name: 'Toplam Blog',
      value: stats.posts,
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
      ),
      color: 'bg-orange-500',
      href: '/admin/dashboard/blog',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">GreenPark Peyzaj yönetim paneline hoş geldiniz</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div
            key={card.name}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center">
              <div className={`${card.color} text-white p-3 rounded-lg`}>
                {card.icon}
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">{card.value}</h3>
                <p className="text-gray-600 text-sm">{card.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Son Aktiviteler</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 rounded-full p-2">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Yeni hizmet eklendi</p>
                <p className="text-xs text-gray-500">2 saat önce</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 rounded-full p-2">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Galeri güncellendi</p>
                <p className="text-xs text-gray-500">5 saat önce</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-purple-100 rounded-full p-2">
                <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-7.5c0-1.1.9-2 2-2s2 .9 2 2V18h2v-4h3v4h2V9H4v9z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Yeni referans eklendi</p>
                <p className="text-xs text-gray-500">1 gün önce</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Hızlı İşlemler</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-sm font-medium transition-colors">
              Yeni Hizmet Ekle
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-sm font-medium transition-colors">
              Galeri Ekle
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg text-sm font-medium transition-colors">
              Referans Ekle
            </button>
            <button className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-lg text-sm font-medium transition-colors">
              Blog Yazısı Ekle
            </button>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Sistem Durumu</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <span className="text-sm font-medium text-gray-900">Website</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Çalışıyor
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <span className="text-sm font-medium text-gray-900">Database</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Bağlı
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <span className="text-sm font-medium text-gray-900">Minio Storage</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Aktif
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}