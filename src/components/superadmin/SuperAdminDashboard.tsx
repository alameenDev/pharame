import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { PharmacyTenant, SubscriptionPlan } from '../../types/pharmacy';
import {
  Building2,
  Users,
  CreditCard,
  AlertTriangle,
  Plus,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Search,
  Filter,
  TrendingUp,
  Activity,
  Calendar,
  Layers,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock
} from 'lucide-react';

export const SuperAdminDashboard: React.FC = () => {
  const {
    pharmacies,
    addPharmacy,
    updatePharmacyStatus,
    subscriptionPlans,
    formatMoney,
    supportLoginAsOwner,
    salesInvoices,
    users
  } = usePharmacy();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended' | 'expired'>('all');

  // New Pharmacy Form State
  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    phone: '',
    email: '',
    governorate: 'بغداد',
    region: 'الكرخ',
    address: '',
    licenseNumber: '',
    branchesCount: 1,
    subscriptionPlanId: 'plan-pro',
    subscriptionStartDate: new Date().toISOString().split('T')[0],
    subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'active' as 'active' | 'suspended' | 'expired',
    maxStaff: 8,
    maxBranches: 3,
    baseCurrency: 'IQD' as 'IQD' | 'USD',
    exchangeRateUSDToIQD: 1530,
    timezone: 'Asia/Baghdad (GMT+3)'
  });

  // System Wide Metrics
  const totalPharmacies = pharmacies.length;
  const activePharmacies = pharmacies.filter(p => p.status === 'active').length;
  const pausedPharmacies = pharmacies.filter(p => p.status === 'suspended' || p.status === 'expired').length;
  const totalBranches = pharmacies.reduce((sum, p) => sum + p.branchesCount, 0);
  const totalUsersCount = users.length;
  const totalSalesCount = salesInvoices.length;

  const totalSubscriptionRevenueIQD = pharmacies.reduce((sum, p) => {
    const plan = subscriptionPlans.find(sp => sp.id === p.subscriptionPlanId);
    return sum + (plan?.priceIQD || 450000);
  }, 0);

  const filteredPharmacies = pharmacies.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.governorate.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreatePharmacy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.ownerName || !formData.phone) return;
    addPharmacy(formData);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      ownerName: '',
      phone: '',
      email: '',
      governorate: 'بغداد',
      region: 'الكرخ',
      address: '',
      licenseNumber: '',
      branchesCount: 1,
      subscriptionPlanId: 'plan-pro',
      subscriptionStartDate: new Date().toISOString().split('T')[0],
      subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active',
      maxStaff: 8,
      maxBranches: 3,
      baseCurrency: 'IQD',
      exchangeRateUSDToIQD: 1530,
      timezone: 'Asia/Baghdad (GMT+3)'
    });
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header with Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-slate-900">لوحة تحكم السوبر أدمن (إدارة النظام)</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            إدارة ومراقبة جميع الصيدليات المشتركة، تفعيل الحسابات، الدعم الفني، وخطط الاشتراكات
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>تسجيل صيدلية جديدة</span>
        </button>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">إجمالي الصيدليات</span>
            <Building2 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalPharmacies}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>{activePharmacies} صيدلية نشطة</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">إجمالي الفروع</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalBranches}</div>
          <div className="text-[11px] text-slate-500 font-semibold mt-1">عبر كافة المحافظات</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">المستخدمين والموظفين</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalUsersCount}</div>
          <div className="text-[11px] text-slate-500 font-semibold mt-1">كادر طبي وإداري</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">عمليات البيع اليوم</span>
            <Activity className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalSalesCount}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">معاملات مسجلة</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">حسابات موقوفة / منتهية</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600">{pausedPharmacies}</div>
          <div className="text-[11px] text-slate-500 font-semibold mt-1">تحتاج تجديد اشتراك</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">إجمالي الاشتراكات</span>
            <TrendingUp className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-lg font-black text-slate-900 leading-tight">
            {formatMoney(totalSubscriptionRevenueIQD)}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">إيرادات سنوية للمنصة</div>
        </div>
      </div>

      {/* Pharmacies Management Table & Search */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="font-black text-base text-slate-900">سجل الصيدليات والمشتركين</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
              {filteredPharmacies.length} صيدلية
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="بحث بالاسم، المالك، المحافظة..."
                className="pl-3 pr-9 py-1.5 rounded-xl border border-slate-200 text-xs w-60 focus:outline-emerald-500 focus:bg-white bg-slate-50"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1 rounded-lg transition ${
                  filterStatus === 'all' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                الكل
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('active')}
                className={`px-3 py-1 rounded-lg transition ${
                  filterStatus === 'active' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                النشطة
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('expired')}
                className={`px-3 py-1 rounded-lg transition ${
                  filterStatus === 'expired' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                منتهية / معلقة
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
              <tr>
                <th className="p-3.5">الصيدلية والمالك</th>
                <th className="p-3.5">الموقع والترخيص</th>
                <th className="p-3.5">الفروع والموظفين</th>
                <th className="p-3.5">الخطة والاشتراك</th>
                <th className="p-3.5">تاريخ الانتهاء</th>
                <th className="p-3.5">الحالة</th>
                <th className="p-3.5 text-center">إجراءات الدعم الفني</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPharmacies.map(pharmacy => {
                const plan = subscriptionPlans.find(p => p.id === pharmacy.subscriptionPlanId);
                const isExpired = new Date(pharmacy.subscriptionEndDate) < new Date();

                return (
                  <tr key={pharmacy.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 font-black flex items-center justify-center shrink-0">
                          {pharmacy.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900 text-xs">{pharmacy.name}</p>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <span>المالك: {pharmacy.ownerName}</span>
                            <span className="text-slate-300">•</span>
                            <span>{pharmacy.phone}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="text-[11px] space-y-0.5">
                        <p className="font-bold text-slate-800 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{pharmacy.governorate} - {pharmacy.region}</span>
                        </p>
                        <p className="text-slate-400">إجازة: {pharmacy.licenseNumber}</p>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="text-[11px]">
                        <span className="font-bold text-slate-800">{pharmacy.branchesCount} فروع</span>
                        <span className="text-slate-400"> / حد أقصى {pharmacy.maxBranches}</span>
                        <p className="text-slate-500 text-[10px]">موظفين: حتى {pharmacy.maxStaff}</p>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="text-[11px]">
                        <span className="font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md">
                          {plan?.nameAr || 'الخطة الاحترافية'}
                        </span>
                        <p className="text-slate-500 text-[10px] mt-1">{formatMoney(plan?.priceIQD || 450000)} / سنوياً</p>
                      </div>
                    </td>

                    <td className="p-3.5 text-[11px]">
                      <div className="flex items-center gap-1 text-slate-700 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{pharmacy.subscriptionEndDate}</span>
                      </div>
                      {isExpired && (
                        <span className="text-[10px] font-bold text-rose-600 block mt-0.5">انتهت الفترة!</span>
                      )}
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          pharmacy.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : pharmacy.status === 'suspended'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {pharmacy.status === 'active' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> نشط
                          </>
                        ) : pharmacy.status === 'suspended' ? (
                          <>
                            <Clock className="w-3 h-3" /> موقوف
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" /> منتهي
                          </>
                        )}
                      </span>
                    </td>

                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* Technical Support Impersonation Button */}
                        <button
                          type="button"
                          onClick={() => supportLoginAsOwner(pharmacy.id)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-100 hover:text-purple-700 text-slate-700 text-[11px] font-bold transition"
                          title="دخول بصلاحية الدعم الفني لمساعدة الصيدلية"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>دخول دعم فني</span>
                        </button>

                        {/* Toggle Suspend / Active */}
                        {pharmacy.status === 'active' ? (
                          <button
                            type="button"
                            onClick={() => updatePharmacyStatus(pharmacy.id, 'suspended')}
                            className="px-2 py-1 rounded-lg text-rose-600 hover:bg-rose-50 text-[11px] font-bold"
                            title="إيقاف الصيدلية مؤقتاً"
                          >
                            إيقاف
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => updatePharmacyStatus(pharmacy.id, 'active')}
                            className="px-2 py-1 rounded-lg text-emerald-600 hover:bg-emerald-50 text-[11px] font-bold"
                            title="تفعيل حساب الصيدلية"
                          >
                            تفعيل
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subscription Plans Card Display */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-black text-base text-slate-900">خطط واشتراكات المنصة المعتمدة</h2>
            <p className="text-xs text-slate-500">الخطط المتاحة للصيدليات مع تسعيرتها وميزاتها وصلاحيات الفروع</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {subscriptionPlans.map(plan => (
            <div
              key={plan.id}
              className={`p-4 rounded-xl border transition ${
                plan.isPopular ? 'border-purple-300 bg-purple-50/40 shadow-xs' : 'border-slate-200 bg-slate-50/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-slate-900">{plan.nameAr}</span>
                {plan.isPopular && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-600 text-white">
                    الأكثر طلباً
                  </span>
                )}
              </div>
              <div className="text-xl font-black text-slate-900 mb-1">
                {formatMoney(plan.priceIQD)}
                <span className="text-xs font-normal text-slate-500"> / {plan.duration === 'yearly' ? 'سنوياً' : 'شهرياً'}</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">ما يعادل {plan.priceUSD}$ بالعملة الأجنبية</p>

              <div className="border-t border-slate-200/80 pt-3 space-y-1.5 text-xs text-slate-700">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-purple-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>حتى {plan.maxBranches} فروع صيدلانية</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-purple-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>حتى {plan.maxStaff} موظفين وكاشير</span>
                </div>
                {plan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Add New Pharmacy */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-purple-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                <h3 className="font-black text-sm">تسجيل صيدلية جديدة في المنصة</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/80 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePharmacy} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">اسم الصيدلية *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="مثال: صيدلية الأمل المركزية"
                    className="w-full p-2 rounded-lg border border-slate-300 focus:outline-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">اسم صاحب الصيدلية / المدير *</label>
                  <input
                    type="text"
                    required
                    value={formData.ownerName}
                    onChange={e => setFormData({ ...formData, ownerName: e.target.value })}
                    placeholder="د. أحمد الخفاجي"
                    className="w-full p-2 rounded-lg border border-slate-300 focus:outline-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">رقم الهاتف *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+964 770 000 0000"
                    className="w-full p-2 rounded-lg border border-slate-300 focus:outline-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="pharmacy@email.com"
                    className="w-full p-2 rounded-lg border border-slate-300 focus:outline-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">المحافظة</label>
                  <select
                    value={formData.governorate}
                    onChange={e => setFormData({ ...formData, governorate: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 focus:outline-purple-500"
                  >
                    <option value="بغداد">بغداد</option>
                    <option value="البصرة">البصرة</option>
                    <option value="أربيل">أربيل</option>
                    <option value="النجف">النجف</option>
                    <option value="كربلاء">كربلاء</option>
                    <option value="نينوى">نينوى (الموصل)</option>
                    <option value="بابل">بابل</option>
                    <option value="السليمانية">السليمانية</option>
                    <option value="كركوك">كركوك</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">المنطقة والحي</label>
                  <input
                    type="text"
                    value={formData.region}
                    onChange={e => setFormData({ ...formData, region: e.target.value })}
                    placeholder="مثال: المنصور، الحارثية"
                    className="w-full p-2 rounded-lg border border-slate-300 focus:outline-purple-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">العنوان التفصيلي</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    placeholder="الشارع العام، عمارة الأطباء..."
                    className="w-full p-2 rounded-lg border border-slate-300 focus:outline-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">رقم إجازة الصيدلية (النقابة / الصحة)</label>
                  <input
                    type="text"
                    value={formData.licenseNumber}
                    onChange={e => setFormData({ ...formData, licenseNumber: e.target.value })}
                    placeholder="PH-BGD-2026-XXXX"
                    className="w-full p-2 rounded-lg border border-slate-300 focus:outline-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">خطة الاشتراك</label>
                  <select
                    value={formData.subscriptionPlanId}
                    onChange={e => setFormData({ ...formData, subscriptionPlanId: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 focus:outline-purple-500"
                  >
                    {subscriptionPlans.map(sp => (
                      <option key={sp.id} value={sp.id}>
                        {sp.nameAr} - {formatMoney(sp.priceIQD)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">الحد الأقصى للفروع</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.maxBranches}
                    onChange={e => setFormData({ ...formData, maxBranches: parseInt(e.target.value) || 1 })}
                    className="w-full p-2 rounded-lg border border-slate-300 focus:outline-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">الحد الأقصى للموظفين</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.maxStaff}
                    onChange={e => setFormData({ ...formData, maxStaff: parseInt(e.target.value) || 1 })}
                    className="w-full p-2 rounded-lg border border-slate-300 focus:outline-purple-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-600/20 transition"
                >
                  تسجيل وتفعيل الصيدلية
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
