import {
  PharmacyTenant,
  Branch,
  SubscriptionPlan,
  UserAccount,
  Supplier,
  MedicineItem,
  MedicineBatch,
  StockMovementCard,
  PurchaseInvoice,
  SaleInvoice,
  SupplierPayment,
  DamagedWriteoff,
  CustomerReturn,
  SupplierReturn,
  ExpenseRecord,
  AuditLog
} from '../types/pharmacy';

export const initialSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'plan-starter',
    name: 'الخطة الأساسية',
    nameAr: 'الأساسية (صيدلية فردية)',
    duration: 'monthly',
    priceIQD: 45000,
    priceUSD: 30,
    maxBranches: 1,
    maxStaff: 3,
    features: ['إدارة المبيعات ونقطة البيع', 'دليل الأدوية والبدائل', 'تنبيهات الصلاحية FEFO', 'تقارير يومية']
  },
  {
    id: 'plan-pro',
    name: 'الخطة الاحترافية',
    nameAr: 'الاحترافية (فروع متعددة)',
    duration: 'yearly',
    priceIQD: 450000,
    priceUSD: 300,
    maxBranches: 4,
    maxStaff: 12,
    features: [
      'جميع ميزات الأساسية',
      'دعم حتى 4 فروع مع التحويلات',
      'حسابات الموردين والأرصدة الدائنة',
      'نظام جرد الباركود والمطابقة',
      'صلاحيات موظفين مخصصة (RBAC)',
      'سحب التشغيلات والتحذيرات السريعة',
      'طباعة الإيصالات والملصقات الحرارية'
    ],
    isPopular: true
  },
  {
    id: 'plan-enterprise',
    name: 'خطة سلاسل الصيدليات الكبرى',
    nameAr: 'المؤسسية غير المحدودة',
    duration: 'yearly',
    priceIQD: 900000,
    priceUSD: 600,
    maxBranches: 20,
    maxStaff: 50,
    features: [
      'فروع ومستخدمين غير محدودين',
      'دعم فني VIP على مدار الساعة',
      'ربط مستودعات مركزية',
      'نسخ احتياطي فوري ومؤتمت',
      'تصدير متقدم وواجهات مخصصة'
    ]
  }
];

export const initialPharmacies: PharmacyTenant[] = [
  {
    id: 'pharmacy-1',
    name: 'مجموعة صيدليات النور الحديثة',
    ownerName: 'د. حيدر أحمد المعموري',
    phone: '+964 770 123 4567',
    email: 'info@alnoorpharma.iq',
    governorate: 'بغداد',
    region: 'الكرخ - المنصور',
    address: 'شارع 14 رمضان، قرب ساحة الرواد',
    licenseNumber: 'PH-BGD-2021-9842',
    logo: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=120&auto=format&fit=crop&q=80',
    branchesCount: 2,
    subscriptionPlanId: 'plan-pro',
    subscriptionStartDate: '2026-01-01',
    subscriptionEndDate: '2027-01-01',
    status: 'active',
    maxStaff: 12,
    maxBranches: 4,
    baseCurrency: 'IQD',
    exchangeRateUSDToIQD: 1530,
    timezone: 'Asia/Baghdad (GMT+3)',
    createdAt: '2025-06-15'
  },
  {
    id: 'pharmacy-2',
    name: 'صيدلية بابل التخصصية',
    ownerName: 'د. زينب قاسم الربيعي',
    phone: '+964 780 987 6543',
    email: 'contact@babylon-pharma.com',
    governorate: 'بابل',
    region: 'الحلة - مركز المدينة',
    address: 'شارع الأطباء، مجاور مجمع الشفاء',
    licenseNumber: 'PH-BBL-2022-3105',
    branchesCount: 1,
    subscriptionPlanId: 'plan-starter',
    subscriptionStartDate: '2026-02-01',
    subscriptionEndDate: '2026-10-01',
    status: 'active',
    maxStaff: 3,
    maxBranches: 1,
    baseCurrency: 'IQD',
    exchangeRateUSDToIQD: 1530,
    timezone: 'Asia/Baghdad (GMT+3)',
    createdAt: '2026-02-01'
  },
  {
    id: 'pharmacy-3',
    name: 'صيدلية الشفاء السريع',
    ownerName: 'د. علي حسين الجبوري',
    phone: '+964 750 444 8899',
    email: 'shifaa.fast@gmail.com',
    governorate: 'أربيل',
    region: 'عنكاوا',
    address: 'الشارع الرئيسي المقابل للكنيسة',
    licenseNumber: 'PH-EBL-2020-5512',
    branchesCount: 1,
    subscriptionPlanId: 'plan-starter',
    subscriptionStartDate: '2025-08-01',
    subscriptionEndDate: '2026-08-01',
    status: 'expired',
    maxStaff: 3,
    maxBranches: 1,
    baseCurrency: 'IQD',
    exchangeRateUSDToIQD: 1530,
    timezone: 'Asia/Baghdad (GMT+3)',
    createdAt: '2024-08-01'
  }
];

export const initialBranches: Branch[] = [
  {
    id: 'branch-1',
    pharmacyId: 'pharmacy-1',
    name: 'الفرع الرئيسي - المنصور',
    governorate: 'بغداد',
    address: 'شارع 14 رمضان، عمارة الأطباء',
    phone: '+964 770 123 4567',
    managerId: 'user-owner',
    isMain: true,
    active: true
  },
  {
    id: 'branch-2',
    pharmacyId: 'pharmacy-1',
    name: 'فرع الكرادة داخل',
    governorate: 'بغداد',
    address: 'الكرادة داخل، مجاور مستشفى العلوية',
    phone: '+964 770 123 4568',
    managerId: 'user-pharmacist',
    isMain: false,
    active: true
  }
];

