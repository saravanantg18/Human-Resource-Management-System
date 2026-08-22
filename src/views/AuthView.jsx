import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHR } from '../context/HRContext';
import {
  Lock,
  Mail,
  User,
  BadgeCheck,
  ShieldCheck,
  Building2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  KeyRound,
  UserCheck,
  Briefcase
} from 'lucide-react';

export default function AuthView() {
  const { login, register, loginAsRole } = useAuth();
  const { addEmployee } = useHR();

  // Active Login Portal: 'Employee' or 'HR' (Admin)
  const [activePortal, setActivePortal] = useState('Employee'); // 'Employee' | 'HR'
  const [isSignUp, setIsSignUp] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [position, setPosition] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Email verification simulation
  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [pendingUserData, setPendingUserData] = useState(null);

  // Password validation rule check
  const passwordRules = {
    length: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
  const isPasswordValid = Object.values(passwordRules).every(Boolean);

  const handlePortalSwitch = (portal) => {
    setActivePortal(portal);
    setErrorMsg('');
    setSuccessMsg('');
    // Auto-fill demo credentials if standard sign in
    if (portal === 'HR') {
      setEmail('admin@dayflow.com');
      setPassword('Password123!');
    } else {
      setEmail('alex@dayflow.com');
      setPassword('Password123!');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (isSignUp) {
      if (!name || !email || !password || !employeeId) {
        setErrorMsg('Please fill in all required registration fields.');
        return;
      }
      if (!isPasswordValid) {
        setErrorMsg('Password does not meet required security criteria.');
        return;
      }

      // Step 1 of Sign Up: Trigger Email Verification
      setPendingUserData({
        name,
        email,
        password,
        role: activePortal, // 'HR' for Admin, 'Employee' for Employee
        employeeId,
        department,
        position: position || (activePortal === 'HR' ? 'HR Manager' : 'Software Engineer')
      });
      setVerificationStep(true);
      setSuccessMsg(`Verification code sent to ${email}. Check your inbox!`);
    } else {
      if (!email || !password) {
        setErrorMsg('Please enter both email and password.');
        return;
      }
      const res = login(email, password);
      if (!res.success) {
        setErrorMsg(res.message);
      }
    }
  };

  const handleVerifyAndComplete = (e) => {
    e.preventDefault();
    if (verificationCode.trim() !== '123456') {
      setErrorMsg('Invalid verification code! Use code "123456" for demo verification.');
      return;
    }

    // Register user in AuthContext
    const res = register(pendingUserData);
    if (!res.success) {
      setErrorMsg(res.message);
      setVerificationStep(false);
      return;
    }

    // Also add to HRContext employee store
    addEmployee(pendingUserData);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Dayflow Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-extrabold text-3xl shadow-xl shadow-purple-500/30 mb-3">
            D
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Dayflow <span className="text-purple-400 font-normal">HRMS</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium italic">
            Every workday, perfectly aligned.
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          
          {/* Explicit Role Portal Switcher (Admin vs Employee) */}
          <div className="mb-6">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 text-center">
              Select Login Portal
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => handlePortalSwitch('Employee')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activePortal === 'Employee'
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                Employee Portal
              </button>

              <button
                type="button"
                onClick={() => handlePortalSwitch('HR')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activePortal === 'HR'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Admin / HR Portal
              </button>
            </div>

            {/* Portal Badge Indicator */}
            <div className="mt-3 text-center">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${
                activePortal === 'HR'
                  ? 'bg-purple-950/80 text-purple-300 border-purple-800'
                  : 'bg-indigo-950/80 text-indigo-300 border-indigo-800'
              }`}>
                {activePortal === 'HR' ? <ShieldCheck className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                {activePortal === 'HR' ? 'Admin / HR Officer Portal Active' : 'Regular Employee Portal Active'}
              </span>
            </div>
          </div>

          {/* Quick Demo Login Option */}
          <div className="mb-6 bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1 text-purple-400">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                1-Click Quick Demo Login
              </span>
              <span className="text-[10px] text-slate-500 font-normal">Pre-configured accounts</span>
            </div>
            <button
              type="button"
              onClick={() => loginAsRole(activePortal)}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-700"
            >
              Log in as Demo {activePortal === 'HR' ? 'Admin (Sarah Jenkins)' : 'Employee (Alex Morgan)'}
              <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
            </button>
          </div>

          {/* Verification Step Form */}
          {verificationStep ? (
            <form onSubmit={handleVerifyAndComplete} className="space-y-4">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-500 text-purple-400 flex items-center justify-center mx-auto">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Email Verification Required</h3>
                <p className="text-xs text-slate-300">
                  Enter the 6-digit verification code sent to <strong className="text-purple-400">{pendingUserData?.email}</strong>.
                </p>
                <p className="text-[11px] text-amber-400 bg-amber-950/40 border border-amber-800/60 p-2 rounded-xl">
                  Demo Code: <strong>123456</strong>
                </p>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 123456"
                  className="w-full text-center tracking-widest text-2xl font-mono py-3 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-purple-500 outline-none"
                />
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-purple-600/30 hover:opacity-90 transition-opacity"
              >
                Verify & Create Account
              </button>
            </form>
          ) : (
            /* Main Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Sign In vs Sign Up Tab */}
              <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 mb-4">
                <button
                  type="button"
                  onClick={() => { setIsSignUp(false); setErrorMsg(''); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    !isSignUp ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setIsSignUp(true); setErrorMsg(''); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    isSignUp ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Create {activePortal === 'HR' ? 'Admin' : 'Employee'} Account
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  {successMsg}
                </div>
              )}

              {/* Sign Up Fields */}
              {isSignUp && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 text-white text-xs rounded-xl focus:border-purple-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Employee ID</label>
                    <div className="relative">
                      <BadgeCheck className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder={activePortal === 'HR' ? 'ADM-2001' : 'EMP-1005'}
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 text-white text-xs rounded-xl focus:border-purple-500 outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 text-white text-xs rounded-xl focus:border-purple-500 outline-none"
                      >
                        <option value="Engineering">Engineering</option>
                        <option value="Human Resources">Human Resources</option>
                        <option value="Design">Design</option>
                        <option value="Infrastructure">Infrastructure</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Position Title</label>
                      <input
                        type="text"
                        placeholder={activePortal === 'HR' ? 'HR Manager' : 'Full Stack Dev'}
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 text-white text-xs rounded-xl focus:border-purple-500 outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Work Email Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder={activePortal === 'HR' ? 'admin@dayflow.com' : 'employee@dayflow.com'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 text-white text-xs rounded-xl focus:border-purple-500 outline-none"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 text-white text-xs rounded-xl focus:border-purple-500 outline-none"
                  />
                </div>
              </div>

              {/* Password Rules check on sign up */}
              {isSignUp && password.length > 0 && (
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1 text-[11px]">
                  <p className="font-semibold text-slate-400 mb-1">Password Security Rules:</p>
                  <div className="grid grid-cols-2 gap-1">
                    <span className={passwordRules.length ? 'text-emerald-400' : 'text-slate-500'}>
                      ✓ 8+ Characters
                    </span>
                    <span className={passwordRules.hasUpper ? 'text-emerald-400' : 'text-slate-500'}>
                      ✓ Uppercase Letter
                    </span>
                    <span className={passwordRules.hasNumber ? 'text-emerald-400' : 'text-slate-500'}>
                      ✓ Number (0-9)
                    </span>
                    <span className={passwordRules.hasSpecial ? 'text-emerald-400' : 'text-slate-500'}>
                      ✓ Special Character
                    </span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-purple-600/30 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <span>{isSignUp ? 'Proceed to Email Verification' : `Sign In to ${activePortal === 'HR' ? 'Admin' : 'Employee'} Portal`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          )}

        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Dayflow HRMS &copy; 2026. Role-based Authentication System.
        </p>

      </div>
    </div>
  );
}
