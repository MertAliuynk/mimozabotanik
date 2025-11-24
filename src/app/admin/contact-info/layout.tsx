'use client';

import DashboardLayout from '../dashboard/layout';

export default function ContactInfoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}