export const initialUsers: UserAccount[] = [
  {
    id: 'user-super',
    name: 'المهندس مصطفى عادل (إدارة المنصة)',
    email: 'superadmin@pharmacloud.iq',
    phone: '+964 771 000 0001',
    role: 'super_admin',
    isActive: true,
    pinCode: '9999',
    lastLogin: '2026-09-09 09:15'
  },
  {
    id: 'user-owner',
    name: 'د. حيدر أحمد المعموري (المالك والمدير)',
    email: 'haider@alnoorpharma.iq',
    phone: '+964 770 123 4567',
    role: 'pharmacy_owner',
    pharmacyId: 'pharmacy-1',
    branchId: 'branch-1',
    isActive: true,
    pinCode: '1234',
    permissions: {
      viewPurchasePrice: true,
      editSellingPrice: true,
      applyDiscounts: true,
      cancelInvoice: true,
      processCustomerReturn: true,
      enterPurchases: true,
      adjustInventory: true,
      viewProfits: true,
      recordSupplierPayments: true,
      exportReports: true,
      manageStaff: true,
      emergencyRecall: true
    },
    lastLogin: '2026-09-09 11:30'
  },
  {
    id: 'user-pharmacist',
    name: 'د. سارة العبيدي (صيدلانية ومسؤولة فرع)',
    email: 'sara@alnoorpharma.iq',
    phone: '+964 772 345 6789',
    role: 'pharmacist',
    pharmacyId: 'pharmacy-1',
    branchId: 'branch-2',
    isActive: true,
    pinCode: '2222',
    permissions: {
      viewPurchasePrice: false,
      editSellingPrice: false,
      applyDiscounts: true,
      cancelInvoice: true,
      processCustomerReturn: true,
      enterPurchases: true,
      adjustInventory: false,
      viewProfits: false,
      recordSupplierPayments: false,
      exportReports: true,
      manageStaff: false,
      emergencyRecall: true
    },
    lastLogin: '2026-09-09 10:45'
  },
  {
    id: 'user-cashier',
    name: 'أحمد التميمي (كاشير وموظف مبيعات)',
    email: 'ahmed@alnoorpharma.iq',
    phone: '+964 773 999 8877',
    role: 'sales_cashier',
    pharmacyId: 'pharmacy-1',
    branchId: 'branch-1',
    isActive: true,
    pinCode: '3333',
    permissions: {
      viewPurchasePrice: false,
      editSellingPrice: false,
      applyDiscounts: false,
      cancelInvoice: false,
      processCustomerReturn: true,
      enterPurchases: false,
      adjustInventory: false,
      viewProfits: false,
      recordSupplierPayments: false,
      exportReports: false,
      manageStaff: false,
      emergencyRecall: false
    },
    lastLogin: '2026-09-09 11:45'
  }
];

export const initialSuppliers: Supplier[] = [
  {
    id: 'sup-1',
    companyName: 'شركة الرازي الدوائية للمستلزمات والأدوية',
    repName: 'أ. كرم السعدي',
    phone: '+964 771 222 3344',
    email: 'orders@alrazi-pharma.iq',
    address: 'بغداد - الكرخ - شارع المشجر',
    taxNumber: 'TAX-IQ-99104',
    paymentTermsDays: 45,
    creditLimit: 25000000,
    defaultDiscount: 5,
    suppliedItemIds: ['item-1', 'item-2', 'item-4', 'item-8'],
    totalPurchases: 18500000,
    totalPaid: 12250000,
    totalReturns: 500000,
    totalDiscounts: 250000,
    balanceDebt: 5500000,
    nextPaymentAmount: 2000000,
    nextPaymentDate: '2026-09-20'
  },
  {
    id: 'sup-2',
    companyName: 'مجموعة الرواد للصناعات الدوائية (Pioneer)',
    repName: 'أ. عمر الخفاجي',
    phone: '+964 770 555 6677',
    email: 'sales@pioneer-pharma.com',
    address: 'السليمانية - المنطقة الصناعية',
    taxNumber: 'TAX-KR-55201',
    paymentTermsDays: 30,
    creditLimit: 15000000,
    defaultDiscount: 7.5,
    suppliedItemIds: ['item-3', 'item-5', 'item-9'],
    totalPurchases: 9400000,
    totalPaid: 6500000,
    totalReturns: 200000,
    totalDiscounts: 450000,
    balanceDebt: 2250000,
    nextPaymentAmount: 1250000,
    nextPaymentDate: '2026-09-15'
  },
  {
    id: 'sup-3',
    companyName: 'شركة الحكمة الدوائية (Hikma Jordan / Iraq)',
    repName: 'د. ليث الجميلي',
    phone: '+964 780 111 8899',
    email: 'iraq.office@hikma.com',
    address: 'بغداد - العرصات - مجمع الروان',
    taxNumber: 'TAX-IQ-44332',
    paymentTermsDays: 60,
    creditLimit: 30000000,
    defaultDiscount: 6,
    suppliedItemIds: ['item-2', 'item-6', 'item-7', 'item-10'],
    totalPurchases: 14200000,
    totalPaid: 10000000,
    totalReturns: 0,
    totalDiscounts: 700000,
    balanceDebt: 3500000,
    nextPaymentAmount: 1500000,
    nextPaymentDate: '2026-09-28'
  },
  {
    id: 'sup-4',
    companyName: 'مذخر النقاء للأدوية ومستحضرات التجميل',
    repName: 'أ. حسين البصري',
    phone: '+964 772 888 1234',
    email: 'alnaqaa.dist@gmail.com',
    address: 'بغداد - الباب المعظم',
    taxNumber: 'TAX-IQ-11009',
    paymentTermsDays: 15,
    creditLimit: 8000000,
    defaultDiscount: 3,
    suppliedItemIds: ['item-11', 'item-12'],
    totalPurchases: 4500000,
    totalPaid: 3900000,
    totalReturns: 100000,
    totalDiscounts: 100000,
    balanceDebt: 400000,
    nextPaymentAmount: 400000,
    nextPaymentDate: '2026-09-12'
  }
];

