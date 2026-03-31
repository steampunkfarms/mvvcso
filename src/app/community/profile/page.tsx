'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, User } from 'lucide-react';

export default function ProfilePage() {
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setStatus('saving');
    // Profile save would go to an API route
    setTimeout(() => setStatus('saved'), 1000);
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-xl mx-auto px-(--container-padding) py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/community" className="text-gold-400 hover:text-gold-500"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-xl font-bold text-(--text-primary)">My Profile</h1>
        </div>

        <form onSubmit={handleSave} className="bg-white rounded-xl p-6 border border-stone-200 space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-dusk-100 flex items-center justify-center">
              <User className="w-8 h-8 text-dusk-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-(--text-primary)">Profile Photo</p>
              <p className="text-xs text-(--text-muted)">Upload coming soon</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-(--text-primary) mb-1">Display Name</label>
            <input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="How you appear in the community"
              className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-50 text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:border-gold-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-(--text-primary) mb-1">Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} placeholder="Tell the community about yourself..."
              className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-50 text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:border-gold-400 resize-y" />
          </div>

          <button type="submit" disabled={status === 'saving'}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-400 text-white font-semibold hover:bg-gold-500 transition-colors disabled:opacity-60">
            <Save className="w-4 h-4" />
            {status === 'saving' ? 'Saving...' : status === 'saved' ? 'Saved!' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
