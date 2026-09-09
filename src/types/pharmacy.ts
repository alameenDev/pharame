export type UserRole =
  | 'super_admin'
  | 'pharmacy_owner'
  | 'branch_manager'
  | 'pharmacist'
  | 'sales_cashier'
  | 'warehouse_keeper'
  | 'accountant'
  | 'auditor';

export interface RolePermissions {
  viewPurchasePrice: boolean;
  editSellingPrice: boolean;
  applyDiscounts: boolean;
  cancelInvoice: boolean;
  processCustomerReturn: boolean;
  enterPurchases: boolean;
  adjustInventory: boolean;
  viewProfits: boolean;
  recordSupplierPayments: boolean;
  exportReports: boolean;
  manageStaff: boolean;
  emergencyRecall: boolean;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  pharmacyId?: string;
  branchId?: string;
  avatar?: string;
  isActive: boolean;
  pinCode?: string;
  permissions?: Partial<RolePermissions>;
  lastLogin?: string;
}

export interface Branch {
  id: string;
  pharmacyId: string;
  name: string;
  governorate: string;
  address: string;
  phone: string;
  managerId?: string;
  isMain: boolean;
  active: boolean;
}

export interface PharmacyTenant {
  id: string;
  name: string;
  ownerName: string;
  phone: string;
  email: string;
  governorate: string;
  region: string;
  address: string;
  licenseNumber: string;
  logo?: string;
  branchesCount: number;
  subscriptionPlanId: string;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  status: 'active' | 'suspended' | 'expired';
  maxStaff: number;
  maxBranches: number;
  baseCurrency: 'IQD' | 'USD';
  exchangeRateUSDToIQD: number;
  timezone: string;
  createdAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  nameAr: string;
  duration: 'monthly' | 'yearly';
  priceIQD: number;
  priceUSD: number;
  maxBranches: number;
  maxStaff: number;
  features: string[];
  isPopular?: boolean;
}

export interface PackagingUnitConfig {
  enabled: boolean;
  unitsInsideParent: number; // e.g. Box has 3 strips, Carton has 20 boxes, Strip has 10 tablets
  costPrice: number;
  sellingPrice: number;
  minSellingPrice: number;
  wholesalePrice?: number;
  barcode?: string;
}

export interface PackagingHierarchy {
  carton: PackagingUnitConfig; // الكارتون
  box: PackagingUnitConfig;    // العلبة
  strip: PackagingUnitConfig;  // الشريط
  tablet: PackagingUnitConfig; // الحبة / المفرد
}

export type UnitLevel = 'carton' | 'box' | 'strip' | 'tablet';

export interface MedicineItem {
  id: string;
  commercialName: string; // الاسم التجاري
  scientificName: string; // الاسم العلمي
  englishName: string;    // الاسم بالإنجليزية
  barcode: string;        // الباركود الرئيسي
  internalCode: string;   // الكود الداخلي
  image?: string;
  category: 'أدوية' | 'مستلزمات' | 'تجميل' | 'أطفال' | 'مكملات' | 'أخرى';
  form: 'حبوب' | 'كبسول' | 'شراب' | 'أمبول' | 'كريم' | 'مرهم' | 'قطرة' | 'بخاخ' | 'تحاميل' | 'محلول' | 'أخرى';
  concentration: string; // مثل 500 mg, 1g, 5mg/5ml
  packageSize: string;    // حجم أو وزن العبوة
  usageInstruction: string;
  manufacturer: string;   // الشركة المصنعة
  originCountry: string;  // بلد المنشأ
  defaultSupplierId: string; // الشركة المجهزة الافتراضية
  requiresPrescription: boolean; // وصفة طبية
  isControlled: boolean;        // خاضعة للرقابة
  requiresColdStorage: boolean; // تخزين مبرد
  storageTemperature: string;   // 2-8°C أو درجة حرارة الغرفة
  minStockLimit: number;        // الحد الأدنى للمخزون (بالوحدة الصغرى)
  maxStockLimit: number;        // الحد الأعلى للمخزون
  defaultProfitMargin: number;  // نسبة الربح الافتراضية %
  shelfLocation: string;        // موقع الرف
  packaging: PackagingHierarchy;
  alternatives: string[];       // معرفات الأدوية البديلة
  isRecalled?: boolean;         // هل تم سحبها كتحذير صحي؟
}

