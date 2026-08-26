"use client";

import { useRouter } from 'next/navigation';
import { SessionProvider, useSession, signIn, signOut } from 'next-auth/react';

export function AuthProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}

// Single auth hook for the whole app.
export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  return {
    user: session?.user ?? null,
    isAuthenticated: status === 'authenticated',
    loading: status === 'loading',
    login: () => router.push('/login'), // dedicated login/signup page
    loginWithGoogle: () => signIn('google'),
    logout: () => signOut({ callbackUrl: '/' }),
  };
}
