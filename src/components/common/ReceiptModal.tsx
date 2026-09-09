import React from 'react';
import { SaleInvoice } from '../../types/pharmacy';
import { usePharmacy } from '../../context/PharmacyContext';
import { Printer, Share2, X, Check, Pill } from 'lucide-react';

interface ReceiptModalProps {
  invoice: SaleInvoice;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ invoice, onClose }) => {
  const { currentPharmacy, currentBranch, formatMoney } = usePharmacy();

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const itemsList = invoice.items
      .map(
        (it, idx) =>
          `${idx + 1}. ${it.itemName} (${it.unit}) × ${it.quantity} = ${it.total.toLocaleString()} د.ع`
      )
      .join('\n');

    const message = `*فاتورة صيدلية ${currentPharmacy.name}*\n` +
      `*الفرع:* ${currentBranch.name}\n` +
      `*رقم الفاتورة:* ${invoice.invoiceNumber}\n` +
      `*التاريخ:* ${invoice.date} ${invoice.time}\n` +
      `*الزبون:* ${invoice.customerName}\n` +
      `---------------------------\n` +
      `*المواد:*\n${itemsList}\n` +
      `---------------------------\n` +
      `*الصافي المطلوب:* ${invoice.netTotal.toLocaleString()} د.ع\n` +
      `*طريقة الدفع:* ${invoice.paymentMethod === 'cash' ? 'نقدي' : invoice.paymentMethod === 'card' ? 'إلكتروني' : 'آجل'}\n` +
      `نتمنى لكم دوام الصحة والعافية!`;

    const encoded = encodeURIComponent(message);
    const phone = invoice.customerPhone ? invoice.customerPhone.replace(/[^0-9]/g, '') : '';
    const url = phone ? `https://wa.me/${phone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Actions */}
        <div className="p-3 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-emerald-400" />
            <span className="font-black text-xs">معاينة إيصال الدفع الحراري (80mm)</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Receipt Paper Container */}
        <div className="p-5 overflow-y-auto font-mono text-[11px] bg-white printable-receipt text-slate-800 space-y-3">
          {/* Pharmacy Header */}
          <div className="text-center border-b border-dashed border-slate-300 pb-3">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center mb-1">
              <Pill className="w-4 h-4 rotate-45" />
            </div>
            <h2 className="font-black text-sm tracking-tight text-slate-900">{currentPharmacy.name}</h2>
            <p className="text-[10px] text-slate-500">{currentBranch.name} • {currentPharmacy.governorate}</p>
            <p className="text-[9px] text-slate-400">إجازة ممارسة: {currentPharmacy.licenseNumber}</p>
            <p className="text-[9px] text-slate-400">هاتف: {currentPharmacy.phone}</p>
          </div>

          {/* Invoice Metadata */}
          <div className="text-[10px] space-y-0.5 border-b border-dashed border-slate-300 pb-2">
            <div className="flex justify-between">
              <span className="text-slate-500">رقم الإيصال:</span>
              <span className="font-bold">{invoice.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">التاريخ والوقت:</span>
              <span>{invoice.date} {invoice.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">اسم الكاشير:</span>
              <span>{invoice.cashierName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">اسم الزبون:</span>
              <span className="font-bold">{invoice.customerName}</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="border-b border-dashed border-slate-300 pb-2">
            <table className="w-full text-right text-[10px]">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400">
                  <th className="py-1">المادة</th>
                  <th className="py-1 text-center">الكمية</th>
                  <th className="py-1 text-left">المجموع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items.map((it, idx) => (
                  <tr key={idx} className="py-1">
                    <td className="py-1">
                      <div className="font-bold text-slate-900 leading-tight">{it.itemName}</div>
                      <div className="text-[9px] text-slate-400">
                        {it.unit} @ {it.unitPrice.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-1 text-center font-bold">{it.quantity}</td>
                    <td className="py-1 text-left font-black text-slate-900">
                      {it.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="space-y-1 text-xs pt-1 border-b border-dashed border-slate-300 pb-3">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">المجموع الفرعي:</span>
              <span>{formatMoney(invoice.totalAmount)}</span>
            </div>
            {invoice.discountAmount > 0 && (
              <div className="flex justify-between text-[11px] text-emerald-700">
                <span>الخصم الممنوح:</span>
                <span>- {formatMoney(invoice.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
              <span>المجموع الصافي:</span>
              <span>{formatMoney(invoice.netTotal)}</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 pt-1">
              <span>طريقة الدفع:</span>
              <span className="font-bold text-slate-700">
                {invoice.paymentMethod === 'cash' ? 'نقدي (كاش)' : invoice.paymentMethod === 'card' ? 'إلكتروني' : 'آجل'}
              </span>
            </div>
          </div>

          {/* Barcode & Footer Notice */}
          <div className="text-center pt-2 text-[9px] text-slate-400 space-y-1">
            <div className="font-mono tracking-widest text-[10px] text-slate-700 font-bold">
              ||| | |||| | ||| || |||| |
            </div>
            <p>{invoice.invoiceNumber}</p>
            <p>الأدوية المباعة لا تسترجع بعد فتح الغلاف</p>
            <p className="font-bold text-slate-600">شكراً لزيارتكم ونتمنى لكم الشفاء العاجل</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 grid grid-cols-2 gap-2 no-print">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة الإيصال</span>
          </button>
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition"
          >
            <Share2 className="w-4 h-4" />
            <span>إرسال واتساب</span>
          </button>
        </div>
      </div>
    </div>
  );
};