export interface MedicineBatch {
  id: string;
  itemId: string;
  branchId: string;
  batchNumber: string;         // رقم التشغيلة
  productionDate: string;      // تاريخ الإنتاج
  expiryDate: string;          // تاريخ الانتهاء (مبدأ FEFO)
  costPriceCarton: number;     // سعر شراء الكارتون
  costPriceSmallestUnit: number; // كلفة الوحدة الصغرى
  initialQuantitySmallestUnit?: number; // الكمية الأصلية عند الاستلام
  totalUnitsRemaining: number; // الرصيد المتبقي بالوحدة الصغرى
  shelfLocation: string;
  purchaseInvoiceId?: string;
  isRecalled?: boolean;
}

export interface StockMovementCard {
  id: string;
  itemId: string;
  branchId: string;
  date: string;
  type:
    | 'opening'
    | 'purchase'
    | 'sale'
    | 'customer_return'
    | 'supplier_return'
    | 'damaged_writeoff'
    | 'expired_writeoff'
    | 'transfer_in'
    | 'transfer_out'
    | 'audit_adjustment';
  referenceNo: string;
  quantityChangeSmallestUnit: number; // positive or negative
  balanceAfter: number;
  userName: string;
  notes?: string;
}

export interface Supplier {
  id: string;
  companyName: string;
  repName: string;
  phone: string;
  email: string;
  address: string;
  taxNumber?: string;
  paymentTermsDays: number;
  creditLimit: number;
  defaultDiscount: number;
  suppliedItemIds: string[];
  totalPurchases: number;
  totalPaid: number;
  totalReturns: number;
  totalDiscounts: number;
  balanceDebt: number; // مستحقات الشركة المجهزة
  nextPaymentAmount?: number;
  nextPaymentDate?: string;
}

export interface PurchaseInvoiceItem {
  itemId: string;
  batchNumber: string;
  productionDate: string;
  expiryDate: string;
  cartons: number;
  extraBoxes: number;
  extraStrips: number;
  extraUnits: number;
  bonusUnits: number; // بونص مجاني
  cartonCost: number;
  discountPercent: number;
  netCost: number;
  totalSmallestUnits: number;
  totalCost: number;
  suggestedSellingPriceBox: number;
  shelfLocation: string;
}

export interface PurchaseInvoice {
  id: string;
  invoiceNumber: string;
  supplierId: string;
  branchId: string;
  invoiceDate: string;
  receivedDate: string;
  orderRef?: string;
  receivedBy: string;
  paymentType: 'cash' | 'deferred' | 'installments';
  dueDate?: string;
  status: 'paid' | 'partial' | 'unpaid';
  totalAmount: number;
  paidAmount: number;
  discountAmount: number;
  remainingAmount: number;
  notes?: string;
  attachmentUrl?: string;
  items: PurchaseInvoiceItem[];
}

export interface SupplierPayment {
  id: string;
  supplierId: string;
  invoiceIds: string[];
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'transfer' | 'cheque' | 'card';
  receiptNumber: string;
  receiptDate: string;
  recipientName: string;
  bankOrTreasury: string;
  notes?: string;
  receiptImageUrl?: string;
}

export interface SaleItem {
  itemId: string;
  itemName: string;
  scientificName: string;
  unit: UnitLevel;
  quantity: number;
  batchId: string;
  batchNumber: string;
  expiryDate: string;
  unitPrice: number;
  discount: number;
  total: number;
  costPriceSmallestUnit: number;
}

