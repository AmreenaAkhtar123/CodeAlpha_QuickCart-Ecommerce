'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function UserProfile() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  
  if (status === 'loading') {
    return <div className="text-center py-4">Loading...</div>;
  }
  
  if (status === 'unauthenticated' || !session) {
    return <div className="text-center py-4">Please sign in to view your profile</div>;
  }
  
  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut({ callbackUrl: '/' });
  };
  
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Your Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={session.user.image} alt={session.user.name} />
            <AvatarFallback className="text-2xl">
              {session.user.name?.charAt(0)?.toUpperCase() || 
               session.user.email?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{session.user.name || 'Not provided'}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{session.user.email}</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button
            onClick={handleSignOut}
            disabled={isLoading}
            variant="destructive"
          >
            {isLoading ? 'Signing out...' : 'Sign Out'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}