export const initialMedicines: MedicineItem[] = [
  {
    id: 'item-1',
    commercialName: 'بانادول إكسترا (Panadol Extra)',
    scientificName: 'Paracetamol 500mg + Caffeine 65mg',
    englishName: 'Panadol Extra Tablets',
    barcode: '5000347071234',
    internalCode: 'MED-PAN-001',
    category: 'أدوية',
    form: 'حبوب',
    concentration: '500mg / 65mg',
    packageSize: 'علبة تحتوي 24 قرص (شريطين)',
    usageInstruction: 'قرص إلى قرصين كل 4-6 ساعات بعد الأكل، الحد الأقصى 8 أقراص يومياً',
    manufacturer: 'GlaxoSmithKline (GSK)',
    originCountry: 'المملكة المتحدة / إيرلندا',
    defaultSupplierId: 'sup-1',
    requiresPrescription: false,
    isControlled: false,
    requiresColdStorage: false,
    storageTemperature: 'أقل من 25°C في مكان جاف',
    minStockLimit: 120, // حبة
    maxStockLimit: 2400,
    defaultProfitMargin: 35,
    shelfLocation: 'رف A-12 (مسكنات الألم)',
    packaging: {
      carton: {
        enabled: true,
        unitsInsideParent: 20, // 20 علبة في الكارتون
        costPrice: 48000,
        sellingPrice: 66000,
        minSellingPrice: 60000,
        wholesalePrice: 55000,
        barcode: '5000347070001'
      },
      box: {
        enabled: true,
        unitsInsideParent: 2, // شريطين في العلبة
        costPrice: 2400,
        sellingPrice: 3500,
        minSellingPrice: 3000,
        wholesalePrice: 2800,
        barcode: '5000347071234'
      },
      strip: {
        enabled: true,
        unitsInsideParent: 12, // 12 حبة في الشريط
        costPrice: 1200,
        sellingPrice: 2000,
        minSellingPrice: 1500,
        wholesalePrice: 1400,
        barcode: '5000347071235'
      },
      tablet: {
        enabled: true,
        unitsInsideParent: 1,
        costPrice: 100,
        sellingPrice: 200,
        minSellingPrice: 150,
        barcode: '5000347071236'
      }
    },
    alternatives: ['item-2', 'item-3'],
    isRecalled: false
  },
  {
    id: 'item-2',
    commercialName: 'أدول إكسترا (Adol Extra)',
    scientificName: 'Paracetamol 500mg + Caffeine 65mg',
    englishName: 'Adol Extra Caplets',
    barcode: '6291007010203',
    internalCode: 'MED-ADL-002',
    category: 'أدوية',
    form: 'حبوب',
    concentration: '500mg / 65mg',
    packageSize: 'علبة تحتوي 20 قرص',
    usageInstruction: 'قرص أو قرصين عند اللزوم، لا تتجاوز 8 أقراص',
    manufacturer: 'Julphar (جلفار)',
    originCountry: 'الإمارات العربية المتحدة',
    defaultSupplierId: 'sup-3',
    requiresPrescription: false,
    isControlled: false,
    requiresColdStorage: false,
    storageTemperature: 'درجة حرارة الغرفة (15-25°C)',
    minStockLimit: 100,
    maxStockLimit: 2000,
    defaultProfitMargin: 40,
    shelfLocation: 'رف A-13 (مسكنات الألم)',
    packaging: {
      carton: {
        enabled: true,
        unitsInsideParent: 25,
        costPrice: 42000,
        sellingPrice: 58000,
        minSellingPrice: 52000,
        wholesalePrice: 48000
      },
      box: {
        enabled: true,
        unitsInsideParent: 2,
        costPrice: 1680,
        sellingPrice: 2500,
        minSellingPrice: 2250,
        barcode: '6291007010203'
      },
      strip: {
        enabled: true,
        unitsInsideParent: 10,
        costPrice: 840,
        sellingPrice: 1500,
        minSellingPrice: 1250
      },
      tablet: {
        enabled: true,
        unitsInsideParent: 1,
        costPrice: 84,
        sellingPrice: 150,
        minSellingPrice: 125
      }
    },
    alternatives: ['item-1', 'item-3'],
    isRecalled: false
  },
  {
    id: 'item-3',
    commercialName: 'باراسيتول بلس (Paracetol Plus - Pioneer)',
    scientificName: 'Paracetamol 500mg + Caffeine 65mg',
    englishName: 'Paracetol Plus Pioneer',
    barcode: '6285002001144',
    internalCode: 'MED-PIO-003',
    category: 'أدوية',
    form: 'حبوب',
    concentration: '500mg / 65mg',
    packageSize: 'علبة تحتوي 20 قرص',
    usageInstruction: 'قرص عند اللزوم بعد الطعام',
    manufacturer: 'Pioneer Pharma (الرواد)',
    originCountry: 'العراق (صناعة وطنية عالية الجودة)',
    defaultSupplierId: 'sup-2',
    requiresPrescription: false,
    isControlled: false,
    requiresColdStorage: false,
    storageTemperature: 'أقل من 30°C',
    minStockLimit: 80,
    maxStockLimit: 1500,
    defaultProfitMargin: 45,
    shelfLocation: 'رف A-14 (مسكنات وطنية)',
    packaging: {
      carton: {
        enabled: true,
        unitsInsideParent: 30,
        costPrice: 36000,
        sellingPrice: 50000,
        minSellingPrice: 45000
      },
      box: {
        enabled: true,
        unitsInsideParent: 2,
        costPrice: 1200,
        sellingPrice: 2000,
        minSellingPrice: 1750,
        barcode: '6285002001144'
      },
      strip: {
        enabled: true,
        unitsInsideParent: 10,
        costPrice: 600,
        sellingPrice: 1000,
        minSellingPrice: 900
      },
      tablet: {
        enabled: true,
        unitsInsideParent: 1,
        costPrice: 60,
        sellingPrice: 100,
        minSellingPrice: 90
      }
    },
    alternatives: ['item-1', 'item-2'],
    isRecalled: false
  },
  {
    id: 'item-4',
    commercialName: 'أوجمنتين 1 غرام (Augmentin 1g)',
    scientificName: 'Amoxicillin 875mg + Clavulanic acid 125mg',
    englishName: 'Augmentin 1g Film-Coated Tablets',
    barcode: '5000347055999',
    internalCode: 'MED-AUG-004',
    category: 'أدوية',
    form: 'حبوب',
    concentration: '1000 mg (1g)',
    packageSize: 'علبة تحتوي 14 قرص (شريطين × 7 أقراص)',
    usageInstruction: 'حبة واحدة كل 12 ساعة مع بداية الوجبة، كورس كامل 7 أيام',
    manufacturer: 'GSK',
    originCountry: 'المملكة المتحدة',
    defaultSupplierId: 'sup-1',
    requiresPrescription: true,
    isControlled: false,
    requiresColdStorage: false,
    storageTemperature: 'مكان بارد وجاف أقل من 25°C',
    minStockLimit: 42, // 3 علب
    maxStockLimit: 500,
    defaultProfitMargin: 25,
    shelfLocation: 'رف B-04 (مضادات حيوية)',
    packaging: {
      carton: {
        enabled: true,
        unitsInsideParent: 20,
        costPrice: 180000,
        sellingPrice: 230000,
        minSellingPrice: 215000
      },
      box: {
        enabled: true,
        unitsInsideParent: 2,
        costPrice: 9000,
        sellingPrice: 12000,
        minSellingPrice: 11000,
        barcode: '5000347055999'
      },
      strip: {
        enabled: true,
        unitsInsideParent: 7,
        costPrice: 4500,
        sellingPrice: 6500,
        minSellingPrice: 5800
      },
      tablet: {
        enabled: false,
        unitsInsideParent: 1,
        costPrice: 642,
        sellingPrice: 1000,
        minSellingPrice: 900
      }
    },
    alternatives: ['item-5'],
    isRecalled: false
  },
  {
    id: 'item-5',
    commercialName: 'أموكلان 1 غرام (Amoclan 1g - Hikma)',
    scientificName: 'Amoxicillin 875mg + Clavulanic acid 125mg',
    englishName: 'Amoclan 1g Tablets Hikma',
    barcode: '6251004018822',
    internalCode: 'MED-AMC-005',
    category: 'أدوية',
    form: 'حبوب',
    concentration: '1g',
    packageSize: 'علبة 14 قرص (شريطين)',
    usageInstruction: 'قرص كل 12 ساعة مع الطعام',
    manufacturer: 'Hikma Pharmaceuticals (الحكمة)',
    originCountry: 'الأردن',
    defaultSupplierId: 'sup-3',
    requiresPrescription: true,
    isControlled: false,
    requiresColdStorage: false,
    storageTemperature: 'يحفظ دون 25°C',
    minStockLimit: 28,
    maxStockLimit: 400,
    defaultProfitMargin: 30,
    shelfLocation: 'رف B-05 (مضادات حيوية بديلة)',
    packaging: {
      carton: {
        enabled: true,
        unitsInsideParent: 20,
        costPrice: 130000,
        sellingPrice: 175000,
        minSellingPrice: 160000
      },
      box: {
        enabled: true,
        unitsInsideParent: 2,
        costPrice: 6500,
        sellingPrice: 9000,
        minSellingPrice: 8000,
        barcode: '6251004018822'
      },
      strip: {
        enabled: true,
        unitsInsideParent: 7,
        costPrice: 3250,
        sellingPrice: 4800,
        minSellingPrice: 4300
      },
      tablet: {
        enabled: false,
        unitsInsideParent: 1,
        costPrice: 464,
        sellingPrice: 750,
        minSellingPrice: 650
      }
    },
    alternatives: ['item-4'],
    isRecalled: false
  },
  {
    id: 'item-6',
    commercialName: 'كونكور 5 ملغ (Concor 5mg)',
    scientificName: 'Bisoprolol Fumarate 5mg',
    englishName: 'Concor 5mg Tablets',
    barcode: '4054839002221',
    internalCode: 'MED-CON-006',
    category: 'أدوية',
    form: 'حبوب',
    concentration: '5mg',
    packageSize: 'علبة 30 قرص (3 أشرطة × 10 أقراص)',
    usageInstruction: 'حبة واحدة صباحاً مع أو بدون طعام لعلاج ضغط الدم والقلب',
    manufacturer: 'Merck Healthcare KGaA',
    originCountry: 'ألمانيا',
    defaultSupplierId: 'sup-1',
    requiresPrescription: true,
    isControlled: false,
    requiresColdStorage: false,
    storageTemperature: 'درجة حرارة لا تتجاوز 30°C',
    minStockLimit: 60,
    maxStockLimit: 600,
    defaultProfitMargin: 28,
    shelfLocation: 'رف C-01 (أدوية الضغط والقلب)',
    packaging: {
      carton: {
        enabled: true,
        unitsInsideParent: 20,
        costPrice: 120000,
        sellingPrice: 160000,
        minSellingPrice: 150000
      },
      box: {
        enabled: true,
        unitsInsideParent: 3,
        costPrice: 6000,
        sellingPrice: 8500,
        minSellingPrice: 7750,
        barcode: '4054839002221'
      },
      strip: {
        enabled: true,
        unitsInsideParent: 10,
        costPrice: 2000,
        sellingPrice: 3000,
        minSellingPrice: 2700
      },
      tablet: {
        enabled: true,
        unitsInsideParent: 1,
        costPrice: 200,
        sellingPrice: 350,
        minSellingPrice: 300
      }
    },
    alternatives: ['item-7'],
    isRecalled: false
  },
  {
    id: 'item-7',
    commercialName: 'بيسوكور 5 ملغ (Bisocor 5mg - Pioneer)',
    scientificName: 'Bisoprolol Fumarate 5mg',
    englishName: 'Bisocor 5mg Pioneer',
    barcode: '6285002003311',
    internalCode: 'MED-BSC-007',
    category: 'أدوية',
    form: 'حبوب',
    concentration: '5mg',
    packageSize: 'علبة 30 قرص (3 أشرطة)',
    usageInstruction: 'حبة يومياً صباحاً تحت إشراف الطبيب',
    manufacturer: 'Pioneer (الرواد)',
    originCountry: 'العراق',
    defaultSupplierId: 'sup-2',
    requiresPrescription: true,
    isControlled: false,
    requiresColdStorage: false,
    storageTemperature: 'دون 25°C',
    minStockLimit: 60,
    maxStockLimit: 600,
    defaultProfitMargin: 35,
    shelfLocation: 'رف C-02 (بدائل أدوية الضغط)',
    packaging: {
      carton: {
        enabled: true,
        unitsInsideParent: 25,
        costPrice: 87500,
        sellingPrice: 125000,
        minSellingPrice: 115000
      },
      box: {
        enabled: true,
        unitsInsideParent: 3,
        costPrice: 3500,
        sellingPrice: 5250,
        minSellingPrice: 4750,
        barcode: '6285002003311'
      },
      strip: {
        enabled: true,
        unitsInsideParent: 10,
        costPrice: 1166,
        sellingPrice: 1850,
        minSellingPrice: 1650
      },
      tablet: {
        enabled: true,
        unitsInsideParent: 1,
        costPrice: 116,
        sellingPrice: 200,
        minSellingPrice: 175
      }
    },
    alternatives: ['item-6'],
    isRecalled: false
  },
  {
    id: 'item-8',
    commercialName: 'لانتوس سولوستار أقلام إنسولين (Lantus SoloStar)',
    scientificName: 'Insulin Glargine 100 Units/ml',
    englishName: 'Lantus SoloStar 100 U/ml Pre-filled Pens',
    barcode: '3582910051199',
    internalCode: 'MED-LAN-008',
    category: 'أدوية',
    form: 'أمبول',
    concentration: '100 U/ml (5 pens x 3ml)',
    packageSize: 'علبة تحتوي 5 أقلام معبأة مسبقاً',
    usageInstruction: 'حقن تحت الجلد مرة واحدة يومياً في نفس الموعد تماماً، يحظر تجميده',
    manufacturer: 'Sanofi Aventis (سانوفي)',
    originCountry: 'ألمانيا / فرنسا',
    defaultSupplierId: 'sup-1',
    requiresPrescription: true,
    isControlled: true, // مراقب بشدة
    requiresColdStorage: true, // مبرد إجباري
    storageTemperature: '2°C إلى 8°C في الثلاجة الطبية',
    minStockLimit: 10,
    maxStockLimit: 100,
    defaultProfitMargin: 15,
    shelfLocation: 'الثلاجة المركزية - رف التبريد رقم 1',
    packaging: {
      carton: {
        enabled: true,
        unitsInsideParent: 10,
        costPrice: 420000,
        sellingPrice: 490000,
        minSellingPrice: 470000
      },
      box: {
        enabled: true,
        unitsInsideParent: 5, // 5 أقلام في العلبة
        costPrice: 42000,
        sellingPrice: 49500,
        minSellingPrice: 47500,
        barcode: '3582910051199'
      },
      strip: {
        enabled: true,
        unitsInsideParent: 1, // كل قلم كوحدة مفردة
        costPrice: 8400,
        sellingPrice: 10500,
        minSellingPrice: 10000
      },
      tablet: {
        enabled: false,
        unitsInsideParent: 1,
        costPrice: 8400,
        sellingPrice: 10500,
        minSellingPrice: 10000
      }
    },
    alternatives: [],
    isRecalled: false
  },
  {
    id: 'item-9',
    commercialName: 'أوميبرازول 20 ملغ (Omeprazole 20mg)',
    scientificName: 'Omeprazole 20mg Delayed-Release',
    englishName: 'Omeprazole 20mg Capsules',
    barcode: '6285002008891',
    internalCode: 'MED-OME-009',
    category: 'أدوية',
    form: 'كبسول',
    concentration: '20mg',
    packageSize: 'علبة 28 كبسولة (4 أشرطة × 7 كبسولات)',
    usageInstruction: 'كبسولة صباحاً قبل الإفطار بنصف ساعة لعلاج حموضة وقرحة المعدة',
    manufacturer: 'Pioneer (الرواد)',
    originCountry: 'العراق',
    defaultSupplierId: 'sup-2',
    requiresPrescription: false,
    isControlled: false,
    requiresColdStorage: false,
    storageTemperature: 'يحفظ في مكان جاف أقل من 25°C',
    minStockLimit: 56,
    maxStockLimit: 800,
    defaultProfitMargin: 35,
    shelfLocation: 'رف D-02 (أدوية المعدة والجهاز الهضمي)',
    packaging: {
      carton: {
        enabled: true,
        unitsInsideParent: 20,
        costPrice: 60000,
        sellingPrice: 85000,
        minSellingPrice: 78000
      },
      box: {
        enabled: true,
        unitsInsideParent: 4,
        costPrice: 3000,
        sellingPrice: 4500,
        minSellingPrice: 4000,
        barcode: '6285002008891'
      },
      strip: {
        enabled: true,
        unitsInsideParent: 7,
        costPrice: 750,
        sellingPrice: 1250,
        minSellingPrice: 1100
      },
      tablet: {
        enabled: false,
        unitsInsideParent: 1,
        costPrice: 107,
        sellingPrice: 200,
        minSellingPrice: 175
      }
    },
    alternatives: [],
    isRecalled: false
  },
  {
    id: 'item-10',
    commercialName: 'سيبروفلوكساسين 500 ملغ (Ciprofloxacin 500mg)',
    scientificName: 'Ciprofloxacin Hydrochloride 500mg',
    englishName: 'Ciprofloxacin 500mg Film-Coated Tablets',
    barcode: '6251004014411',
    internalCode: 'MED-CIP-010',
    category: 'أدوية',
    form: 'حبوب',
    concentration: '500mg',
    packageSize: 'علبة 10 أقراص (شريط واحد)',
    usageInstruction: 'قرص كل 12 ساعة مع شرب كميات وافرة من الماء، تجنب مشتقات الحليب تزامناً معه',
    manufacturer: 'Hikma Pharmaceuticals',
    originCountry: 'الأردن',
    defaultSupplierId: 'sup-3',
    requiresPrescription: true,
    isControlled: false,
    requiresColdStorage: false,
    storageTemperature: 'درجة حرارة الغرفة أقل من 30°C',
    minStockLimit: 30,
    maxStockLimit: 300,
    defaultProfitMargin: 30,
    shelfLocation: 'رف B-10 (مضادات مسالك والتهابات)',
    packaging: {
      carton: {
        enabled: true,
        unitsInsideParent: 25,
        costPrice: 75000,
        sellingPrice: 100000,
        minSellingPrice: 92000
      },
      box: {
        enabled: true,
        unitsInsideParent: 1,
        costPrice: 3000,
        sellingPrice: 4250,
        minSellingPrice: 3800,
        barcode: '6251004014411'
      },
      strip: {
        enabled: true,
        unitsInsideParent: 10,
        costPrice: 3000,
        sellingPrice: 4250,
        minSellingPrice: 3800
      },
      tablet: {
        enabled: true,
        unitsInsideParent: 1,
        costPrice: 300,
        sellingPrice: 500,
        minSellingPrice: 425
      }
    },
    alternatives: [],
    isRecalled: false
  },
  {
    id: 'item-11',
    commercialName: 'أوتريفين بخاخ أنفي للأطفال 0.05% (Otrivin)',
    scientificName: 'Xylometazoline Hydrochloride 0.05%',
    englishName: 'Otrivin 0.05% Nasal Spray',
    barcode: '5000347098877',
    internalCode: 'MED-OTR-011',
    category: 'أطفال',
    form: 'بخاخ',
    concentration: '0.05% (10ml)',
    packageSize: 'قنينة بخاخ 10 مل',
    usageInstruction: 'بخة واحدة في كل فتحة أنف مرتين يومياً، لا يستخدم لأكثر من 5 أيام متتالية',
    manufacturer: 'GSK',
    originCountry: 'سويسرا',
    defaultSupplierId: 'sup-4',
    requiresPrescription: false,
    isControlled: false,
    requiresColdStorage: false,
    storageTemperature: 'أقل من 30°C بعيداً عن الحرارة',
    minStockLimit: 12,
    maxStockLimit: 150,
    defaultProfitMargin: 30,
    shelfLocation: 'رف E-03 (قطرات وبخاخات الأنف)',
    packaging: {
      carton: {
        enabled: true,
        unitsInsideParent: 24,
        costPrice: 72000,
        sellingPrice: 96000,
        minSellingPrice: 88000
      },
      box: {
        enabled: true,
        unitsInsideParent: 1,
        costPrice: 3000,
        sellingPrice: 4250,
        minSellingPrice: 3750,
        barcode: '5000347098877'
      },
      strip: {
        enabled: false,
        unitsInsideParent: 1,
        costPrice: 3000,
        sellingPrice: 4250,
        minSellingPrice: 3750
      },
      tablet: {
        enabled: false,
        unitsInsideParent: 1,
        costPrice: 3000,
        sellingPrice: 4250,
        minSellingPrice: 3750
      }
    },
    alternatives: [],
    isRecalled: false
  },
  {
    id: 'item-12',
    commercialName: 'ديتول مطهر ومعقم طبي 500 مل (Dettol)',
    scientificName: 'Chloroxylenol 4.8%',
    englishName: 'Dettol Antiseptic Liquid 500ml',
    barcode: '5000347012399',
    internalCode: 'COS-DET-012',
    category: 'مستلزمات',
    form: 'محلول',
    concentration: '4.8% w/v',
    packageSize: 'عبوة 500 مل',
    usageInstruction: 'يخفف بالماء لتعقيم الجروح والأسطح والنظافة الشخصية',
    manufacturer: 'Reckitt Benckiser',
    originCountry: 'المملكة المتحدة',
    defaultSupplierId: 'sup-4',
    requiresPrescription: false,
    isControlled: false,
    requiresColdStorage: false,
    storageTemperature: 'درجة حرارة الغرفة العادية',
    minStockLimit: 10,
    maxStockLimit: 120,
    defaultProfitMargin: 25,
    shelfLocation: 'قسم المستلزمات والمعقمات - رف 1',
    packaging: {
      carton: {
        enabled: true,
        unitsInsideParent: 12,
        costPrice: 66000,
        sellingPrice: 84000,
        minSellingPrice: 78000
      },
      box: {
        enabled: true,
        unitsInsideParent: 1,
        costPrice: 5500,
        sellingPrice: 7500,
        minSellingPrice: 6750,
        barcode: '5000347012399'
      },
      strip: {
        enabled: false,
        unitsInsideParent: 1,
        costPrice: 5500,
        sellingPrice: 7500,
        minSellingPrice: 6750
      },
      tablet: {
        enabled: false,
        unitsInsideParent: 1,
        costPrice: 5500,
        sellingPrice: 7500,
        minSellingPrice: 6750
      }
    },
    alternatives: [],
    isRecalled: false
  }
];

