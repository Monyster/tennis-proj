'use client';

import { useAuth } from '@/lib/useAuth';
import { ReactNode, useState, useEffect } from 'react';
import AuthModal from './AuthModal';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * AuthGuard component that ensures user is authenticated before rendering children
 * Shows AuthModal if user is not authenticated
 */
export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setShowAuthModal(true);
    }
  }, [loading, user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto" />
          <p className="text-gray-600">Завантаження...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        {fallback || (
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Потрібна авторизація
              </h2>
              <p className="text-gray-600 mb-6">
                Увійдіть, щоб продовжити
              </p>
            </div>
          </div>
        )}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </>
    );
  }

  return <>{children}</>;
}
