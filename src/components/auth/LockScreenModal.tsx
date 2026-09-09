import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Lock, KeyRound, LogOut, ShieldCheck, AlertCircle } from 'lucide-react';

export const LockScreenModal: React.FC = () => {
  const { currentUser, currentPharmacy, currentBranch, unlockScreen, logout } = usePharmacy();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pin) {
      setError('يرجى إدخال رمز المرور أو الـ PIN');
      return;
    }
    setIsSubmitting(true);
    setError('');

    setTimeout(() => {
      const success = unlockScreen(pin);
      if (!success) {
        setError('رمز الـ PIN غير صحيح! يمكنك استخدام 1234 أو رمز حسابك');
        setIsSubmitting(false);
      }
    }, 300);
  };

  const handleNumpadClick = (num: string) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      setError('');
      if (newPin.length === 4) {
        setTimeout(() => {
          unlockScreen(newPin);
        }, 200);
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-right">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 p-6 text-white text-center relative">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto mb-3 text-amber-400 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-black tracking-wide">شاشة المحطة مقفلة مؤقتاً</h2>
          <p className="text-xs text-slate-300 mt-1">لحماية بيانات المرضى والمبيعات أثناء ابتعادك عن الشاشة</p>
        </div>

        {/* User Card */}
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-md">
                {currentUser.name.slice(0, 2)}
              </div>
              <div>
                <p className="text-xs font-black text-slate-900">{currentUser.name}</p>
                <p className="text-[11px] text-slate-500">{currentPharmacy.name} - {currentBranch.name}</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
              {currentUser.role === 'super_admin'
                ? 'مدير المنصة'
                : currentUser.role === 'pharmacy_owner'
                ? 'المالك'
                : currentUser.role === 'pharmacist'
                ? 'صيدلاني'
                : 'كاشير'}
            </span>
          </div>

          {/* PIN Input Display */}
          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="text-center">
              <label className="block text-xs font-bold text-slate-600 mb-2">
                أدخل رمز PIN السريع لإلغاء القفل (الافتراضي: {currentUser.pinCode || '1234'})
              </label>

              {/* Dots indicator */}
              <div className="flex items-center justify-center gap-3 my-2" dir="ltr">
                {[0, 1, 2, 3].map(i => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full border-2 transition-all ${
                      pin.length > i
                        ? 'bg-emerald-600 border-emerald-600 scale-110 shadow-xs'
                        : 'border-slate-300 bg-slate-100'
                    }`}
                  />
                ))}
              </div>

              {error && (
                <p className="text-rose-600 text-[11px] font-bold mt-2 flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{error}</span>
                </p>
              )}
            </div>

            {/* Touch Numpad */}
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto" dir="ltr">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleNumpadClick(num)}
                  className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-black text-lg transition shadow-xs flex items-center justify-center"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPin('')}
                className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold text-xs transition"
              >
                مسح
              </button>
              <button
                type="button"
                onClick={() => handleNumpadClick('0')}
                className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-black text-lg transition shadow-xs flex items-center justify-center"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition flex items-center justify-center"
              >
                ←
              </button>
            </div>

            {/* Submit & Switch User Actions */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleUnlock()}
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-xs shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>{isSubmitting ? 'جاري التحقق...' : 'إلغاء القفل واستئناف العمل'}</span>
              </button>

              <button
                type="button"
                onClick={logout}
                className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs transition flex items-center justify-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span>تسجيل الخروج أو تبديل الحساب بالكامل</span>
              </button>
            </div>
          </form>
        </div>

        {/* Security watermark footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>منظومة فارماكلاود ERP مشفرة ومؤمنة بأعلى المعايير الصيدلانية</span>
        </div>
      </div>
    </div>
  );
};