export const initialBatches: MedicineBatch[] = [
  // Panadol Extra batches (FEFO: PE-24B02 expires soonest in Nov 2026, then PE-25A11 in Dec 2027)
  {
    id: 'batch-pan-1',
    itemId: 'item-1',
    branchId: 'branch-1',
    batchNumber: 'PE-24B02',
    productionDate: '2024-11-01',
    expiryDate: '2026-10-15', // Near expiry warning test! (~1 month away)
    costPriceCarton: 48000,
    costPriceSmallestUnit: 100,
    totalUnitsRemaining: 144, // 6 boxes (12 strips)
    shelfLocation: 'رف A-12',
    purchaseInvoiceId: 'pinv-101',
    isRecalled: false
  },
  {
    id: 'batch-pan-2',
    itemId: 'item-1',
    branchId: 'branch-1',
    batchNumber: 'PE-25A11',
    productionDate: '2025-05-10',
    expiryDate: '2027-12-30',
    costPriceCarton: 48000,
    costPriceSmallestUnit: 100,
    totalUnitsRemaining: 576, // 24 boxes
    shelfLocation: 'رف A-12',
    purchaseInvoiceId: 'pinv-103',
    isRecalled: false
  },
  {
    id: 'batch-pan-branch2',
    itemId: 'item-1',
    branchId: 'branch-2',
    batchNumber: 'PE-25A11',
    productionDate: '2025-05-10',
    expiryDate: '2027-12-30',
    costPriceCarton: 48000,
    costPriceSmallestUnit: 100,
    totalUnitsRemaining: 240,
    shelfLocation: 'رف الكرادة 1',
    purchaseInvoiceId: 'pinv-103',
    isRecalled: false
  },

  // Adol Extra
  {
    id: 'batch-adl-1',
    itemId: 'item-2',
    branchId: 'branch-1',
    batchNumber: 'AD-9941',
    productionDate: '2025-01-15',
    expiryDate: '2027-06-30',
    costPriceCarton: 42000,
    costPriceSmallestUnit: 84,
    totalUnitsRemaining: 320,
    shelfLocation: 'رف A-13',
    purchaseInvoiceId: 'pinv-102',
    isRecalled: false
  },

  // Paracetol Plus Pioneer
  {
    id: 'batch-pio-1',
    itemId: 'item-3',
    branchId: 'branch-1',
    batchNumber: 'PP-00421',
    productionDate: '2025-03-01',
    expiryDate: '2028-02-28',
    costPriceCarton: 36000,
    costPriceSmallestUnit: 60,
    totalUnitsRemaining: 400,
    shelfLocation: 'رف A-14',
    purchaseInvoiceId: 'pinv-102',
    isRecalled: false
  },

  // Augmentin 1g (Batch near expiry!)
  {
    id: 'batch-aug-1',
    itemId: 'item-4',
    branchId: 'branch-1',
    batchNumber: 'AUG-8871',
    productionDate: '2024-09-01',
    expiryDate: '2026-11-20', // Near expiry (~70 days)
    costPriceCarton: 180000,
    costPriceSmallestUnit: 642,
    totalUnitsRemaining: 70, // 5 boxes
    shelfLocation: 'رف B-04',
    purchaseInvoiceId: 'pinv-101',
    isRecalled: false
  },
  {
    id: 'batch-aug-2',
    itemId: 'item-4',
    branchId: 'branch-1',
    batchNumber: 'AUG-9410',
    productionDate: '2025-06-15',
    expiryDate: '2027-10-30',
    costPriceCarton: 180000,
    costPriceSmallestUnit: 642,
    totalUnitsRemaining: 210, // 15 boxes
    shelfLocation: 'رف B-04',
    purchaseInvoiceId: 'pinv-103',
    isRecalled: false
  },

  // Amoclan
  {
    id: 'batch-amc-1',
    itemId: 'item-5',
    branchId: 'branch-1',
    batchNumber: 'AMC-7730',
    productionDate: '2025-02-10',
    expiryDate: '2027-08-15',
    costPriceCarton: 130000,
    costPriceSmallestUnit: 464,
    totalUnitsRemaining: 182, // 13 boxes
    shelfLocation: 'رف B-05',
    purchaseInvoiceId: 'pinv-102',
    isRecalled: false
  },

  // Concor 5mg
  {
    id: 'batch-con-1',
    itemId: 'item-6',
    branchId: 'branch-1',
    batchNumber: 'CON-3321',
    productionDate: '2025-01-20',
    expiryDate: '2028-01-15',
    costPriceCarton: 120000,
    costPriceSmallestUnit: 200,
    totalUnitsRemaining: 300, // 10 boxes (30 strips)
    shelfLocation: 'رف C-01',
    purchaseInvoiceId: 'pinv-101',
    isRecalled: false
  },

  // Bisocor Pioneer
  {
    id: 'batch-bsc-1',
    itemId: 'item-7',
    branchId: 'branch-1',
    batchNumber: 'BSC-1190',
    productionDate: '2025-04-01',
    expiryDate: '2028-03-30',
    costPriceCarton: 87500,
    costPriceSmallestUnit: 116,
    totalUnitsRemaining: 240,
    shelfLocation: 'رف C-02',
    purchaseInvoiceId: 'pinv-102',
    isRecalled: false
  },

  // Lantus SoloStar (Cold Chain)
  {
    id: 'batch-lan-1',
    itemId: 'item-8',
    branchId: 'branch-1',
    batchNumber: 'LNT-5502',
    productionDate: '2025-03-10',
    expiryDate: '2027-03-01',
    costPriceCarton: 420000,
    costPriceSmallestUnit: 8400,
    totalUnitsRemaining: 25, // 5 boxes
    shelfLocation: 'الثلاجة المركزية رف 1',
    purchaseInvoiceId: 'pinv-101',
    isRecalled: false
  },

  // Omeprazole
  {
    id: 'batch-ome-1',
    itemId: 'item-9',
    branchId: 'branch-1',
    batchNumber: 'OME-4412',
    productionDate: '2025-02-15',
    expiryDate: '2027-11-30',
    costPriceCarton: 60000,
    costPriceSmallestUnit: 107,
    totalUnitsRemaining: 336, // 12 boxes
    shelfLocation: 'رف D-02',
    purchaseInvoiceId: 'pinv-102',
    isRecalled: false
  },

  // Ciprofloxacin
  {
    id: 'batch-cip-1',
    itemId: 'item-10',
    branchId: 'branch-1',
    batchNumber: 'CIP-9901',
    productionDate: '2025-01-05',
    expiryDate: '2027-09-20',
    costPriceCarton: 75000,
    costPriceSmallestUnit: 300,
    totalUnitsRemaining: 150, // 15 boxes
    shelfLocation: 'رف B-10',
    purchaseInvoiceId: 'pinv-102',
    isRecalled: false
  },

  // Otrivin
  {
    id: 'batch-otr-1',
    itemId: 'item-11',
    branchId: 'branch-1',
    batchNumber: 'OTR-1234',
    productionDate: '2025-04-10',
    expiryDate: '2027-04-10',
    costPriceCarton: 72000,
    costPriceSmallestUnit: 3000,
    totalUnitsRemaining: 18,
    shelfLocation: 'رف E-03',
    purchaseInvoiceId: 'pinv-103',
    isRecalled: false
  },

  // Dettol
  {
    id: 'batch-det-1',
    itemId: 'item-12',
    branchId: 'branch-1',
    batchNumber: 'DET-8811',
    productionDate: '2025-02-01',
    expiryDate: '2028-02-01',
    costPriceCarton: 66000,
    costPriceSmallestUnit: 5500,
    totalUnitsRemaining: 16,
    shelfLocation: 'قسم المستلزمات رف 1',
    purchaseInvoiceId: 'pinv-103',
    isRecalled: false
  }
];

