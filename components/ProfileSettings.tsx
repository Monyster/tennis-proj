'use client';

import { signOut, updateProfile } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { firebaseAuth } from '@/lib/firebase';
import { useAuth } from '@/lib/useAuth';
import { useGlobalStats } from '@/lib/useGlobalStats';
import Button from './button/button';
import Typography from './typography/typography';

/**
 * Profile settings component for managing display name and sign out
 */
export default function ProfileSettings() {
  const router = useRouter();
  const { user } = useAuth();
  const { updateDisplayName } = useGlobalStats(user?.uid || null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.displayName || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSaveName = async () => {
    if (!user || !newName.trim()) {
      setError("Ім'я не може бути порожнім");
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: newName.trim(),
      });

      // Update in database
      await updateDisplayName(newName.trim());

      setIsEditing(false);
    } catch (err) {
      console.error('Error updating name:', err);
      setError('Помилка оновлення імені');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    if (confirm('Ви впевнені, що хочете вийти?')) {
      try {
        await signOut(firebaseAuth);
        router.push('/');
      } catch (err) {
        console.error('Error signing out:', err);
      }
    }
  };

  return (
    <div className="bg-[#1e2939] rounded-lg p-6 border border-[#9198a0]/20">
      <Typography.H5 className="text-[#fef4e5] mb-4">⚙️ Налаштування</Typography.H5>

      <div className="space-y-4">
        {/* Display Name */}
        <div>
          <Typography.Label htmlFor="displayName" className="text-[#fef4e5] mb-2 block">
            Відображуване ім'я
          </Typography.Label>

          {isEditing ? (
            <div className="space-y-2">
              <input
                id="displayName"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-4 py-2 bg-[#101827] border border-[#9198a0]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#75db70] focus:border-transparent text-[#fef4e5]"
                placeholder="Введіть ім'я"
                disabled={isSaving}
              />
              {error && (
                <Typography.BodySRegular className="text-error-500">
                  {error}
                </Typography.BodySRegular>
              )}
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="small"
                  onClick={handleSaveName}
                  disabled={isSaving}
                  className="flex-1"
                >
                  {isSaving ? 'Збереження...' : 'Зберегти'}
                </Button>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => {
                    setIsEditing(false);
                    setNewName(user?.displayName || '');
                    setError('');
                  }}
                  disabled={isSaving}
                  className="flex-1 border border-[#9198a0]/30 text-[#fef4e5]"
                >
                  Скасувати
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-[#101827] border border-[#9198a0]/10 rounded-lg px-4 py-3">
              <Typography.BodyMRegular className="text-[#fef4e5]">
                {user?.displayName || 'Гравець'}
              </Typography.BodyMRegular>
              <Button
                variant="ghost"
                size="small"
                onClick={() => setIsEditing(true)}
                className="text-[#75db70] hover:bg-[#75db70]/10"
              >
                Змінити
              </Button>
            </div>
          )}
        </div>

        {/* Sign Out Button */}
        <div className="pt-4 border-t border-[#9198a0]/20">
          <Button
            variant="ghost"
            size="big"
            onClick={handleSignOut}
            className="w-full border border-error-500/30 text-error-500 hover:bg-error-500/10"
          >
            Вийти з акаунту
          </Button>
        </div>
      </div>
    </div>
  );
}
