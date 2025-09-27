'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import UserProfile from '@/components/auth/UserProfile';
import Navbar from '@/components/layout/Navbar';

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/profile');
    }
  }, [status, router]);
  
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="text-center py-12">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-8">Your Account</h1>
        <UserProfile />
      </div>
    </div>
  );
}