export const initialPurchaseInvoices: PurchaseInvoice[] = [
  {
    id: 'pinv-101',
    invoiceNumber: 'PINV-2026-0041',
    supplierId: 'sup-1',
    branchId: 'branch-1',
    invoiceDate: '2026-08-10',
    receivedDate: '2026-08-11',
    orderRef: 'PO-8821',
    receivedBy: 'د. حيدر المعموري',
    paymentType: 'deferred',
    dueDate: '2026-09-20',
    status: 'partial',
    totalAmount: 4800000,
    paidAmount: 2800000,
    discountAmount: 200000,
    remainingAmount: 1800000,
    notes: 'توريد أدوية GSK الأصلية مع أقلام لانتوس مبردة مع فحص درجة الحرارة',
    items: [
      {
        itemId: 'item-1',
        batchNumber: 'PE-24B02',
        productionDate: '2024-11-01',
        expiryDate: '2026-10-15',
        cartons: 2,
        extraBoxes: 0,
        extraStrips: 0,
        extraUnits: 0,
        bonusUnits: 48, // 2 boxes bonus
        cartonCost: 48000,
        discountPercent: 5,
        netCost: 91200,
        totalSmallestUnits: 960,
        totalCost: 91200,
        suggestedSellingPriceBox: 3500,
        shelfLocation: 'رف A-12'
      },
      {
        itemId: 'item-4',
        batchNumber: 'AUG-8871',
        productionDate: '2024-09-01',
        expiryDate: '2026-11-20',
        cartons: 5,
        extraBoxes: 0,
        extraStrips: 0,
        extraUnits: 0,
        bonusUnits: 14,
        cartonCost: 180000,
        discountPercent: 4,
        netCost: 864000,
        totalSmallestUnits: 1400,
        totalCost: 864000,
        suggestedSellingPriceBox: 12000,
        shelfLocation: 'رف B-04'
      }
    ]
  },
  {
    id: 'pinv-102',
    invoiceNumber: 'PINV-2026-0055',
    supplierId: 'sup-2',
    branchId: 'branch-1',
    invoiceDate: '2026-08-25',
    receivedDate: '2026-08-26',
    orderRef: 'PO-9004',
    receivedBy: 'د. سارة العبيدي',
    paymentType: 'deferred',
    dueDate: '2026-09-15',
    status: 'partial',
    totalAmount: 3200000,
    paidAmount: 1200000,
    discountAmount: 150000,
    remainingAmount: 1850000,
    notes: 'طلبية مصنع الرواد الوطنية، خصم كمية إضافي',
    items: [
      {
        itemId: 'item-3',
        batchNumber: 'PP-00421',
        productionDate: '2025-03-01',
        expiryDate: '2028-02-28',
        cartons: 4,
        extraBoxes: 0,
        extraStrips: 0,
        extraUnits: 0,
        bonusUnits: 60,
        cartonCost: 36000,
        discountPercent: 7.5,
        netCost: 133200,
        totalSmallestUnits: 2400,
        totalCost: 133200,
        suggestedSellingPriceBox: 2000,
        shelfLocation: 'رف A-14'
      }
    ]
  }
];

