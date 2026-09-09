import React from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import {
  LayoutDashboard,
  ShoppingCart,
  Pill,
  FileText,
  Boxes,
  Truck,
  CreditCard,
  RotateCcw,
  GitBranch,
  Wallet,
  BarChart3,
  Users,
  ShieldAlert,
  Settings,
  Building2,
  PackagePlus,
  Sliders
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { activeRole, activeView, setActiveView, expiringBatchesCount, pendingSupplierDuesCount } = usePharmacy();

  // Navigation menus based on active role
  const superAdminNav: NavItem[] = [
    { id: 'superadmin_dashboard', label: 'لوحة التحكم المركزية', icon: LayoutDashboard },
    { id: 'superadmin_pharmacies', label: 'إدارة الصيدليات والاشتراكات', icon: Building2 },
    { id: 'superadmin_subscriptions', label: 'خطط الاشتراكات والأسعار', icon: Sliders },
    { id: 'audit', label: 'سجل عمليات المنصة', icon: ShieldAlert }
  ];

  const pharmacyNav: NavItem[] = [
    { id: 'dashboard', label: 'لوحة التحكم والداشبورد', icon: LayoutDashboard },
    { id: 'pos', label: 'نقطة البيع (POS)', icon: ShoppingCart, highlight: true },
    { id: 'catalog', label: 'دليل المواد والبدائل والتغليف', icon: Pill },
    { id: 'purchases', label: 'فواتير المشتريات', icon: FileText },
    {
      id: 'inventory',
      label: 'المخزون وتواريخ الصلاحية (FEFO)',
      icon: Boxes,
      badge: expiringBatchesCount > 0 ? `${expiringBatchesCount}` : undefined
    },
    { id: 'suppliers', label: 'الشركات المجهزة وكشف الحساب', icon: Truck },
    {
      id: 'payments',
      label: 'المدفوعات والمستحقات',
      icon: CreditCard,
      badge: pendingSupplierDuesCount > 0 ? `${pendingSupplierDuesCount}` : undefined
    },
    { id: 'returns', label: 'المرتجعات والتالف', icon: RotateCcw },
    { id: 'branches', label: 'الفروع والتحويلات', icon: GitBranch },
    { id: 'treasury', label: 'الصندوق والمصروفات', icon: Wallet },
    { id: 'reports', label: 'التقارير والإحصائيات', icon: BarChart3 },
    { id: 'staff', label: 'الموظفون والصلاحيات', icon: Users },
    { id: 'audit', label: 'سجل العمليات والتدقيق', icon: ShieldAlert }
  ];

  // Cashier specific simplified menu if role is sales_cashier
  const cashierNav: NavItem[] = [
    { id: 'pos', label: 'نقطة البيع السريعة (POS)', icon: ShoppingCart, highlight: true },
    { id: 'catalog', label: 'دليل الأدوية والبدائل', icon: Pill },
    { id: 'returns', label: 'تسجيل مرتجع زبون', icon: RotateCcw },
    { id: 'dashboard', label: 'ملخص مبيعاتي اليومية', icon: LayoutDashboard }
  ];

  const currentNav =
    activeRole === 'super_admin'
      ? superAdminNav
      : activeRole === 'sales_cashier'
      ? cashierNav
      : pharmacyNav;

  return (
    <aside className="w-64 shrink-0 bg-white border-l border-slate-200 min-h-[calc(100vh-4rem)] flex flex-col justify-between hidden lg:flex">
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[11px] font-black text-slate-400 uppercase tracking-wider">
          {activeRole === 'super_admin'
            ? 'إدارة المنصة المركزية'
            : activeRole === 'sales_cashier'
            ? 'واجهة الكاشير السريعة'
            : 'أقسام النظام الرئيسية'}
        </div>

        {currentNav.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-xs'
                  : item.highlight
                  ? 'bg-slate-50 text-emerald-700 hover:bg-emerald-50/50'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-emerald-600' : item.highlight ? 'text-emerald-500' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer info card */}
      <div className="p-4 border-t border-slate-100 m-2 rounded-xl bg-slate-50/80">
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold mb-1">
          <span>نظام FEFO النشط</span>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
        <p className="text-[10px] text-slate-400 leading-tight">
          بيع الأقرب انتهاءً أولاً ومطابقة درجات الحرارة للمخزون
        </p>
      </div>
    </aside>
  );
};
