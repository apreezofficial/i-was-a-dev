'use client';

import { useState, useEffect } from 'react';
import { X, Camera, Save, LogOut, Loader2, Sparkles, User, MessageSquareText, Award, Heart } from 'lucide-react';
import { toast } from 'sonner';

interface RegisterModalProps {
  mode?: 'register' | 'login';
  onClose: () => void;
  onSuccess?: (user: any) => void;
}

const API_BASE = 'https://api.preciousadedokun.com.ng/iwasadev';

export default function RegisterModal({ mode = 'register', onClose, onSuccess }: RegisterModalProps) {
  const [currentStep, setCurrentStep] = useState<'form' | 'pin' | 'dashboard'>(mode === 'login' && typeof window !== 'undefined' && localStorage.getItem('iwasadev_user') ? 'dashboard' : 'form');
  const [authMode, setAuthMode] = useState<'register' | 'login'>(mode);
  const [formData, setFormData] = useState({
    name: '',
    before: '',
    after: '',
    story: '',
    pin: '',
  });
  const [avatar, setAvatar] = useState<string | null>(null);
  const [generatedPin, setGeneratedPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const [storyView, setStoryView] = useState<'edit' | 'preview'>('edit');
  const [liked, setLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('iwasadev_user');
    if (savedUser && mode === 'login') {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setFormData({
        name: parsedUser.name || '',
        before: parsedUser.before || '',
        after: parsedUser.after || '',
        story: parsedUser.story || '',
        pin: localStorage.getItem('iwasadev_pin') || '',
      });
      setAvatar(parsedUser.avatar || null);
      setCurrentStep('dashboard');
      checkLikeStatus(parsedUser.id);
    }
  }, [mode]);

  const checkLikeStatus = async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE}/check-like?person_id=${userId}`);
      const data = await response.json();
      setLiked(data.liked || false);

      // Also refresh user data while at it
      const storyResponse = await fetch(`${API_BASE}/get-story?id=${userId}`);
      const storyData = await storyResponse.json();
      if (storyData.success) {
        setUser(storyData.data);
        localStorage.setItem('iwasadev_user', JSON.stringify(storyData.data));
      }
    } catch (err) {
      console.error('Error checking like status:', err);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const endpoint = authMode === 'register' ? 'register' : 'login';
      const body = authMode === 'register'
        ? { name: formData.name, before: formData.before, after: formData.after, story: formData.story, avatar }
        : { pin: formData.pin };

      const response = await fetch(`${API_BASE}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        if (authMode === 'register') {
          setGeneratedPin(data.pin);
          setCurrentStep('pin');
          // Save a temporary session if registration is successful? 
          // Actually, usually user will login with the PIN first.
        } else {
          // Login successful
          localStorage.setItem('iwasadev_user', JSON.stringify(data.data));
          localStorage.setItem('iwasadev_pin', formData.pin);
          setUser(data.data);
          onSuccess?.(data.data);
          setCurrentStep('dashboard');
        }
      } else {
        setError(data.error || 'Operation failed');
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const pin = localStorage.getItem('iwasadev_pin');
      // Exclude pin from formData to avoid overwriting the stored PIN
      const { pin: _unusedPin, ...profileData } = formData;
      const response = await fetch(`${API_BASE}/update-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          pin,
          ...profileData,
          avatar
        }),
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem('iwasadev_user', JSON.stringify(data.data));
        setUser(data.data);
        onSuccess?.(data.data);
        toast.success('Profile updated! 🎉');
      } else {
        setError(data.error || 'Update failed');
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const insertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementsByName('story')[0] as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    const selection = text.substring(start, end);

    const newValue = before + prefix + selection + suffix + after;
    setFormData(prev => ({ ...prev, story: newValue }));

    // Reset focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const handleLike = async () => {
    if (!user || isLiking) return;
    setIsLiking(true);

    try {
      const endpoint = liked ? 'unlike' : 'like';
      const response = await fetch(`${API_BASE}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ person_id: user.id }),
      });

      const data = await response.json();
      if (data.success) {
        setLiked(!liked);
        const updatedUser = { ...user, likes: data.likes };
        setUser(updatedUser);
        localStorage.setItem('iwasadev_user', JSON.stringify(updatedUser));
        toast.success(liked ? 'Story unliked' : 'Story liked! ❤️');
      } else {
        toast.error(data.error || 'Operation failed');
      }
    } catch (err) {
      toast.error('Error connecting to server');
    } finally {
      setIsLiking(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const renderHeader = () => {
    let title = '';
    if (currentStep === 'dashboard') title = 'My Dashboard';
    else if (currentStep === 'pin') title = 'Your Access PIN';
    else title = authMode === 'register' ? 'Register Your Story' : 'Welcome Back';

    return (
      <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {title}
          </h2>
          {currentStep === 'form' && (
            <p className="text-sm text-foreground/50 font-medium">
              {authMode === 'register' ? "Share your journey with the community" : "Enter your details to manage your story"}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
        >
          <X size={20} className="text-foreground/60" />
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
        {renderHeader()}

        <div className="p-8 overflow-y-auto flex-1">
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              <p className="text-sm font-semibold text-destructive">{error}</p>
            </div>
          )}

          {currentStep === 'form' && (
            <div className="space-y-8">
              {/* Auth Tabs */}
              <div className="flex p-1 bg-muted rounded-xl gap-1">
                <button
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-all ${authMode === 'register' ? 'bg-card text-foreground shadow-sm' : 'text-foreground/50 hover:text-foreground'}`}
                >
                  Register
                </button>
                <button
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-all ${authMode === 'login' ? 'bg-card text-foreground shadow-sm' : 'text-foreground/50 hover:text-foreground'}`}
                >
                  Login
                </button>
              </div>

              <form onSubmit={handleAuth} className="space-y-6">
                {authMode === 'register' && (
                  <div>
                    <label className="block text-xs font-black text-foreground/40 mb-2 uppercase tracking-widest">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Sarah Chen"
                      className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                    />
                  </div>
                )}

                {authMode === 'register' ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-foreground/40 mb-2 uppercase tracking-widest">
                          Was (Dev Role)
                        </label>
                        <textarea
                          name="before"
                          value={formData.before}
                          onChange={handleInputChange}
                          required
                          placeholder="e.g., Senior Frontend dev"
                          rows={2}
                          className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-foreground/40 mb-2 uppercase tracking-widest">
                          Now (Current Role)
                        </label>
                        <textarea
                          name="after"
                          value={formData.after}
                          onChange={handleInputChange}
                          required
                          placeholder="e.g., Product Manager"
                          rows={2}
                          className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium resize-none"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-xs font-black text-foreground/40 mb-2 uppercase tracking-widest">
                      Access PIN
                    </label>
                    <input
                      type="password"
                      name="pin"
                      value={formData.pin}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your 6-digit PIN"
                      maxLength={6}
                      className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-black tracking-widest text-center text-xl"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg shadow-primary/20 active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : authMode === 'register' ? (
                    <>
                      <span>Start Your Journey</span>
                      <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
                    </>
                  ) : (
                    <span>Login to Dashboard</span>
                  )}
                </button>
              </form>
            </div>
          )}

          {currentStep === 'pin' && (
            <div className="space-y-8 text-center py-4">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award size={40} className="text-primary" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Welcome to the Community!</h3>
                <p className="text-foreground/60">
                  Your story has been registered. Save this PIN to access your dashboard anytime.
                </p>
              </div>

              <div className="bg-muted border-2 border-dashed border-border rounded-2xl p-10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="text-xs font-black text-foreground/30 uppercase tracking-[0.2em] mb-4">
                  Access PIN
                </p>
                <p className="text-6xl font-black text-foreground tracking-[0.3em]">
                  {generatedPin}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedPin);
                    toast.success('PIN copied to clipboard! 🔐');
                  }}
                  className="w-full py-4 bg-muted hover:bg-muted/80 text-foreground font-bold rounded-xl transition-all border border-border"
                >
                  Copy PIN
                </button>
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setFormData({ ...formData, pin: generatedPin });
                    setCurrentStep('form');
                  }}
                  className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-xl transition-all"
                >
                  Continue to Login
                </button>
              </div>
            </div>
          )}

          {currentStep === 'dashboard' && user && (
            <div className="space-y-8">
              {/* Stats / Dashboard Overview */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted p-4 rounded-2xl border border-border/50 flex items-center justify-between group">
                  <div>
                    <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-1">Total Likes</p>
                    <p className="text-3xl font-black text-foreground">{user.likes ?? 0}</p>
                  </div>
                  <button
                    onClick={handleLike}
                    disabled={isLiking}
                    className={`p-3 rounded-xl transition-all duration-300 ${liked
                        ? 'bg-primary/20 text-primary scale-110 shadow-lg shadow-primary/20'
                        : 'bg-background/50 text-foreground/20 hover:text-foreground/40 hover:scale-105'
                      }`}
                  >
                    <Heart size={24} className={isLiking ? 'animate-pulse' : ''} fill={liked ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <div className="bg-muted p-4 rounded-2xl border border-border/50">
                  <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-1">Status</p>
                  <p className="text-3xl font-black text-primary">Live</p>
                </div>
              </div>

              {/* Quick Links */}
              <div className="flex gap-3">
                <a
                  href={`/story/${user.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-muted hover:bg-border border border-border text-foreground font-bold rounded-xl text-center text-sm transition-all"
                >
                  View My Story →
                </a>
                <button
                  type="button"
                  onClick={() => {
                    const shareUrl = `${window.location.origin}/story/${user.id}`;
                    navigator.clipboard.writeText(shareUrl);
                    toast.success('Story link copied! 🔗');
                  }}
                  className="px-4 py-3 bg-muted hover:bg-border border border-border text-foreground font-bold rounded-xl text-sm transition-all"
                >
                  Copy Link
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-6">
                {/* Avatar Upload */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-muted border-2 border-border overflow-hidden flex items-center justify-center">
                      {avatar ? (
                        <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User size={32} className="text-foreground/20" />
                      )}
                    </div>
                    <label className="absolute inset-0 flex items-center justify-center bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                      <Camera className="text-background" size={24} />
                      <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                    </label>
                  </div>
                  <p className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Update Profile Picture</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-foreground/40 mb-2 uppercase tracking-widest">
                      Display Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-foreground/40 mb-2 uppercase tracking-widest">
                        Was
                      </label>
                      <input
                        type="text"
                        name="before"
                        value={formData.before}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-foreground/40 mb-2 uppercase tracking-widest">
                        Now
                      </label>
                      <input
                        type="text"
                        name="after"
                        value={formData.after}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                        <button
                          type="button"
                          onClick={() => setStoryView('edit')}
                          className={`px-4 py-1.5 rounded-md text-xs font-black transition-all ${storyView === 'edit' ? 'bg-card text-foreground shadow-sm' : 'text-foreground/40 hover:text-foreground'}`}
                        >
                          EDIT
                        </button>
                        <button
                          type="button"
                          onClick={() => setStoryView('preview')}
                          className={`px-4 py-1.5 rounded-md text-xs font-black transition-all ${storyView === 'preview' ? 'bg-card text-foreground shadow-sm' : 'text-foreground/40 hover:text-foreground'}`}
                        >
                          PREVIEW
                        </button>
                      </div>
                      <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-black uppercase">Markdown Supported</span>
                    </div>

                    {storyView === 'edit' ? (
                      <div className="space-y-4">
                        {/* Markdown Toolbar */}
                        <div className="flex flex-wrap gap-2 pb-2">
                          {[
                            { label: 'B', prefix: '**', suffix: '**', title: 'Bold' },
                            { label: 'I', prefix: '*', suffix: '*', title: 'Italic' },
                            { label: 'H1', prefix: '# ', suffix: '', title: 'Heading 1' },
                            { label: 'H2', prefix: '## ', suffix: '', title: 'Heading 2' },
                            { label: 'Quote', prefix: '> ', suffix: '', title: 'Quote' },
                            { label: 'Link', prefix: '[', suffix: '](url)', title: 'Link' },
                            { label: 'List', prefix: '- ', suffix: '', title: 'Bullet List' },
                          ].map((tool) => (
                            <button
                              key={tool.title}
                              type="button"
                              onClick={() => insertMarkdown(tool.prefix, tool.suffix)}
                              className="px-3 py-1 bg-muted hover:bg-border rounded text-[10px] font-black border border-border/50 text-foreground/60 transition-colors"
                              title={tool.title}
                            >
                              {tool.label}
                            </button>
                          ))}
                        </div>
                        <textarea
                          name="story"
                          value={formData.story}
                          onChange={handleInputChange}
                          placeholder="Write your full transition story here... what made you quit? what's the best part about your new life? # Markdown is on!"
                          rows={10}
                          className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium resize-none leading-relaxed font-mono text-sm"
                        />
                      </div>
                    ) : (
                      <div className="w-full px-6 py-6 bg-muted/50 border border-border rounded-xl min-h-[250px] max-h-[400px] overflow-y-auto">
                        {formData.story ? (
                          <div className="prose prose-invert prose-sm max-w-none">
                            {/* Simple fallback markdown rendering if react-markdown isn't ready */}
                            <div className="text-foreground/90 whitespace-pre-wrap font-medium leading-relaxed">
                              {formData.story.split('\n').map((line, i) => {
                                if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-black mb-4 mt-2">{line.replace('# ', '')}</h1>;
                                if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-black mb-3 mt-2">{line.replace('## ', '')}</h2>;
                                if (line.startsWith('> ')) return <blockquote key={i} className="border-l-4 border-primary pl-4 italic my-4 text-foreground/60">{line.replace('> ', '')}</blockquote>;
                                return <p key={i} className={line.trim() === '' ? 'h-4' : 'mb-2'}>{line}</p>;
                              })}
                            </div>
                          </div>
                        ) : (
                          <p className="text-foreground/20 italic text-center py-12">Nothing to preview yet...</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                  >
                    {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