export const initialSalesInvoices: SaleInvoice[] = [
  {
    id: 'sinv-1001',
    invoiceNumber: 'INV-2026-0891',
    branchId: 'branch-1',
    branchName: 'الفرع الرئيسي - المنصور',
    date: '2026-09-09',
    time: '10:45',
    cashierId: 'user-cashier',
    cashierName: 'أحمد التميمي',
    customerName: 'محمد سالم التميمي',
    customerPhone: '+964 770 111 2233',
    paymentMethod: 'cash',
    cashPaid: 15500,
    cardPaid: 0,
    creditPaid: 0,
    totalBeforeDiscount: 15500,
    discountAmount: 0,
    netTotal: 15500,
    totalCost: 11400,
    profit: 4100,
    status: 'completed',
    items: [
      {
        itemId: 'item-1',
        itemName: 'بانادول إكسترا (Panadol Extra)',
        scientificName: 'Paracetamol 500mg + Caffeine 65mg',
        unit: 'box',
        quantity: 1,
        batchId: 'batch-pan-1',
        batchNumber: 'PE-24B02',
        expiryDate: '2026-10-15',
        unitPrice: 3500,
        discount: 0,
        total: 3500,
        costPriceSmallestUnit: 100
      },
      {
        itemId: 'item-4',
        itemName: 'أوجمنتين 1 غرام (Augmentin 1g)',
        scientificName: 'Amoxicillin + Clavulanic acid',
        unit: 'box',
        quantity: 1,
        batchId: 'batch-aug-1',
        batchNumber: 'AUG-8871',
        expiryDate: '2026-11-20',
        unitPrice: 12000,
        discount: 0,
        total: 12000,
        costPriceSmallestUnit: 642
      }
    ]
  },
  {
    id: 'sinv-1002',
    invoiceNumber: 'INV-2026-0892',
    branchId: 'branch-1',
    branchName: 'الفرع الرئيسي - المنصور',
    date: '2026-09-09',
    time: '11:15',
    cashierId: 'user-cashier',
    cashierName: 'أحمد التميمي',
    customerName: 'أم عبد الله',
    customerPhone: '+964 780 444 5566',
    paymentMethod: 'card',
    cashPaid: 0,
    cardPaid: 8500,
    creditPaid: 0,
    totalBeforeDiscount: 8500,
    discountAmount: 0,
    netTotal: 8500,
    totalCost: 6000,
    profit: 2500,
    status: 'completed',
    items: [
      {
        itemId: 'item-6',
        itemName: 'كونكور 5 ملغ (Concor 5mg)',
        scientificName: 'Bisoprolol Fumarate 5mg',
        unit: 'box',
        quantity: 1,
        batchId: 'batch-con-1',
        batchNumber: 'CON-3321',
        expiryDate: '2028-01-15',
        unitPrice: 8500,
        discount: 0,
        total: 8500,
        costPriceSmallestUnit: 200
      }
    ]
  },
  {
    id: 'sinv-1003',
    invoiceNumber: 'INV-2026-0893',
    branchId: 'branch-1',
    branchName: 'الفرع الرئيسي - المنصور',
    date: '2026-09-09',
    time: '11:50',
    cashierId: 'user-cashier',
    cashierName: 'أحمد التميمي',
    customerName: 'زبون نقدي عام',
    paymentMethod: 'cash',
    cashPaid: 4000,
    cardPaid: 0,
    creditPaid: 0,
    totalBeforeDiscount: 4000,
    discountAmount: 0,
    netTotal: 4000,
    totalCost: 2400,
    profit: 1600,
    status: 'completed',
    items: [
      {
        itemId: 'item-1',
        itemName: 'بانادول إكسترا (Panadol Extra)',
        scientificName: 'Paracetamol 500mg + Caffeine 65mg',
        unit: 'strip',
        quantity: 2,
        batchId: 'batch-pan-1',
        batchNumber: 'PE-24B02',
        expiryDate: '2026-10-15',
        unitPrice: 2000,
        discount: 0,
        total: 4000,
        costPriceSmallestUnit: 100
      }
    ]
  }
];

