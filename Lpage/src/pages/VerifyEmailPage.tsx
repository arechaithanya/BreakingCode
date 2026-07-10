import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, RefreshCcw, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

const VerifyEmailPage: React.FC = () => {
  const [isResending, setIsResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    setIsResending(true);
    try {
      // In a real app, you'd get the email from the current session or a state
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        await supabase.auth.resend({
          type: 'signup',
          email: user.email,
        });
        setResent(true);
        setTimeout(() => setResent(false), 5000);
      }
    } catch (err) {
      console.error('Error resending verification email:', err);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="glass p-10 rounded-3xl border border-white/10 shadow-2xl text-center">
          <div className="w-20 h-20 bg-[#00ff88]/10 rounded-full flex items-center justify-center mx-auto mb-8 relative">
            <Mail className="w-10 h-10 text-[#00ff88]" />
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-[#00ff88] rounded-full blur-xl -z-10"
            />
          </div>

          <h1 className="text-2xl font-bold text-white mb-4">Check your email</h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            We've sent a verification link to your email address. 
            Please click the link to verify your account and access the dashboard.
          </p>

          <div className="space-y-4">
            <button
              onClick={handleResend}
              disabled={isResending || resent}
              className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                resent 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
              }`}
            >
              {resent ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Email Resent!
                </>
              ) : (
                <>
                  <RefreshCcw className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`} />
                  {isResending ? 'Sending...' : 'Resend Verification Email'}
                </>
              )}
            </button>

            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>

          <p className="mt-10 text-[10px] text-gray-600 uppercase tracking-widest font-mono">
            Link expires in 24 hours
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;
