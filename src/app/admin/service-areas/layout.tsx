'use client';

import DashboardLayout from '../dashboard/layout';

export default function ServiceAreasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}