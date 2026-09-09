import React, { useState, useEffect } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import {
  Pill,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Building2,
  MapPin,
  Coins,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Clock,
  Activity,
  Users,
  ShoppingCart,
  Receipt,
  FileSpreadsheet,
  Globe
} from 'lucide-react';
import { UserRole } from '../../types/pharmacy';

export const LoginView: React.FC = () => {
  const {
    login,
    loginWithPin,
    loginAsDemoUser,
    users,
    pharmacies,
    branches,
    currentPharmacy,
    currentBranch,
    addTreasuryTransaction
  } = usePharmacy();

  // Mode: 'credentials' | 'pin' | 'demo'
  const [activeTab, setActiveTab] = useState<'credentials' | 'pin' | 'demo'>('credentials');

  // Credentials form state
  const [emailOrPhone, setEmailOrPhone] = useState('haider@alnoorpharma.iq');
  const [password, setPassword] = useState('••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPharmacyId, setSelectedPharmacyId] = useState(currentPharmacy.id || 'pharmacy-1');
  const [selectedBranchId, setSelectedBranchId] = useState(currentBranch.id || 'branch-1');
  const [openingCashFloat, setOpeningCashFloat] = useState<number>(50000);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // PIN mode state
  const [selectedUserForPin, setSelectedUserForPin] = useState(users[1] || users[0]);
  const [pinDigits, setPinDigits] = useState('');
  const [pinError, setPinError] = useState('');

  // Forgot password modal
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);

  // Live Baghdad Clock
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Update branches when selected pharmacy changes
  const availableBranches = branches.filter(b => b.pharmacyId === selectedPharmacyId);

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!emailOrPhone.trim()) {
      setErrorMessage('يرجى إدخال البريد الإلكتروني أو رقم الهاتف');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const success = login(emailOrPhone, password, selectedPharmacyId, selectedBranchId);
      if (success) {
        // If opening float specified, add treasury log
        if (openingCashFloat > 0) {
          addTreasuryTransaction({
            type: 'inflow',
            category: 'رصيد افتتاح الصندوق',
            amount: openingCashFloat,
            description: `رصيد بداية الوردية الافتتاحي للكاشير (${emailOrPhone})`,
            paymentMethod: 'cash'
          });
        }
      } else {
        setErrorMessage('بيانات الدخول غير صحيحة. يمكنك النقر على الحسابات التجريبية أو الدخول السريع.');
        setIsSubmitting(false);
      }
    }, 400);
  };

  const handleNumpadClick = (num: string) => {
    if (pinDigits.length < 4) {
      const next = pinDigits + num;
      setPinDigits(next);
      setPinError('');

      if (next.length === 4) {
        setTimeout(() => {
          const success = loginWithPin(selectedUserForPin.id, next);
          if (!success) {
            setPinError('رمز الـ PIN غير صحيح! يمكنك استخدام رمز حسابك أو 1234');
          }
        }, 200);
      }
    }
  };

  const handlePinDelete = () => {
    setPinDigits(prev => prev.slice(0, -1));
    setPinError('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-3 sm:p-6 font-sans relative overflow-hidden" dir="rtl">
      {/* Subtle Background Lighting / Glow Effects */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Card Container */}
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px] z-10">

        {/* ================= LEFT / HERO BRANDING SECTION (5 Cols on Desktop) ================= */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-teal-950/60 to-slate-900 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-l border-slate-800 relative">
          
          {/* Top Logo & App Header */}
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
                <Pill className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black text-white tracking-wide">PharmaCloud</h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    v3.5 ERP
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">فارماكلاود • المنظومة السحابية الموحدة للصيدليات</p>
              </div>
            </div>

            {/* Platform Pitch */}
            <div className="mt-8 space-y-4">
              <h2 className="text-lg font-black text-white leading-snug">
                المنصة السحابية المعتمدة لإدارة الصيدليات ومستودعات التوزيع الدوائي في العراق
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                نظام صيدلاني ذكي يربط نقاط البيع السريعة، تتبع التواريخ والوجبات وفق معايير FEFO، كشوفات الموردين، وإغلاق الصندوق مع مزامنة سحابية فائقة الأمان.
              </p>
            </div>

            {/* Capability Feature Bullets */}
            <div className="mt-6 space-y-3 text-xs">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-200">نقطة بيع POS باركود تدعم الفواتير الحرارية 80mm والواتساب</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-200">تتبع ذكي لصلاحية الأدوية والتنبيه المبكر (FEFO Protocol)</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-200">إغلاق الشفت اليومي وجرد الصندوق ومطابقة العجز والفائض (Z-Report)</span>
              </div>
            </div>
          </div>

          {/* Bottom Live Status & Time */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 space-y-3">
            {/* Live Clock */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1.5 font-mono">
                <Clock className="w-3.5 h-3.5 text-teal-400" />
                <span>
                  {currentTime.toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
              <span>توقيت بغداد (GMT+3)</span>
            </div>

            {/* Server Status */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-300 font-bold">السيرفر السحابي متصل</span>
              </div>
              <span className="text-emerald-400/80 font-mono">18ms Latency</span>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
              <ShieldCheck className="w-3 h-3 text-teal-500" />
              <span>تشفير 256-Bit SSL • متوافق مع معايير وزارة الصحة ونقابة الصيادلة</span>
            </div>
          </div>
        </div>

        {/* ================= RIGHT / LOGIN FORM SECTION (7 Cols on Desktop) ================= */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-slate-900">
          
          <div>
            {/* Header & Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-xl font-black text-white">تسجيل الدخول للمنظومة</h3>
                <p className="text-xs text-slate-400 mt-0.5">اختر طريقة الدخول المناسبة لمحطة عملك</p>
              </div>

              {/* Navigation Tabs */}
              <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700/80 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('credentials');
                    setErrorMessage('');
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'credentials'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>البريد وكلمة السر</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('pin');
                    setErrorMessage('');
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'pin'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>رمز الـ PIN</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('demo');
                    setErrorMessage('');
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'demo'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>دخول تجريبي</span>
                </button>
              </div>
            </div>

            {/* Error Message Display */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* ================= TAB 1: CREDENTIALS LOGIN ================= */}
            {activeTab === 'credentials' && (
              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                
                {/* Pharmacy & Branch Selector Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-950/60 rounded-2xl border border-slate-800">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>الصيدلية / المؤسسة الدوائية</span>
                    </label>
                    <select
                      value={selectedPharmacyId}
                      onChange={e => {
                        const pId = e.target.value;
                        setSelectedPharmacyId(pId);
                        const bList = branches.filter(b => b.pharmacyId === pId);
                        if (bList.length > 0) setSelectedBranchId(bList[0].id);
                      }}
                      className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      {pharmacies.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.governorate})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-teal-400" />
                      <span>الفرع / محطة العمل</span>
                    </label>
                    <select
                      value={selectedBranchId}
                      onChange={e => setSelectedBranchId(e.target.value)}
                      className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      {availableBranches.map(b => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Email / Username Input with Quick Fill Pills */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-300">البريد الإلكتروني أو رقم الهاتف</label>
                    <span className="text-[10px] text-slate-400">انقر للتعبئة السريعة:</span>
                  </div>
                  
                  {/* Quick User Fill Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <button
                      type="button"
                      onClick={() => setEmailOrPhone('haider@alnoorpharma.iq')}
                      className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-[10px] text-emerald-400 border border-slate-700 font-bold transition"
                    >
                      د. حيدر (المالك)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEmailOrPhone('sara@alnoorpharma.iq')}
                      className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-[10px] text-teal-400 border border-slate-700 font-bold transition"
                    >
                      د. سارة (صيدلانية)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEmailOrPhone('ahmed@alnoorpharma.iq')}
                      className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-[10px] text-blue-400 border border-slate-700 font-bold transition"
                    >
                      أحمد (كاشير)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEmailOrPhone('superadmin@pharmacloud.iq')}
                      className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-[10px] text-purple-400 border border-slate-700 font-bold transition"
                    >
                      المدير العام
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={emailOrPhone}
                      onChange={e => setEmailOrPhone(e.target.value)}
                      placeholder="example@pharmacloud.iq أو 0770xxxxxxx"
                      className="w-full py-2.5 px-3.5 pr-10 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-300">كلمة المرور</label>
                    <button
                      type="button"
                      onClick={() => setIsForgotModalOpen(true)}
                      className="text-[11px] text-teal-400 hover:text-teal-300 hover:underline"
                    >
                      نسيت كلمة المرور؟
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full py-2.5 px-3.5 pr-10 pl-10 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-3 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Shift Opening Float & Remember Me */}
                <div className="pt-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-slate-400 text-[11px]">رصيد افتتاح الصندوق:</span>
                    <input
                      type="number"
                      min="0"
                      step="5000"
                      value={openingCashFloat}
                      onChange={e => setOpeningCashFloat(parseFloat(e.target.value) || 0)}
                      className="w-24 p-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-emerald-400 font-mono font-bold text-center"
                    />
                    <span className="text-slate-500 text-[10px]">د.ع</span>
                  </div>

                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-800 text-emerald-600 focus:ring-0 w-3.5 h-3.5"
                    />
                    <span className="text-[11px]">تذكر تسجيل دخولي</span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-98 text-white font-black text-xs shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>جاري التحقق والدخول...</span>
                      </div>
                    ) : (
                      <>
                        <span>تسجيل الدخول إلى المحطة</span>
                        <ArrowRight className="w-4 h-4 rotate-180" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* ================= TAB 2: QUICK PIN ACCESS ================= */}
            {activeTab === 'pin' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-400">
                  اختر حسابك وأدخل رمز الـ PIN المكون من 4 أرقام للاستلام السريع للوردية:
                </p>

                {/* Staff Selection Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {users.map(u => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        setSelectedUserForPin(u);
                        setPinDigits('');
                        setPinError('');
                      }}
                      className={`p-2.5 rounded-xl border text-right transition flex flex-col justify-between ${
                        selectedUserForPin.id === u.id
                          ? 'bg-emerald-950/50 border-emerald-500 ring-1 ring-emerald-500/50'
                          : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center font-bold text-xs text-white">
                          {u.name.slice(0, 2)}
                        </div>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-900 font-bold text-slate-300">
                          PIN: {u.pinCode || '1234'}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-white truncate">{u.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {u.role === 'super_admin' ? 'إدارة المنصة' : u.role === 'pharmacy_owner' ? 'المالك' : u.role === 'pharmacist' ? 'صيدلاني' : 'كاشير'}
                      </p>
                    </button>
                  ))}
                </div>

                {/* PIN Mask Dots */}
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                  <p className="text-xs font-bold text-slate-300 mb-2">
                    الرمز السري لـ: <span className="text-emerald-400">{selectedUserForPin.name}</span>
                  </p>

                  <div className="flex items-center justify-center gap-3 my-2" dir="ltr">
                    {[0, 1, 2, 3].map(i => (
                      <div
                        key={i}
                        className={`w-4 h-4 rounded-full border-2 transition-all ${
                          pinDigits.length > i
                            ? 'bg-emerald-500 border-emerald-500 scale-110 shadow-sm'
                            : 'border-slate-600 bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>

                  {pinError && (
                    <p className="text-rose-400 text-xs font-bold mt-1.5">{pinError}</p>
                  )}
                </div>

                {/* Touch Numpad */}
                <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto" dir="ltr">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleNumpadClick(num)}
                      className="h-11 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-black text-base transition border border-slate-700/60 shadow-xs flex items-center justify-center"
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setPinDigits('')}
                    className="h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold text-xs transition border border-slate-700/60"
                  >
                    مسح
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNumpadClick('0')}
                    className="h-11 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-black text-base transition border border-slate-700/60 shadow-xs flex items-center justify-center"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={handlePinDelete}
                    className="h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition border border-slate-700/60 flex items-center justify-center"
                  >
                    ←
                  </button>
                </div>
              </div>
            )}

            {/* ================= TAB 3: 1-CLICK DEMO PROFILES ================= */}
            {activeTab === 'demo' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">
                  يمكنك الدخول مباشرة بأي صلاحية وظيفية لتجربة كافة وحدات النظام دون الحاجة لكتابة كلمة سر:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Persona 1: Pharmacy Owner */}
                  <div
                    onClick={() => loginAsDemoUser('pharmacy_owner')}
                    className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-850 border border-slate-700 hover:border-emerald-500/80 cursor-pointer transition active:scale-98 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-black text-xs text-white">د. حيدر المعموري</h4>
                        <p className="text-[10px] text-emerald-400 font-bold">مالك الصيدلية والمدير العام</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                      الصلاحيات المالية الكاملة، شجرة الحسابات والأرباح، فواتير المشتريات، وإدارة الكادر والمخازن.
                    </p>
                  </div>

                  {/* Persona 2: Sales Cashier */}
                  <div
                    onClick={() => loginAsDemoUser('sales_cashier')}
                    className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-850 border border-slate-700 hover:border-blue-500/80 cursor-pointer transition active:scale-98 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition">
                        <ShoppingCart className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-black text-xs text-white">أحمد التميمي</h4>
                        <p className="text-[10px] text-blue-400 font-bold">كاشير نقطة البيع (POS)</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                      البيع السريع بالباركود، إصدار فواتير حرارية وواتساب، استلام النقد، وتسليم الصندوق.
                    </p>
                  </div>

                  {/* Persona 3: Pharmacist */}
                  <div
                    onClick={() => loginAsDemoUser('pharmacist')}
                    className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-850 border border-slate-700 hover:border-teal-500/80 cursor-pointer transition active:scale-98 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-teal-600/20 text-teal-400 group-hover:bg-teal-600 group-hover:text-white transition">
                        <Pill className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-black text-xs text-white">د. سارة العبيدي</h4>
                        <p className="text-[10px] text-teal-400 font-bold">صيدلانية ومسؤولة فرع الكرادة</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                      الصرف السريري، فحص التداخلات الدوائية، تدقيق الوجبات وتواريخ الانتهاء، وإدخال المشتريات.
                    </p>
                  </div>

                  {/* Persona 4: Super Admin */}
                  <div
                    onClick={() => loginAsDemoUser('super_admin')}
                    className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-850 border border-slate-700 hover:border-purple-500/80 cursor-pointer transition active:scale-98 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-black text-xs text-white">المهندس مصطفى عادل</h4>
                        <p className="text-[10px] text-purple-400 font-bold">مدير المنصة العام (Super Admin)</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                      التحكم بصيدليات محافظات العراق، تفعيل الاشتراكات الشهرية، الدعم الفني، وسجلات الرقابة والتفتيش.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Card Footer */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span>فارماكلاود ERP - بغداد، العراق</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <button
                type="button"
                onClick={() => alert('خط الدعم الفني المباشر للصيادلة في العراق: 07701234567')}
                className="hover:text-emerald-400 transition"
              >
                الدعم الفني المباشر
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => alert('إصدار النظام: PharmaCloud Enterprise 3.5 - متوافق مع كافة طابعات الباركود وأجهزة الجرد')}
                className="hover:text-emerald-400 transition"
              >
                معلومات التوافق
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-right animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white">
                <HelpCircle className="w-5 h-5 text-teal-400" />
                <h3 className="font-black text-sm">استعادة كلمة المرور أو رمز الـ PIN</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsForgotModalOpen(false);
                  setRecoverySent(false);
                }}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            {recoverySent ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-black text-white text-sm">تم إرسال تعليمات إعادة التعيين</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  تم إرسال رسالة SMS / واتساب تحتوي على رمز تحقق مؤقت إلى رقم الهاتف المسجل لصيدليتك.
                </p>
                <p className="text-[11px] text-amber-400 font-mono bg-amber-950/40 p-2 rounded-xl border border-amber-800/40">
                  كود التعيين السريع للاختبار التجريبي: 1234
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotModalOpen(false);
                    setRecoverySent(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  العودة لتسجيل الدخول
                </button>
              </div>
            ) : (
              <div className="py-4 space-y-4 text-xs">
                <p className="text-slate-400 leading-relaxed">
                  أدخل البريد الإلكتروني أو رقم الهاتف المرتبط بحسابك بالصيدلية لاستلام رمز إعادة التعيين الفوري:
                </p>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">البريد أو الهاتف المسجل</label>
                  <input
                    type="text"
                    value={recoveryEmail}
                    onChange={e => setRecoveryEmail(e.target.value)}
                    placeholder="haider@alnoorpharma.iq"
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <p className="font-bold text-teal-400">ملاحظة للكادر والصيادلة:</p>
                  <p>يمكن لمالك الصيدلية أو المشرف إعادة تعيين رمز PIN الخاص بك فوراً من شاشة إدارة الموظفين والصلاحيات.</p>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setRecoverySent(true)}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
                  >
                    إرسال رمز التعيين (SMS / WhatsApp)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
