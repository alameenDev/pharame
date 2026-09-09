import React from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Boxes,
  AlertTriangle,
  Clock,
  Truck,
  Users,
  CreditCard,
  PackageX,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  CheckCircle2,
  Calendar,
  Sparkles,
  Layers,
  ChevronLeft
} from 'lucide-react';

export const OwnerDashboard: React.FC = () => {
  const {
    currentPharmacy,
    currentBranch,
    medicines,
    batches,
    salesInvoices,
    purchaseInvoices,
    suppliers,
    formatMoney,
    setActiveView,
    getTotalItemStock,
    expiringBatchesCount,
    lowStockCount,
    outOfStockCount,
    pendingSupplierDuesCount
  } = usePharmacy();

  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonthStr = todayStr.substring(0, 7);

  // Filter sales for today and this month
  const todaySalesInvoices = salesInvoices.filter(s => s.date === todayStr && s.status === 'completed');
  const monthSalesInvoices = salesInvoices.filter(s => s.date.startsWith(currentMonthStr) && s.status === 'completed');

  const todaySalesTotal = todaySalesInvoices.reduce((sum, s) => sum + s.netTotal, 0);
  const monthSalesTotal = monthSalesInvoices.reduce((sum, s) => sum + s.netTotal, 0);
  const todayProfitTotal = todaySalesInvoices.reduce((sum, s) => sum + s.profit, 0);
  const monthProfitTotal = monthSalesInvoices.reduce((sum, s) => sum + s.profit, 0);
  const todayInvoicesCount = todaySalesInvoices.length;

  // Inventory valuation at cost vs at selling price
  let stockValueAtCost = 0;
  let stockValueAtSale = 0;

  batches.forEach(b => {
    if (b.branchId === currentBranch.id && b.totalUnitsRemaining > 0 && !b.isRecalled) {
      stockValueAtCost += b.totalUnitsRemaining * b.costPriceSmallestUnit;
      const med = medicines.find(m => m.id === b.itemId);
      if (med) {
        // unit price per tablet/smallest unit
        const sellingSmallest = med.packaging.tablet.enabled
          ? med.packaging.tablet.sellingPrice
          : med.packaging.box.sellingPrice / ((med.packaging.strip.unitsInsideParent || 1) * (med.packaging.box.unitsInsideParent || 1));
        stockValueAtSale += b.totalUnitsRemaining * (sellingSmallest || b.costPriceSmallestUnit * 1.3);
      }
    }
  });

  // Supplier payables & paid
  const totalDebtToSuppliers = suppliers.reduce((sum, s) => sum + s.balanceDebt, 0);
  const totalPaidToSuppliers = suppliers.reduce((sum, s) => sum + s.totalPaid, 0);
  const dueSoonAmount = suppliers.reduce((sum, s) => sum + (s.nextPaymentAmount || 0), 0);

  // Sales breakdown by payment method
  const cashSales = todaySalesInvoices.filter(s => s.paymentMethod === 'cash').reduce((sum, s) => sum + s.netTotal, 0);
  const cardSales = todaySalesInvoices.filter(s => s.paymentMethod === 'card').reduce((sum, s) => sum + s.netTotal, 0);
  const creditSales = todaySalesInvoices.filter(s => s.paymentMethod === 'deferred').reduce((sum, s) => sum + s.netTotal, 0);

  // Sales by Cashier
  const cashierMap: { [name: string]: { count: number; total: number } } = {};
  salesInvoices.forEach(s => {
    if (!cashierMap[s.cashierName]) {
      cashierMap[s.cashierName] = { count: 0, total: 0 };
    }
    cashierMap[s.cashierName].count += 1;
    cashierMap[s.cashierName].total += s.netTotal;
  });

  // Top selling medicines (aggregate from all sales)
  const itemSalesCount: { [id: string]: { name: string; qty: number; total: number } } = {};
  salesInvoices.forEach(inv => {
    inv.items.forEach(it => {
      if (!itemSalesCount[it.itemId]) {
        itemSalesCount[it.itemId] = { name: it.itemName, qty: 0, total: 0 };
      }
      itemSalesCount[it.itemId].qty += it.quantity;
      itemSalesCount[it.itemId].total += it.total;
    });
  });

  const topSellingItems = Object.values(itemSalesCount).sort((a, b) => b.qty - a.qty).slice(0, 5);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Top Banner: Pharmacy Info & Quick POS Action */}
      <div className="bg-gradient-to-l from-emerald-700 via-teal-700 to-emerald-800 rounded-2xl p-5 text-white shadow-lg shadow-emerald-800/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/30 text-emerald-100 border border-emerald-400/40">
              {currentBranch.name}
            </span>
            <span className="text-xs text-emerald-100 font-medium">
              الفرع الرئيسي • {currentPharmacy.governorate}
            </span>
          </div>
          <h1 className="text-xl lg:text-2xl font-black tracking-tight">{currentPharmacy.name}</h1>
          <p className="text-xs text-emerald-100 mt-1 max-w-xl">
            متابعة حية وشاملة لمبيعات اليوم، تدفقات الصندوق، حركة المخزون بنظام FEFO ومستحقات شركات الأدوية
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveView('pos')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-emerald-800 font-black text-xs hover:bg-emerald-50 transition shadow-md active:scale-95"
          >
            <ShoppingCart className="w-4 h-4 text-emerald-600" />
            <span>فتح نقطة البيع السريعة</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView('purchases')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/40 hover:bg-emerald-600/60 border border-white/20 text-white font-bold text-xs transition"
          >
            <FileText className="w-4 h-4" />
            <span>إدخال فاتورة مشتريات</span>
          </button>
        </div>
      </div>

      {/* Row 1: Primary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Today Sales */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">مبيعات اليوم</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{formatMoney(todaySalesTotal)}</div>
          <div className="flex items-center justify-between mt-2 text-[11px]">
            <span className="text-slate-500 font-medium">{todayInvoicesCount} فاتورة بيع</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
              ربح: {formatMoney(todayProfitTotal)}
            </span>
          </div>
        </div>

        {/* Month Sales */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">مبيعات الشهر الحالي</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{formatMoney(monthSalesTotal)}</div>
          <div className="flex items-center justify-between mt-2 text-[11px]">
            <span className="text-slate-500 font-medium">صافي الأرباح</span>
            <span className="text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
              {formatMoney(monthProfitTotal)}
            </span>
          </div>
        </div>

        {/* Stock Value at Cost */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">المخزون (بسعر الشراء)</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900">{formatMoney(stockValueAtCost)}</div>
          <div className="flex items-center justify-between mt-2 text-[11px]">
            <span className="text-slate-500 font-medium">بسعر البيع المقدر</span>
            <span className="text-purple-700 font-bold bg-purple-50 px-1.5 py-0.5 rounded">
              {formatMoney(stockValueAtSale)}
            </span>
          </div>
        </div>

        {/* Suppliers Dues */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">ديون ومستحقات الموردين</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-amber-700">{formatMoney(totalDebtToSuppliers)}</div>
          <div className="flex items-center justify-between mt-2 text-[11px]">
            <span className="text-slate-500 font-medium">مستحقة قريباً</span>
            <span className="text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
              {formatMoney(dueSoonAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Smart Inventory Alerts & Payment Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Inventory Radar Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                رادار المخزون وتواريخ الصلاحية (نظام FEFO)
              </h2>
              <p className="text-[11px] text-slate-500">
                متابعة حركة المواد، التواريخ الأقرب للانتهاء، والأدوية تحت الحد الأدنى
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveView('inventory')}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
            >
              <span>تفاصيل المخزون والجرد</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div
              onClick={() => setActiveView('inventory')}
              className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-50 cursor-pointer transition"
            >
              <div className="flex items-center justify-between text-amber-800 mb-1">
                <span className="text-xs font-bold">تنتهي قريباً (30-60 يوم)</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-amber-900">{expiringBatchesCount}</div>
              <p className="text-[10px] text-amber-700 mt-1">يجب تصريفها أو طلب إرجاع للمورد</p>
            </div>

            <div
              onClick={() => setActiveView('inventory')}
              className="p-3.5 rounded-xl border border-orange-200 bg-orange-50/50 hover:bg-orange-50 cursor-pointer transition"
            >
              <div className="flex items-center justify-between text-orange-800 mb-1">
                <span className="text-xs font-bold">قريبة من النفاد (الحد الأدنى)</span>
                <AlertTriangle className="w-4 h-4 text-orange-600" />
              </div>
              <div className="text-2xl font-black text-orange-900">{lowStockCount}</div>
              <p className="text-[10px] text-orange-700 mt-1">تجاوزت نقطة إعادة الطلب</p>
            </div>

            <div
              onClick={() => setActiveView('inventory')}
              className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-50 cursor-pointer transition"
            >
              <div className="flex items-center justify-between text-rose-800 mb-1">
                <span className="text-xs font-bold">مواد نافدة بالكامل</span>
                <PackageX className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-2xl font-black text-rose-900">{outOfStockCount}</div>
              <p className="text-[10px] text-rose-700 mt-1">رصيد المخزن حالياً صفر</p>
            </div>
          </div>
        </div>

        {/* Payment Methods Breakdown */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              طرق دفع مبيعات اليوم
            </h2>
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                <span>نقدي (كاش في الصندوق)</span>
                <span>{formatMoney(cashSales)}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2 rounded-full"
                  style={{ width: `${todaySalesTotal > 0 ? (cashSales / todaySalesTotal) * 100 : 80}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                <span>إلكتروني (زين كاش / كي كارد / ماستر)</span>
                <span>{formatMoney(cardSales)}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${todaySalesTotal > 0 ? (cardSales / todaySalesTotal) * 100 : 20}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                <span>آجل / ذمم زبائن</span>
                <span>{formatMoney(creditSales)}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-amber-500 h-2 rounded-full"
                  style={{ width: `${todaySalesTotal > 0 ? (creditSales / todaySalesTotal) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
              <span>إجمالي مقبوضات الصندوق اليوم:</span>
              <span className="font-black text-slate-900">{formatMoney(todaySalesTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Top Selling Items & Recent Sales Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Selling Medicines */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <h2 className="text-sm font-black text-slate-900">أكثر الأدوية والمواد طلباً</h2>
            <button
              type="button"
              onClick={() => setActiveView('reports')}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-bold"
            >
              التقرير المفصل
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {topSellingItems.map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-700 font-black text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{item.name}</p>
                    <p className="text-[10px] text-slate-400">إجمالي المبيعات: {formatMoney(item.total)}</p>
                  </div>
                </div>
                <div className="text-left">
                  <span className="text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                    {item.qty} وحدة مباعة
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Sales Transactions */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <h2 className="text-sm font-black text-slate-900">آخر فواتير المبيعات المسجلة</h2>
            <button
              type="button"
              onClick={() => setActiveView('pos')}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-bold"
            >
              عرض الكل
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {salesInvoices.slice(0, 5).map(inv => (
              <div key={inv.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-800">{inv.invoiceNumber}</span>
                    <span className="text-[10px] text-slate-400">{inv.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {inv.customerName} • الكاشير: {inv.cashierName}
                  </p>
                </div>

                <div className="text-left">
                  <span className="font-black text-emerald-700 block">{formatMoney(inv.netTotal)}</span>
                  <span className="text-[10px] text-slate-400">
                    {inv.paymentMethod === 'cash' ? 'نقدي' : inv.paymentMethod === 'card' ? 'بطاقة' : 'آجل'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Cashier Performance & Recent Purchases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sales by Cashier */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <h2 className="text-sm font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">
            المبيعات حسب الكاشير والموظف
          </h2>
          <div className="space-y-3">
            {Object.entries(cashierMap).map(([name, data], idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{name}</p>
                    <p className="text-[10px] text-slate-500">{data.count} عملية بيع ناجحة</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-xs font-black text-emerald-700">{formatMoney(data.total)}</p>
                  <p className="text-[10px] text-slate-400">إجمالي المبيعات</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Purchase Invoices */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <h2 className="text-sm font-black text-slate-900">آخر طلبيات وفواتير المشتريات</h2>
            <button
              type="button"
              onClick={() => setActiveView('purchases')}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-bold"
            >
              عرض المشتريات
            </button>
          </div>

          <div className="space-y-2.5">
            {purchaseInvoices.slice(0, 3).map(inv => {
              const supplier = suppliers.find(s => s.id === inv.supplierId);
              return (
                <div key={inv.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900">{inv.invoiceNumber}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                          inv.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {inv.status === 'paid' ? 'مدفوعة' : 'مسددة جزئياً'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">
                      {supplier?.companyName || 'شركة مجهزة'} • {inv.invoiceDate}
                    </p>
                  </div>

                  <div className="text-left">
                    <p className="font-black text-slate-900">{formatMoney(inv.totalAmount)}</p>
                    {inv.remainingAmount > 0 && (
                      <p className="text-[10px] text-rose-600 font-bold">
                        متبقي: {formatMoney(inv.remainingAmount)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
