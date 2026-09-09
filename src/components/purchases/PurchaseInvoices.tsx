import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { PurchaseInvoice, PurchaseInvoiceItem } from '../../types/pharmacy';

interface LocalInvoiceItemRow {
  itemId: string;
  batchNumber: string;
  productionDate: string;
  expiryDate: string;
  cartonsCount: number;
  extraBoxesCount: number;
  bonusBoxesCount: number;
  cartonCostPrice: number;
  discountPercentage: number;
  suggestedSellingPriceBox: number;
  shelfLocation: string;
}
import {
  FileText,
  Plus,
  Truck,
  Calendar,
  DollarSign,
  Boxes,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Trash2,
  Gift,
  MapPin,
  ArrowDownRight
} from 'lucide-react';

export const PurchaseInvoices: React.FC = () => {
  const {
    purchaseInvoices,
    suppliers,
    medicines,
    currentBranch,
    currentUser,
    addPurchaseInvoice,
    formatMoney
  } = usePharmacy();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'partial' | 'unpaid'>('all');
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);

  // New Invoice Form State
  const [invoiceNumber, setInvoiceNumber] = useState(`PINV-2026-${purchaseInvoices.length + 101}`);
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentTerms, setPaymentTerms] = useState<'cash' | 'deferred' | 'partial'>('deferred');
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');

  // Items in the new purchase invoice
  const [itemsList, setItemsList] = useState<LocalInvoiceItemRow[]>([
    {
      itemId: medicines[0]?.id || '',
      batchNumber: 'BCH-NEW-01',
      productionDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      expiryDate: '2027-12-31',
      cartonsCount: 2,
      extraBoxesCount: 0,
      bonusBoxesCount: 1, // Free bonus box
      cartonCostPrice: 72000,
      discountPercentage: 0,
      suggestedSellingPriceBox: 4000,
      shelfLocation: 'A-1'
    }
  ]);

  const selectedSupplier = suppliers.find(s => s.id === supplierId);

  // Calculate totals of current invoice in progress
  const invoiceSubtotal = itemsList.reduce((sum, it) => {
    const med = medicines.find(m => m.id === it.itemId);
    const boxesPerCarton = med?.packaging.box.unitsInsideParent || 24;
    const totalPurchasedBoxes = it.cartonsCount * boxesPerCarton + it.extraBoxesCount;
    const boxCost = it.cartonCostPrice / boxesPerCarton;
    const itemSubtotal = totalPurchasedBoxes * boxCost * (1 - it.discountPercentage / 100);
    return sum + itemSubtotal;
  }, 0);

  const remainingDebt = Math.max(0, invoiceSubtotal - paidAmount);

  const handleAddItemRow = () => {
    setItemsList(prev => [
      ...prev,
      {
        itemId: medicines[0]?.id || '',
        batchNumber: `BCH-${Math.floor(1000 + Math.random() * 9000)}`,
        productionDate: new Date().toISOString().split('T')[0],
        expiryDate: '2028-06-30',
        cartonsCount: 1,
        extraBoxesCount: 0,
        bonusBoxesCount: 0,
        cartonCostPrice: 60000,
        discountPercentage: 0,
        suggestedSellingPriceBox: 3500,
        shelfLocation: 'رف رئيسي'
      }
    ]);
  };

  const handleRemoveItemRow = (index: number) => {
    setItemsList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (itemsList.length === 0 || !supplierId) return;

    const mappedItems: PurchaseInvoiceItem[] = itemsList.map(it => {
      const med = medicines.find(m => m.id === it.itemId);
      const boxesPerCarton = med?.packaging.box.unitsInsideParent || 24;
      const stripsPerBox = med?.packaging.strip.unitsInsideParent || 2;
      const tabletsPerStrip = med?.packaging.tablet.unitsInsideParent || 10;
      const smallestPerBox = stripsPerBox * tabletsPerStrip;
      const totalBoxes = it.cartonsCount * boxesPerCarton + it.extraBoxesCount + it.bonusBoxesCount;
      const totalSmallestUnits = totalBoxes * smallestPerBox;
      const boxCost = it.cartonCostPrice / boxesPerCarton;
      const purchasedBoxes = it.cartonsCount * boxesPerCarton + it.extraBoxesCount;
      const totalCost = purchasedBoxes * boxCost * (1 - it.discountPercentage / 100);

      return {
        itemId: it.itemId,
        batchNumber: it.batchNumber,
        productionDate: it.productionDate,
        expiryDate: it.expiryDate,
        cartons: it.cartonsCount,
        extraBoxes: it.extraBoxesCount,
        extraStrips: 0,
        extraUnits: 0,
        bonusUnits: it.bonusBoxesCount * smallestPerBox,
        cartonCost: it.cartonCostPrice,
        discountPercent: it.discountPercentage,
        netCost: boxCost * (1 - it.discountPercentage / 100),
        totalSmallestUnits,
        totalCost,
        suggestedSellingPriceBox: it.suggestedSellingPriceBox,
        shelfLocation: it.shelfLocation
      };
    });

    const actualPaid = paymentTerms === 'cash' ? invoiceSubtotal : paidAmount;
    const rem = Math.max(0, invoiceSubtotal - actualPaid);
    const status: 'paid' | 'partial' | 'unpaid' = rem <= 0 ? 'paid' : actualPaid > 0 ? 'partial' : 'unpaid';

    addPurchaseInvoice({
      supplierId,
      branchId: currentBranch.id,
      invoiceNumber,
      invoiceDate,
      receivedDate: invoiceDate,
      receivedBy: currentUser.name,
      paymentType: paymentTerms === 'partial' ? 'installments' : paymentTerms,
      totalAmount: invoiceSubtotal,
      paidAmount: actualPaid,
      discountAmount: 0,
      remainingAmount: rem,
      status,
      dueDate: paymentTerms === 'cash' ? undefined : dueDate,
      notes,
      items: mappedItems
    });

    setIsNewInvoiceOpen(false);
  };

  const filteredInvoices = purchaseInvoices.filter(inv => {
    const supplier = suppliers.find(s => s.id === inv.supplierId);
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier?.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || inv.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-100 text-blue-800">
              <FileText className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-slate-900">فواتير مشتريات الأدوية والطلبيات</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            تسجيل طلبيات الشركات، إنشاء التشغيلات (Batches)، رصد البونص المجاني، وفصل تواريخ الصلاحية
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNewInvoiceOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>إدخال فاتورة مشتريات جديدة</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="بحث برقم الفاتورة، اسم المورد أو الشركة المجهزة..."
            className="w-full pl-3 pr-10 py-2 rounded-xl border border-slate-200 text-xs focus:outline-blue-500 bg-slate-50"
          />
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 rounded-lg transition ${
              filterStatus === 'all' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            الكل
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('paid')}
            className={`px-3 py-1 rounded-lg transition ${
              filterStatus === 'paid' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            مسددة بالكامل
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('partial')}
            className={`px-3 py-1 rounded-lg transition ${
              filterStatus === 'partial' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            مسددة جزئياً
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('unpaid')}
            className={`px-3 py-1 rounded-lg transition ${
              filterStatus === 'unpaid' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            غير مسددة (آجلة)
          </button>
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
              <tr>
                <th className="p-3.5">رقم الفاتورة والتاريخ</th>
                <th className="p-3.5">الشركة المجهزة والمورد</th>
                <th className="p-3.5">عدد المواد والتشغيلات</th>
                <th className="p-3.5">إجمالي الفاتورة</th>
                <th className="p-3.5">المسدد والمتبقي</th>
                <th className="p-3.5">حالة السداد والاستحقاق</th>
                <th className="p-3.5">المستلم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map(inv => {
                const supplier = suppliers.find(s => s.id === inv.supplierId);
                return (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5">
                      <div className="space-y-0.5">
                        <span className="font-extrabold text-slate-900 text-xs block">
                          {inv.invoiceNumber}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {inv.invoiceDate}
                        </span>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div>
                        <p className="font-bold text-slate-800">{supplier?.companyName || 'مورد غير محدد'}</p>
                        <p className="text-[10px] text-slate-400">
                          مندوب: {supplier?.representativeName} • {supplier?.phone}
                        </p>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="text-[11px]">
                        <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {inv.items.length} أصناف
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1">
                          تشغيلات مفصولة تلقائياً
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className="font-black text-slate-900 text-xs">
                        {formatMoney(inv.totalAmount)}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <div className="text-[11px] space-y-0.5">
                        <div className="text-emerald-700 font-bold">
                          مدفوع: {formatMoney(inv.paidAmount)}
                        </div>
                        {inv.remainingAmount > 0 && (
                          <div className="text-rose-600 font-bold">
                            متبقي: {formatMoney(inv.remainingAmount)}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            inv.status === 'paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : inv.status === 'partial'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {inv.status === 'paid' ? 'مدفوعة بالكامل' : inv.status === 'partial' ? 'مسددة جزئياً' : 'آجلة'}
                        </span>
                        {inv.dueDate && inv.status !== 'paid' && (
                          <span className="text-[10px] text-slate-400 block">
                            تستحق: {inv.dueDate}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-3.5 text-slate-500 text-[11px]">
                      {inv.receivingPharmacistName}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Purchase Invoice Modal */}
      {isNewInvoiceOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in">
            <div className="p-4 bg-blue-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <h3 className="font-black text-sm">تسجيل فاتورة شراء واستلام شحنة أدوية</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewInvoiceOpen(false)}
                className="text-white/80 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitInvoice} className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Header Details */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الشركة المجهزة (المورد) *</label>
                  <select
                    value={supplierId}
                    onChange={e => setSupplierId(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white font-bold"
                  >
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.companyName} (رصيده الحالي: {formatMoney(s.balanceDebt)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">رقم الفاتورة (من المورد) *</label>
                  <input
                    type="text"
                    required
                    value={invoiceNumber}
                    onChange={e => setInvoiceNumber(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">تاريخ الفاتورة</label>
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={e => setInvoiceDate(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">شروط الدفع</label>
                  <select
                    value={paymentTerms}
                    onChange={e => setPaymentTerms(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white font-bold"
                  >
                    <option value="deferred">آجل (بأجل زمني)</option>
                    <option value="cash">نقدي (تم التسديد فوراً)</option>
                    <option value="partial">تسديد دفعة مقدمة</option>
                  </select>
                </div>
              </div>

              {/* Items & Batches Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-slate-800 text-xs">
                    قائمة المواد، التشغيلات وتواريخ الصلاحية (FEFO Auto-Split)
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة مادة للشحنة</span>
                  </button>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-right text-[11px]">
                    <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold">
                      <tr>
                        <th className="p-2.5">المادة الصيدلانية</th>
                        <th className="p-2.5">رقم التشغيلة (Batch)</th>
                        <th className="p-2.5">تاريخ الانتهاء</th>
                        <th className="p-2.5">الكمية (كارتون)</th>
                        <th className="p-2.5">بونص مجاني</th>
                        <th className="p-2.5">سعر شراء الكارتون</th>
                        <th className="p-2.5">الخصم %</th>
                        <th className="p-2.5">سعر بيع العلبة</th>
                        <th className="p-2.5 text-center">حذف</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {itemsList.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2">
                            <select
                              value={row.itemId}
                              onChange={e => {
                                const newId = e.target.value;
                                const med = medicines.find(m => m.id === newId);
                                setItemsList(prev => {
                                  const updated = [...prev];
                                  updated[idx].itemId = newId;
                                  if (med) {
                                    updated[idx].cartonCostPrice = med.packaging.carton.costPrice;
                                    updated[idx].suggestedSellingPriceBox = med.packaging.box.sellingPrice;
                                  }
                                  return updated;
                                });
                              }}
                              className="w-48 p-1.5 rounded border border-slate-300 font-bold"
                            >
                              {medicines.map(m => (
                                <option key={m.id} value={m.id}>
                                  {m.commercialName} ({m.concentration})
                                </option>
                              ))}
                            </select>
                          </td>

                          <td className="p-2">
                            <input
                              type="text"
                              value={row.batchNumber}
                              onChange={e => {
                                const val = e.target.value;
                                setItemsList(prev => {
                                  const updated = [...prev];
                                  updated[idx].batchNumber = val;
                                  return updated;
                                });
                              }}
                              className="w-24 p-1.5 rounded border border-slate-300 font-mono"
                            />
                          </td>

                          <td className="p-2">
                            <input
                              type="date"
                              value={row.expiryDate}
                              onChange={e => {
                                const val = e.target.value;
                                setItemsList(prev => {
                                  const updated = [...prev];
                                  updated[idx].expiryDate = val;
                                  return updated;
                                });
                              }}
                              className="p-1.5 rounded border border-slate-300"
                            />
                          </td>

                          <td className="p-2">
                            <input
                              type="number"
                              min="1"
                              value={row.cartonsCount}
                              onChange={e => {
                                const val = parseInt(e.target.value) || 1;
                                setItemsList(prev => {
                                  const updated = [...prev];
                                  updated[idx].cartonsCount = val;
                                  return updated;
                                });
                              }}
                              className="w-16 p-1.5 rounded border border-slate-300 font-bold text-center"
                            />
                          </td>

                          <td className="p-2">
                            <input
                              type="number"
                              min="0"
                              value={row.bonusBoxesCount}
                              onChange={e => {
                                const val = parseInt(e.target.value) || 0;
                                setItemsList(prev => {
                                  const updated = [...prev];
                                  updated[idx].bonusBoxesCount = val;
                                  return updated;
                                });
                              }}
                              placeholder="0 علبة"
                              className="w-16 p-1.5 rounded border border-emerald-300 bg-emerald-50/50 text-emerald-900 font-bold text-center"
                            />
                          </td>

                          <td className="p-2">
                            <input
                              type="number"
                              value={row.cartonCostPrice}
                              onChange={e => {
                                const val = parseFloat(e.target.value) || 0;
                                setItemsList(prev => {
                                  const updated = [...prev];
                                  updated[idx].cartonCostPrice = val;
                                  return updated;
                                });
                              }}
                              className="w-24 p-1.5 rounded border border-slate-300 font-bold text-left"
                            />
                          </td>

                          <td className="p-2">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={row.discountPercentage}
                              onChange={e => {
                                const val = parseFloat(e.target.value) || 0;
                                setItemsList(prev => {
                                  const updated = [...prev];
                                  updated[idx].discountPercentage = val;
                                  return updated;
                                });
                              }}
                              className="w-14 p-1.5 rounded border border-slate-300 text-center"
                            />
                          </td>

                          <td className="p-2">
                            <input
                              type="number"
                              value={row.suggestedSellingPriceBox}
                              onChange={e => {
                                const val = parseFloat(e.target.value) || 0;
                                setItemsList(prev => {
                                  const updated = [...prev];
                                  updated[idx].suggestedSellingPriceBox = val;
                                  return updated;
                                });
                              }}
                              className="w-24 p-1.5 rounded border border-emerald-300 text-emerald-800 font-bold"
                            />
                          </td>

                          <td className="p-2 text-center">
                            {itemsList.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveItemRow(idx)}
                                className="text-slate-400 hover:text-rose-600 p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payment Settlement Fields */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="space-y-1">
                  <div className="text-xs text-slate-500 font-bold">إجمالي قيمة الفاتورة:</div>
                  <div className="text-xl font-black text-slate-900">{formatMoney(invoiceSubtotal)}</div>
                </div>

                {paymentTerms !== 'cash' && (
                  <div className="flex items-center gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">المبلغ المسدد الآن:</label>
                      <input
                        type="number"
                        value={paidAmount}
                        onChange={e => setPaidAmount(parseFloat(e.target.value) || 0)}
                        placeholder="0 د.ع"
                        className="p-1.5 rounded-lg border border-slate-300 font-bold text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">تاريخ الاستحقاق:</label>
                      <input
                        type="date"
                        value={dueDate}
                        onChange={e => setDueDate(e.target.value)}
                        className="p-1.5 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                  </div>
                )}

                <div className="text-left">
                  <div className="text-xs text-slate-500 font-bold">المتبقي كدين على الصيدلية:</div>
                  <div className="text-lg font-black text-rose-600">{formatMoney(remainingDebt)}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewInvoiceOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/20"
                >
                  تأكيد الفاتورة وإيداع الدفعات في المخزن
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
