import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, profile, fetchProfile } = useAuth();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setBio(profile.bio || '');
    }
  }, [profile]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, phone, bio })
      .eq('id', user.id);

    if (!error) {
      await fetchProfile(user.id);
      setToast('Profile updated successfully');
      setTimeout(() => setToast(''), 3000);
    }
    setSaving(false);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-100 mb-8">Profile</h1>

      {toast && (
        <div className="mb-6 rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-400">
          {toast}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 rounded-xl border border-surface-border bg-surface p-8">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
          <input
            type="email"
            value={user?.email || ''}
            readOnly
            className="w-full rounded-lg border border-surface-border bg-slate-800/50 px-4 py-2.5 text-slate-500 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Role</label>
          <input
            type="text"
            value={profile?.role || 'founder'}
            readOnly
            className="w-full rounded-lg border border-surface-border bg-slate-800/50 px-4 py-2.5 text-slate-500 cursor-not-allowed"
          />
        </div>

        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-light px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-1.5">Phone</label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-light px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            placeholder="+91 98765 43210"
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-slate-300 mb-1.5">Bio</label>
          <textarea
            id="bio"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-light px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand resize-none"
            placeholder="Tell us about yourself..."
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-light transition-colors disabled:opacity-50 cursor-pointer"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
