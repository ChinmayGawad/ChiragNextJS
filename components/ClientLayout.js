"use client";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ClientLayout({ children }) {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && pathname !== '/login') {
      const token = localStorage.getItem('sb-access-token');
      if (!token) {
        window.location.href = '/login';
      }
    }
  }, [pathname]);

  return children;
}