export interface SaleInvoice {
  id: string;
  invoiceNumber: string;
  branchId: string;
  branchName: string;
  date: string;
  time: string;
  cashierId: string;
  cashierName: string;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  paymentMethod: 'cash' | 'card' | 'deferred' | 'mixed';
  cashPaid: number;
  cardPaid: number;
  creditPaid: number;
  totalBeforeDiscount: number;
  discountAmount: number;
  netTotal: number;
  totalCost: number;
  profit: number;
  items: SaleItem[];
  returnsRelated?: string[];
  status: 'completed' | 'cancelled' | 'refunded';
}

export interface CustomerReturnItem {
  itemId: string;
  itemName: string;
  unit: UnitLevel;
  quantity: number;
  unitPrice: number;
  totalRefund: number;
  reason: string;
  condition: 'good' | 'damaged';
  action: 'restock' | 'writeoff';
}

export interface CustomerReturn {
  id: string;
  returnNumber: string;
  originalInvoiceId: string;
  date: string;
  branchId: string;
  cashierName: string;
  customerName?: string;
  totalRefund: number;
  items: CustomerReturnItem[];
  approvedBy?: string;
}

export interface SupplierReturnItem {
  itemId: string;
  itemName: string;
  batchNumber: string;
  quantitySmallestUnit: number;
  reason: 'near_expiry' | 'damaged' | 'wrong_supply' | 'batch_recall';
  unitCost: number;
  totalCredit: number;
}

export interface SupplierReturn {
  id: string;
  returnNumber: string;
  supplierId: string;
  purchaseInvoiceId?: string;
  date: string;
  branchId: string;
  debitNoteNumber: string;
  totalCreditAmount: number;
  items: SupplierReturnItem[];
  approvedBy: string;
}

export interface DamagedWriteoff {
  id: string;
  date: string;
  branchId: string;
  itemId: string;
  itemName: string;
  batchNumber: string;
  quantity: number;
  reason: 'expired' | 'damaged' | 'broken' | 'temperature_excursion' | 'contaminated';
  unitCost: number;
  totalLoss: number;
  responsibleStaff: string;
  approvedBy: string;
  notes?: string;
  documentUrl?: string;
}

export interface InventoryAuditItem {
  itemId: string;
  itemName: string;
  barcode: string;
  category: string;
  shelf: string;
  systemQty: number; // بالوحدة الصغرى
  countedQty: number;
  difference: number;
  costPrice: number;
  differenceValue: number;
  note?: string;
}

export interface InventoryAudit {
  id: string;
  branchId: string;
  date: string;
  type: 'full' | 'category' | 'shelf' | 'supplier';
  filterTarget?: string;
  status: 'draft' | 'completed';
  auditedBy: string;
  approvedBy?: string;
  items: InventoryAuditItem[];
  totalShortageValue: number;
  totalSurplusValue: number;
}

export interface InterBranchTransfer {
  id: string;
  transferNumber: string;
  fromBranchId: string;
  toBranchId: string;
  date: string;
  status: 'pending' | 'in_transit' | 'completed' | 'cancelled';
  items: Array<{
    itemId: string;
    itemName: string;
    batchId: string;
    batchNumber: string;
    quantitySmallestUnit: number;
  }>;
  requestedBy: string;
  receivedBy?: string;
  notes?: string;
}

export interface TreasuryTransaction {
  id: string;
  type: 'inflow' | 'outflow';
  category: string;
  amount: number;
  description: string;
  date: string;
  paymentMethod?: 'cash' | 'card' | 'transfer';
  recordedBy?: string;
  branchId?: string;
}

export interface ExpenseRecord {
  id: string;
  branchId: string;
  date: string;
  type: 'expense' | 'income';
  category: 'rent' | 'salaries' | 'electricity' | 'maintenance' | 'supplies' | 'other';
  amount: number;
  description: string;
  recordedBy: string;
  receiptNumber?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: UserRole;
  action: string;
  entity: string;
  details: string;
  branchName?: string;
  ipAddress?: string;
}
