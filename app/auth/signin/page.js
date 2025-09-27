'use client';

import { useSearchParams } from 'next/navigation';
import SignInForm from '@/components/auth/SignInForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';

export default function SignIn() {
  const searchParams = useSearchParams();
  const registered = searchParams?.get('registered');

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {registered && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Account created successfully! Please sign in.
            </AlertDescription>
          </Alert>
        )}
        
        <SignInForm />
      </div>
    </div>
  );
}