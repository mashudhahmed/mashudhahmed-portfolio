'use client';
import { useState, useEffect } from 'react';
import { Upload, X, Loader2, FileText, Link as LinkIcon, Check, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentImage?: string;
  folder?: string;
  accept?: string;
  label?: string;
  allowUrlInput?: boolean;
}

export default function ImageUpload({ 
  onUpload, 
  currentImage = '', 
  folder = 'portfolio',
  accept = 'image/*',
  label = 'Upload File',
  allowUrlInput = true,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');
  const [urlInput, setUrlInput] = useState(currentImage || '');
  const [showUrlField, setShowUrlField] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Keep state in sync when parent data loads asynchronously
  useEffect(() => {
    setPreview(currentImage || '');
    setUrlInput(currentImage || '');
  }, [currentImage]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setSuccessMsg('');

    // Validate file type
    if (accept === 'application/pdf' && file.type !== 'application/pdf') {
      setError('Please select a valid PDF file');
      return;
    }
    
    if (accept === 'image/*' && !file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WEBP)');
      return;
    }

    // Validate file size (max 5MB for images, 15MB for PDFs)
    const maxSize = accept === 'application/pdf' ? 15 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`File size exceeds limit (${maxSize / (1024 * 1024)}MB)`);
      return;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      setError(
        'Cloudinary Cloud Name is not configured in .env.local. Please add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME or paste a direct URL below.'
      );
      setShowUrlField(true);
      return;
    }

    setUploading(true);

    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'portfolio_preset';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', folder);

    try {
      // Use auto/upload to support images, PDFs, and raw assets safely
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.secure_url) {
        setPreview(data.secure_url);
        setUrlInput(data.secure_url);
        onUpload(data.secure_url);
        setSuccessMsg(`Uploaded: ${file.name}`);
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        const errorMsg = data?.error?.message || 'Upload failed. Check your Cloudinary preset settings.';
        setError(errorMsg);
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setError('Network error while uploading. Please check connection or paste URL manually.');
    } finally {
      setUploading(false);
      // Reset input value so same file can be re-selected if needed
      e.target.value = '';
    }
  };

  const handleApplyUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      handleClear();
      return;
    }
    setError('');
    setPreview(trimmed);
    onUpload(trimmed);
    setSuccessMsg('URL applied');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleClear = () => {
    setPreview('');
    setUrlInput('');
    setError('');
    setSuccessMsg('');
    onUpload('');
  };

  const isPdf = preview && (preview.toLowerCase().endsWith('.pdf') || accept === 'application/pdf');

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        {/* Preview thumbnail */}
        {preview && (
          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-800 border border-gray-700 flex-shrink-0">
            {isPdf ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-red-500/10 text-red-400 p-1">
                <FileText className="w-6 h-6" />
                <span className="text-[9px] font-mono mt-0.5 truncate max-w-full">PDF</span>
              </div>
            ) : (
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full h-full object-cover"
                onError={() => {
                  // Fallback if image fails to render
                }}
              />
            )}
            <button
              type="button"
              onClick={handleClear}
              title="Remove"
              className="absolute top-0 right-0 p-1 bg-red-600/80 hover:bg-red-600 text-white rounded-bl transition"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Upload file button */}
        <label className={`cursor-pointer px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 text-sm font-medium transition inline-flex items-center gap-2 ${
          uploading ? 'opacity-60 cursor-not-allowed' : ''
        }`}>
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin text-green-400" />
          ) : (
            <Upload className="w-4 h-4 text-green-400" />
          )}
          {uploading ? 'Uploading...' : preview ? 'Change File' : label}
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>

        {/* Toggle Direct URL Input */}
        {allowUrlInput && (
          <button
            type="button"
            onClick={() => setShowUrlField(!showUrlField)}
            className="px-3 py-2 rounded-lg bg-gray-800/60 hover:bg-gray-800 border border-gray-700/60 text-gray-400 hover:text-white text-xs transition inline-flex items-center gap-1.5"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            {showUrlField ? 'Hide URL Input' : 'Enter URL / Path'}
          </button>
        )}
      </div>

      {/* Direct URL / Path Input Field */}
      {showUrlField && allowUrlInput && (
        <div className="flex gap-2 items-center pt-1">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleApplyUrl();
              }
            }}
            placeholder={accept === 'application/pdf' ? 'e.g. /resume.pdf or https://...' : 'e.g. https://... or /image.png'}
            className="flex-1 px-3 py-1.5 rounded-lg bg-black/60 border border-gray-700 text-white text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-3 py-1.5 rounded-lg bg-green-600/80 hover:bg-green-600 text-white text-xs font-medium transition inline-flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5" />
            Apply
          </button>
        </div>
      )}

      {/* Success Notification */}
      {successMsg && (
        <div className="flex items-center gap-1.5 text-green-400 text-xs">
          <Check className="w-3.5 h-3.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div className="flex items-start gap-1.5 text-red-400 text-xs bg-red-500/10 border border-red-500/20 p-2 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Helper text */}
      <p className="text-gray-500 text-[11px]">
        {accept === 'application/pdf' 
          ? 'Supports PDF files up to 15MB, or enter direct link.' 
          : 'Supports JPG, PNG, WEBP up to 5MB, or enter image URL.'}
      </p>
    </div>
  );
}