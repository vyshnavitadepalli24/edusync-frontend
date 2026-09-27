import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, ArrowRight, Sparkles, School, GraduationCap, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { useToast } from '../../context/ToastContext';

interface LoginPageProps {
  onLoginSuccess: (role: UserRole) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { login, loginAsDemo } = useAuth();
  const { addToast } = useToast();

  const [selectedRole, setSelectedRole] = useState<UserRole>('principal');
  const [email, setEmail] = useState('principal@edunexus.edu');
  const [password, setPassword] = useState('nexus@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleTabChange = (role: UserRole) => {
    setSelectedRole(role);
    setError(null);
    if (role === 'principal') {
      setEmail('principal@edunexus.edu');
      setPassword('nexus@2026');
    } else if (role === 'teacher') {
      setEmail('anitha.v@edunexus.edu');
      setPassword('teacher@2026');
    } else {
      setEmail('suresh.kumar@gmail.com');
      setPassword('parent@2026');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide valid credentials.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await login(email, password, selectedRole);
      addToast({
        type: 'success',
        title: 'Authentication Successful',
        message: `Welcome back to EduNexus ERP as ${selectedRole.toUpperCase()}.`,
      });
      onLoginSuccess(selectedRole);
    } catch {
      setError('Invalid credentials or authorization level.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoContinue = async (demoRole: UserRole) => {
    setIsLoading(true);
    try {
      await loginAsDemo(demoRole);
      addToast({
        type: 'success',
        title: `Signed in as ${demoRole.toUpperCase()}`,
        message: 'Loaded simulated institutional records and AI anomaly telemetry.',
      });
      onLoginSuccess(demoRole);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background architectural grid pattern */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="w-full max-w-md z-10 space-y-6">
        {/* Brand Banner */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>AI-Augmented Parallel ERP Architecture</span>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
              EN
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">EduNexus</h1>
          </div>
          <p className="text-xs text-slate-400 font-medium">One Connected Platform for Smarter Education</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
          {/* Role Selection Tabs */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              Select Workspace Portal
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-700/60">
              <button
                type="button"
                onClick={() => handleRoleTabChange('principal')}
                className={`py-2 text-xs font-semibold rounded-lg transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  selectedRole === 'principal'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <School className="w-4 h-4" />
                <span>Principal</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleTabChange('teacher')}
                className={`py-2 text-xs font-semibold rounded-lg transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  selectedRole === 'teacher'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Teacher</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleTabChange('parent')}
                className={`py-2 text-xs font-semibold rounded-lg transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  selectedRole === 'parent'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Parent</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Institutional Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs text-slate-100 bg-slate-900/60 border border-slate-700 rounded-lg placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="name@edunexus.edu"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">Access Key / Password</label>
                <button
                  type="button"
                  onClick={() =>
                    addToast({
                      type: 'info',
                      title: 'Credential Reset',
                      message: 'Password reset token dispatched to registered institutional phone/email.',
                    })
                  }
                  className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-3.5 pr-10 py-2.5 text-xs text-slate-100 bg-slate-900/60 border border-slate-700 rounded-lg placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
                />
                <span>Remember this terminal</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to {selectedRole.toUpperCase()}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="pt-4 border-t border-slate-700/60 space-y-2.5">
            <div className="text-center">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                1-Click Internship Evaluator Access
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleDemoContinue('principal')}
                className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-200 border border-slate-600/60 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>Continue as Principal (Dr. Ramesh)</span>
                <span className="text-[10px] font-mono text-blue-400 font-bold">Admin Portal →</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoContinue('teacher')}
                className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-200 border border-slate-600/60 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>Continue as Teacher (Prof. Anitha)</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">Faculty Portal →</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoContinue('parent')}
                className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-200 border border-slate-600/60 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>Continue as Parent (Suresh Kumar)</span>
                <span className="text-[10px] font-mono text-purple-400 font-bold">Parent Portal →</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-500 space-y-1">
          <p>EduNexus v2.4 · Team 3: AI-ERP Beta Prototype</p>
          <p className="text-[11px] text-slate-500">Forenoon (FN) & Afternoon (AN) Session Synchronization Active</p>
        </div>
      </div>
    </div>
  );
};
