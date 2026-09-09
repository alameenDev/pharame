import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Branch, MedicineBatch } from '../../types/pharmacy';
import {
  GitBranch,
  Building2,
  Plus,
  ArrowLeftRight,
  MapPin,
  Phone,
  CheckCircle2,
  Boxes,
  UserCheck
} from 'lucide-react';

export const BranchManagement: React.FC = () => {
  const {
    branches,
    currentBranch,
    setCurrentBranchId,
    medicines,
    batches,
    addBranch,
    transferStockBetweenBranches,
    formatMoney
  } = usePharmacy();

  const [isAddBranchModalOpen, setIsAddBranchModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  // New Branch State
  const [newBranchData, setNewBranchData] = useState({
    name: '',
    governorate: 'بغداد',
    phone: '',
    address: '',
    managerName: '',
    isMain: false
  });

  // Transfer State
  const [fromBranchId, setFromBranchId] = useState(currentBranch.id);
  const [toBranchId, setToBranchId] = useState(branches.find(b => b.id !== currentBranch.id)?.id || '');
  const [transferItemId, setTransferItemId] = useState(medicines[0]?.id || '');
  const [transferBatchId, setTransferBatchId] = useState(batches[0]?.id || '');
  const [transferUnits, setTransferUnits] = useState(10);
  const [transferNotes, setTransferNotes] = useState('سد نقص المخزون في الفرع الآخر');

  const availableBatchesForFromBranch = batches.filter(
    b => b.branchId === fromBranchId && b.itemId === transferItemId && b.totalUnitsRemaining > 0 && !b.isRecalled
  );

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchData.name) return;
    addBranch({
      pharmacyId: currentBranch.pharmacyId,
      name: newBranchData.name,
      governorate: newBranchData.governorate,
      phone: newBranchData.phone,
      address: newBranchData.address,
      isMain: newBranchData.isMain,
      active: true
    });
    setIsAddBranchModalOpen(false);
    setNewBranchData({
      name: '',
      governorate: 'بغداد',
      phone: '',
      address: '',
      managerName: '',
      isMain: false
    });
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromBranchId || !toBranchId || fromBranchId === toBranchId || !transferBatchId || transferUnits <= 0) {
      alert('يرجى التأكد من اختيار فرعين مختلفين وتشغيلة تحتوي على رصيد كافٍ');
      return;
    }

    transferStockBetweenBranches(
      fromBranchId,
      toBranchId,
      transferItemId,
      transferBatchId,
      transferUnits,
      transferNotes
    );

    alert('تم تنفيذ التحويل المخزني بنجاح وتحديث أرصدة الفرعين!');
    setIsTransferModalOpen(false);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-100 text-indigo-800">
              <GitBranch className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-slate-900">إدارة الفروع والتحويلات المخزنية</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            إدارة شبكة فروع الصيدلية، تدوير ونقل الأدوية بين الفروع، ومتابعة مخزون كل فرع
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsTransferModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition active:scale-95"
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>طلب تحويل مخزني بين الفروع</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddBranchModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة فرع جديد</span>
          </button>
        </div>
      </div>

      {/* Branches Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {branches.map(branch => {
          const branchBatchesCount = batches.filter(
            b => b.branchId === branch.id && b.totalUnitsRemaining > 0
          ).length;
          const isCurrentActive = branch.id === currentBranch.id;

          return (
            <div
              key={branch.id}
              className={`p-5 rounded-2xl border transition relative bg-white ${
                isCurrentActive ? 'border-indigo-500 shadow-md ring-2 ring-indigo-500/20' : 'border-slate-200 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                      isCurrentActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-slate-900">{branch.name}</h3>
                    <p className="text-[10px] text-slate-400 font-mono">الرمز: {branch.id}</p>
                  </div>
                </div>

                {branch.isMain && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-800">
                    الفرع الرئيسي
                  </span>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <p className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>المحافظة: {branch.governorate}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{branch.phone}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{branch.address}</span>
                </p>
                <p className="flex items-center gap-1.5 pt-1 text-indigo-700 font-bold">
                  <Boxes className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{branchBatchesCount} تشغيلة دوائية متوفرة</span>
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                {isCurrentActive ? (
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> الفرع النشط حالياً
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCurrentBranchId(branch.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-bold text-xs transition"
                  >
                    التبديل إلى هذا الفرع
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Inter-branch Transfer */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in">
            <div className="p-4 bg-indigo-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5" />
                <h3 className="font-black text-sm">تحويل مخزني بين الفروع</h3>
              </div>
              <button type="button" onClick={() => setIsTransferModalOpen(false)} className="text-white/80 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleTransferSubmit} className="p-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">من الفرع (المصدر) *</label>
                  <select
                    value={fromBranchId}
                    onChange={e => setFromBranchId(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 font-bold"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">إلى الفرع (الوجهة) *</label>
                  <select
                    value={toBranchId}
                    onChange={e => setToBranchId(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 font-bold"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id} disabled={b.id === fromBranchId}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">المادة المراد نقلها *</label>
                <select
                  value={transferItemId}
                  onChange={e => setTransferItemId(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 font-bold"
                >
                  {medicines.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.commercialName} ({m.concentration})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">التشغيلة المتوفرة في فرع المصدر *</label>
                <select
                  value={transferBatchId}
                  onChange={e => setTransferBatchId(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 font-mono"
                >
                  {availableBatchesForFromBranch.length > 0 ? (
                    availableBatchesForFromBranch.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.batchNumber} - تنتهي {b.expiryDate} (متبقي: {b.totalUnitsRemaining} وحدة)
                      </option>
                    ))
                  ) : (
                    <option value="">لا توجد تشغيلات متوفرة في هذا الفرع</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">الكمية المنقولة (وحدات) *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={transferUnits}
                  onChange={e => setTransferUnits(parseInt(e.target.value) || 1)}
                  className="w-full p-2 rounded-xl border border-slate-300 font-bold text-center"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">سبب التحويل والملاحظات</label>
                <input
                  type="text"
                  value={transferNotes}
                  onChange={e => setTransferNotes(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  تأكيد نقل المخزون
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Branch */}
      {isAddBranchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-black text-sm">تسجيل فرع جديد للصيدلية</h3>
              <button type="button" onClick={() => setIsAddBranchModalOpen(false)} className="text-white/80 font-bold">
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateBranch} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم الفرع *</label>
                <input
                  type="text"
                  required
                  value={newBranchData.name}
                  onChange={e => setNewBranchData({ ...newBranchData, name: e.target.value })}
                  placeholder="مثال: فرع الكرخ - المنصور"
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم الصيدلاني المدير المسؤول *</label>
                <input
                  type="text"
                  required
                  value={newBranchData.managerName}
                  onChange={e => setNewBranchData({ ...newBranchData, managerName: e.target.value })}
                  placeholder="د. سارة التميمي"
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">رقم الهاتف</label>
                <input
                  type="text"
                  value={newBranchData.phone}
                  onChange={e => setNewBranchData({ ...newBranchData, phone: e.target.value })}
                  placeholder="+964 770 000 0000"
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">العنوان التفصيلي</label>
                <input
                  type="text"
                  value={newBranchData.address}
                  onChange={e => setNewBranchData({ ...newBranchData, address: e.target.value })}
                  placeholder="شارع 14 رمضان، مجمع الأطباء"
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddBranchModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold"
                >
                  إنشاء الفرع وتفعيله
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
