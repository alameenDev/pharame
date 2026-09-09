import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { UserRole } from '../../types/pharmacy';
import {
  Users,
  Shield,
  Plus,
  Key,
  CheckCircle2,
  XCircle,
  Building2,
  Lock,
  Percent,
  Eye,
  RotateCcw
} from 'lucide-react';

interface StaffUser {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  branchName: string;
  isActive: boolean;
  canGiveDiscount: boolean;
  maxDiscountPercent: number;
  canViewProfitAndCost: boolean;
  canRefundInvoice: boolean;
  canOverridePrice: boolean;
}

export const StaffManagement: React.FC = () => {
  const { branches, formatMoney } = usePharmacy();

  const [staffList, setStaffList] = useState<StaffUser[]>([
    {
      id: 'usr-1',
      name: 'د. أحمد الكرخي',
      username: 'ahmed_rx',
      role: 'pharmacy_owner',
      branchName: 'الفرع الرئيسي - المنصور',
      isActive: true,
      canGiveDiscount: true,
      maxDiscountPercent: 100,
      canViewProfitAndCost: true,
      canRefundInvoice: true,
      canOverridePrice: true
    },
    {
      id: 'usr-2',
      name: 'الصيدلاني علي حسن',
      username: 'ali_pharma',
      role: 'pharmacist',
      branchName: 'الفرع الرئيسي - المنصور',
      isActive: true,
      canGiveDiscount: true,
      maxDiscountPercent: 15,
      canViewProfitAndCost: false,
      canRefundInvoice: true,
      canOverridePrice: false
    },
    {
      id: 'usr-3',
      name: 'كاشير مبيعات 1',
      username: 'cashier1',
      role: 'sales_cashier',
      branchName: 'الفرع الرئيسي - المنصور',
      isActive: true,
      canGiveDiscount: true,
      maxDiscountPercent: 5,
      canViewProfitAndCost: false,
      canRefundInvoice: false,
      canOverridePrice: false
    },
    {
      id: 'usr-4',
      name: 'أمين المخزن سجاد',
      username: 'sajjad_store',
      role: 'warehouse_keeper',
      branchName: 'الفرع الرئيسي - المنصور',
      isActive: true,
      canGiveDiscount: false,
      maxDiscountPercent: 0,
      canViewProfitAndCost: true,
      canRefundInvoice: false,
      canOverridePrice: false
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState<Omit<StaffUser, 'id'>>({
    name: '',
    username: '',
    role: 'sales_cashier',
    branchName: branches[0]?.name || 'الفرع الرئيسي',
    isActive: true,
    canGiveDiscount: true,
    maxDiscountPercent: 10,
    canViewProfitAndCost: false,
    canRefundInvoice: false,
    canOverridePrice: false
  });

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.username) return;
    setStaffList([
      ...staffList,
      {
        ...newStaff,
        id: `usr-${Date.now()}`
      }
    ]);
    setIsAddModalOpen(false);
    setNewStaff({
      name: '',
      username: '',
      role: 'sales_cashier',
      branchName: branches[0]?.name || 'الفرع الرئيسي',
      isActive: true,
      canGiveDiscount: true,
      maxDiscountPercent: 10,
      canViewProfitAndCost: false,
      canRefundInvoice: false,
      canOverridePrice: false
    });
  };

  const toggleUserStatus = (id: string) => {
    setStaffList(staffList.map(u => (u.id === id ? { ...u, isActive: !u.isActive } : u)));
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'pharmacy_owner':
        return 'صاحب ومدير الصيدلية';
      case 'branch_manager':
        return 'مدير فرع';
      case 'pharmacist':
        return 'صيدلاني شفت مسؤول';
      case 'sales_cashier':
        return 'كاشير مبيعات';
      case 'warehouse_keeper':
        return 'أمين مخزن ومشتريات';
      case 'accountant':
        return 'محاسب مالي';
      case 'auditor':
        return 'مدقق حسابات';
      case 'super_admin':
        return 'مدير النظام السوبر أدمن';
      default:
        return role;
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-100 text-blue-800">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-slate-900">إدارة المستخدمين ومصفوفة الصلاحيات (RBAC)</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            إدارة حسابات الكادر الصيدلاني، تحديد نسبة الخصم المسموحة، وصلاحيات الاطلاع على الأرباح والتكلفة
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة مستخدم / موظف جديد</span>
        </button>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
              <tr>
                <th className="p-3.5">الاسم واسم المستخدم</th>
                <th className="p-3.5">الدور الوظيفي</th>
                <th className="p-3.5">الفرع المخصص</th>
                <th className="p-3.5">أقصى خصم مسموح</th>
                <th className="p-3.5">صلاحيات حساسة</th>
                <th className="p-3.5">الحالة</th>
                <th className="p-3.5 text-center">التحكم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffList.map(user => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3.5">
                    <div>
                      <p className="font-extrabold text-slate-900 text-xs">{user.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">@{user.username}</p>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-50 text-blue-800 border border-blue-200">
                      {getRoleLabel(user.role)}
                    </span>
                  </td>

                  <td className="p-3.5 text-slate-700 font-medium">{user.branchName}</td>

                  <td className="p-3.5">
                    <span className="font-black text-slate-900">{user.maxDiscountPercent}%</span>
                  </td>

                  <td className="p-3.5">
                    <div className="flex flex-wrap gap-1">
                      {user.canViewProfitAndCost && (
                        <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-100 text-emerald-800 font-bold">
                          رؤية التكلفة والربح
                        </span>
                      )}
                      {user.canRefundInvoice && (
                        <span className="px-2 py-0.5 rounded text-[9px] bg-indigo-100 text-indigo-800 font-bold">
                          استرجاع فواتير
                        </span>
                      )}
                      {user.canOverridePrice && (
                        <span className="px-2 py-0.5 rounded text-[9px] bg-amber-100 text-amber-800 font-bold">
                          تعديل السعر اليدوي
                        </span>
                      )}
                      {!user.canViewProfitAndCost && !user.canRefundInvoice && !user.canOverridePrice && (
                        <span className="text-slate-400 text-[10px]">صلاحيات قياسية فقط</span>
                      )}
                    </div>
                  </td>

                  <td className="p-3.5">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        user.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {user.isActive ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> نشط
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" /> معطل
                        </>
                      )}
                    </span>
                  </td>

                  <td className="p-3.5 text-center">
                    <button
                      type="button"
                      onClick={() => toggleUserStatus(user.id)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold transition ${
                        user.isActive
                          ? 'bg-rose-50 hover:bg-rose-100 text-rose-700'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {user.isActive ? 'تعطيل الحساب' : 'تفعيل الحساب'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in">
            <div className="p-4 bg-blue-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <h3 className="font-black text-sm">إضافة مستخدم جديد للنظام</h3>
              </div>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-white/80 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="p-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الاسم الكامل *</label>
                  <input
                    type="text"
                    required
                    value={newStaff.name}
                    onChange={e => setNewStaff({ ...newStaff, name: e.target.value })}
                    placeholder="د. عمر الخفاجي"
                    className="w-full p-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">اسم المستخدم للدخول *</label>
                  <input
                    type="text"
                    required
                    value={newStaff.username}
                    onChange={e => setNewStaff({ ...newStaff, username: e.target.value })}
                    placeholder="omar_pharma"
                    className="w-full p-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الدور الوظيفي *</label>
                  <select
                    value={newStaff.role}
                    onChange={e => setNewStaff({ ...newStaff, role: e.target.value as any })}
                    className="w-full p-2 rounded-xl border border-slate-300 font-bold"
                  >
                    <option value="pharmacist">صيدلاني شفت مسؤول</option>
                    <option value="sales_cashier">كاشير مبيعات</option>
                    <option value="warehouse_keeper">أمين مخزن ومشتريات</option>
                    <option value="branch_manager">مدير فرع</option>
                    <option value="accountant">محاسب مالي</option>
                    <option value="pharmacy_owner">صاحب ومدير الصيدلية</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">الفرع المعين فيه</label>
                  <select
                    value={newStaff.branchName}
                    onChange={e => setNewStaff({ ...newStaff, branchName: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 font-bold"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">أقصى نسبة خصم يمكنه إعطاؤها للزبون (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newStaff.maxDiscountPercent}
                  onChange={e =>
                    setNewStaff({ ...newStaff, maxDiscountPercent: parseInt(e.target.value) || 0 })
                  }
                  className="w-full p-2 rounded-xl border border-slate-300 font-bold text-center"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-700 block">صلاحيات إضافية:</span>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newStaff.canViewProfitAndCost}
                    onChange={e => setNewStaff({ ...newStaff, canViewProfitAndCost: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>السماح بالاطلاع على تكلفة الشراء وهوامش الربح</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newStaff.canRefundInvoice}
                    onChange={e => setNewStaff({ ...newStaff, canRefundInvoice: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>السماح بإلغاء واسترجاع فواتير البيع للزبائن</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newStaff.canOverridePrice}
                    onChange={e => setNewStaff({ ...newStaff, canOverridePrice: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>السماح بالتعديل اليدوي على سعر البيع في الكاشير</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  حفظ وتفعيل المستخدم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
