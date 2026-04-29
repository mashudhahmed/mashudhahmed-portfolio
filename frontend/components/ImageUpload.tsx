'use client';
import { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentImage?: string;
  folder?: string;
}

export default function ImageUpload({ onUpload, currentImage, folder = 'portfolio' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'portfolio_preset');
    formData.append('folder', 'portfolio');
    

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        setPreview(data.secure_url);
        onUpload(data.secure_url);
      } else {
        setError('Upload failed. Please try again.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Network error. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        {/* Preview */}
        {preview && (
          <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-800 border border-gray-700">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => {
                setPreview('');
                onUpload('');
              }}
              className="absolute top-0 right-0 p-0.5 bg-red-500 rounded-bl-lg hover:bg-red-600 transition"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        )}

        {/* Upload Button */}
        <label className={`cursor-pointer px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition flex items-center gap-2 ${
          uploading ? 'opacity-50 cursor-not-allowed' : ''
        }`}>
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {uploading ? 'Uploading...' : preview ? 'Change Image' : 'Upload Image'}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}
      <p className="text-gray-500 text-xs">Supports JPG, PNG, WEBP (max 5MB)</p>
    </div>
  );
}