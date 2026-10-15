import { API_BASE_URL } from '../../config/api';
import React, { useState, useRef } from 'react';
import { X, Camera, Trash2, CheckCircle2, AlertCircle, Loader2, ShieldCheck, Mail, Phone, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ProfileModal({ isOpen, onClose }) {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef(null);

  const [preview, setPreview] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !user) return null;

  // Process chosen image and resize via canvas to ~400px square for fast storage
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    // Size limit check (max 8MB before compression)
    if (file.size > 8 * 1024 * 1024) {
      setError('Image file is too large. Please select a photo under 8MB.');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Compress to JPEG with 0.85 quality
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
        setPreview(compressedBase64);
        saveAvatar(compressedBase64);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const saveAvatar = async (avatarData) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/avatar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          avatar: avatarData
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update profile image');
      }

      updateProfile({ avatar: avatarData });
      setSuccess('Profile picture updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Error updating avatar. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAvatar = () => {
    setPreview('');
    saveAvatar('');
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'pharmacist':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'doctor':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200 dark:border-purple-800';
      case 'receptionist':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm flex justify-center items-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-slate-100 dark:border-slate-700 relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            User Account & Profile
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your photo, credentials & identity on MedClinic
          </p>
        </div>

        {/* Avatar Upload Area */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full ring-4 ring-primary/20 overflow-hidden bg-gradient-to-br from-primary/10 to-teal-500/10 flex items-center justify-center shadow-lg">
              {preview ? (
                <img
                  src={preview}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-black text-primary">
                  {user.initials || user.name?.substring(0, 2).toUpperCase() || 'U'}
                </span>
              )}
            </div>

            {/* Click to trigger file input */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-primary hover:bg-primary-dark text-white flex items-center justify-center shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
              title="Upload new profile photo"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex items-center gap-2 mt-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="text-xs font-bold text-primary hover:underline cursor-pointer"
            >
              Upload New Photo
            </button>
            {preview && (
              <>
                <span className="text-slate-300 dark:text-slate-600">&bull;</span>
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  disabled={loading}
                  className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 size={12} />
                  <span>Remove</span>
                </button>
              </>
            )}
          </div>
          <span className="text-[10px] text-slate-400 mt-1">Recommended: Square JPG or PNG, up to 8MB</span>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="p-3 mb-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 mb-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* User Details Card */}
        <div className="bg-slate-50 dark:bg-slate-700/40 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/60 space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{user.title || 'MedClinic Member'}</p>
            </div>
            <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${getRoleBadgeColor(user.role)}`}>
              {user.role}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-600/60 space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-slate-400 shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-slate-400 shrink-0" />
                <span>{user.phone}</span>
              </div>
            )}
            {user.department && (
              <div className="flex items-center gap-2">
                <Briefcase size={14} className="text-slate-400 shrink-0" />
                <span>{user.department}</span>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
        >
          Done
        </button>

      </div>
    </div>
  );
}
