'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';

interface ReasonFormProps {
  user: {
    id: string;
    name: string;
    before: string;
    pin: string;
  };
}

export default function ReasonForm({ user }: ReasonFormProps) {
  const [reason, setReason] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('https://api.preciousadedokun.com.ng/iwasadev/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin: user.pin,
          reason_for_leaving: reason,
          current_role: currentRole,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Profile updated successfully!');
        setReason('');
        setCurrentRole('');
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('[v0] Error updating profile:', err);
      setError('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="bg-card border border-border rounded-xl p-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Why I Left Development</h2>
        <p className="text-foreground/70 mb-6">Tell us what made you leave your dev career and what you do now.</p>

        {error && (
          <div className="mb-6 p-4 bg-destructive/20 border border-destructive rounded-lg">
            <p className="text-sm text-foreground">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg">
            <p className="text-sm text-foreground">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">
              Reason for Leaving
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., I wanted to focus on product strategy rather than coding, or I realized I enjoyed design more..."
              rows={4}
              className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-2">
              What You Do Now
            </label>
            <input
              type="text"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              placeholder="e.g., Product Manager, Entrepreneur, Designer, Consultant..."
              className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !reason || !currentRole}
            className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
