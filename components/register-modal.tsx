'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface RegisterModalProps {
  onClose: () => void;
}

const API_BASE = 'https://api.preciousadedokun.com.ng/iwasadev';

export default function RegisterModal({ onClose }: RegisterModalProps) {
  const [step, setStep] = useState<'form' | 'pin'>('form');
  const [formData, setFormData] = useState({
    name: '',
    before: '',
    after: '',
  });
  const [generatedPin, setGeneratedPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedPin(data.pin);
        setStep('pin');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Error registering. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-2xl max-w-2xl w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">
            {step === 'form' ? 'Register Your Story' : 'Your Access PIN'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X size={20} className="text-foreground/60" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {error && (
            <div className="mb-4 p-4 bg-destructive/20 border border-destructive rounded-lg">
              <p className="text-sm text-foreground">{error}</p>
            </div>
          )}
          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Sarah Chen"
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide">
                  What You Were (Your Dev Role)
                </label>
                <textarea
                  name="before"
                  value={formData.before}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Full-Stack Developer (10 years)"
                  rows={3}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide">
                  What You Do Now (Current Role)
                </label>
                <textarea
                  name="after"
                  value={formData.after}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Product Manager at Tech Startup"
                  rows={3}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground transition-all resize-none"
                />
              </div>

              <p className="text-sm text-foreground/60 italic">
                After submission, you&apos;ll receive a PIN to log in and manage your profile anytime.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Registering...' : 'Generate My PIN'}
              </button>
            </form>
          ) : (
            <div className="space-y-6 text-center">
              <div>
                <p className="text-foreground/70 mb-4">
                  Your story has been registered! Save this PIN to login anytime.
                </p>
              </div>

              {/* PIN Display */}
              <div className="bg-muted border border-border rounded-xl p-8 my-8">
                <p className="text-sm font-semibold text-foreground/60 uppercase tracking-wider mb-2">
                  Your Access PIN
                </p>
                <p className="text-5xl font-black text-foreground tracking-widest">
                  {generatedPin}
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedPin);
                    alert('PIN copied to clipboard!');
                  }}
                  className="w-full py-3 bg-muted hover:bg-muted/80 text-foreground font-bold rounded-lg transition-all border border-border"
                >
                  Copy PIN
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg transition-all"
                >
                  Done
                </button>
              </div>

              <p className="text-xs text-foreground/50 italic">
                Keep this PIN safe. You&apos;ll need it to access your profile.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
