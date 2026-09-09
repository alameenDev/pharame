import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { CustomerReturn, SupplierReturn, DamagedWriteoff } from '../../types/pharmacy';
import {
  RotateCcw,
  Plus,
  Trash2,
  AlertTriangle,
  FileText,
  User,
  Truck,
  CheckCircle2,
  Calendar,
  DollarSign,
  Pill,
  Search
} from 'lucide-react';

export const ReturnsAndDamaged: React.FC = () => {
  const {
    customerReturns,
    supplierReturns,
    damagedWriteoffs,
    medicines,
    suppliers,
    salesInvoices,
    batches,
    currentBranch,
    currentUser,
    addCustomerReturn,
    addSupplierReturn,
    addDamagedWriteoff,
    formatMoney
  } = usePharmacy();

  const [activeTab, setActiveTab] = useState<'customer' | 'supplier' | 'damaged'>('customer');

  // Customer Return Modal State
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [selectedSaleInvoiceNumber, setSelectedSaleInvoiceNumber] = useState(salesInvoices[0]?.invoiceNumber || '');
  const [custReturnItemId, setCustReturnItemId] = useState(medicines[0]?.id || '');
  const [custReturnUnit, setCustReturnUnit] = useState<'box' | 'strip' | 'tablet'>('box');
  const [custReturnQty, setCustReturnQty] = useState(1);
  const [custReturnReason, setCustReturnReason] = useState('خطأ في طلب الزبون / وصفة بديلة');
  const [custReturnCondition, setCustReturnCondition] = useState<'intact' | 'damaged'>('intact');
  const [custRefundMethod, setCustRefundMethod] = useState<'cash' | 'credit'>('cash');

  // Supplier Return Modal State
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [supReturnSupplierId, setSupReturnSupplierId] = useState(suppliers[0]?.id || '');
  const [supReturnItemId, setSupReturnItemId] = useState(medicines[0]?.id || '');
  const [supReturnBatchNumber, setSupReturnBatchNumber] = useState('BCH-2026-01');
  const [supReturnUnits, setSupReturnUnits] = useState(10);
  const [supReturnReason, setSupReturnReason] = useState('قريب انتهاء الصلاحية حسب اتفاق التبديل');

  // Damaged Write-off Modal State
  const [isDamagedModalOpen, setIsDamagedModalOpen] = useState(false);
  const [damagedItemId, setDamagedItemId] = useState(medicines[0]?.id || '');
  const [damagedBatchId, setDamagedBatchId] = useState(batches[0]?.id || '');
  const [damagedUnits, setDamagedUnits] = useState(5);
  const [damagedReason, setDamagedReason] = useState('كسر زجاجي أثناء النقل والتخزين');

  // Submit Customer Return
  const handleSubmitCustomerReturn = (e: React.FormEvent) => {
    e.preventDefault();
    const med = medicines.find(m => m.id === custReturnItemId);
    const unitPrice =
      custReturnUnit === 'box'
        ? med?.packaging.box.sellingPrice || 4000
        : custReturnUnit === 'strip'
        ? med?.packaging.strip.sellingPrice || 2000
        : med?.packaging.tablet.sellingPrice || 200;

    const refund = unitPrice * custReturnQty;
    addCustomerReturn({
      originalInvoiceId: selectedSaleInvoiceNumber,
      date: new Date().toISOString().split('T')[0],
      branchId: currentBranch.id,
      cashierName: currentUser.name,
      customerName: 'زبون نقدي',
      totalRefund: refund,
      approvedBy: currentUser.name,
      items: [
        {
          itemId: custReturnItemId,
          itemName: med?.commercialName || 'دواء',
          unit: custReturnUnit,
          quantity: custReturnQty,
          unitPrice,
          totalRefund: refund,
          reason: custReturnReason,
          condition: custReturnCondition === 'intact' ? 'good' : 'damaged',
          action: custReturnCondition === 'intact' ? 'restock' : 'writeoff'
        }
      ]
    });

    setIsCustomerModalOpen(false);
  };

  // Submit Supplier Return
  const handleSubmitSupplierReturn = (e: React.FormEvent) => {
    e.preventDefault();
    const med = medicines.find(m => m.id === supReturnItemId);
    const costPrice = med?.packaging.box.costPrice || 3000;
    const totalCredit = costPrice * supReturnUnits;

    addSupplierReturn({
      supplierId: supReturnSupplierId,
      date: new Date().toISOString().split('T')[0],
      branchId: currentBranch.id,
      totalCreditAmount: totalCredit,
      approvedBy: currentUser.name,
      items: [
        {
          itemId: supReturnItemId,
          itemName: med?.commercialName || 'دواء',
          batchNumber: supReturnBatchNumber,
          quantitySmallestUnit: supReturnUnits,
          reason: 'near_expiry',
          unitCost: costPrice,
          totalCredit
        }
      ]
    });

    setIsSupplierModalOpen(false);
  };

  // Submit Damaged
  const handleSubmitDamaged = (e: React.FormEvent) => {
    e.preventDefault();
    const med = medicines.find(m => m.id === damagedItemId);
    const batch = batches.find(b => b.id === damagedBatchId);
    const costPrice = batch?.costPriceSmallestUnit || 500;
    const totalLoss = costPrice * damagedUnits;

    addDamagedWriteoff({
      date: new Date().toISOString().split('T')[0],
      branchId: currentBranch.id,
      itemId: damagedItemId,
      itemName: med?.commercialName || 'دواء',
      batchNumber: batch?.batchNumber || 'BATCH-01',
      quantity: damagedUnits,
      reason: 'damaged',
      unitCost: costPrice,
      totalLoss,
      responsibleStaff: currentUser.name,
      approvedBy: currentUser.name,
      notes: damagedReason
    });

    setIsDamagedModalOpen(false);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-orange-100 text-orange-800">
              <RotateCcw className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-slate-900">إدارة المرتجعات، التوالف والشطب</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            مرتجعات الزبائن، مرتجعات الموردين وخصم الحساب، وتوثيق شطب الأدوية التالفة
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('customer')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'customer' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            مرتجع زبون
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('supplier')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'supplier' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            مرتجع إلى مورد
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('damaged')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'damaged' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            توالف وشطب
          </button>
        </div>
      </div>

      {/* Tab 1: Customer Returns */}
      {activeTab === 'customer' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-sm text-slate-900">سجل مرتجعات الزبائن</h3>
            <button
              type="button"
              onClick={() => setIsCustomerModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل مرتجع زبون جديد</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                <tr>
                  <th className="p-3.5">الفاتورة الأصلية والتاريخ</th>
                  <th className="p-3.5">المادة المرتجعة</th>
                  <th className="p-3.5">الكمية والوحدة</th>
                  <th className="p-3.5">المبلغ المسترد</th>
                  <th className="p-3.5">حالة العبوة</th>
                  <th className="p-3.5">السبب</th>
                  <th className="p-3.5">المستلم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customerReturns.map(ret => {
                  const firstItem = ret.items[0];
                  return (
                    <tr key={ret.id} className="hover:bg-slate-50/80">
                      <td className="p-3.5">
                        <span className="font-mono font-bold text-slate-900 block">{ret.originalInvoiceId}</span>
                        <span className="text-[10px] text-slate-400">{ret.date}</span>
                      </td>
                      <td className="p-3.5 font-bold text-slate-800">{firstItem?.itemName || 'دواء'}</td>
                      <td className="p-3.5">
                        {firstItem?.quantity || 1} {firstItem?.unit || 'وحدة'}
                      </td>
                      <td className="p-3.5 font-black text-emerald-800">{formatMoney(ret.totalRefund)}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            firstItem?.condition === 'good'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {firstItem?.condition === 'good' ? 'سليمة (أعيدت للمخزن)' : 'تالفة'}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-600">{firstItem?.reason || 'مرتجع'}</td>
                      <td className="p-3.5 text-slate-500">{ret.cashierName}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Supplier Returns */}
      {activeTab === 'supplier' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-sm text-slate-900">سجل المرتجعات إلى الشركات المجهزة (إشعار مدين)</h3>
            <button
              type="button"
              onClick={() => setIsSupplierModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل مرتجع إلى مورد</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                <tr>
                  <th className="p-3.5">رقم إشعار المرتجع</th>
                  <th className="p-3.5">الشركة المجهزة</th>
                  <th className="p-3.5">المادة ورقم التشغيلة</th>
                  <th className="p-3.5">الكمية المرتجعة</th>
                  <th className="p-3.5">المبلغ المخصوم من الرصيد</th>
                  <th className="p-3.5">سبب الإرجاع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {supplierReturns.map(ret => {
                  const sup = suppliers.find(s => s.id === ret.supplierId);
                  const firstItem = ret.items[0];
                  return (
                    <tr key={ret.id} className="hover:bg-slate-50/80">
                      <td className="p-3.5 font-mono font-bold text-slate-900">{ret.returnNumber}</td>
                      <td className="p-3.5 font-bold text-slate-800">{sup?.companyName}</td>
                      <td className="p-3.5">
                        <span className="font-bold text-slate-800 block">{firstItem?.itemName}</span>
                        <span className="font-mono text-[10px] text-slate-400">Batch: {firstItem?.batchNumber}</span>
                      </td>
                      <td className="p-3.5">{firstItem?.quantitySmallestUnit || 0} وحدة</td>
                      <td className="p-3.5 font-black text-blue-700">{formatMoney(ret.totalCreditAmount)}</td>
                      <td className="p-3.5 text-slate-600">{firstItem?.reason || 'مرتجع مورد'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Damaged Write-offs */}
      {activeTab === 'damaged' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-sm text-slate-900">سجل الأدوية التالفة ومحاضر الإتلاف والشطب</h3>
            <button
              type="button"
              onClick={() => setIsDamagedModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل محضر إتلاف</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                <tr>
                  <th className="p-3.5">التاريخ</th>
                  <th className="p-3.5">المادة الصيدلانية</th>
                  <th className="p-3.5">الكمية التالفة</th>
                  <th className="p-3.5">قيمة الخسارة</th>
                  <th className="p-3.5">سبب التلف</th>
                  <th className="p-3.5">المسؤول والاعتماد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {damagedWriteoffs.map(rec => {
                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/80">
                      <td className="p-3.5">{rec.date}</td>
                      <td className="p-3.5 font-bold text-slate-800">{rec.itemName}</td>
                      <td className="p-3.5 text-rose-600 font-black">{rec.quantity} وحدة</td>
                      <td className="p-3.5 font-black text-rose-700">{formatMoney(rec.totalLoss)}</td>
                      <td className="p-3.5 text-slate-600">{rec.notes || rec.reason}</td>
                      <td className="p-3.5">
                        <span className="text-slate-700 block">{rec.responsibleStaff}</span>
                        <span className="text-[10px] text-emerald-700 font-bold">معتمد من الإدارة</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Customer Return */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in">
            <div className="p-4 bg-emerald-700 text-white flex items-center justify-between">
              <h3 className="font-black text-sm">تسجيل مرتجع زبون</h3>
              <button type="button" onClick={() => setIsCustomerModalOpen(false)} className="text-white/80 font-bold">
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmitCustomerReturn} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">رقم الفاتورة المباعة *</label>
                <input
                  type="text"
                  required
                  value={selectedSaleInvoiceNumber}
                  onChange={e => setSelectedSaleInvoiceNumber(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">المادة المرتجعة *</label>
                <select
                  value={custReturnItemId}
                  onChange={e => setCustReturnItemId(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 font-bold"
                >
                  {medicines.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.commercialName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">وحدة المرتجع</label>
                  <select
                    value={custReturnUnit}
                    onChange={e => setCustReturnUnit(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-slate-300"
                  >
                    <option value="box">علبة</option>
                    <option value="strip">شريط</option>
                    <option value="tablet">حبة</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الكمية</label>
                  <input
                    type="number"
                    min="1"
                    value={custReturnQty}
                    onChange={e => setCustReturnQty(parseInt(e.target.value) || 1)}
                    className="w-full p-2 rounded-xl border border-slate-300 font-bold text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">حالة العبوة</label>
                <select
                  value={custReturnCondition}
                  onChange={e => setCustReturnCondition(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-slate-300"
                >
                  <option value="intact">سليمة ومغلقة (إعادة مباشرة للمخزون)</option>
                  <option value="damaged">تالفة أو مفتوحة (تحويل لملف التالف)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">سبب الإرجاع</label>
                <input
                  type="text"
                  value={custReturnReason}
                  onChange={e => setCustReturnReason(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCustomerModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  تأكيد واسترجاع المبلغ للزبون
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Supplier Return */}
      {isSupplierModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in">
            <div className="p-4 bg-blue-700 text-white flex items-center justify-between">
              <h3 className="font-black text-sm">تسجيل مرتجع إلى الشركة المجهزة</h3>
              <button type="button" onClick={() => setIsSupplierModalOpen(false)} className="text-white/80 font-bold">
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmitSupplierReturn} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">الشركة المجهزة *</label>
                <select
                  value={supReturnSupplierId}
                  onChange={e => setSupReturnSupplierId(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 font-bold"
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.companyName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">المادة المراد إرجاعها *</label>
                <select
                  value={supReturnItemId}
                  onChange={e => setSupReturnItemId(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 font-bold"
                >
                  {medicines.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.commercialName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">رقم التشغيلة</label>
                  <input
                    type="text"
                    value={supReturnBatchNumber}
                    onChange={e => setSupReturnBatchNumber(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">عدد العلب</label>
                  <input
                    type="number"
                    min="1"
                    value={supReturnUnits}
                    onChange={e => setSupReturnUnits(parseInt(e.target.value) || 1)}
                    className="w-full p-2 rounded-xl border border-slate-300 font-bold text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">سبب الإرجاع للمورد</label>
                <input
                  type="text"
                  value={supReturnReason}
                  onChange={e => setSupReturnReason(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSupplierModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  إصدار إشعار مدين وخصم الحساب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Damaged Write-off */}
      {isDamagedModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in">
            <div className="p-4 bg-rose-700 text-white flex items-center justify-between">
              <h3 className="font-black text-sm">تسجيل محضر إتلاف وشطب أدوية</h3>
              <button type="button" onClick={() => setIsDamagedModalOpen(false)} className="text-white/80 font-bold">
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmitDamaged} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">المادة التالفة *</label>
                <select
                  value={damagedItemId}
                  onChange={e => setDamagedItemId(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 font-bold"
                >
                  {medicines.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.commercialName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">الكمية المشطوبة (وحدات)</label>
                <input
                  type="number"
                  min="1"
                  value={damagedUnits}
                  onChange={e => setDamagedUnits(parseInt(e.target.value) || 1)}
                  className="w-full p-2 rounded-xl border border-slate-300 font-bold text-center"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">سبب التلف والشطب</label>
                <input
                  type="text"
                  value={damagedReason}
                  onChange={e => setDamagedReason(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDamagedModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
                >
                  تأكيد الشطب وتسجيل الخسارة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
