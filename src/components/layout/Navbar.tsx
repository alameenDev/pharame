import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { UserRole } from '../../types/pharmacy';
import {
  Building2,
  GitBranch,
  ShieldCheck,
  UserCheck,
  ShoppingCart,
  Bell,
  Coins,
  AlertTriangle,
  Clock,
  PackageX,
  FileSpreadsheet,
  LogOut,
  ChevronDown,
  RefreshCw,
  Zap,
  HelpCircle,
  Pill,
  Menu,
  X,
  Lock,
  LayoutDashboard,
  Boxes,
  FileText,
  Truck,
  CreditCard,
  RotateCcw,
  Wallet,
  BarChart3,
  Users,
  ShieldAlert,
  Sliders
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentPharmacy,
    currentBranch,
    branches,
    setCurrentBranchId,
    activeRole,
    switchRole,
    currentUser,
    baseCurrency,
    setBaseCurrency,
    activeView,
    setActiveView,
    expiringBatchesCount,
    lowStockCount,
    outOfStockCount,
    pendingSupplierDuesCount,
    recalledBatchesCount,
    logout,
    setIsScreenLocked
  } = usePharmacy();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isBranchMenuOpen, setIsBranchMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const totalAlerts =
    expiringBatchesCount + lowStockCount + outOfStockCount + pendingSupplierDuesCount + recalledBatchesCount;

  const roles: { role: UserRole; title: string; desc: string; color: string }[] = [
    {
      role: 'super_admin',
      title: 'واجهة السوبر أدمن',
      desc: 'إدارة الصيدليات، الاشتراكات ومراقبة المنصة',
      color: 'bg-purple-600 text-white'
    },
    {
      role: 'pharmacy_owner',
      title: 'واجهة صاحب الصيدلية',
      desc: 'إدارة كاملة: المشتريات، الموردين، الأرباح والمخزون',
      color: 'bg-emerald-600 text-white'
    },
    {
      role: 'sales_cashier',
      title: 'واجهة موظف المبيعات (الكاشير)',
      desc: 'نقطة بيع سريعة، البحث، الصلاحية والبدائل',
      color: 'bg-blue-600 text-white'
    }
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand Identity */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
            aria-label="القائمة الرئيسية"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
            <Pill className="w-6 h-6 rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                فارما<span className="text-emerald-600">كلاود</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                ERP صيدلاني
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              {activeRole === 'super_admin' ? 'لوحة تحكم إدارة النظام المركزية' : currentPharmacy.name}
            </p>
          </div>
        </div>

        {/* Center: Branch Selector (if not super admin) */}
        {activeRole !== 'super_admin' && (
          <div className="relative hidden md:flex items-center">
            <div className="relative">
              <button
                type="button"
                id="btn-branch-dropdown"
                onClick={() => setIsBranchMenuOpen(!isBranchMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition"
              >
                <GitBranch className="w-4 h-4 text-emerald-600" />
                <span>{currentBranch.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isBranchMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40"
                  onMouseLeave={() => setIsBranchMenuOpen(false)}
                >
                  <div className="px-3 py-1.5 text-xs text-slate-400 font-bold border-b border-slate-100">
                    تبديل الفرع النشط
                  </div>
                  {branches.map(b => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        setCurrentBranchId(b.id);
                        setIsBranchMenuOpen(false);
                      }}
                      className={`w-full text-right px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                        b.id === currentBranch.id ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>{b.name}</span>
                      </div>
                      {b.isMain && (
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">رئيسي</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick POS button for Owner or Cashier */}
          {activeRole !== 'super_admin' && (
            <button
              type="button"
              id="btn-quick-pos"
              onClick={() => setActiveView('pos')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition active:scale-95"
              title="فتح شاشة البيع السريعة"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">نقطة البيع (POS)</span>
            </button>
          )}

          {/* Currency Switcher: IQD / USD */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
            <button
              type="button"
              id="btn-currency-iqd"
              onClick={() => setBaseCurrency('IQD')}
              className={`px-2.5 py-1 rounded-md font-bold transition ${
                baseCurrency === 'IQD'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              د.ع
            </button>
            <button
              type="button"
              id="btn-currency-usd"
              onClick={() => setBaseCurrency('USD')}
              className={`px-2.5 py-1 rounded-md font-bold transition ${
                baseCurrency === 'USD'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              $ USD
            </button>
          </div>

          {/* Notifications / Alerts Popover */}
          <div className="relative">
            <button
              type="button"
              id="btn-notifications-toggle"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              title="تنبيهات الصيدلية"
            >
              <Bell className="w-5 h-5" />
              {totalAlerts > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                  {totalAlerts}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div
                className="absolute left-0 sm:right-auto sm:left-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2"
                onMouseLeave={() => setIsNotificationsOpen(false)}
              >
                <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    مركز التنبيهات الذكية
                  </span>
                  <span className="text-xs bg-amber-50 text-amber-700 font-semibold px-2 py-0.5 rounded-full">
                    {totalAlerts} تنبيه نشط
                  </span>
                </div>

                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {/* Recalled Batch Alert */}
                  {recalledBatchesCount > 0 && (
                    <div
                      onClick={() => {
                        setActiveView('inventory');
                        setIsNotificationsOpen(false);
                      }}
                      className="p-3 hover:bg-rose-50 cursor-pointer flex items-start gap-3 text-right transition"
                    >
                      <div className="p-2 rounded-lg bg-rose-100 text-rose-600 shrink-0">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-rose-800">تحذير سحب تشغيلة دوائية (Recall)!</p>
                        <p className="text-[11px] text-rose-600">
                          هناك {recalledBatchesCount} تشغيلة مسحوبة رسمياً وموقوف بيعها فوراً.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Near-expiry Batches */}
                  {expiringBatchesCount > 0 && (
                    <div
                      onClick={() => {
                        setActiveView('inventory');
                        setIsNotificationsOpen(false);
                      }}
                      className="p-3 hover:bg-amber-50 cursor-pointer flex items-start gap-3 text-right transition"
                    >
                      <div className="p-2 rounded-lg bg-amber-100 text-amber-600 shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">أدوية قريبة من الانتهاء (FEFO)</p>
                        <p className="text-[11px] text-slate-500">
                          {expiringBatchesCount} تشغيلات تنتهي صلاحيتها خلال أقل من 60 يوماً.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Out of stock */}
                  {outOfStockCount > 0 && (
                    <div
                      onClick={() => {
                        setActiveView('inventory');
                        setIsNotificationsOpen(false);
                      }}
                      className="p-3 hover:bg-red-50 cursor-pointer flex items-start gap-3 text-right transition"
                    >
                      <div className="p-2 rounded-lg bg-red-100 text-red-600 shrink-0">
                        <PackageX className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">أدوية نفدت من المخزن</p>
                        <p className="text-[11px] text-slate-500">
                          {outOfStockCount} مواد رصيدها الحالي صفر وتحتاج لطلبية جديدة.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Supplier dues */}
                  {pendingSupplierDuesCount > 0 && (
                    <div
                      onClick={() => {
                        setActiveView('suppliers');
                        setIsNotificationsOpen(false);
                      }}
                      className="p-3 hover:bg-blue-50 cursor-pointer flex items-start gap-3 text-right transition"
                    >
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-600 shrink-0">
                        <Coins className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">مستحقات موردين قريبة الاستحقاق</p>
                        <p className="text-[11px] text-slate-500">
                          هناك دفعات تستحق خلال 7 أيام لشركات الأدوية المجهزة.
                        </p>
                      </div>
                    </div>
                  )}

                  {totalAlerts === 0 && (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      لا توجد تنبيهات حالياً. جميع العمليات والمخزون في وضع سليم!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Multi-role Switcher Button */}
          <div className="relative">
            <button
              type="button"
              id="btn-role-switcher"
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition"
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${
                  activeRole === 'super_admin'
                    ? 'bg-purple-600 text-white'
                    : activeRole === 'pharmacy_owner'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 text-white'
                }`}
              >
                {activeRole === 'super_admin' ? 'SA' : activeRole === 'pharmacy_owner' ? 'DR' : 'POS'}
              </div>
              <div className="text-right hidden xl:block">
                <p className="text-xs font-bold text-slate-800 leading-tight">
                  {activeRole === 'super_admin'
                    ? 'السوبر أدمن'
                    : activeRole === 'pharmacy_owner'
                    ? 'مالك الصيدلية'
                    : 'الكاشير'}
                </p>
                <p className="text-[10px] text-slate-400">تبديل الواجهة</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isRoleMenuOpen && (
              <div
                className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in"
                onMouseLeave={() => setIsRoleMenuOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-black text-slate-900">الواجهات الرئيسية للنظام</p>
                  <p className="text-[11px] text-slate-500">اختر الواجهة لتجربة النظام بصلاحياتها الكاملة:</p>
                </div>

                <div className="space-y-1.5 mt-2">
                  {roles.map(r => (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => {
                        switchRole(r.role);
                        setIsRoleMenuOpen(false);
                      }}
                      className={`w-full p-2.5 rounded-xl text-right flex items-start gap-3 transition ${
                        activeRole === r.role
                          ? 'bg-slate-100 border border-slate-300 font-bold'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className={`p-2 rounded-lg shrink-0 ${r.color}`}>
                        {r.role === 'super_admin' ? (
                          <ShieldCheck className="w-4 h-4" />
                        ) : r.role === 'pharmacy_owner' ? (
                          <Building2 className="w-4 h-4" />
                        ) : (
                          <ShoppingCart className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{r.title}</p>
                        <p className="text-[10px] text-slate-500 font-normal leading-relaxed">{r.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Session Actions */}
                <div className="mt-3 pt-2 border-t border-slate-100 space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsRoleMenuOpen(false);
                      setIsScreenLocked(true);
                    }}
                    className="w-full p-2 rounded-xl text-right flex items-center gap-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <Lock className="w-4 h-4 text-amber-500" />
                    <span>قفل المحطة والشاشة مؤقتاً</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsRoleMenuOpen(false);
                      logout();
                    }}
                    className="w-full p-2 rounded-xl text-right flex items-center gap-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>تسجيل الخروج (Sign Out)</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Lock Terminal Icon Button */}
          <button
            type="button"
            onClick={() => setIsScreenLocked(true)}
            title="قفل المحطة مؤقتاً لحماية الحساب"
            className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 text-slate-500 transition hidden sm:flex items-center justify-center"
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* Quick Logout Button */}
          <button
            type="button"
            onClick={logout}
            title="تسجيل الخروج والعودة لشاشة الدخول"
            className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 text-slate-500 transition hidden sm:flex items-center justify-center"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-40 bg-black/50 backdrop-blur-xs flex">
          <div className="w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto p-4 space-y-4 animate-in slide-in-from-right duration-200">
            {/* Active Branch Switcher (Mobile) */}
            {activeRole !== 'super_admin' && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-black text-slate-400 block mb-1">الفرع النشط حالياً:</span>
                <select
                  value={currentBranch.id}
                  onChange={e => setCurrentBranchId(e.target.value)}
                  className="w-full text-xs font-bold bg-white p-2 rounded-lg border border-slate-300 text-slate-800"
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} {b.isMain ? '(الرئيسي)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Nav Items List */}
            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block px-2 mb-1">
                {activeRole === 'super_admin' ? 'أقسام المنصة' : 'أقسام النظام'}
              </span>

              {(activeRole === 'super_admin'
                ? [
                    { id: 'superadmin_dashboard', label: 'لوحة التحكم المركزية', icon: LayoutDashboard },
                    { id: 'superadmin_pharmacies', label: 'إدارة الصيدليات والاشتراكات', icon: Building2 },
                    { id: 'superadmin_subscriptions', label: 'خطط الاشتراكات والأسعار', icon: Sliders },
                    { id: 'audit', label: 'سجل عمليات المنصة', icon: ShieldAlert }
                  ]
                : activeRole === 'sales_cashier'
                ? [
                    { id: 'pos', label: 'نقطة البيع السريعة (POS)', icon: ShoppingCart },
                    { id: 'catalog', label: 'دليل الأدوية والبدائل', icon: Pill },
                    { id: 'returns', label: 'تسجيل مرتجع زبون', icon: RotateCcw },
                    { id: 'dashboard', label: 'ملخص مبيعاتي اليومية', icon: LayoutDashboard }
                  ]
                : [
                    { id: 'dashboard', label: 'لوحة التحكم والداشبورد', icon: LayoutDashboard },
                    { id: 'pos', label: 'نقطة البيع (POS)', icon: ShoppingCart },
                    { id: 'catalog', label: 'دليل المواد والتغليف والبدائل', icon: Pill },
                    { id: 'purchases', label: 'فواتير المشتريات', icon: FileText },
                    { id: 'inventory', label: 'المخزون والصلاحية (FEFO)', icon: Boxes, badge: expiringBatchesCount > 0 ? `${expiringBatchesCount}` : undefined },
                    { id: 'suppliers', label: 'الشركات المجهزة والمذاخر', icon: Truck },
                    { id: 'payments', label: 'المدفوعات والمستحقات', icon: CreditCard, badge: pendingSupplierDuesCount > 0 ? `${pendingSupplierDuesCount}` : undefined },
                    { id: 'returns', label: 'المرتجعات والتالف والشطب', icon: RotateCcw },
                    { id: 'branches', label: 'الفروع والتحويلات المخزنية', icon: GitBranch },
                    { id: 'treasury', label: 'الصندوق والمصروفات', icon: Wallet },
                    { id: 'reports', label: 'التقارير المالية والـ P&L', icon: BarChart3 },
                    { id: 'staff', label: 'الموظفون والصلاحيات', icon: Users },
                    { id: 'audit', label: 'سجل التدقيق والعمليات', icon: ShieldAlert }
                  ]
              ).map(item => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveView(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Session Actions (Mobile) */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsScreenLocked(true);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>قفل المحطة مؤقتاً</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>تسجيل الخروج من النظام</span>
              </button>
            </div>

            {/* Quick close */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                إغلاق القائمة
              </button>
            </div>
          </div>

          {/* Backdrop Click */}
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};
