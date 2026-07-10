import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Clock } from 'lucide-react';
import breakingCodeLogo from '../assets/breaking-code-logo.jpeg';
import { supabase } from '../services/supabaseClient';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LOCKOUT_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [lockoutTimeLeft, setLockoutTimeLeft] = useState<number>(0);
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  // Check for lockout on mount and every second
  useEffect(() => {
    const checkLockout = () => {
      const lockoutTimestamp = localStorage.getItem('login_lockout_until');
      if (lockoutTimestamp) {
        const remaining = parseInt(lockoutTimestamp) - Date.now();
        if (remaining > 0) {
          setLockoutTimeLeft(Math.ceil(remaining / 1000));
        } else {
          localStorage.removeItem('login_lockout_until');
          localStorage.removeItem('login_attempts');
          setLockoutTimeLeft(0);
        }
      }
    };

    checkLockout();
    const timer = setInterval(checkLockout, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleFailedAttempt = () => {
    const attempts = parseInt(localStorage.getItem('login_attempts') || '0') + 1;
    localStorage.setItem('login_attempts', attempts.toString());

    if (attempts >= LOCKOUT_ATTEMPTS) {
      const lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
      localStorage.setItem('login_lockout_until', lockoutUntil.toString());
      setLockoutTimeLeft(LOCKOUT_DURATION_MS / 1000);
    }
  };

  const onSubmit = async (data: LoginFormValues) => {
    if (lockoutTimeLeft > 0) return;

    setIsSubmitting(true);
    setAuthError(null);

    try {
      // DEMO MODE BYPASS for user testing
      if (data.email === 'tester@breakingcode.com' && data.password === 'password123') {
        localStorage.setItem('breaking_code_demo_mode', 'true');
        setTimeout(() => {
          navigate(from, { replace: true });
          window.location.reload(); // Force reload to trigger AuthContext logic
        }, 800);
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        handleFailedAttempt();
        throw new Error('Invalid credentials'); // Generic error for security
      }

      // Success - reset attempts
      localStorage.removeItem('login_attempts');
      navigate(from, { replace: true });
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin + '/dashboard',
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setAuthError(err.message || 'Github login failed');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 font-sans">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-[#00ff88]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 -left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-4 group">
            <img 
              src={breakingCodeLogo} 
              alt="Breaking Code Logo" 
              className="w-12 h-12 rounded-xl object-cover border border-white/10 shadow-[0_0_20px_rgba(0,255,136,0.15)] group-hover:scale-110 transition-transform"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className="text-2xl font-bold tracking-tight text-white">Breaking Code</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-gray-400">Continue your path to mastery</p>
        </div>

        <div className="glass p-8 rounded-3xl border border-white/10 shadow-2xl">
          {lockoutTimeLeft > 0 && (
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/50 rounded-xl flex items-center gap-3 text-amber-400 text-sm">
              <Clock className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-bold">Account temporarily locked</p>
                <p className="text-xs opacity-80">Too many failed attempts. Try again in {formatTime(lockoutTimeLeft)}</p>
              </div>
            </div>
          )}

          {authError && lockoutTimeLeft === 0 && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  {...register('email')}
                  className={`w-full bg-white/5 border ${errors.email ? 'border-red-500/50' : 'border-white/10'} rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[#00ff88]/50 transition-colors placeholder:text-gray-600`}
                  placeholder="name@company.com"
                  disabled={lockoutTimeLeft > 0}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-400 ml-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 ml-1">
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">Password</label>
                <Link to="/forgot-password" className="text-[10px] text-[#00ff88] hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className={`w-full bg-white/5 border ${errors.password ? 'border-red-500/50' : 'border-white/10'} rounded-xl py-2.5 pl-10 pr-10 text-white focus:outline-none focus:border-[#00ff88]/50 transition-colors placeholder:text-gray-600`}
                  placeholder="••••••••"
                  disabled={lockoutTimeLeft > 0}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400 ml-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-center">
              <input
                {...register('rememberMe')}
                type="checkbox"
                id="rememberMe"
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#00ff88] focus:ring-[#00ff88] focus:ring-offset-0 transition-all cursor-pointer"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-400 cursor-pointer select-none">Remember me</label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || lockoutTimeLeft > 0}
              className="w-full bg-[#00ff88] hover:bg-[#00dd77] text-black font-bold py-3 rounded-xl shadow-[0_0_20px_rgba(0,255,136,0.2)] hover:shadow-[0_0_30px_rgba(0,255,136,0.4)] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  Log In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0a0a0a] px-2 text-gray-500 font-mono">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGithubLogin}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-2.5 rounded-xl transition-all flex items-center justify-center gap-3 group"
          >
            <div className="w-5 h-5 group-hover:scale-110 transition-transform flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.841 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </div>
            Sign in with GitHub
          </button>

          <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#00ff88] hover:underline font-medium">Sign up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
