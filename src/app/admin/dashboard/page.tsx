'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirecionar para /admin
    router.replace('/admin');
  }, [router]);

  return null;
}
