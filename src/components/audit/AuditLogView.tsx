import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import {
  ShieldCheck,
  Search,
  Filter,
  AlertTriangle,
  Clock,
  User,
  Activity,
  Terminal,
  FileText
} from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const { auditLogs } = usePharmacy();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch =
      !searchTerm ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = filterAction === 'all' || log.action === filterAction;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-slate-900 text-white">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-slate-900">سجل التدقيق الرقابي والأمان (Audit Trail)</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            سجل غير قابل للتعديل يوثق أدق تفاصيل الحركات، التعديلات الحساسة، الصرفيات، وتتبع النشاط الرقابي
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            نظام التوثيق الرقابي الفوري نشط
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="ابحث في سجل العمليات، اسم المستخدم، أو التفاصيل..."
            className="w-full pl-3 pr-10 py-2 rounded-xl border border-slate-200 text-xs focus:outline-slate-900 bg-slate-50"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterAction}
            onChange={e => setFilterAction(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50"
          >
            <option value="all">كل أنواع العمليات</option>
            <option value="SALE_COMPLETED">مبيعات نقدية وآجلة</option>
            <option value="PURCHASE_INVOICE_RECORDED">فواتير مشتريات</option>
            <option value="SUPPLIER_PAYMENT_RECORDED">سندات صرف لموردين</option>
            <option value="STOCK_AUDIT_ADJUSTMENT">تسويات جرد مخزني</option>
            <option value="BATCH_EMERGENCY_RECALL">سحب تشغيلات دوائية</option>
            <option value="ITEM_CREATED">إضافة مواد جديدة</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
              <tr>
                <th className="p-3.5">التوقيت والتاريخ</th>
                <th className="p-3.5">المستخدم والمسؤول</th>
                <th className="p-3.5">نوع الإجراء الرقابي</th>
                <th className="p-3.5">تفاصيل الحركة</th>
                <th className="p-3.5">الفرع</th>
                <th className="p-3.5">معرف الحركة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3.5 text-slate-600 font-sans">
                    <span className="font-bold block text-slate-900">{log.timestamp.split('T')[0]}</span>
                    <span className="text-[10px] text-slate-400">
                      {log.timestamp.split('T')[1]?.replace('Z', '') || ''}
                    </span>
                  </td>

                  <td className="p-3.5 font-sans">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{log.userName}</span>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                      {log.action}
                    </span>
                  </td>

                  <td className="p-3.5 font-sans text-slate-700 text-xs max-w-md truncate">
                    {log.details}
                  </td>

                  <td className="p-3.5 font-sans text-slate-500">{log.branchName || 'الرئيسي'}</td>

                  <td className="p-3.5 text-[10px] text-slate-400">{log.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
