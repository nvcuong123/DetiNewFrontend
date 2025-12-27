
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { X, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, Loader2, Globe } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('United Arab Emirates');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API Call
    setTimeout(() => {
      const mockUser: UserProfile = {
        id: 'USR-' + Math.floor(Math.random() * 10000),
        name: method === 'email' ? email.split('@')[0] : 'User ' + phone.slice(-4),
        email: method === 'email' ? email : undefined,
        phone: method === 'phone' ? phone : undefined,
        kycStatus: 'Unverified',
        tier: 0,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`
      };
      setLoading(false);
      onLogin(mockUser);
      onClose();
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
       const mockUser: UserProfile = {
        id: 'GOOG-' + Math.floor(Math.random() * 10000),
        name: 'Google User',
        email: 'user@gmail.com',
        kycStatus: 'Unverified',
        tier: 0,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Google'
      };
      setLoading(false);
      onLogin(mockUser);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>

      {/* Modal Content with glassmorphism */}
      <div className="relative bg-[#181920]/90 backdrop-blur-xl border border-white/10 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header Image/Banner - Updated Background for Contrast */}
        <div className="h-32 bg-[#111218] relative overflow-hidden border-b border-white/5">
           {/* Subtle mesh to keep it premium but dark */}
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-deti-primary/20 via-[#111218] to-[#111218]"></div>
           <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-deti-primary/10 rounded-full blur-3xl"></div>
           
           <div className="absolute top-1/2 -translate-y-1/2 left-8">
              <img src="https://i.postimg.cc/3Rj9YpjK/Group-83.png" alt="Logo" className="h-16 w-auto object-contain drop-shadow-lg" />
           </div>
           
           <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md">
              <X size={18} />
           </button>
        </div>

        <div className="p-8">
           <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-1">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
              <p className="text-deti-subtext text-sm">
                {mode === 'login' ? 'Enter your credentials to access your account.' : 'Join the world\'s premium crypto exchange.'}
              </p>
           </div>

           {/* Method Tabs - Updated Active Color */}
           <div className="flex p-1 bg-white/5 rounded-xl mb-6 border border-white/10">
              <button 
                onClick={() => setMethod('email')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${method === 'email' ? 'bg-deti-primary text-white shadow-glow' : 'text-deti-subtext hover:text-white'}`}
              >
                Email
              </button>
              <button 
                onClick={() => setMethod('phone')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${method === 'phone' ? 'bg-deti-primary text-white shadow-glow' : 'text-deti-subtext hover:text-white'}`}
              >
                Phone
              </button>
           </div>

           <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Country Selection - Only visible during Registration */}
              {mode === 'register' && (
                <div className="space-y-1">
                   <label className="text-xs font-bold text-deti-subtext uppercase ml-1">Country of Residence</label>
                   <div className="relative group">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-deti-subtext group-focus-within:text-deti-primary transition-colors" />
                      <select 
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:border-deti-primary outline-none transition-all appearance-none cursor-pointer"
                      >
                         <option className="bg-[#181920]">United Arab Emirates</option>
                         <option className="bg-[#181920]">United States</option>
                         <option className="bg-[#181920]">United Kingdom</option>
                         <option className="bg-[#181920]">Vietnam</option>
                         <option className="bg-[#181920]">Singapore</option>
                         <option className="bg-[#181920]">Germany</option>
                         <option className="bg-[#181920]">Japan</option>
                         <option className="bg-[#181920]">Canada</option>
                         <option className="bg-[#181920]">Other</option>
                      </select>
                   </div>
                </div>
              )}

              {method === 'email' ? (
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-deti-subtext uppercase ml-1">Email Address</label>
                    <div className="relative group">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-deti-subtext group-focus-within:text-deti-primary transition-colors" />
                       <input 
                         type="email" 
                         required
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:border-deti-primary outline-none transition-all"
                         placeholder="name@example.com"
                       />
                    </div>
                 </div>
              ) : (
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-deti-subtext uppercase ml-1">Phone Number</label>
                    <div className="relative group">
                       <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-deti-subtext group-focus-within:text-deti-primary transition-colors" />
                       <input 
                         type="tel" 
                         required
                         value={phone}
                         onChange={(e) => setPhone(e.target.value)}
                         className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:border-deti-primary outline-none transition-all"
                         placeholder="+1 234 567 8900"
                       />
                    </div>
                 </div>
              )}

              <div className="space-y-1">
                 <label className="text-xs font-bold text-deti-subtext uppercase ml-1">Password</label>
                 <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-deti-subtext group-focus-within:text-deti-primary transition-colors" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-3 text-sm text-white focus:border-deti-primary outline-none transition-all"
                      placeholder="••••••••"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-deti-subtext hover:text-white"
                    >
                       {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                 </div>
              </div>

              {mode === 'login' && (
                 <div className="flex justify-end">
                    <a href="#" className="text-xs text-deti-primary hover:text-deti-secondary font-medium transition-colors">Forgot Password?</a>
                 </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-gradient-brand text-white rounded-xl font-bold shadow-glow hover:shadow-glow-gold transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                 {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                    <>
                       {mode === 'login' ? 'Log In' : 'Create Account'} <ArrowRight size={18} />
                    </>
                 )}
              </button>
           </form>

           <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
              <span className="relative bg-[#181920] px-4 text-xs text-deti-subtext rounded">OR CONTINUE WITH</span>
           </div>

           <button 
             onClick={handleGoogleLogin}
             disabled={loading}
             className="w-full py-3 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-3 group"
           >
              {/* Google SVG */}
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
           </button>

           <div className="mt-6 text-center text-sm text-deti-subtext">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-deti-primary font-bold hover:underline"
              >
                 {mode === 'login' ? 'Sign Up' : 'Log In'}
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};
