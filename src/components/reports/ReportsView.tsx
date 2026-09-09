import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import {
  BarChart3,
  TrendingUp,
  Download,
  Printer,
  DollarSign,
  Boxes,
  Truck,
  Users,
  Calendar,
  FileSpreadsheet,
  CheckCircle2,
  PieChart
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const {
    salesInvoices,
    purchaseInvoices,
    medicines,
    batches,
    suppliers,
    treasuryTransactions,
    formatMoney,
    currentBranch
  } = usePharmacy();

  const [reportType, setReportType] = useState<'sales' | 'profit' | 'inventory' | 'suppliers'>('profit');
  const [dateRange, setDateRange] = useState<'today' | 'month' | 'year' | 'all'>('month');

  // Calculations for Financial P&L (قائمة الأرباح والخسائر)
  const totalRevenue = salesInvoices.reduce((sum, s) => sum + s.netTotal, 0);
  const totalProfitFromSales = salesInvoices.reduce((sum, s) => sum + s.profit, 0);
  const totalCostOfGoodsSold = totalRevenue - totalProfitFromSales;

  const totalOperatingExpenses = treasuryTransactions
    .filter(t => t.type === 'outflow' && t.category !== 'سداد مورد')
    .reduce((sum, t) => sum + t.amount, 0);

  const netRealProfit = totalProfitFromSales - totalOperatingExpenses;

  // Stock valuation
  const totalStockAtCost = batches.reduce(
    (sum, b) => (b.branchId === currentBranch.id ? sum + b.totalUnitsRemaining * b.costPriceSmallestUnit : sum),
    0
  );

  // Sales by Category Breakdown
  const categorySalesMap: { [cat: string]: number } = {};
  salesInvoices.forEach(inv => {
    inv.items.forEach(it => {
      const med = medicines.find(m => m.id === it.itemId);
      const cat = med?.category || 'أدوية';
      categorySalesMap[cat] = (categorySalesMap[cat] || 0) + it.total;
    });
  });

  // Export to CSV helper
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,\uFEFF';

    if (reportType === 'sales') {
      csvContent += 'رقم الفاتورة,التاريخ,الزبون,الكاشير,طريقة الدفع,المجموع الصافي,الربح\n';
      salesInvoices.forEach(inv => {
        csvContent += `"${inv.invoiceNumber}","${inv.date}","${inv.customerName}","${inv.cashierName}","${inv.paymentMethod}",${inv.netTotal},${inv.profit}\n`;
      });
    } else {
      csvContent += 'البند,القيمة (د.ع)\n';
      csvContent += `إجمالي المبيعات,${totalRevenue}\n`;
      csvContent += `تكلفة البضاعة المباعة (COGS),${totalCostOfGoodsSold}\n`;
      csvContent += `مجمل الربح,${totalProfitFromSales}\n`;
      csvContent += `المصروفات التشغيلية,${totalOperatingExpenses}\n`;
      csvContent += `صافي الربح الحقيقي,${netRealProfit}\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pharmacy_report_${reportType}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-100 text-purple-800">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-slate-900">التقارير المالية والتحليلات الصيدلانية</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            قائمة الأرباح والخسائر، تحليل تكلفة البضاعة المباعة (COGS)، المصروفات، والتقارير الرقابية
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
          >
            <Download className="w-4 h-4" />
            <span>تصدير Excel / CSV</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-md transition"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة التقرير</span>
          </button>
        </div>
      </div>

      {/* Report Types Tabs */}
      <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold w-fit">
        <button
          type="button"
          onClick={() => setReportType('profit')}
          className={`px-4 py-2 rounded-lg transition ${
            reportType === 'profit' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
          }`}
        >
          قائمة الدخل والأرباح (P&L)
        </button>
        <button
          type="button"
          onClick={() => setReportType('sales')}
          className={`px-4 py-2 rounded-lg transition ${
            reportType === 'sales' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
          }`}
        >
          تقرير حركة المبيعات
        </button>
        <button
          type="button"
          onClick={() => setReportType('inventory')}
          className={`px-4 py-2 rounded-lg transition ${
            reportType === 'inventory' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
          }`}
        >
          تقييم المخزون وركود المواد
        </button>
        <button
          type="button"
          onClick={() => setReportType('suppliers')}
          className={`px-4 py-2 rounded-lg transition ${
            reportType === 'suppliers' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
          }`}
        >
          تقرير كشوفات الموردين
        </button>
      </div>

      {/* Tab: Profit & Loss Statement (قائمة الأرباح والخسائر) */}
      {reportType === 'profit' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-black text-slate-900">
                قائمة الأرباح والخسائر المالية (Income Statement)
              </h2>
              <p className="text-xs text-slate-500">
                حساب دقيق لصافي الربح بعد خصم تكلفة الشراء والمصروفات التشغيلية
              </p>
            </div>

            <div className="space-y-3 font-medium text-xs">
              {/* Gross Sales */}
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="font-black text-slate-900 text-sm block">إجمالي إيرادات المبيعات</span>
                  <span className="text-[11px] text-slate-500">من فواتير البيع الصادرة عبر الكاشير</span>
                </div>
                <span className="font-black text-base text-slate-900">{formatMoney(totalRevenue)}</span>
              </div>

              {/* COGS */}
              <div className="flex justify-between items-center p-3 rounded-xl bg-rose-50/50 border border-rose-200">
                <div>
                  <span className="font-black text-rose-900 text-sm block">
                    (-) تكلفة البضاعة المباعة (COGS)
                  </span>
                  <span className="text-[11px] text-rose-600">سعر شراء الأدوية المصروفة من المخزن</span>
                </div>
                <span className="font-black text-base text-rose-700">- {formatMoney(totalCostOfGoodsSold)}</span>
              </div>

              {/* Gross Profit */}
              <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-50 border border-emerald-300">
                <div>
                  <span className="font-black text-emerald-950 text-sm block">(=) مجمل الربح الصيدلاني</span>
                  <span className="text-[11px] text-emerald-700">الفارق بين سعر البيع وتكلفة الشراء</span>
                </div>
                <span className="font-black text-lg text-emerald-900">{formatMoney(totalProfitFromSales)}</span>
              </div>

              {/* Operating Expenses */}
              <div className="flex justify-between items-center p-3 rounded-xl bg-amber-50/50 border border-amber-200">
                <div>
                  <span className="font-black text-amber-900 text-sm block">
                    (-) المصروفات التشغيلية للصيدلية
                  </span>
                  <span className="text-[11px] text-amber-700">إيجار، كهرباء ومولدة، رواتب، ونثريات</span>
                </div>
                <span className="font-black text-base text-amber-800">- {formatMoney(totalOperatingExpenses)}</span>
              </div>

              {/* Net Profit */}
              <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-l from-emerald-800 to-teal-800 text-white shadow-md">
                <div>
                  <span className="font-black text-base block">(=) صافي الربح الحقيقي الصافي</span>
                  <span className="text-[11px] text-emerald-200">الأرباح النهائية الصافية لمالك الصيدلية</span>
                </div>
                <span className="font-black text-2xl">{formatMoney(netRealProfit)}</span>
              </div>
            </div>
          </div>

          {/* Category Sales Share */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="font-black text-sm text-slate-900 mb-3">توزيع المبيعات حسب التصنيف</h3>
            <div className="space-y-2.5">
              {Object.entries(categorySalesMap).map(([cat, total], idx) => {
                const percentage = totalRevenue > 0 ? ((total / totalRevenue) * 100).toFixed(1) : 0;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-800">
                      <span>{cat}</span>
                      <span>
                        {formatMoney(total)} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Sales History */}
      {reportType === 'sales' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-black text-sm text-slate-900">سجل فواتير المبيعات التفصيلي</h2>
            <span className="text-xs text-slate-500">{salesInvoices.length} فاتورة</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                <tr>
                  <th className="p-3.5">رقم الفاتورة</th>
                  <th className="p-3.5">التاريخ والوقت</th>
                  <th className="p-3.5">الزبون</th>
                  <th className="p-3.5">الكاشير</th>
                  <th className="p-3.5">طريقة الدفع</th>
                  <th className="p-3.5">المجموع الصافي</th>
                  <th className="p-3.5">الربح المحقق</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {salesInvoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-50/80">
                    <td className="p-3.5 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                    <td className="p-3.5 text-slate-500">
                      {inv.date} {inv.time}
                    </td>
                    <td className="p-3.5 font-medium text-slate-800">{inv.customerName}</td>
                    <td className="p-3.5 text-slate-600">{inv.cashierName}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100">
                        {inv.paymentMethod === 'cash' ? 'نقدي' : inv.paymentMethod === 'card' ? 'بطاقة' : 'آجل'}
                      </span>
                    </td>
                    <td className="p-3.5 font-black text-emerald-800">{formatMoney(inv.netTotal)}</td>
                    <td className="p-3.5 font-bold text-slate-700">{formatMoney(inv.profit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Inventory & Stagnant Items */}
      {reportType === 'inventory' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 block mb-1">
                إجمالي قيمة المخزون الحالي (بسعر التكلفة)
              </span>
              <div className="text-2xl font-black text-purple-700">{formatMoney(totalStockAtCost)}</div>
              <p className="text-[11px] text-slate-400 mt-1">القيمة الرأسمالية للمواد الموجودة على الأرفف</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 block mb-1">
                إجمالي التشغيلات النشطة في الفرع
              </span>
              <div className="text-2xl font-black text-slate-900">
                {batches.filter(b => b.branchId === currentBranch.id && b.totalUnitsRemaining > 0).length} تشغيلة
              </div>
              <p className="text-[11px] text-slate-400 mt-1">تدار بالكامل بنظام FEFO</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Suppliers Statement Report */}
      {reportType === 'suppliers' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h2 className="font-black text-sm text-slate-900">تقرير المديونية والمستحقات للشركات المجهزة</h2>
          </div>

          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
              <tr>
                <th className="p-3.5">الشركة المجهزة</th>
                <th className="p-3.5">إجمالي المشتريات</th>
                <th className="p-3.5">المسدد</th>
                <th className="p-3.5">الدين المتبقي</th>
                <th className="p-3.5">موعد الدفعة القادمة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {suppliers.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/80">
                  <td className="p-3.5 font-bold text-slate-900">{s.companyName}</td>
                  <td className="p-3.5">{formatMoney(s.totalPurchases)}</td>
                  <td className="p-3.5 text-emerald-700 font-bold">{formatMoney(s.totalPaid)}</td>
                  <td className="p-3.5 text-rose-600 font-black">{formatMoney(s.balanceDebt)}</td>
                  <td className="p-3.5 text-slate-600">{s.nextPaymentDate || 'لا توجد'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
