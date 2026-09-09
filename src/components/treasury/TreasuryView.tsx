import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { TreasuryTransaction } from '../../types/pharmacy';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  DollarSign,
  Calendar,
  CheckCircle2,
  FileText,
  Clock,
  Coins,
  Printer,
  Receipt,
  Lock,
  Scale,
  AlertCircle
} from 'lucide-react';

export const TreasuryView: React.FC = () => {
  const {
    treasuryTransactions,
    addTreasuryTransaction,
    salesInvoices,
    supplierPayments,
    formatMoney,
    currentUser,
    currentPharmacy,
    currentBranch
  } = usePharmacy();

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isShiftCloseModalOpen, setIsShiftCloseModalOpen] = useState(false);
  const [showZReportPrint, setShowZReportPrint] = useState(false);

  // Expense form
  const [expenseCategory, setExpenseCategory] = useState('رواتب وأجور');
  const [expenseAmount, setExpenseAmount] = useState<number>(50000);
  const [expenseDescription, setExpenseDescription] = useState('أجور كهرباء ومولدة الصيدلية');

  // Income form
  const [incomeCategory, setIncomeCategory] = useState('إيداع صاحب الصيدلية');
  const [incomeAmount, setIncomeAmount] = useState<number>(200000);
  const [incomeDescription, setIncomeDescription] = useState('إيداع سيولة إضافية في صندوق الصيدلية');

  // Shift Close Form
  const [actualCashInDrawer, setActualCashInDrawer] = useState<number>(0);
  const [shiftNotes, setShiftNotes] = useState('');

  // Treasury Calculations
  const todayStr = new Date().toISOString().split('T')[0];
  const totalIn = treasuryTransactions
    .filter(t => t.type === 'inflow')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalOut = treasuryTransactions
    .filter(t => t.type === 'outflow')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentCashInRegister = Math.max(0, totalIn - totalOut);

  // Today specific
  const todayIn = treasuryTransactions
    .filter(t => t.type === 'inflow' && t.date === todayStr)
    .reduce((sum, t) => sum + t.amount, 0);
  const todayOut = treasuryTransactions
    .filter(t => t.type === 'outflow' && t.date === todayStr)
    .reduce((sum, t) => sum + t.amount, 0);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (expenseAmount <= 0) return;
    addTreasuryTransaction({
      type: 'outflow',
      category: expenseCategory,
      amount: expenseAmount,
      description: expenseDescription,
      paymentMethod: 'cash'
    });
    setIsExpenseModalOpen(false);
  };

  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (incomeAmount <= 0) return;
    addTreasuryTransaction({
      type: 'inflow',
      category: incomeCategory,
      amount: incomeAmount,
      description: incomeDescription,
      paymentMethod: 'cash'
    });
    setIsIncomeModalOpen(false);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Wallet className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-slate-900">الصندوق والمصروفات اليومية (الخزينة)</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            متابعة حركة النقد الفعلي، مقبوضات المبيعات، المصروفات التشغيلية، ومطابقة عهدة الكاشير
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActualCashInDrawer(currentCashInRegister);
              setIsShiftCloseModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-md transition active:scale-95"
          >
            <Lock className="w-4 h-4 text-amber-400" />
            <span>إغلاق الوردية وجرد الكاشير (Z-Report)</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpenseModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition active:scale-95"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>تسجيل سند صرف / مصروف</span>
          </button>

          <button
            type="button"
            onClick={() => setIsIncomeModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition active:scale-95"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>تسجيل إيداع نقدي</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Net Cash In Box */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block mb-1">الرصيد النقدي المتوفر حالياً في الصندوق</span>
          <div className="text-3xl font-black text-emerald-800">{formatMoney(currentCashInRegister)}</div>
          <p className="text-[11px] text-slate-400 mt-1">مطابق للسيولة الفعلية في درج الكاشير</p>
        </div>

        {/* Today Inflow */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block mb-1">إجمالي مقبوضات اليوم (وارد)</span>
          <div className="text-2xl font-black text-teal-700">{formatMoney(todayIn)}</div>
          <p className="text-[11px] text-slate-400 mt-1">مبيعات نقدية وإيداعات</p>
        </div>

        {/* Today Outflow */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block mb-1">إجمالي مصروفات اليوم (صادر)</span>
          <div className="text-2xl font-black text-rose-600">{formatMoney(todayOut)}</div>
          <p className="text-[11px] text-slate-400 mt-1">مصروفات تشغيلية ودفعات موردين</p>
        </div>
      </div>

      {/* Transactions History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-black text-sm text-slate-900">سجل حركات وسندات الصندوق</h2>
          <span className="text-xs font-bold text-slate-500">{treasuryTransactions.length} حركة مسجلة</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
              <tr>
                <th className="p-3.5">النوع</th>
                <th className="p-3.5">التصنيف / الباب</th>
                <th className="p-3.5">البيان والشرح</th>
                <th className="p-3.5">المبلغ</th>
                <th className="p-3.5">التاريخ والوقت</th>
                <th className="p-3.5">المسؤول</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {treasuryTransactions.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        t.type === 'inflow'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {t.type === 'inflow' ? (
                        <>
                          <ArrowUpRight className="w-3 h-3" /> مقبوضات (وارد)
                        </>
                      ) : (
                        <>
                          <ArrowDownLeft className="w-3 h-3" /> مدفوعات (صادر)
                        </>
                      )}
                    </span>
                  </td>

                  <td className="p-3.5 font-bold text-slate-800">{t.category}</td>

                  <td className="p-3.5 text-slate-600">{t.description}</td>

                  <td className="p-3.5">
                    <span
                      className={`font-black text-sm ${
                        t.type === 'inflow' ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {t.type === 'inflow' ? '+' : '-'} {formatMoney(t.amount)}
                    </span>
                  </td>

                  <td className="p-3.5 text-slate-500 text-[11px]">
                    {t.date} {t.time}
                  </td>

                  <td className="p-3.5 text-slate-700 font-medium">{t.performedByName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Expense */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in">
            <div className="p-4 bg-rose-700 text-white flex items-center justify-between">
              <h3 className="font-black text-sm">تسجيل سند صرف / مصروف</h3>
              <button type="button" onClick={() => setIsExpenseModalOpen(false)} className="text-white/80 font-bold">
                ✕
              </button>
            </div>
            <form onSubmit={handleAddExpense} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">باب المصروف *</label>
                <select
                  value={expenseCategory}
                  onChange={e => setExpenseCategory(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 font-bold"
                >
                  <option value="رواتب وأجور">رواتب وأجور موظفين</option>
                  <option value="إيجار">إيجار الصيدلية</option>
                  <option value="كهرباء ومولدة">كهرباء ومولدة ديزل</option>
                  <option value="صيانة وتشغيل">صيانة أجهزة وتكييف</option>
                  <option value="مستلزمات مكتبية">مطبوعات وورق حراري</option>
                  <option value="ضيافة ونظافة">ضيافة ونظافة</option>
                  <option value="نثريات عامة">نثريات ومصروفات أخرى</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">المبلغ المصروف *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={expenseAmount}
                  onChange={e => setExpenseAmount(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 rounded-xl border border-slate-300 font-black text-rose-700 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">البيان / الوصف</label>
                <input
                  type="text"
                  required
                  value={expenseDescription}
                  onChange={e => setExpenseDescription(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
                >
                  تأكيد الصرف وخصم الصندوق
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Income */}
      {isIncomeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in">
            <div className="p-4 bg-emerald-700 text-white flex items-center justify-between">
              <h3 className="font-black text-sm">تسجيل سند قبض / إيداع نقدي</h3>
              <button type="button" onClick={() => setIsIncomeModalOpen(false)} className="text-white/80 font-bold">
                ✕
              </button>
            </div>
            <form onSubmit={handleAddIncome} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">مصدر الإيداع *</label>
                <select
                  value={incomeCategory}
                  onChange={e => setIncomeCategory(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 font-bold"
                >
                  <option value="إيداع صاحب الصيدلية">إيداع رأسمال من صاحب الصيدلية</option>
                  <option value="تحصيل ذمة زبون">تحصيل ذمة زبون آجل</option>
                  <option value="إيرادات أخرى">إيرادات متنوعة</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">المبلغ المودع *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={incomeAmount}
                  onChange={e => setIncomeAmount(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 rounded-xl border border-slate-300 font-black text-emerald-800 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">البيان / الوصف</label>
                <input
                  type="text"
                  required
                  value={incomeDescription}
                  onChange={e => setIncomeDescription(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsIncomeModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  تأكيد الإيداع في الصندوق
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Shift Close & Z-Report (إغلاق الوردية وجرد الصندوق) */}
      {isShiftCloseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[95vh] flex flex-col animate-in fade-in">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-black text-sm">إغلاق الوردية اليومية وجرد الصندوق (Z-Report)</h3>
                  <p className="text-[10px] text-slate-400">مطابقة النقد الفعلي مع النظام وتسليم العهدة</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsShiftCloseModalOpen(false)}
                className="text-white/80 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto text-xs flex-1">
              {/* Cash Register Comparison Table */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex justify-between items-center text-slate-600 font-bold">
                  <span>إجمالي مبيعات اليوم النقدية (POS):</span>
                  <span className="font-mono text-emerald-700">{formatMoney(todayIn)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 font-bold">
                  <span>إجمالي المصروفات وسندات الصرف اليوم:</span>
                  <span className="font-mono text-rose-600">- {formatMoney(todayOut)}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-slate-900 font-black text-sm">
                  <span>الرصيد الدفتري المتوقع في الصندوق:</span>
                  <span className="font-mono text-emerald-800">{formatMoney(currentCashInRegister)}</span>
                </div>
              </div>

              {/* Physical Cash Count Input */}
              <div className="space-y-1.5">
                <label className="block font-black text-slate-800">
                  المبلغ النقدي الفعلي المعدود في الدرج (د.ع / $) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={actualCashInDrawer}
                    onChange={e => setActualCashInDrawer(parseFloat(e.target.value) || 0)}
                    className="w-full p-3 rounded-xl border border-slate-300 font-black text-lg text-slate-900 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="أدخل المبلغ بعد عد النقود الفعلية..."
                  />
                  <span className="absolute left-3 top-3.5 text-xs font-bold text-slate-400">العد الفعلي</span>
                </div>
              </div>

              {/* Variance Analysis (مطابقة / عجز / زيادة) */}
              {(() => {
                const variance = actualCashInDrawer - currentCashInRegister;
                const isExact = variance === 0;
                const isShortage = variance < 0;
                return (
                  <div
                    className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                      isExact
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : isShortage
                        ? 'bg-rose-50 border-rose-300 text-rose-800'
                        : 'bg-amber-50 border-amber-300 text-amber-800'
                    }`}
                  >
                    <Scale className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-black text-xs">
                        {isExact
                          ? 'مطابقة تامة بنسبة 100% (لا يوجد عجز أو زيادة)'
                          : isShortage
                          ? `يوجد عجز نقدي بقيمة: ${formatMoney(Math.abs(variance))}`
                          : `يوجد فائض نقدي بقيمة: ${formatMoney(variance)}`}
                      </p>
                      <p className="text-[11px] opacity-90 mt-0.5">
                        {isExact
                          ? 'الصندوق جاهز للترحيل والتصفير وتسليم الوردية التالية.'
                          : isShortage
                          ? 'يرجى مراجعة فواتير الكاشير أو سندات الصرف المسجلة قبل إتمام الإغلاق.'
                          : 'سيتم تسجيل الفائض كبند إيراد غير متوقع في الصندوق.'}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* Cashier Notes */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">ملاحظات تسليم الوردية والكاشير</label>
                <textarea
                  rows={2}
                  value={shiftNotes}
                  onChange={e => setShiftNotes(e.target.value)}
                  placeholder="أي ملاحظات حول فروقات الصندوق، عملات تالفة، أو تسليم الشفت..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              {/* Thermal Z-Report Preview when toggled */}
              {showZReportPrint && (
                <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200 font-mono text-[11px] text-slate-800 space-y-2 print:p-0">
                  <div className="text-center border-b border-dashed border-slate-400 pb-2">
                    <p className="font-bold text-xs">{currentPharmacy.name}</p>
                    <p>{currentBranch.name}</p>
                    <p className="font-black mt-1">تقرير إغلاق الصندوق اليومي (Z-Report)</p>
                    <p className="text-[10px] text-slate-500">
                      التاريخ: {todayStr} | الوقت: {new Date().toLocaleTimeString('ar-IQ')}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>المسؤول / الكاشير:</span>
                      <span>{currentUser.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>الرصيد الدفتري المتوقع:</span>
                      <span>{formatMoney(currentCashInRegister)}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>النقد الفعلي المعدود:</span>
                      <span>{formatMoney(actualCashInDrawer)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-rose-700">
                      <span>الفارق (عجز/زيادة):</span>
                      <span>{formatMoney(actualCashInDrawer - currentCashInRegister)}</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-dashed border-slate-400 flex justify-between text-[10px]">
                    <div>
                      <p>توقيع الكاشير:</p>
                      <p className="mt-4">...............</p>
                    </div>
                    <div>
                      <p>اعتماد المشرف/المدير:</p>
                      <p className="mt-4">...............</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setShowZReportPrint(!showZReportPrint)}
                className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition"
              >
                <Printer className="w-4 h-4" />
                <span>{showZReportPrint ? 'إخفاء معاينة التقرير' : 'معاينة شريط Z-Report'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsShiftCloseModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-white"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const variance = actualCashInDrawer - currentCashInRegister;
                    if (variance !== 0) {
                      addTreasuryTransaction({
                        type: variance > 0 ? 'inflow' : 'outflow',
                        category: variance > 0 ? 'فائض تسوية صندوق' : 'عجز تسوية صندوق',
                        amount: Math.abs(variance),
                        description: `تسوية جرد وإغلاق وردية الكاشير (${currentUser.name}) - ${shiftNotes || 'إغلاق شفت'}`,
                        paymentMethod: 'cash'
                      });
                    }
                    alert('تم إغلاق الوردية وجرد الصندوق بنجاح وتمت مطابقة الأرصدة!');
                    setIsShiftCloseModalOpen(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-md transition"
                >
                  تأكيد إغلاق الوردية والترحيل
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
