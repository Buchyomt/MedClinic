import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function GoogleAuthButton({ role = 'patient', onSuccess, text = 'signin_with' }) {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();
  const btnRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '534423448246-r2dpn2cuki4d329ejk7e57tam8ug8aem.apps.googleusercontent.com';

  useEffect(() => {
    // Dynamically load Google Identity Services
    const scriptId = 'google-gsi-client';
    const initGoogle = () => {
      if (window.google?.accounts?.id && btnRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          window.google.accounts.id.renderButton(btnRef.current, {
            theme: 'outline',
            size: 'large',
            type: 'standard',
            text: text, // 'signin_with' or 'signup_with'
            shape: 'pill',
            logo_alignment: 'left',
            width: btnRef.current.offsetWidth || 340,
          });
        } catch (err) {
          console.warn('Google GSI render error:', err);
        }
      }
    };

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.body.appendChild(script);
    } else {
      initGoogle();
    }
  }, [clientId, text]);

  const handleCredentialResponse = async (response) => {
    if (!response.credential) return;
    setLoading(true);
    setError('');
    try {
      const user = await googleLogin(response.credential, role);
      if (onSuccess) {
        onSuccess(user);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Google auth error:', err);
      setError(err.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  // Fallback demo/manual click in case client_id is still being configured
  const handleFallbackClick = async () => {
    // If real Google client is initialized and has a valid ID, trigger Google prompt
    if (window.google?.accounts?.id && !clientId.includes('fakeclientid')) {
      window.google.accounts.id.prompt();
      return;
    }

    // Demo fast-sign-in fallback for presentations
    setLoading(true);
    try {
      // Simulate payload for presentation if Google Console ID is not set yet
      const demoEmail = role === 'pharmacist' ? 'chinedu.google@yourhealthpharmacy.com' : 'patient.google@medclinic.com';
      const demoName = role === 'pharmacist' ? 'Pharm. Chinedu (Google)' : 'Dr. Adeola (Google)';
      const fakeToken = btoa(JSON.stringify({
        email: demoEmail,
        name: demoName,
        picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200',
        sub: 'google-demo-sub-123'
      }));

      const user = await googleLogin(fakeToken, role);
      if (onSuccess) onSuccess(user);
      else navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Google Sign-In failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {error && (
        <p className="text-xs text-rose-500 font-semibold mb-2 text-center">{error}</p>
      )}

      {loading ? (
        <div className="w-full py-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 shadow-xs">
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
          <span>Connecting with Google...</span>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center">
          {/* Official Google GSI Mount Target */}
          <div ref={btnRef} className="w-full flex justify-center [&>div]:w-full" />

          {/* Privacy browser tip */}
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 text-center leading-tight">
            Using Brave or privacy mode? If Google hangs, toggle Shields OFF or use standard Email below.
          </p>

          {/* Sleek styled fallback button if GSI button is waiting or needs custom trigger */}
          {(!clientId || clientId.includes('fakeclientid')) && (
            <button
              type="button"
              onClick={handleFallbackClick}
              className="w-full py-2.5 px-4 rounded-full border border-slate-200 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700/80 transition-all text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-3 shadow-xs cursor-pointer active:scale-98"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{text === 'signup_with' ? 'Sign up with Google' : 'Sign in with Google'}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
