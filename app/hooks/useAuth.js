"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      router.push('/');
    }
  }, [router]);
}

export function handleLogout() {
  // Clear all auth related items from localStorage
  localStorage.clear();
  // Redirect to home page
  window.location.href = '/';
}