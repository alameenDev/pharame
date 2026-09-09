import React, { useState, useMemo } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { MedicineBatch, StockMovementCard } from '../../types/pharmacy';
import {
  Boxes,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  ShieldAlert,
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  ScanLine,
  Sliders,
  Sparkles,
  MapPin,
  RefreshCw,
  TrendingDown
} from 'lucide-react';

export const InventoryManagement: React.FC = () => {
  const {
    batches,
    medicines,
    suppliers,
    currentBranch,
    recallBatch,
    performStockAudit,
    formatMoney,
    expiringBatchesCount
  } = usePharmacy();

  const [activeTab, setActiveTab] = useState<'fefo' | 'movement' | 'audit' | 'recalls'>('fefo');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'critical' | 'near' | 'safe' | 'recalled'>('all');

  // Drug Recall Modal State
  const [selectedBatchForRecall, setSelectedBatchForRecall] = useState<MedicineBatch | null>(null);
  const [recallReason, setRecallReason] = useState('قرار صادر من وزارة الصحة / عيب تصنيعي');

  // Physical Audit State
  const [auditItemId, setAuditItemId] = useState(medicines[0]?.id || '');
  const [actualUnitsFound, setActualUnitsFound] = useState<number>(100);
  const [auditNotes, setAuditNotes] = useState('جرد دوري لشهر سبتمبر');
  const [auditSuccessMessage, setAuditSuccessMessage] = useState<string | null>(null);

  // Selected Medicine for Stock Movement Card
  const [selectedMovementItemId, setSelectedMovementItemId] = useState<string>(medicines[0]?.id || '');

  // Filter batches
  const branchBatches = useMemo(() => {
    return batches.filter(b => b.branchId === currentBranch.id);
  }, [batches, currentBranch.id]);

  const filteredBatches = useMemo(() => {
    const today = new Date();
    return branchBatches.filter(b => {
      const med = medicines.find(m => m.id === b.itemId);
      const matchesSearch =
        !searchTerm ||
        b.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med?.commercialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med?.scientificName.toLowerCase().includes(searchTerm.toLowerCase());

      const expDate = new Date(b.expiryDate);
      const daysUntilExpiry = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      let matchesFilter = true;
      if (filterStatus === 'critical') {
        matchesFilter = daysUntilExpiry <= 30 && !b.isRecalled;
      } else if (filterStatus === 'near') {
        matchesFilter = daysUntilExpiry > 30 && daysUntilExpiry <= 90 && !b.isRecalled;
      } else if (filterStatus === 'safe') {
        matchesFilter = daysUntilExpiry > 90 && !b.isRecalled;
      } else if (filterStatus === 'recalled') {
        matchesFilter = b.isRecalled;
      }

      return matchesSearch && matchesFilter;
    });
  }, [branchBatches, medicines, searchTerm, filterStatus]);

  // Handle Recall
  const handleConfirmRecall = () => {
    if (!selectedBatchForRecall) return;
    recallBatch(selectedBatchForRecall.id, recallReason);
    setSelectedBatchForRecall(null);
  };

  // Handle Audit Submit
  const handleAuditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const batch = branchBatches.find(b => b.itemId === auditItemId && !b.isRecalled);
    if (!batch) {
      alert('لا توجد تشغيلة صالحة لهذه المادة لتطبيق التسوية عليها');
      return;
    }
    const diff = actualUnitsFound - batch.totalUnitsRemaining;
    performStockAudit(batch.id, actualUnitsFound, auditNotes);
    setAuditSuccessMessage(
      `تمت التسوية بنجاح: الفارق (${diff > 0 ? `+${diff}` : diff} وحدة) وتم تحديث الرصيد الدفتري.`
    );
    setTimeout(() => setAuditSuccessMessage(null), 5000);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Boxes className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-slate-900">
              إدارة المخزون والدفعات وتواريخ الصلاحية (نظام FEFO)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            بيع الأقرب انتهاءً أولاً، رادار الصلاحية الذكي، سحب التشغيلات المعيبة، والجرد الفعلي
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('fefo')}
            className={`px-3.5 py-1.5 rounded-lg transition ${
              activeTab === 'fefo' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            رادار التشغيلات (FEFO)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('movement')}
            className={`px-3.5 py-1.5 rounded-lg transition ${
              activeTab === 'movement' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            بطاقة حركة المادة
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`px-3.5 py-1.5 rounded-lg transition ${
              activeTab === 'audit' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            الجرد والتسوية المخزنية
          </button>
        </div>
      </div>

      {/* Tab 1: FEFO Radar Batches */}
      {activeTab === 'fefo' && (
        <div className="space-y-4">
          {/* Radar Category Badges & Search */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="ابحث برقم التشغيلة، اسم الدواء، أو المادة..."
                className="w-full pl-3 pr-10 py-2 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500 bg-slate-50"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-xl border transition ${
                  filterStatus === 'all' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'
                }`}
              >
                الكل
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('critical')}
                className={`px-3 py-1.5 rounded-xl border transition ${
                  filterStatus === 'critical'
                    ? 'bg-rose-600 text-white'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                أقل من 30 يوماً
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('near')}
                className={`px-3 py-1.5 rounded-xl border transition ${
                  filterStatus === 'near'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                30 - 90 يوماً
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('safe')}
                className={`px-3 py-1.5 rounded-xl border transition ${
                  filterStatus === 'safe'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                صلاحية آمنة
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('recalled')}
                className={`px-3 py-1.5 rounded-xl border transition ${
                  filterStatus === 'recalled'
                    ? 'bg-purple-900 text-white'
                    : 'bg-purple-50 text-purple-900 border-purple-200'
                }`}
              >
                مسحوبة رسمياً (Recalled)
              </button>
            </div>
          </div>

          {/* Batches Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                  <tr>
                    <th className="p-3.5">المادة واسم الدواء</th>
                    <th className="p-3.5">رقم التشغيلة (Batch)</th>
                    <th className="p-3.5">تاريخ الانتهاء</th>
                    <th className="p-3.5">الأيام المتبقية</th>
                    <th className="p-3.5">الرصيد المتبقي</th>
                    <th className="p-3.5">الموقع والرف</th>
                    <th className="p-3.5">الحالة وأولوية FEFO</th>
                    <th className="p-3.5 text-center">سحب تشغيلة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBatches.map(batch => {
                    const med = medicines.find(m => m.id === batch.itemId);
                    const today = new Date();
                    const expDate = new Date(batch.expiryDate);
                    const daysRemaining = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                    const isExpired = daysRemaining <= 0;

                    // Expiry Color Logic
                    let badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
                    let statusLabel = 'صلاحية ممتازة';

                    if (batch.isRecalled) {
                      badgeColor = 'bg-rose-950 text-white border-rose-900';
                      statusLabel = 'مسحوبة وموقوف بيعها';
                    } else if (isExpired) {
                      badgeColor = 'bg-red-600 text-white';
                      statusLabel = 'منتهية الصلاحية!';
                    } else if (daysRemaining <= 30) {
                      badgeColor = 'bg-rose-100 text-rose-800 border-rose-300 font-black';
                      statusLabel = 'حرجة جداً (< 30 يوم)';
                    } else if (daysRemaining <= 60) {
                      badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
                      statusLabel = 'قريبة الانتهاء (< 60 يوم)';
                    } else if (daysRemaining <= 90) {
                      badgeColor = 'bg-yellow-100 text-yellow-800 border-yellow-300';
                      statusLabel = 'متابعة (< 90 يوم)';
                    }

                    return (
                      <tr key={batch.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-3.5">
                          <div>
                            <p className="font-extrabold text-slate-900 text-xs">{med?.commercialName}</p>
                            <p className="text-[10px] text-slate-400">{med?.scientificName}</p>
                          </div>
                        </td>

                        <td className="p-3.5 font-mono font-bold text-slate-800">
                          {batch.batchNumber}
                        </td>

                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5 font-bold text-slate-800">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{batch.expiryDate}</span>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <span className={`font-black ${daysRemaining <= 60 ? 'text-rose-600' : 'text-slate-700'}`}>
                            {isExpired ? 'منتهي!' : `${daysRemaining} يوم`}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <div>
                            <span className="font-black text-slate-900">{batch.totalUnitsRemaining} وحدة</span>
                            <span className="text-slate-400 block text-[10px]">
                              شراء: {formatMoney(batch.costPriceSmallestUnit)} / وحدة
                            </span>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <span className="inline-flex items-center gap-1 text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{batch.shelfLocation || 'رف عام'}</span>
                          </span>
                        </td>

                        <td className="p-3.5">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${badgeColor}`}>
                            {statusLabel}
                          </span>
                        </td>

                        <td className="p-3.5 text-center">
                          {!batch.isRecalled ? (
                            <button
                              type="button"
                              onClick={() => setSelectedBatchForRecall(batch)}
                              className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[10px] transition"
                              title="سحب هذه التشغيلة ووقف بيعها فوراً"
                            >
                              سحب تشغيلة
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-bold">تم السحب</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Stock Movement Card */}
      {activeTab === 'movement' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="font-black text-sm text-slate-900">بطاقة حركة المادة التفصيلية</h3>
              <p className="text-xs text-slate-500">
                سجل تتبع تدفق الصنف: رصيد افتتاحي، مشتريات، مبيعات، مرتجعات، تالف، والرصيد النهائي
              </p>
            </div>

            <div className="w-full sm:w-72">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">اختر المادة الصيدلانية:</label>
              <select
                value={selectedMovementItemId}
                onChange={e => setSelectedMovementItemId(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-300 font-bold text-xs bg-slate-50"
              >
                {medicines.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.commercialName} ({m.concentration})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Movement Summary Cards */}
          {(() => {
            const med = medicines.find(m => m.id === selectedMovementItemId);
            const itemBatches = branchBatches.filter(b => b.itemId === selectedMovementItemId);
            const totalRemaining = itemBatches.reduce((sum, b) => sum + b.totalUnitsRemaining, 0);

            return (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-xs font-bold block mb-1">المادة المحددة</span>
                  <p className="font-black text-sm text-slate-900">{med?.commercialName}</p>
                  <p className="text-[10px] text-slate-400">{med?.scientificName}</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-xs font-bold block mb-1">الرصيد الفعلي الحالي</span>
                  <p className="font-black text-xl text-emerald-800">{totalRemaining} وحدة</p>
                  <p className="text-[10px] text-slate-400">موزعة على {itemBatches.length} تشغيلات</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-xs font-bold block mb-1">إجمالي المشتريات المسجلة</span>
                  <p className="font-black text-xl text-blue-700">
                    {itemBatches.reduce((sum, b) => sum + (b.initialQuantitySmallestUnit || b.totalUnitsRemaining), 0)} وحدة
                  </p>
                  <p className="text-[10px] text-slate-400">من الشركات المجهزة</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-xs font-bold block mb-1">إجمالي المبيعات المخصومة</span>
                  <p className="font-black text-xl text-purple-700">
                    {itemBatches.reduce((sum, b) => sum + Math.max(0, (b.initialQuantitySmallestUnit || b.totalUnitsRemaining) - b.totalUnitsRemaining), 0)} وحدة
                  </p>
                  <p className="text-[10px] text-slate-400">مباعة عبر الكاشير بنظام FEFO</p>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Tab 3: Physical Inventory Audit (الجرد والتسوية) */}
      {activeTab === 'audit' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="font-black text-sm text-slate-900 flex items-center gap-1.5">
              <ScanLine className="w-4 h-4 text-emerald-600" />
              جلسة جرد فعلي ومطابقة المخزون
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              مطابقة الكميات المحسوبة على الأرفف مع الرصيد الدفتري وتسجيل الفروقات (عجز أو زيادة) واعتماد التسوية
            </p>
          </div>

          {auditSuccessMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{auditSuccessMessage}</span>
            </div>
          )}

          <form onSubmit={handleAuditSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">المادة المراد جردها</label>
              <select
                value={auditItemId}
                onChange={e => setAuditItemId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
              >
                {medicines.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.commercialName} ({m.concentration})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">الرصيد الفعلي الموجود على الرف (وحدات)</label>
              <input
                type="number"
                min="0"
                value={actualUnitsFound}
                onChange={e => setActualUnitsFound(parseInt(e.target.value) || 0)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-black text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">ملاحظات ومبرر التسوية</label>
              <input
                type="text"
                value={auditNotes}
                onChange={e => setAuditNotes(e.target.value)}
                placeholder="مثال: تلف أثناء التخزين / بونص غير مسجل"
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div className="md:col-span-3 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20 transition"
              >
                تطبيق التسوية المخزنية وتحديث الرصيد
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Recall Batch Confirmation Modal */}
      {selectedBatchForRecall && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in">
            <div className="p-4 bg-rose-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="font-black text-sm">سحب تشغيلة دوائية (Emergency Recall)</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBatchForRecall(null)}
                className="text-white/80 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 space-y-1">
                <p className="font-bold">تنبيه أمان صيدلاني هام:</p>
                <p className="text-[11px] leading-relaxed">
                  سيتم فوراً إيقاف بيع التشغيلة رقم{' '}
                  <span className="font-mono font-bold">{selectedBatchForRecall.batchNumber}</span> وحجبها عن شاشة
                  الكاشير (POS). الكمية المتبقية ({selectedBatchForRecall.totalUnitsRemaining} وحدة) سيتم تحويلها لملف
                  المرتجعات للمورد أو الإتلاف.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">سبب السحب / القرار الرسمي:</label>
                <textarea
                  rows={3}
                  value={recallReason}
                  onChange={e => setRecallReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedBatchForRecall(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRecall}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-600/20"
                >
                  تأكيد سحب التشغيلة فوراً
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
