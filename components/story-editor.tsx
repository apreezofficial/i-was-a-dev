'use client';

import { useState, useRef } from 'react';
import { Wand2, Upload, Save, X } from 'lucide-react';

interface StoryEditorProps {
  user: {
    id: string;
    name: string;
    before: string;
    pin: string;
  };
}

export default function StoryEditor({ user }: StoryEditorProps) {
  const [story, setStory] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDraftWithAI = async () => {
    setLoadingDraft(true);
    setError('');

    try {
      // We need reason and currentRole from backend, for now we'll use a simple prompt
      const response = await fetch('/api/draft-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: 'I needed a change in my career',
          currentRole: 'Working in a different field',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStory(data.story);
        setSuccess('Story draft generated! Edit it to make it yours.');
      } else {
        setError(data.error || 'Failed to generate draft');
      }
    } catch (err) {
      console.error('[v0] Error generating draft:', err);
      setError('Error generating draft. Please try again.');
    } finally {
      setLoadingDraft(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target.result as string]);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!story.trim()) {
      setError('Please write a story first');
      return;
    }

    setLoadingSave(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('https://api.preciousadedokun.com.ng/iwasadev/save-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin: user.pin,
          story: story,
          images: images, // Array of base64 images
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Story saved successfully!');
      } else {
        setError(data.error || 'Failed to save story');
      }
    } catch (err) {
      console.error('[v0] Error saving story:', err);
      setError('Error saving story. Please try again.');
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Alerts */}
      {error && (
        <div className="p-4 bg-destructive/20 border border-destructive rounded-lg">
          <p className="text-sm text-foreground">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-500/20 border border-green-500 rounded-lg">
          <p className="text-sm text-foreground">{success}</p>
        </div>
      )}

      {/* Editor Card */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Toolbar */}
        <div className="border-b border-border bg-muted p-4 flex flex-wrap gap-3">
          <button
            onClick={handleDraftWithAI}
            disabled={loadingDraft}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Wand2 size={18} />
            {loadingDraft ? 'Drafting...' : 'Ask AI to Draft'}
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 border border-foreground/30 text-foreground hover:bg-foreground/5 font-bold rounded-lg transition-colors"
          >
            <Upload size={18} />
            Add Images
          </button>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Editor */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Tell Your Story</h2>
          <p className="text-foreground/70 mb-6">
            Can&apos;t write? Click &quot;Ask AI to Draft&quot; above to let AI write an initial version for you, then edit it to make it yours.
          </p>

          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Write your story here... What made you leave development? What are you doing now? Why does it matter?"
            rows={12}
            className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground resize-none font-mono text-sm"
          />

          <p className="text-xs text-foreground/60 mt-4">
            {story.length} characters
          </p>
        </div>

        {/* Images */}
        {images.length > 0 && (
          <div className="border-t border-border p-8">
            <h3 className="text-lg font-bold text-foreground mb-4">Images ({images.length})</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-border"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-destructive hover:bg-destructive/90 text-background rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={loadingSave || !story.trim()}
        className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
      >
        <Save size={20} />
        {loadingSave ? 'Saving...' : 'Save Story'}
      </button>
    </div>
  );
}
