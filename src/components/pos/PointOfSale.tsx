import React, { useState, useMemo, useRef } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { MedicineItem, UnitLevel, SaleInvoice } from '../../types/pharmacy';
import {
  Search,
  Barcode,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Pill,
  Printer,
  Share2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Sparkles,
  User,
  Phone,
  CreditCard,
  DollarSign,
  Info,
  HelpCircle,
  X
} from 'lucide-react';
import { ReceiptModal } from '../common/ReceiptModal';

export const PointOfSale: React.FC = () => {
  const {
    medicines,
    batches,
    currentBranch,
    currentUser,
    processSale,
    formatMoney,
    getItemStockBreakdown,
    getTotalItemStock,
    getBatchesForItem,
    selectedReceiptForPrint,
    setSelectedReceiptForPrint
  } = usePharmacy();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Cart State
  interface CartLine {
    itemId: string;
    item: MedicineItem;
    unit: UnitLevel;
    quantity: number;
    unitPrice: number;
    discount: number;
    minAllowedPrice: number;
  }

  const [cart, setCart] = useState<CartLine[]>([]);

  // Customer & Payment State
  const [customerName, setCustomerName] = useState('زبون نقدي');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'deferred' | 'mixed'>('cash');
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [cardAmount, setCardAmount] = useState<number>(0);
  const [overallDiscount, setOverallDiscount] = useState<number>(0);

  // Alternatives Modal State
  const [activeAlternativesItem, setActiveAlternativesItem] = useState<MedicineItem | null>(null);

  // Price warning toast
  const [priceWarning, setPriceWarning] = useState<string | null>(null);

  // Filter medicines
  const filteredMedicines = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return medicines.filter(m => {
      const matchSearch =
        !term ||
        m.commercialName.toLowerCase().includes(term) ||
        m.scientificName.toLowerCase().includes(term) ||
        m.englishName.toLowerCase().includes(term) ||
        m.barcode.includes(term) ||
        m.manufacturer.toLowerCase().includes(term);

      const matchCat = selectedCategory === 'all' || m.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [medicines, searchTerm, selectedCategory]);

  // Add Item to Cart
  const addToCart = (item: MedicineItem, chosenUnit: UnitLevel = 'box') => {
    const stockTotal = getTotalItemStock(item.id, currentBranch.id);
    if (stockTotal <= 0) {
      alert(`عذراً، مادة "${item.commercialName}" غير متوفرة في المخزون حالياً! يمكنك الاطلاع على البدائل.`);
      return;
    }

    // Determine unit price and min allowed price based on unit
    let price = 0;
    let minPrice = 0;

    if (chosenUnit === 'box') {
      price = item.packaging.box.sellingPrice;
      minPrice = item.packaging.box.minSellingPrice;
    } else if (chosenUnit === 'strip') {
      price = item.packaging.strip.sellingPrice;
      minPrice = item.packaging.strip.minSellingPrice;
    } else if (chosenUnit === 'tablet') {
      price = item.packaging.tablet.sellingPrice;
      minPrice = item.packaging.tablet.minSellingPrice;
    } else if (chosenUnit === 'carton') {
      price = item.packaging.carton.sellingPrice;
      minPrice = item.packaging.carton.minSellingPrice;
    }

    setCart(prev => {
      const existingIndex = prev.findIndex(c => c.itemId === item.id && c.unit === chosenUnit);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [
        ...prev,
        {
          itemId: item.id,
          item,
          unit: chosenUnit,
          quantity: 1,
          unitPrice: price,
          discount: 0,
          minAllowedPrice: minPrice
        }
      ];
    });
  };

  // Barcode input handler
  const handleBarcodeScan = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm) {
      const found = medicines.find(
        m =>
          m.barcode === searchTerm.trim() ||
          m.packaging.box.barcode === searchTerm.trim() ||
          m.packaging.strip.barcode === searchTerm.trim()
      );
      if (found) {
        addToCart(found, 'box');
        setSearchTerm('');
      }
    }
  };

  // Update Cart Item Unit
  const changeCartUnit = (index: number, newUnit: UnitLevel) => {
    setCart(prev => {
      const line = prev[index];
      const item = line.item;
      let newPrice = 0;
      let newMinPrice = 0;

      if (newUnit === 'box') {
        newPrice = item.packaging.box.sellingPrice;
        newMinPrice = item.packaging.box.minSellingPrice;
      } else if (newUnit === 'strip') {
        newPrice = item.packaging.strip.sellingPrice;
        newMinPrice = item.packaging.strip.minSellingPrice;
      } else if (newUnit === 'tablet') {
        newPrice = item.packaging.tablet.sellingPrice;
        newMinPrice = item.packaging.tablet.minSellingPrice;
      } else if (newUnit === 'carton') {
        newPrice = item.packaging.carton.sellingPrice;
        newMinPrice = item.packaging.carton.minSellingPrice;
      }

      const updated = [...prev];
      updated[index] = {
        ...line,
        unit: newUnit,
        unitPrice: newPrice,
        minAllowedPrice: newMinPrice
      };
      return updated;
    });
  };

  // Update Cart Price with Min Price Safeguard
  const updateCartPrice = (index: number, price: number) => {
    const line = cart[index];
    if (price < line.minAllowedPrice) {
      setPriceWarning(
        `تنبيه: السعر (${price}) أقل من الحد الأدنى المسموح به (${line.minAllowedPrice} د.ع) لمادة ${line.item.commercialName}!`
      );
      setTimeout(() => setPriceWarning(null), 4000);
      return;
    }
    setCart(prev => {
      const updated = [...prev];
      updated[index].unitPrice = price;
      return updated;
    });
  };

  // Calculations
  const totalSubtotal = cart.reduce((sum, line) => sum + (line.unitPrice * line.quantity - line.discount), 0);
  const netTotal = Math.max(0, totalSubtotal - overallDiscount);

  // Complete Sale
  const handleCompleteSale = () => {
    if (cart.length === 0) return;

    let cPaid = 0;
    let cardPaid = 0;
    let creditPaid = 0;

    if (paymentMethod === 'cash') {
      cPaid = netTotal;
    } else if (paymentMethod === 'card') {
      cardPaid = netTotal;
    } else if (paymentMethod === 'deferred') {
      creditPaid = netTotal;
    } else {
      cPaid = cashAmount;
      cardPaid = cardAmount;
      creditPaid = Math.max(0, netTotal - (cPaid + cardPaid));
    }

    const saleResult = processSale({
      customerName,
      customerPhone,
      paymentMethod,
      cashPaid: cPaid,
      cardPaid,
      creditPaid,
      discountAmount: overallDiscount,
      items: cart.map(c => ({
        itemId: c.itemId,
        unit: c.unit,
        quantity: c.quantity,
        unitPrice: c.unitPrice,
        discount: c.discount
      }))
    });

    // Open receipt modal
    setSelectedReceiptForPrint(saleResult);

    // Reset Cart
    setCart([]);
    setOverallDiscount(0);
    setCustomerName('زبون نقدي');
    setCustomerPhone('');
  };

  return (
    <div className="p-3 lg:p-5 flex flex-col lg:flex-row gap-4 min-h-[calc(100vh-5rem)]">
      {/* Left Column: Drug Catalog & Quick Selection (60% width) */}
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        {/* Search & Barcode Bar */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            <input
              ref={barcodeInputRef}
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={handleBarcodeScan}
              placeholder="ابحث بالاسم التجاري، العلمي، الباركود، أو الشركة المصنعة..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-emerald-500 focus:bg-white bg-slate-50"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute left-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Categories Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {['all', 'أدوية', 'أطفال', 'مستلزمات'].map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'جميع المواد' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Medicines Cards Grid */}
        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-14rem)] pr-1 space-y-2.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {filteredMedicines.map(med => {
              const batchesList = getBatchesForItem(med.id, currentBranch.id);
              const nearestExpiry = batchesList[0]?.expiryDate || 'غير متوفر';
              const stockBreakdown = getItemStockBreakdown(med.id, currentBranch.id);
              const totalSmallest = getTotalItemStock(med.id, currentBranch.id);
              const isOutOfStock = totalSmallest === 0;

              return (
                <div
                  key={med.id}
                  className={`bg-white p-3.5 rounded-2xl border transition relative flex flex-col justify-between ${
                    isOutOfStock
                      ? 'border-rose-200 bg-rose-50/20 opacity-80'
                      : 'border-slate-200 hover:border-emerald-300 hover:shadow-md'
                  }`}
                >
                  <div>
                    {/* Top Row: Form & Alerts */}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-100 text-slate-700">
                          {med.form}
                        </span>
                        {med.requiresColdStorage && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">
                            مبرد (2-8°C)
                          </span>
                        )}
                        {med.requiresPrescription && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-100 text-amber-800">
                            وصفة طبية
                          </span>
                        )}
                      </div>

                      {/* Alternatives Button */}
                      {med.alternatives && med.alternatives.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setActiveAlternativesItem(med)}
                          className="text-[11px] font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-2 py-0.5 rounded-lg flex items-center gap-1 transition"
                          title="عرض البدائل المتاحة بنفس المادة الفعالة"
                        >
                          <Sparkles className="w-3 h-3 text-teal-600" />
                          <span>{med.alternatives.length} بدائل</span>
                        </button>
                      )}
                    </div>

                    {/* Drug Commercial & Scientific Name */}
                    <h3 className="font-black text-xs text-slate-900 leading-snug">{med.commercialName}</h3>
                    <p className="text-[11px] text-slate-500 font-medium">{med.scientificName}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {med.manufacturer} • {med.concentration}
                    </p>

                    {/* Stock & Expiry Info (Matching prompt specs) */}
                    <div className="mt-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200/60 text-[11px] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-semibold">المخزون المتوفر:</span>
                        <span className={`font-black ${isOutOfStock ? 'text-rose-600' : 'text-emerald-700'}`}>
                          {isOutOfStock
                            ? 'نفد من المخزن!'
                            : `${stockBreakdown.boxes} علبة و ${stockBreakdown.strips} شريط`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-semibold">أقرب انتهاء (FEFO):</span>
                        <span className="font-bold text-slate-800 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-500" />
                          {nearestExpiry}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Multi-unit Price & Quick Add Buttons */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
                    <div className="text-[10px] text-slate-400 font-bold">اختيار وحدة البيع والإضافة للسلة:</div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {/* Box Unit */}
                      {med.packaging.box.enabled && (
                        <button
                          type="button"
                          disabled={isOutOfStock}
                          onClick={() => addToCart(med, 'box')}
                          className="p-1.5 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-center transition disabled:opacity-40"
                        >
                          <span className="block text-[10px] text-slate-500">علبة</span>
                          <span className="block text-xs font-black text-emerald-800">
                            {formatMoney(med.packaging.box.sellingPrice)}
                          </span>
                        </button>
                      )}

                      {/* Strip Unit */}
                      {med.packaging.strip.enabled && (
                        <button
                          type="button"
                          disabled={isOutOfStock}
                          onClick={() => addToCart(med, 'strip')}
                          className="p-1.5 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-center transition disabled:opacity-40"
                        >
                          <span className="block text-[10px] text-slate-500">شريط</span>
                          <span className="block text-xs font-black text-emerald-800">
                            {formatMoney(med.packaging.strip.sellingPrice)}
                          </span>
                        </button>
                      )}

                      {/* Tablet Unit */}
                      {med.packaging.tablet.enabled && (
                        <button
                          type="button"
                          disabled={isOutOfStock}
                          onClick={() => addToCart(med, 'tablet')}
                          className="p-1.5 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-center transition disabled:opacity-40"
                        >
                          <span className="block text-[10px] text-slate-500">حبة</span>
                          <span className="block text-xs font-black text-emerald-800">
                            {formatMoney(med.packaging.tablet.sellingPrice)}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column: POS Cart & Checkout (40% width) */}
      <div className="w-full lg:w-[420px] bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden">
        {/* Cart Header */}
        <div className="p-3.5 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-emerald-600" />
              <h2 className="font-black text-sm text-slate-900">سلة المبيعات الحالية</h2>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
              {cart.reduce((sum, i) => sum + i.quantity, 0)} عنصر
            </span>
          </div>

          {/* Customer info fields */}
          <div className="grid grid-cols-2 gap-2 mt-2.5 text-xs">
            <div className="relative">
              <User className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
              <input
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="اسم الزبون"
                className="w-full pl-2 pr-8 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
              />
            </div>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
              <input
                type="text"
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
                placeholder="هاتف الزبون (للواتساب)"
                className="w-full pl-2 pr-8 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
              />
            </div>
          </div>
        </div>

        {/* Warning Toast if any */}
        {priceWarning && (
          <div className="p-2.5 bg-rose-50 border-y border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 animate-pulse">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{priceWarning}</span>
          </div>
        )}

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto max-h-80 p-3 space-y-2.5 divide-y divide-slate-100">
          {cart.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-slate-400 text-xs text-center p-4">
              <ShoppingCart className="w-8 h-8 text-slate-300 mb-2" />
              <p className="font-bold text-slate-600">السلة فارغة حالياً</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                اضغط على أي مادة أو امسح الباركود لإضافتها إلى الفاتورة
              </p>
            </div>
          ) : (
            cart.map((line, idx) => {
              const lineTotal = line.unitPrice * line.quantity - line.discount;
              return (
                <div key={`${line.itemId}-${line.unit}`} className="pt-2.5 first:pt-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-black text-xs text-slate-900">{line.item.commercialName}</p>
                      <p className="text-[10px] text-slate-400">{line.item.scientificName}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCart(prev => prev.filter((_, i) => i !== idx))}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-2">
                    {/* Unit Selector */}
                    <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5 text-[11px] font-bold">
                      {line.item.packaging.box.enabled && (
                        <button
                          type="button"
                          onClick={() => changeCartUnit(idx, 'box')}
                          className={`px-2 py-0.5 rounded-md ${
                            line.unit === 'box' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
                          }`}
                        >
                          علبة
                        </button>
                      )}
                      {line.item.packaging.strip.enabled && (
                        <button
                          type="button"
                          onClick={() => changeCartUnit(idx, 'strip')}
                          className={`px-2 py-0.5 rounded-md ${
                            line.unit === 'strip' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
                          }`}
                        >
                          شريط
                        </button>
                      )}
                      {line.item.packaging.tablet.enabled && (
                        <button
                          type="button"
                          onClick={() => changeCartUnit(idx, 'tablet')}
                          className={`px-2 py-0.5 rounded-md ${
                            line.unit === 'tablet' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
                          }`}
                        >
                          حبة
                        </button>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center border border-slate-200 rounded-lg">
                      <button
                        type="button"
                        onClick={() => {
                          if (line.quantity > 1) {
                            setCart(prev => {
                              const updated = [...prev];
                              updated[idx].quantity -= 1;
                              return updated;
                            });
                          } else {
                            setCart(prev => prev.filter((_, i) => i !== idx));
                          }
                        }}
                        className="p-1 hover:bg-slate-100 text-slate-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold">{line.quantity}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setCart(prev => {
                            const updated = [...prev];
                            updated[idx].quantity += 1;
                            return updated;
                          });
                        }}
                        className="p-1 hover:bg-slate-100 text-slate-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Line Total */}
                    <div className="text-left font-black text-xs text-slate-900">
                      {formatMoney(lineTotal)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Checkout Controls */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 space-y-3">
          {/* Payment Method Selector */}
          <div>
            <div className="text-[11px] font-bold text-slate-600 mb-1.5">طريقة الدفع:</div>
            <div className="grid grid-cols-3 gap-1.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`py-1.5 rounded-xl border transition ${
                  paymentMethod === 'cash'
                    ? 'border-emerald-500 bg-emerald-100/70 text-emerald-900 font-black'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                نقدي (كاش)
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-1.5 rounded-xl border transition ${
                  paymentMethod === 'card'
                    ? 'border-blue-500 bg-blue-100/70 text-blue-900 font-black'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                إلكتروني
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('deferred')}
                className={`py-1.5 rounded-xl border transition ${
                  paymentMethod === 'deferred'
                    ? 'border-amber-500 bg-amber-100/70 text-amber-900 font-black'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                آجل (ذمة)
              </button>
            </div>
          </div>

          {/* Discount input */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-bold">خصم إضافي:</span>
            <input
              type="number"
              min="0"
              value={overallDiscount || ''}
              onChange={e => setOverallDiscount(parseFloat(e.target.value) || 0)}
              placeholder="0 د.ع"
              className="w-28 p-1 text-left rounded-lg border border-slate-300 font-bold text-xs"
            />
          </div>

          {/* Final Net Total */}
          <div className="p-3 rounded-xl bg-emerald-900 text-white flex items-center justify-between">
            <div>
              <span className="text-[11px] text-emerald-200 block">المبلغ الصافي المطلوب:</span>
              <span className="text-xl font-black">{formatMoney(netTotal)}</span>
            </div>
            <div className="text-left text-[11px] text-emerald-300">
              <span>الكاشير: {currentUser.name.split(' ')[0]}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={cart.length === 0}
              onClick={handleCompleteSale}
              className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/20 transition active:scale-95 disabled:opacity-40 flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>إتمام البيع والطباعة</span>
            </button>

            <button
              type="button"
              disabled={cart.length === 0}
              onClick={() => {
                if (window.confirm('هل تريد بالتأكيد إلغاء ومسح السلة الحالية؟')) {
                  setCart([]);
                  setOverallDiscount(0);
                }
              }}
              className="py-3 px-4 rounded-xl border border-slate-200 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-bold text-xs transition disabled:opacity-40"
            >
              إلغاء السلة
            </button>
          </div>
        </div>
      </div>

      {/* Alternatives Modal Drawer */}
      {activeAlternativesItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-teal-700 text-white flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  البدائل الدوائية المطابقة
                </h3>
                <p className="text-[11px] text-teal-100 mt-0.5">
                  لبديل مادة: {activeAlternativesItem.commercialName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveAlternativesItem(null)}
                className="text-white/80 hover:text-white font-black text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-4 divide-y divide-slate-100 max-h-96 overflow-y-auto">
              <div className="pb-3 text-xs text-slate-500">
                <span className="font-bold text-slate-800">الاسم العلمي / المادة الفعالة: </span>
                {activeAlternativesItem.scientificName} ({activeAlternativesItem.concentration})
              </div>

              {activeAlternativesItem.alternatives.map(altId => {
                const altMed = medicines.find(m => m.id === altId);
                if (!altMed) return null;
                const altStock = getTotalItemStock(altMed.id, currentBranch.id);
                const isAvailable = altStock > 0;

                return (
                  <div key={altMed.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <p className="font-black text-slate-900">{altMed.commercialName}</p>
                      <p className="text-[11px] text-slate-500">
                        {altMed.manufacturer} • {altMed.originCountry}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[10px]">
                        <span
                          className={`font-bold px-1.5 py-0.5 rounded ${
                            isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isAvailable ? `متوفر بالمخزن (${altStock} وحدة)` : 'غير متوفر'}
                        </span>
                        <span className="text-slate-400">سعر العلبة: {formatMoney(altMed.packaging.box.sellingPrice)}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => {
                        addToCart(altMed, 'box');
                        setActiveAlternativesItem(null);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs disabled:opacity-30 transition"
                    >
                      إضافة للسلة
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal for Thermal / A4 Print & WhatsApp Share */}
      {selectedReceiptForPrint && (
        <ReceiptModal
          invoice={selectedReceiptForPrint}
          onClose={() => setSelectedReceiptForPrint(null)}
        />
      )}
    </div>
  );
};
