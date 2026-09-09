import React, { useState, useMemo } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { MedicineItem, PackagingHierarchy, PackagingUnitConfig } from '../../types/pharmacy';
import {
  Pill,
  Search,
  Plus,
  Edit,
  Trash2,
  Barcode,
  Layers,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Filter,
  DollarSign,
  PackageCheck,
  Snowflake,
  ShieldAlert,
  FileSpreadsheet
} from 'lucide-react';

export const ItemCatalog: React.FC = () => {
  const {
    medicines,
    suppliers,
    addMedicine,
    updateMedicine,
    currentBranch,
    formatMoney,
    getItemStockBreakdown,
    getTotalItemStock,
    currentUser
  } = usePharmacy();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterForm, setFilterForm] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MedicineItem | null>(null);

  // Form State for Adding / Editing Medicine
  const defaultPackaging: PackagingHierarchy = {
    carton: {
      enabled: true,
      unitsInsideParent: 1,
      barcode: '',
      costPrice: 72000,
      sellingPrice: 96000,
      minSellingPrice: 85000
    },
    box: {
      enabled: true,
      unitsInsideParent: 24, // 24 boxes in a carton
      barcode: '',
      costPrice: 3000,
      sellingPrice: 4000,
      minSellingPrice: 3500
    },
    strip: {
      enabled: true,
      unitsInsideParent: 2, // 2 strips in a box
      barcode: '',
      costPrice: 1500,
      sellingPrice: 2000,
      minSellingPrice: 1800
    },
    tablet: {
      enabled: true,
      unitsInsideParent: 10, // 10 tablets in a strip
      barcode: '',
      costPrice: 150,
      sellingPrice: 250,
      minSellingPrice: 200
    }
  };

  const [formData, setFormData] = useState({
    commercialName: '',
    scientificName: '',
    englishName: '',
    barcode: '',
    internalCode: '',
    category: 'أدوية',
    form: 'حبوب',
    concentration: '500 mg',
    packageSize: '24 حبة (شريطان)',
    usageInstruction: 'مسكن للآلام وخافض للحرارة',
    manufacturer: 'GSK',
    originCountry: 'بريطانيا',
    defaultSupplierId: suppliers[0]?.id || '',
    requiresPrescription: false,
    isControlled: false,
    requiresColdStorage: false,
    storageTemperature: '20-25°C',
    shelfLocation: 'رف A-1',
    minStockLimit: 10,
    maxStockLimit: 200,
    defaultProfitMargin: 25,
    alternatives: [] as string[],
    packaging: defaultPackaging
  });

  const filteredList = useMemo(() => {
    return medicines.filter(m => {
      const matchesSearch =
        !searchTerm ||
        m.commercialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.scientificName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.barcode.includes(searchTerm) ||
        m.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat = filterCategory === 'all' || m.category === filterCategory;
      const matchesForm = filterForm === 'all' || m.form === filterForm;
      return matchesSearch && matchesCat && matchesForm;
    });
  }, [medicines, searchTerm, filterCategory, filterForm]);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      commercialName: '',
      scientificName: '',
      englishName: '',
      barcode: `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      internalCode: `MED-${medicines.length + 101}`,
      category: 'أدوية',
      form: 'حبوب',
      concentration: '500 mg',
      packageSize: '',
      usageInstruction: '',
      manufacturer: '',
      originCountry: 'العراق',
      defaultSupplierId: suppliers[0]?.id || '',
      requiresPrescription: false,
      isControlled: false,
      requiresColdStorage: false,
      storageTemperature: '20-25°C',
      shelfLocation: 'رف A-1',
      minStockLimit: 10,
      maxStockLimit: 150,
      defaultProfitMargin: 25,
      alternatives: [],
      packaging: defaultPackaging
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (item: MedicineItem) => {
    setEditingItem(item);
    setFormData({
      commercialName: item.commercialName,
      scientificName: item.scientificName,
      englishName: item.englishName,
      barcode: item.barcode,
      internalCode: item.internalCode,
      category: item.category,
      form: item.form,
      concentration: item.concentration,
      packageSize: item.packageSize,
      usageInstruction: item.usageInstruction,
      manufacturer: item.manufacturer,
      originCountry: item.originCountry,
      defaultSupplierId: item.defaultSupplierId,
      requiresPrescription: item.requiresPrescription,
      isControlled: item.isControlled,
      requiresColdStorage: item.requiresColdStorage,
      storageTemperature: item.storageTemperature,
      shelfLocation: item.shelfLocation,
      minStockLimit: item.minStockLimit,
      maxStockLimit: item.maxStockLimit,
      defaultProfitMargin: item.defaultProfitMargin,
      alternatives: item.alternatives || [],
      packaging: JSON.parse(JSON.stringify(item.packaging))
    });
    setIsAddModalOpen(true);
  };

  const handleSaveMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.commercialName || !formData.scientificName) return;

    if (editingItem) {
      updateMedicine(editingItem.id, formData);
    } else {
      addMedicine(formData);
    }
    setIsAddModalOpen(false);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Pill className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-slate-900">دليل المواد الصيدلانية والتغليف</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            إدارة بطاقات الأدوية، التسلسل الهرمي للوحدات (كارتون، باكت، شريط، حبة)، الأسعار وهوامش الربح
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة مادة / دواء جديد</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="بحث بالاسم التجاري، العلمي، الباركود، الشركة المصنعة..."
            className="w-full pl-3 pr-10 py-2 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500 bg-slate-50"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700 focus:outline-emerald-500"
          >
            <option value="all">جميع التصنيفات</option>
            <option value="أدوية">أدوية عامة</option>
            <option value="مكملات">فيتامينات ومكملات</option>
            <option value="أطفال">عناية الأطفال</option>
            <option value="مستلزمات">مستلزمات طبية</option>
            <option value="تجميل">عناية وتجميل</option>
          </select>

          <select
            value={filterForm}
            onChange={e => setFilterForm(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700 focus:outline-emerald-500"
          >
            <option value="all">كافة الأشكال الدوائية</option>
            <option value="حبوب">حبوب / كبسول</option>
            <option value="شراب">شراب</option>
            <option value="حقن">حقن (أمبول/فيال)</option>
            <option value="مرهم">مرهم / كريم</option>
            <option value="قطرات">قطرات</option>
          </select>
        </div>
      </div>

      {/* Medicines Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
              <tr>
                <th className="p-3.5">المادة والمواصفات</th>
                <th className="p-3.5">الباركود والكود</th>
                <th className="p-3.5">الشركة والمنشأ</th>
                <th className="p-3.5">التغليف والأسعار</th>
                <th className="p-3.5">الرصيد الحالي</th>
                <th className="p-3.5">ملاحظات وخصائص</th>
                <th className="p-3.5 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.map(med => {
                const stockBreakdown = getItemStockBreakdown(med.id, currentBranch.id);
                const totalUnits = getTotalItemStock(med.id, currentBranch.id);
                const isOutOfStock = totalUnits === 0;

                return (
                  <tr key={med.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          <Pill className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900 text-xs">{med.commercialName}</p>
                          <p className="text-[11px] text-slate-500">{med.scientificName}</p>
                          <p className="text-[10px] text-slate-400">
                            {med.form} • {med.concentration}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="space-y-0.5 text-[11px]">
                        <p className="font-mono font-bold text-slate-800 flex items-center gap-1">
                          <Barcode className="w-3.5 h-3.5 text-slate-400" />
                          <span>{med.barcode}</span>
                        </p>
                        <p className="text-slate-400 text-[10px]">كود: {med.internalCode}</p>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="text-[11px]">
                        <p className="font-bold text-slate-800">{med.manufacturer}</p>
                        <p className="text-slate-400 text-[10px]">{med.originCountry}</p>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="text-[11px] space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-600">سعر العلبة:</span>
                          <span className="font-extrabold text-emerald-800">
                            {formatMoney(med.packaging.box.sellingPrice)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span>الشريط: {formatMoney(med.packaging.strip.sellingPrice)}</span>
                          {med.packaging.tablet.enabled && (
                            <span>• الحبة: {formatMoney(med.packaging.tablet.sellingPrice)}</span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="text-[11px]">
                        {isOutOfStock ? (
                          <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded">
                            نفد المخزون
                          </span>
                        ) : (
                          <div>
                            <span className="font-extrabold text-emerald-800">
                              {stockBreakdown.boxes} علبة و {stockBreakdown.strips} شريط
                            </span>
                            <span className="text-slate-400 block text-[10px]">
                              (إجمالي: {totalUnits} أصغر وحدة)
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="flex flex-wrap gap-1 text-[10px]">
                        {med.requiresColdStorage && (
                          <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold flex items-center gap-0.5">
                            <Snowflake className="w-3 h-3" /> مبرد
                          </span>
                        )}
                        {med.requiresPrescription && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                            وصفة طبية
                          </span>
                        )}
                        {med.isControlled && (
                          <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold flex items-center gap-0.5">
                            <ShieldAlert className="w-3 h-3" /> مؤثر عقلي
                          </span>
                        )}
                        {med.alternatives && med.alternatives.length > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 font-bold">
                            {med.alternatives.length} بدائل
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(med)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition"
                        title="تعديل بطاقة المادة والتسعير"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Medicine Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in">
            <div className="p-4 bg-emerald-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5" />
                <h3 className="font-black text-sm">
                  {editingItem ? `تعديل بطاقة مادة: ${editingItem.commercialName}` : 'إضافة دواء / مادة جديدة'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/80 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMedicine} className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Section 1: Basic Identifiers */}
              <div>
                <h4 className="font-black text-slate-800 text-xs mb-2.5 pb-1 border-b border-slate-200 flex items-center gap-1.5">
                  <span>1. البيانات الأساسية للتعريف</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">الاسم التجاري *</label>
                    <input
                      type="text"
                      required
                      value={formData.commercialName}
                      onChange={e => setFormData({ ...formData, commercialName: e.target.value })}
                      placeholder="مثال: Panadol Extra"
                      className="w-full p-2 rounded-lg border border-slate-300 focus:outline-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">الاسم العلمي / الفعّال *</label>
                    <input
                      type="text"
                      required
                      value={formData.scientificName}
                      onChange={e => setFormData({ ...formData, scientificName: e.target.value })}
                      placeholder="Paracetamol + Caffeine"
                      className="w-full p-2 rounded-lg border border-slate-300 focus:outline-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">الاسم بالإنكليزية</label>
                    <input
                      type="text"
                      value={formData.englishName}
                      onChange={e => setFormData({ ...formData, englishName: e.target.value })}
                      placeholder="Panadol Extra Tablets"
                      className="w-full p-2 rounded-lg border border-slate-300 focus:outline-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">الباركود الدولي</label>
                    <input
                      type="text"
                      value={formData.barcode}
                      onChange={e => setFormData({ ...formData, barcode: e.target.value })}
                      placeholder="5000347000123"
                      className="w-full p-2 rounded-lg border border-slate-300 focus:outline-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">الكود الداخلي</label>
                    <input
                      type="text"
                      value={formData.internalCode}
                      onChange={e => setFormData({ ...formData, internalCode: e.target.value })}
                      placeholder="MED-101"
                      className="w-full p-2 rounded-lg border border-slate-300 focus:outline-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">الشكل الدوائي</label>
                    <select
                      value={formData.form}
                      onChange={e => setFormData({ ...formData, form: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-300 focus:outline-emerald-500"
                    >
                      <option value="حبوب">حبوب / كبسولات</option>
                      <option value="شراب">شراب / معلق</option>
                      <option value="حقن">حقن (أمبول / فيال)</option>
                      <option value="مرهم">مرهم / كريم</option>
                      <option value="قطرات">قطرات عيون / أذن</option>
                      <option value="بخاخ">بخاخ استنشاق</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">التركيز</label>
                    <input
                      type="text"
                      value={formData.concentration}
                      onChange={e => setFormData({ ...formData, concentration: e.target.value })}
                      placeholder="500 mg"
                      className="w-full p-2 rounded-lg border border-slate-300 focus:outline-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">الشركة المصنعة</label>
                    <input
                      type="text"
                      value={formData.manufacturer}
                      onChange={e => setFormData({ ...formData, manufacturer: e.target.value })}
                      placeholder="GSK, Pfizer, SDI..."
                      className="w-full p-2 rounded-lg border border-slate-300 focus:outline-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">دولة المنشأ</label>
                    <input
                      type="text"
                      value={formData.originCountry}
                      onChange={e => setFormData({ ...formData, originCountry: e.target.value })}
                      placeholder="بريطانيا، الأردن، العراق..."
                      className="w-full p-2 rounded-lg border border-slate-300 focus:outline-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Packaging Hierarchy & Multi-level Pricing */}
              <div>
                <h4 className="font-black text-slate-800 text-xs mb-2.5 pb-1 border-b border-slate-200 flex items-center justify-between">
                  <span>2. تسلسل التغليف والأسعار (كارتون ← باكت ← شريط ← حبة)</span>
                  <span className="text-[10px] text-emerald-700 font-bold">
                    حساب ذكي تلقائي لأسعار التكلفة والبيع
                  </span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {/* Carton */}
                  <div className="space-y-1.5 p-2 rounded-lg bg-white border border-slate-200">
                    <span className="font-black text-xs text-slate-800 block border-b pb-1">1. الكارتون</span>
                    <div>
                      <label className="text-[10px] text-slate-500 font-semibold">سعر الشراء / التكلفة:</label>
                      <input
                        type="number"
                        value={formData.packaging.carton.costPrice}
                        onChange={e => {
                          const val = parseFloat(e.target.value) || 0;
                          setFormData({
                            ...formData,
                            packaging: {
                              ...formData.packaging,
                              carton: { ...formData.packaging.carton, costPrice: val }
                            }
                          });
                        }}
                        className="w-full p-1.5 rounded border border-slate-300 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-semibold">سعر البيع:</label>
                      <input
                        type="number"
                        value={formData.packaging.carton.sellingPrice}
                        onChange={e => {
                          const val = parseFloat(e.target.value) || 0;
                          setFormData({
                            ...formData,
                            packaging: {
                              ...formData.packaging,
                              carton: { ...formData.packaging.carton, sellingPrice: val }
                            }
                          });
                        }}
                        className="w-full p-1.5 rounded border border-slate-300 text-xs font-bold text-emerald-800"
                      />
                    </div>
                  </div>

                  {/* Box */}
                  <div className="space-y-1.5 p-2 rounded-lg bg-white border border-emerald-300">
                    <span className="font-black text-xs text-emerald-900 block border-b pb-1">
                      2. العلبة / الباكت *
                    </span>
                    <div>
                      <label className="text-[10px] text-slate-500 font-semibold">عدد العلب في الكارتون:</label>
                      <input
                        type="number"
                        value={formData.packaging.box.unitsInsideParent}
                        onChange={e => {
                          const val = parseInt(e.target.value) || 1;
                          setFormData({
                            ...formData,
                            packaging: {
                              ...formData.packaging,
                              box: { ...formData.packaging.box, unitsInsideParent: val }
                            }
                          });
                        }}
                        className="w-full p-1.5 rounded border border-slate-300 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-semibold">سعر شراء العلبة:</label>
                      <input
                        type="number"
                        value={formData.packaging.box.costPrice}
                        onChange={e => {
                          const val = parseFloat(e.target.value) || 0;
                          setFormData({
                            ...formData,
                            packaging: {
                              ...formData.packaging,
                              box: { ...formData.packaging.box, costPrice: val }
                            }
                          });
                        }}
                        className="w-full p-1.5 rounded border border-slate-300 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-semibold">سعر بيع العلبة:</label>
                      <input
                        type="number"
                        value={formData.packaging.box.sellingPrice}
                        onChange={e => {
                          const val = parseFloat(e.target.value) || 0;
                          setFormData({
                            ...formData,
                            packaging: {
                              ...formData.packaging,
                              box: { ...formData.packaging.box, sellingPrice: val }
                            }
                          });
                        }}
                        className="w-full p-1.5 rounded border border-slate-300 text-xs font-bold text-emerald-800"
                      />
                    </div>
                  </div>

                  {/* Strip */}
                  <div className="space-y-1.5 p-2 rounded-lg bg-white border border-slate-200">
                    <span className="font-black text-xs text-slate-800 block border-b pb-1">3. الشريط</span>
                    <div>
                      <label className="text-[10px] text-slate-500 font-semibold">عدد الأشرطة في العلبة:</label>
                      <input
                        type="number"
                        value={formData.packaging.strip.unitsInsideParent}
                        onChange={e => {
                          const val = parseInt(e.target.value) || 1;
                          setFormData({
                            ...formData,
                            packaging: {
                              ...formData.packaging,
                              strip: { ...formData.packaging.strip, unitsInsideParent: val }
                            }
                          });
                        }}
                        className="w-full p-1.5 rounded border border-slate-300 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-semibold">سعر بيع الشريط:</label>
                      <input
                        type="number"
                        value={formData.packaging.strip.sellingPrice}
                        onChange={e => {
                          const val = parseFloat(e.target.value) || 0;
                          setFormData({
                            ...formData,
                            packaging: {
                              ...formData.packaging,
                              strip: { ...formData.packaging.strip, sellingPrice: val }
                            }
                          });
                        }}
                        className="w-full p-1.5 rounded border border-slate-300 text-xs font-bold text-emerald-800"
                      />
                    </div>
                  </div>

                  {/* Tablet */}
                  <div className="space-y-1.5 p-2 rounded-lg bg-white border border-slate-200">
                    <span className="font-black text-xs text-slate-800 block border-b pb-1">4. الحبة / القطعة</span>
                    <div>
                      <label className="text-[10px] text-slate-500 font-semibold">عدد الحبات في الشريط:</label>
                      <input
                        type="number"
                        value={formData.packaging.tablet.unitsInsideParent}
                        onChange={e => {
                          const val = parseInt(e.target.value) || 1;
                          setFormData({
                            ...formData,
                            packaging: {
                              ...formData.packaging,
                              tablet: { ...formData.packaging.tablet, unitsInsideParent: val }
                            }
                          });
                        }}
                        className="w-full p-1.5 rounded border border-slate-300 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-semibold">سعر بيع الحبة المفردة:</label>
                      <input
                        type="number"
                        value={formData.packaging.tablet.sellingPrice}
                        onChange={e => {
                          const val = parseFloat(e.target.value) || 0;
                          setFormData({
                            ...formData,
                            packaging: {
                              ...formData.packaging,
                              tablet: { ...formData.packaging.tablet, sellingPrice: val }
                            }
                          });
                        }}
                        className="w-full p-1.5 rounded border border-slate-300 text-xs font-bold text-emerald-800"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Storage & Safety Properties */}
              <div>
                <h4 className="font-black text-slate-800 text-xs mb-2.5 pb-1 border-b border-slate-200">
                  3. التخزين، المراقبة والحدود المخزنية
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.requiresColdStorage}
                      onChange={e => setFormData({ ...formData, requiresColdStorage: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <span className="font-bold text-slate-700">يتطلب تبريد ثلاجة (2-8°C)</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.requiresPrescription}
                      onChange={e => setFormData({ ...formData, requiresPrescription: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <span className="font-bold text-slate-700">يصرف بوصفة طبية فقط (Rx)</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isControlled}
                      onChange={e => setFormData({ ...formData, isControlled: e.target.checked })}
                      className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                    />
                    <span className="font-bold text-rose-700">مادة مراقبة / مؤثر عقلي</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20"
                >
                  حفظ بطاقة المادة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
