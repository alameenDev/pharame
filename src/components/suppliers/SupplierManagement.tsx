import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Supplier, SupplierPayment } from '../../types/pharmacy';
import {
  Truck,
  Plus,
  CreditCard,
  Calendar,
  DollarSign,
  FileText,
  Phone,
  Mail,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Search,
  ArrowDownLeft,
  ChevronLeft,
  Coins
} from 'lucide-react';

export const SupplierManagement: React.FC = () => {
  const {
    suppliers,
    addSupplier,
    recordSupplierPayment,
    supplierPayments,
    formatMoney,
    purchaseInvoices,
    activeView
  } = usePharmacy();

  const [activeTab, setActiveTab] = useState<'suppliers' | 'dues' | 'vouchers'>(() => {
    return activeView === 'payments' ? 'dues' : 'suppliers';
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);
  const [selectedSupplierForPayment, setSelectedSupplierForPayment] = useState<Supplier | null>(null);
  const [selectedSupplierForStatement, setSelectedSupplierForStatement] = useState<Supplier | null>(null);

  // New Supplier Form State
  const [newSupplierData, setNewSupplierData] = useState({
    companyName: '',
    repName: '',
    phone: '',
    email: '',
    address: '',
    balanceDebt: 0,
    creditLimit: 15000000,
    paymentTermsDays: 30,
    nextPaymentDate: '',
    nextPaymentAmount: 0,
    notes: ''
  });

  // Payment Modal State
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer' | 'cheque' | 'card'>('cash');
  const [recipientName, setRecipientName] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');

  // Filter suppliers
  const filteredSuppliers = suppliers.filter(
    s =>
      s.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.repName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone.includes(searchTerm)
  );

  const totalOwed = suppliers.reduce((sum, s) => sum + s.balanceDebt, 0);
  const totalPaid = suppliers.reduce((sum, s) => sum + s.totalPaid, 0);

  const handleAddSupplierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupplierData.companyName || !newSupplierData.repName) return;
    addSupplier({
      companyName: newSupplierData.companyName,
      repName: newSupplierData.repName,
      phone: newSupplierData.phone,
      email: newSupplierData.email,
      address: newSupplierData.address,
      creditLimit: newSupplierData.creditLimit,
      paymentTermsDays: newSupplierData.paymentTermsDays,
      defaultDiscount: 5,
      suppliedItemIds: [],
      nextPaymentDate: newSupplierData.nextPaymentDate,
      nextPaymentAmount: newSupplierData.nextPaymentAmount
    });
    setIsAddSupplierModalOpen(false);
    setNewSupplierData({
      companyName: '',
      repName: '',
      phone: '',
      email: '',
      address: '',
      balanceDebt: 0,
      creditLimit: 15000000,
      paymentTermsDays: 30,
      nextPaymentDate: '',
      nextPaymentAmount: 0,
      notes: ''
    });
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplierForPayment || paymentAmount <= 0) return;

    recordSupplierPayment({
      supplierId: selectedSupplierForPayment.id,
      invoiceIds: [],
      amount: paymentAmount,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: paymentMethod,
      receiptNumber: `PAY-${Date.now().toString().slice(-6)}`,
      receiptDate: new Date().toISOString().split('T')[0],
      recipientName: recipientName || selectedSupplierForPayment.repName,
      bankOrTreasury: paymentMethod === 'cash' ? 'خزينة الصيدلية' : 'حساب المصرف',
      notes: paymentNotes
    });

    setSelectedSupplierForPayment(null);
    setPaymentAmount(0);
    setPaymentNotes('');
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-100 text-teal-800">
              <Truck className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-slate-900">
              الشركات المجهزة، الموردون وكشف الحساب والمدفوعات
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            متابعة أرصدة المكاتب العلمية ومذاخر الأدوية، كشف الحساب، سندات الصرف، ومواعيد الاستحقاق
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddSupplierModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة مورد / شركة مجهزة جديدة</span>
        </button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block mb-1">إجمالي الديون المستحقة للموردين</span>
          <div className="text-2xl font-black text-rose-600">{formatMoney(totalOwed)}</div>
          <p className="text-[10px] text-slate-400 mt-1">مستحقات واجبة السداد لمذاخر وشركات الأدوية</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block mb-1">إجمالي المسدد للشركات حتى الآن</span>
          <div className="text-2xl font-black text-emerald-700">{formatMoney(totalPaid)}</div>
          <p className="text-[10px] text-slate-400 mt-1">عبر سندات الصرف المسجلة في الصندوق</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block mb-1">عدد الشركات والمذاخر المعتمدة</span>
          <div className="text-2xl font-black text-slate-900">{suppliers.length} شركات</div>
          <p className="text-[10px] text-slate-400 mt-1">عقود توريد نشطة مع الصيدلية</p>
        </div>
      </div>

      {/* Search Bar & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('suppliers')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'suppliers' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            الشركات والمذاخر ({suppliers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('dues')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'dues' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            مواعيد الاستحقاقات القادمة ({suppliers.filter(s => s.nextPaymentDate && s.balanceDebt > 0).length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('vouchers')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'vouchers' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            سجل سندات الصرف ({supplierPayments.length})
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2.5 w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="ابحث باسم الشركة، المندوب، الهاتف..."
            className="w-full text-xs font-medium focus:outline-none bg-transparent"
          />
        </div>
      </div>

      {/* Tab 1: Suppliers Table */}
      {activeTab === 'suppliers' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                <tr>
                  <th className="p-3.5">الشركة المجهزة والمندوب</th>
                  <th className="p-3.5">معلومات الاتصال</th>
                  <th className="p-3.5">إجمالي المشتريات</th>
                  <th className="p-3.5">المسدد</th>
                  <th className="p-3.5">الرصيد المتبقي (الدين)</th>
                  <th className="p-3.5">الدفعة القادمة</th>
                  <th className="p-3.5 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSuppliers.map(sup => (
                  <tr key={sup.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5">
                      <div>
                        <p className="font-extrabold text-slate-900 text-xs">{sup.companyName}</p>
                        <p className="text-[11px] text-slate-500">المندوب: {sup.repName}</p>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="space-y-0.5 text-[11px]">
                        <p className="text-slate-800 font-semibold flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{sup.phone}</span>
                        </p>
                        <p className="text-slate-400 text-[10px]">{sup.address}</p>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className="font-bold text-slate-800">{formatMoney(sup.totalPurchases)}</span>
                    </td>

                    <td className="p-3.5">
                      <span className="font-bold text-emerald-700">{formatMoney(sup.totalPaid)}</span>
                    </td>

                    <td className="p-3.5">
                      <span className={`font-black ${sup.balanceDebt > 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                        {formatMoney(sup.balanceDebt)}
                      </span>
                    </td>

                    <td className="p-3.5">
                      {sup.nextPaymentDate ? (
                        <div className="text-[11px]">
                          <span className="font-bold text-amber-800">{formatMoney(sup.nextPaymentAmount || 0)}</span>
                          <p className="text-slate-400 text-[10px] flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{sup.nextPaymentDate}</span>
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[10px]">لا توجد دفعة محددة</span>
                      )}
                    </td>

                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedSupplierForStatement(sup)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3 text-slate-500" />
                          <span>كشف حساب</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSupplierForPayment(sup);
                            setPaymentAmount(sup.nextPaymentAmount || Math.min(sup.balanceDebt, 1000000));
                            setRecipientName(sup.repName);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition flex items-center gap-1"
                        >
                          <Coins className="w-3 h-3" />
                          <span>تسديد دفعة</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Upcoming Dues Schedule */}
      {activeTab === 'dues' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-black text-sm text-slate-900">جدول ومواعيد استحقاق دفعات الموردين</h3>
            <span className="text-xs text-slate-500">مرتبة حسب تاريخ الاستحقاق الأقرب</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                <tr>
                  <th className="p-3.5">الشركة المجهزة والمندوب</th>
                  <th className="p-3.5">تاريخ الاستحقاق</th>
                  <th className="p-3.5">مبلغ القسط / الدفعة</th>
                  <th className="p-3.5">إجمالي الدين الحالي</th>
                  <th className="p-3.5">حالة الاستحقاق</th>
                  <th className="p-3.5 text-center">إجراء السداد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {suppliers
                  .filter(s => s.balanceDebt > 0 && s.nextPaymentDate)
                  .map(sup => (
                    <tr key={sup.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3.5 font-bold text-slate-900">
                        {sup.companyName}
                        <span className="text-slate-400 font-normal block text-[11px]">مندوب: {sup.repName} ({sup.phone})</span>
                      </td>
                      <td className="p-3.5 font-mono font-bold text-slate-800">
                        <div className="flex items-center gap-1 text-amber-700">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{sup.nextPaymentDate}</span>
                        </div>
                      </td>
                      <td className="p-3.5 font-black text-sm text-amber-800">
                        {formatMoney(sup.nextPaymentAmount || sup.balanceDebt)}
                      </td>
                      <td className="p-3.5 font-black text-rose-600">
                        {formatMoney(sup.balanceDebt)}
                      </td>
                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3" />
                          قريب الاستحقاق
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSupplierForPayment(sup);
                            setPaymentAmount(sup.nextPaymentAmount || sup.balanceDebt);
                            setRecipientName(sup.repName);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition inline-flex items-center gap-1"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>تسديد القسط الآن</span>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Payment Vouchers History */}
      {activeTab === 'vouchers' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-black text-sm text-slate-900">أرشيف سندات الصرف وسداد الموردين</h3>
            <span className="text-xs text-slate-500 font-bold">{supplierPayments.length} سند صرف مسجل</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                <tr>
                  <th className="p-3.5">رقم السند</th>
                  <th className="p-3.5">الشركة المجهزة</th>
                  <th className="p-3.5">المبلغ المسدد</th>
                  <th className="p-3.5">التاريخ</th>
                  <th className="p-3.5">طريقة الدفع</th>
                  <th className="p-3.5">المستلم</th>
                  <th className="p-3.5">ملاحظات وبيان</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {supplierPayments.map(v => {
                  const sup = suppliers.find(s => s.id === v.supplierId);
                  return (
                    <tr key={v.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3.5 font-mono font-bold text-slate-800">{v.receiptNumber}</td>
                      <td className="p-3.5 font-bold text-slate-900">{sup?.companyName || 'شركة أدوية'}</td>
                      <td className="p-3.5 font-black text-emerald-800 text-sm">{formatMoney(v.amount)}</td>
                      <td className="p-3.5 text-slate-600 font-mono">{v.paymentDate}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 font-bold text-slate-700">
                          {v.paymentMethod === 'cash' ? 'نقدي من الصندوق' : v.paymentMethod === 'transfer' ? 'حوالة مصرفية' : 'شيك'}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-700">{v.recipientName || sup?.repName}</td>
                      <td className="p-3.5 text-slate-500 text-[11px]">{v.notes || 'سداد دفعة من الحساب'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Supplier Statement Modal */}
      {selectedSupplierForStatement && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-400" />
                <h3 className="font-black text-sm">
                  كشف حساب المورد: {selectedSupplierForStatement.companyName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSupplierForStatement(null)}
                className="text-white/80 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Balances Summary */}
              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                <div>
                  <span className="text-slate-500 font-bold block">إجمالي المشتريات</span>
                  <span className="font-black text-sm text-slate-900">
                    {formatMoney(selectedSupplierForStatement.totalPurchases)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">إجمالي المسدد</span>
                  <span className="font-black text-sm text-emerald-700">
                    {formatMoney(selectedSupplierForStatement.totalPaid)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">الرصيد المتبقي (الدين الحالي)</span>
                  <span className="font-black text-sm text-rose-600">
                    {formatMoney(selectedSupplierForStatement.balanceDebt)}
                  </span>
                </div>
              </div>

              {/* Purchase Invoices list */}
              <div>
                <h4 className="font-black text-slate-800 mb-2">فواتير المشتريات من هذا المورد:</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-right text-[11px]">
                    <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold">
                      <tr>
                        <th className="p-2">رقم الفاتورة</th>
                        <th className="p-2">التاريخ</th>
                        <th className="p-2">القيمة</th>
                        <th className="p-2">المدفوع</th>
                        <th className="p-2">المتبقي</th>
                        <th className="p-2">الحالة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {purchaseInvoices
                        .filter(p => p.supplierId === selectedSupplierForStatement.id)
                        .map(inv => (
                          <tr key={inv.id} className="hover:bg-slate-50">
                            <td className="p-2 font-mono font-bold">{inv.invoiceNumber}</td>
                            <td className="p-2">{inv.invoiceDate}</td>
                            <td className="p-2 font-bold">{formatMoney(inv.totalAmount)}</td>
                            <td className="p-2 text-emerald-700">{formatMoney(inv.paidAmount)}</td>
                            <td className="p-2 text-rose-600 font-bold">{formatMoney(inv.remainingAmount)}</td>
                            <td className="p-2">
                              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100">
                                {inv.status === 'paid' ? 'مسددة' : 'آجلة'}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payment Vouchers History */}
              <div>
                <h4 className="font-black text-slate-800 mb-2">سندات الدفع المسددة لهذا المورد:</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-right text-[11px]">
                    <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold">
                      <tr>
                        <th className="p-2">رقم السند</th>
                        <th className="p-2">التاريخ</th>
                        <th className="p-2">المبلغ المسدد</th>
                        <th className="p-2">طريقة الدفع</th>
                        <th className="p-2">اسم المستلم</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {supplierPayments
                        .filter(v => v.supplierId === selectedSupplierForStatement.id)
                        .map(v => (
                          <tr key={v.id} className="hover:bg-slate-50">
                            <td className="p-2 font-mono font-bold text-slate-800">{v.receiptNumber}</td>
                            <td className="p-2">{v.paymentDate}</td>
                            <td className="p-2 font-black text-emerald-800">{formatMoney(v.amount)}</td>
                            <td className="p-2 text-slate-600">
                              {v.paymentMethod === 'cash' ? 'نقدي' : v.paymentMethod === 'transfer' ? 'حوالة' : 'شيك'}
                            </td>
                            <td className="p-2">{v.recipientName}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Voucher Modal */}
      {selectedSupplierForPayment && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in">
            <div className="p-4 bg-emerald-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5" />
                <h3 className="font-black text-sm">تسجيل سند صرف وتسديد دفعة لمورد</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSupplierForPayment(null)}
                className="text-white/80 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="p-5 space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-slate-500 font-bold">الشركة المجهزة:</div>
                <div className="font-black text-slate-900 text-sm">{selectedSupplierForPayment.companyName}</div>
                <div className="text-slate-500 mt-1">
                  الرصيد المتبقي المطلوب: {formatMoney(selectedSupplierForPayment.balanceDebt)}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">المبلغ المراد تسديده *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 rounded-xl border border-slate-300 font-black text-sm text-emerald-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">طريقة الدفع</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-slate-300 font-bold"
                >
                  <option value="cash">نقدي من صندوق الصيدلية</option>
                  <option value="transfer">حوالة مصرفية (زين كاش / مصرف)</option>
                  <option value="cheque">شيك بنكي</option>
                  <option value="card">بطاقة دفع إلكتروني</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم المستلم (المندوب / المحاسب)</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={e => setRecipientName(e.target.value)}
                  placeholder="اسم الشخص المستلم للدفعة"
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ملاحظات وسند الصرف</label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={e => setPaymentNotes(e.target.value)}
                  placeholder="مثال: تسديد دفعة فاتورة شهر آب"
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSupplierForPayment(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20"
                >
                  تأكيد صرف السند وتحديث الرصيد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Supplier Modal */}
      {isAddSupplierModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in">
            <div className="p-4 bg-teal-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                <h3 className="font-black text-sm">تسجيل شركة مجهزة أو مذخر أدوية جديد</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddSupplierModalOpen(false)}
                className="text-white/80 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSupplierSubmit} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم الشركة / المذخر *</label>
                <input
                  type="text"
                  required
                  value={newSupplierData.companyName}
                  onChange={e => setNewSupplierData({ ...newSupplierData, companyName: e.target.value })}
                  placeholder="مثال: مذخر الأدوية الحديث"
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم المندوب المسؤول *</label>
                <input
                  type="text"
                  required
                  value={newSupplierData.repName}
                  onChange={e => setNewSupplierData({ ...newSupplierData, repName: e.target.value })}
                  placeholder="مثال: د. مصطفى علي"
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">رقم الهاتف *</label>
                  <input
                    type="text"
                    required
                    value={newSupplierData.phone}
                    onChange={e => setNewSupplierData({ ...newSupplierData, phone: e.target.value })}
                    placeholder="+964 770 000 0000"
                    className="w-full p-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">مدة السماح (أيام)</label>
                  <input
                    type="number"
                    value={newSupplierData.paymentTermsDays}
                    onChange={e =>
                      setNewSupplierData({
                        ...newSupplierData,
                        paymentTermsDays: parseInt(e.target.value) || 30
                      })
                    }
                    className="w-full p-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">العنوان / المحافظة</label>
                <input
                  type="text"
                  value={newSupplierData.address}
                  onChange={e => setNewSupplierData({ ...newSupplierData, address: e.target.value })}
                  placeholder="بغداد - شارع السعدون"
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSupplierModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md shadow-teal-600/20"
                >
                  تسجيل المورد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