export const initialSupplierPayments: SupplierPayment[] = [
  {
    id: 'spay-1',
    supplierId: 'sup-1',
    invoiceIds: ['pinv-101'],
    amount: 2800000,
    paymentDate: '2026-08-20',
    paymentMethod: 'transfer',
    receiptNumber: 'VOUCHER-IQ-883',
    receiptDate: '2026-08-20',
    recipientName: 'أ. كرم السعدي (مندوب الرازي)',
    bankOrTreasury: 'حساب مصرف بغداد التجاري',
    notes: 'دفعة أولى من فاتورة أغسطس، تم استلام الوصل الأصلي وتوقيعه'
  },
  {
    id: 'spay-2',
    supplierId: 'sup-2',
    invoiceIds: ['pinv-102'],
    amount: 1200000,
    paymentDate: '2026-08-30',
    paymentMethod: 'cash',
    receiptNumber: 'CASH-REC-112',
    receiptDate: '2026-08-30',
    recipientName: 'أ. عمر الخفاجي',
    bankOrTreasury: 'صندوق الصيدلية الرئيسي',
    notes: 'تسليم نقدي مباشر للمندوب'
  }
];

export const initialDamagedWriteoffs: DamagedWriteoff[] = [
  {
    id: 'dmg-1',
    date: '2026-09-02',
    branchId: 'branch-1',
    itemId: 'item-11',
    itemName: 'أوتريفين بخاخ أنفي للأطفال',
    batchNumber: 'OTR-1234',
    quantity: 2,
    reason: 'broken',
    unitCost: 3000,
    totalLoss: 6000,
    responsibleStaff: 'أحمد التميمي',
    approvedBy: 'د. حيدر المعموري',
    notes: 'كسر في عبوتين أثناء تنظيف وترتيب الرفوف العلوية'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-09-09 11:50:12',
    userId: 'user-cashier',
    userName: 'أحمد التميمي',
    role: 'sales_cashier',
    action: 'إصدار فاتورة مبيعات',
    entity: 'فاتورة INV-2026-0893',
    details: 'بيع 2 شريط بانادول إكسترا بمبلغ 4,000 د.ع نقداً'
  },
  {
    id: 'log-2',
    timestamp: '2026-09-09 11:30:00',
    userId: 'user-owner',
    userName: 'د. حيدر أحمد المعموري',
    role: 'pharmacy_owner',
    action: 'تسجيل دخول للنظام',
    entity: 'جلسة عمل',
    details: 'تسجيل دخول ناجح من الفرع الرئيسي - المنصور'
  },
  {
    id: 'log-3',
    timestamp: '2026-09-09 09:15:00',
    userId: 'user-super',
    userName: 'المهندس مصطفى عادل',
    role: 'super_admin',
    action: 'لوحة التحكم الفنية',
    entity: 'مراقبة النظام',
    details: 'فحص حالة قواعد البيانات والتنبيهات الدوائية لجميع الصيدليات'
  }
];
