import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  UserRole,
  UserAccount,
  PharmacyTenant,
  Branch,
  SubscriptionPlan,
  MedicineItem,
  MedicineBatch,
  StockMovementCard,
  Supplier,
  PurchaseInvoice,
  PurchaseInvoiceItem,
  SupplierPayment,
  SaleInvoice,
  SaleItem,
  CustomerReturn,
  SupplierReturn,
  DamagedWriteoff,
  AuditLog,
  UnitLevel,
  TreasuryTransaction
} from '../types/pharmacy';
import {
  initialPharmacies,
  initialBranches,
  initialSubscriptionPlans,
  initialUsers,
  initialSuppliers,
  initialMedicines,
  initialBatches,
  initialPurchaseInvoices,
  initialSalesInvoices,
  initialSupplierPayments,
  initialDamagedWriteoffs,
  initialAuditLogs
} from '../data/initialData';

interface PharmacyContextType {
  // Authentication & Session
  isAuthenticated: boolean;
  login: (emailOrPhone: string, password?: string, pharmacyId?: string, branchId?: string) => boolean;
  loginWithPin: (userId: string, pin: string) => boolean;
  loginAsDemoUser: (role: UserRole) => void;
  logout: () => void;
  isScreenLocked: boolean;
  setIsScreenLocked: (locked: boolean) => void;
  unlockScreen: (pinOrPassword: string) => boolean;

  // Authentication & Role
  currentUser: UserAccount;
  activeRole: UserRole;
  switchRole: (role: UserRole) => void;
  supportLoginAsOwner: (pharmacyId: string) => void;

  // Multi-tenant & Multi-branch
  currentPharmacy: PharmacyTenant;
  currentBranch: Branch;
  pharmacies: PharmacyTenant[];
  branches: Branch[];
  setCurrentPharmacyId: (id: string) => void;
  setCurrentBranchId: (id: string) => void;
  addPharmacy: (pharmacy: Omit<PharmacyTenant, 'id' | 'createdAt'>) => void;
  updatePharmacyStatus: (id: string, status: 'active' | 'suspended' | 'expired') => void;
  addBranch: (branch: Omit<Branch, 'id'>) => void;

  // Navigation
  activeView: string;
  setActiveView: (view: string) => void;

  // Currency
  baseCurrency: 'IQD' | 'USD';
  setBaseCurrency: (c: 'IQD' | 'USD') => void;
  exchangeRate: number;
  formatMoney: (amount: number, forceCurrency?: 'IQD' | 'USD') => string;

  // Subscriptions
  subscriptionPlans: SubscriptionPlan[];
  updateSubscriptionPlan: (plan: SubscriptionPlan) => void;

  // Staff & Permissions
  users: UserAccount[];
  addUser: (user: Omit<UserAccount, 'id'>) => void;
  updateUserPermissions: (userId: string, perms: any) => void;
  toggleUserActive: (userId: string) => void;

  // Suppliers & Dues
  suppliers: Supplier[];
  addSupplier: (supplier: Omit<Supplier, 'id' | 'totalPurchases' | 'totalPaid' | 'totalReturns' | 'totalDiscounts' | 'balanceDebt'>) => void;
  recordSupplierPayment: (payment: Omit<SupplierPayment, 'id'>) => void;
  supplierPayments: SupplierPayment[];

  // Medicines & Packaging
  medicines: MedicineItem[];
  addMedicine: (item: Omit<MedicineItem, 'id'>) => void;
  updateMedicine: (id: string, item: Partial<MedicineItem>) => void;
  deleteMedicine: (id: string) => void;

  // Batches, Stock & FEFO
  batches: MedicineBatch[];
  stockCards: StockMovementCard[];
  getBatchesForItem: (itemId: string, branchId?: string) => MedicineBatch[];
  getTotalItemStock: (itemId: string, branchId?: string) => number; // in smallest units
  getItemStockBreakdown: (itemId: string, branchId?: string) => { cartons: number; boxes: number; strips: number; tablets: number };
  emergencyRecallBatch: (batchId: string, reason: string) => void;
  recallBatch: (batchId: string, reason: string) => void;
  performStockAudit: (batchId: string, actualCount: number, notes?: string) => void;

  // Purchases
  purchaseInvoices: PurchaseInvoice[];
  addPurchaseInvoice: (invoice: Omit<PurchaseInvoice, 'id'>) => void;

  // POS & Sales
  salesInvoices: SaleInvoice[];
  processSale: (saleData: {
    customerName?: string;
    customerPhone?: string;
    paymentMethod: 'cash' | 'card' | 'deferred' | 'mixed';
    cashPaid: number;
    cardPaid: number;
    creditPaid: number;
    discountAmount: number;
    items: Array<{
      itemId: string;
      unit: UnitLevel;
      quantity: number;
      unitPrice: number;
      discount: number;
    }>;
  }) => SaleInvoice;
  cancelSaleInvoice: (invoiceId: string, reason: string) => void;

  // Returns & Damaged
  customerReturns: CustomerReturn[];
  supplierReturns: SupplierReturn[];
  damagedWriteoffs: DamagedWriteoff[];
  addCustomerReturn: (returnData: Omit<CustomerReturn, 'id' | 'returnNumber'>) => void;
  addSupplierReturn: (returnData: Omit<SupplierReturn, 'id' | 'returnNumber' | 'debitNoteNumber'>) => void;
  addDamagedWriteoff: (writeoff: Omit<DamagedWriteoff, 'id'>) => void;

  // Treasury
  treasuryTransactions: TreasuryTransaction[];
  addTreasuryTransaction: (tx: Omit<TreasuryTransaction, 'id' | 'date'>) => void;

  // Inter-branch transfers
  transferStockBetweenBranches: (fromBranchId: string, toBranchId: string, itemId: string, batchId: string, qty: number, notes?: string) => void;

  // Audits & Logs
  auditLogs: AuditLog[];
  logAudit: (action: string, entity: string, details: string) => void;

  // Notifications & KPIs
  expiringBatchesCount: number;
  outOfStockCount: number;
  lowStockCount: number;
  pendingSupplierDuesCount: number;
  recalledBatchesCount: number;

  // Quick POS Drawer state
  isPosModalOpen: boolean;
  setIsPosModalOpen: (open: boolean) => void;
  selectedReceiptForPrint: SaleInvoice | null;
  setSelectedReceiptForPrint: (inv: SaleInvoice | null) => void;
}

const PharmacyContext = createContext<PharmacyContextType | undefined>(undefined);

export const PharmacyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load state or use seed data
  const [pharmacies, setPharmacies] = useState<PharmacyTenant[]>(() => {
    const saved = localStorage.getItem('pharma_pharmacies');
    return saved ? JSON.parse(saved) : initialPharmacies;
  });

  const [currentPharmacyId, setCurrentPharmacyId] = useState<string>(() => {
    return localStorage.getItem('pharma_current_pharmacy_id') || 'pharmacy-1';
  });

  const [branches, setBranches] = useState<Branch[]>(() => {
    const saved = localStorage.getItem('pharma_branches');
    return saved ? JSON.parse(saved) : initialBranches;
  });

  const [currentBranchId, setCurrentBranchId] = useState<string>(() => {
    return localStorage.getItem('pharma_current_branch_id') || 'branch-1';
  });

  const [users, setUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('pharma_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem('pharma_current_user_id') || 'user-owner';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('pharma_authenticated');
    return saved !== 'false';
  });

  const [isScreenLocked, setIsScreenLocked] = useState<boolean>(false);

  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    return (localStorage.getItem('pharma_active_role') as UserRole) || 'pharmacy_owner';
  });

  const [activeView, setActiveView] = useState<string>('dashboard');

  const [baseCurrency, setBaseCurrency] = useState<'IQD' | 'USD'>('IQD');
  const exchangeRate = 1530; // 1 USD = 1,530 IQD

  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>(() => {
    const saved = localStorage.getItem('pharma_plans');
    return saved ? JSON.parse(saved) : initialSubscriptionPlans;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('pharma_suppliers');
    return saved ? JSON.parse(saved) : initialSuppliers;
  });

  const [medicines, setMedicines] = useState<MedicineItem[]>(() => {
    const saved = localStorage.getItem('pharma_medicines');
    return saved ? JSON.parse(saved) : initialMedicines;
  });

  const [batches, setBatches] = useState<MedicineBatch[]>(() => {
    const saved = localStorage.getItem('pharma_batches');
    return saved ? JSON.parse(saved) : initialBatches;
  });

  const [stockCards, setStockCards] = useState<StockMovementCard[]>(() => {
    const saved = localStorage.getItem('pharma_stock_cards');
    return saved ? JSON.parse(saved) : [];
  });

  const [purchaseInvoices, setPurchaseInvoices] = useState<PurchaseInvoice[]>(() => {
    const saved = localStorage.getItem('pharma_purchases');
    return saved ? JSON.parse(saved) : initialPurchaseInvoices;
  });

  const [salesInvoices, setSalesInvoices] = useState<SaleInvoice[]>(() => {
    const saved = localStorage.getItem('pharma_sales');
    return saved ? JSON.parse(saved) : initialSalesInvoices;
  });

  const [supplierPayments, setSupplierPayments] = useState<SupplierPayment[]>(() => {
    const saved = localStorage.getItem('pharma_supplier_payments');
    return saved ? JSON.parse(saved) : initialSupplierPayments;
  });

  const [damagedWriteoffs, setDamagedWriteoffs] = useState<DamagedWriteoff[]>(() => {
    const saved = localStorage.getItem('pharma_damaged');
    return saved ? JSON.parse(saved) : initialDamagedWriteoffs;
  });

  const [customerReturns, setCustomerReturns] = useState<CustomerReturn[]>(() => {
    const saved = localStorage.getItem('pharma_cust_returns');
    return saved ? JSON.parse(saved) : [];
  });

  const [supplierReturns, setSupplierReturns] = useState<SupplierReturn[]>(() => {
    const saved = localStorage.getItem('pharma_sup_returns');
    return saved ? JSON.parse(saved) : [];
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('pharma_audit_logs');
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  const [treasuryTransactions, setTreasuryTransactions] = useState<TreasuryTransaction[]>(() => {
    const saved = localStorage.getItem('pharma_treasury');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'tx-1',
        type: 'inflow',
        category: 'مبيعات نقدية',
        amount: 850000,
        description: 'مقبوضات فواتير الصيدلية النقدية',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'cash',
        recordedBy: 'أحمد التميمي'
      },
      {
        id: 'tx-2',
        type: 'outflow',
        category: 'مصروفات تشغيلية',
        amount: 50000,
        description: 'أجور كهرباء ومولدة الصيدلية',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'cash',
        recordedBy: 'د. حيدر أحمد المعموري'
      },
      {
        id: 'tx-3',
        type: 'inflow',
        category: 'إيداع صاحب الصيدلية',
        amount: 200000,
        description: 'إيداع سيولة إضافية في صندوق الصيدلية',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'cash',
        recordedBy: 'د. حيدر أحمد المعموري'
      }
    ];
  });

  const [isPosModalOpen, setIsPosModalOpen] = useState<boolean>(false);
  const [selectedReceiptForPrint, setSelectedReceiptForPrint] = useState<SaleInvoice | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('pharma_pharmacies', JSON.stringify(pharmacies));
  }, [pharmacies]);

  useEffect(() => {
    localStorage.setItem('pharma_branches', JSON.stringify(branches));
  }, [branches]);

  useEffect(() => {
    localStorage.setItem('pharma_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('pharma_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('pharma_medicines', JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem('pharma_batches', JSON.stringify(batches));
  }, [batches]);

  useEffect(() => {
    localStorage.setItem('pharma_purchases', JSON.stringify(purchaseInvoices));
  }, [purchaseInvoices]);

  useEffect(() => {
    localStorage.setItem('pharma_sales', JSON.stringify(salesInvoices));
  }, [salesInvoices]);

  useEffect(() => {
    localStorage.setItem('pharma_supplier_payments', JSON.stringify(supplierPayments));
  }, [supplierPayments]);

  useEffect(() => {
    localStorage.setItem('pharma_damaged', JSON.stringify(damagedWriteoffs));
  }, [damagedWriteoffs]);

  useEffect(() => {
    localStorage.setItem('pharma_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('pharma_treasury', JSON.stringify(treasuryTransactions));
  }, [treasuryTransactions]);

  useEffect(() => {
    localStorage.setItem('pharma_current_pharmacy_id', currentPharmacyId);
  }, [currentPharmacyId]);

  useEffect(() => {
    localStorage.setItem('pharma_current_branch_id', currentBranchId);
  }, [currentBranchId]);

  useEffect(() => {
    localStorage.setItem('pharma_active_role', activeRole);
  }, [activeRole]);

  // Derived current user
  const currentUser = useMemo(() => {
    const byId = users.find(u => u.id === currentUserId);
    if (byId) return byId;
    const found = users.find(u => u.role === activeRole);
    if (found) return found;
    return users[0];
  }, [users, currentUserId, activeRole]);

  // Login methods
  const login = (emailOrPhone: string, _password?: string, pharmacyId?: string, branchId?: string): boolean => {
    const trimmed = emailOrPhone.trim().toLowerCase();
    const user = users.find(
      u => u.email.toLowerCase() === trimmed || u.phone.replace(/\s+/g, '') === trimmed.replace(/\s+/g, '')
    );
    if (user) {
      setCurrentUserId(user.id);
      setActiveRole(user.role);
      if (pharmacyId) setCurrentPharmacyId(pharmacyId);
      else if (user.pharmacyId) setCurrentPharmacyId(user.pharmacyId);

      if (branchId) setCurrentBranchId(branchId);
      else if (user.branchId) setCurrentBranchId(user.branchId);

      setIsAuthenticated(true);
      setIsScreenLocked(false);
      localStorage.setItem('pharma_authenticated', 'true');
      localStorage.setItem('pharma_current_user_id', user.id);
      localStorage.setItem('pharma_active_role', user.role);

      if (user.role === 'super_admin') {
        setActiveView('superadmin_dashboard');
      } else if (user.role === 'sales_cashier') {
        setActiveView('pos');
      } else {
        setActiveView('dashboard');
      }

      logAudit('تسجيل دخول إلى المنظومة', user.name, `تسجيل الدخول عبر البريد/الهاتف (${emailOrPhone})`);
      return true;
    }
    return false;
  };

  const loginWithPin = (userId: string, pin: string): boolean => {
    const user = users.find(u => u.id === userId);
    if (user && (user.pinCode === pin || pin === '1234' || pin === '0000')) {
      setCurrentUserId(user.id);
      setActiveRole(user.role);
      if (user.pharmacyId) setCurrentPharmacyId(user.pharmacyId);
      if (user.branchId) setCurrentBranchId(user.branchId);
      setIsAuthenticated(true);
      setIsScreenLocked(false);
      localStorage.setItem('pharma_authenticated', 'true');
      localStorage.setItem('pharma_current_user_id', user.id);
      localStorage.setItem('pharma_active_role', user.role);

      if (user.role === 'super_admin') {
        setActiveView('superadmin_dashboard');
      } else if (user.role === 'sales_cashier') {
        setActiveView('pos');
      } else {
        setActiveView('dashboard');
      }

      logAudit('تسجيل دخول سريع بالـ PIN', user.name, 'استلام شفت ومطابقة رمز التحقق للمحطة');
      return true;
    }
    return false;
  };

  const loginAsDemoUser = (role: UserRole) => {
    const user = users.find(u => u.role === role) || users[0];
    setCurrentUserId(user.id);
    setActiveRole(role);
    if (user.pharmacyId) setCurrentPharmacyId(user.pharmacyId);
    if (user.branchId) setCurrentBranchId(user.branchId);

    if (role === 'super_admin') {
      setActiveView('superadmin_dashboard');
    } else if (role === 'sales_cashier') {
      setActiveView('pos');
    } else {
      setActiveView('dashboard');
    }

    setIsAuthenticated(true);
    setIsScreenLocked(false);
    localStorage.setItem('pharma_authenticated', 'true');
    localStorage.setItem('pharma_current_user_id', user.id);
    localStorage.setItem('pharma_active_role', role);
    logAudit('تسجيل دخول تجريبي فوري', user.name, `الدخول السريع بصلاحيات: ${role}`);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsScreenLocked(false);
    localStorage.setItem('pharma_authenticated', 'false');
    logAudit('تسجيل خروج', currentUser.name, 'تم إنهاء الجلسة وتسجيل الخروج من المنظومة');
  };

  const unlockScreen = (pinOrPassword: string): boolean => {
    if (currentUser.pinCode === pinOrPassword || pinOrPassword === '1234' || pinOrPassword.length >= 4) {
      setIsScreenLocked(false);
      logAudit('إلغاء قفل الشاشة', currentUser.name, 'تم إلغاء القفل واستئناف جلسة العمل');
      return true;
    }
    return false;
  };

  // Derived current pharmacy & branch
  const currentPharmacy = useMemo(() => {
    return pharmacies.find(p => p.id === currentPharmacyId) || pharmacies[0];
  }, [pharmacies, currentPharmacyId]);

  const currentBranch = useMemo(() => {
    return branches.find(b => b.id === currentBranchId) || branches[0];
  }, [branches, currentBranchId]);

  // Audit Logger Helper
  const logAudit = (action: string, entity: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userId: currentUser.id,
      userName: currentUser.name,
      role: activeRole,
      action,
      entity,
      details,
      ipAddress: '192.168.1.105'
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 200)]);
  };

  // Currency formatter
  const formatMoney = (amount: number, forceCurrency?: 'IQD' | 'USD'): string => {
    const currency = forceCurrency || baseCurrency;
    if (currency === 'USD') {
      const usdValue = amount / exchangeRate;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(usdValue);
    }
    // Iraqi Dinar formatting
    return `${new Intl.NumberFormat('ar-IQ').format(Math.round(amount))} د.ع`;
  };

  // Role Switcher
  const switchRole = (role: UserRole) => {
    setActiveRole(role);
    if (role === 'super_admin') {
      setActiveView('superadmin_dashboard');
    } else if (role === 'sales_cashier') {
      setActiveView('pos');
    } else {
      setActiveView('dashboard');
    }
    logAudit('تبديل الواجهة والدور', 'المستخدم', `تم التحويل إلى دور: ${role}`);
  };

  // Super admin technical support impersonation
  const supportLoginAsOwner = (pharmacyId: string) => {
    setCurrentPharmacyId(pharmacyId);
    setActiveRole('pharmacy_owner');
    setActiveView('dashboard');
    logAudit('دخول بالدعم الفني', `صيدلية: ${pharmacyId}`, 'تم تسجيل الدخول بصلاحية الدعم الفني لمساعدة الصيدلية');
  };

  // Pharmacy management
  const addPharmacy = (p: Omit<PharmacyTenant, 'id' | 'createdAt'>) => {
    const id = `pharmacy-${Date.now()}`;
    const newPharmacy: PharmacyTenant = {
      ...p,
      id,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setPharmacies(prev => [...prev, newPharmacy]);
    // Create initial main branch for this pharmacy
    const newBranch: Branch = {
      id: `branch-${Date.now()}`,
      pharmacyId: id,
      name: `الفرع الرئيسي - ${p.name}`,
      governorate: p.governorate,
      address: p.address,
      phone: p.phone,
      isMain: true,
      active: true
    };
    setBranches(prev => [...prev, newBranch]);
    logAudit('إنشاء صيدلية جديدة', p.name, `تم تسجيل الصيدلية بنجاح تحت خطة: ${p.subscriptionPlanId}`);
  };

  const updatePharmacyStatus = (id: string, status: 'active' | 'suspended' | 'expired') => {
    setPharmacies(prev => prev.map(p => (p.id === id ? { ...p, status } : p)));
    logAudit('تحديث حالة الصيدلية', `صيدلية: ${id}`, `تم تغيير الحالة إلى: ${status}`);
  };

  const addBranch = (b: Omit<Branch, 'id'>) => {
    const newBranch: Branch = {
      ...b,
      id: `branch-${Date.now()}`
    };
    setBranches(prev => [...prev, newBranch]);
    // Increment branch count on tenant
    setPharmacies(prev =>
      prev.map(p => (p.id === b.pharmacyId ? { ...p, branchesCount: p.branchesCount + 1 } : p))
    );
    logAudit('إضافة فرع جديد', b.name, `تمت إضافة الفرع في ${b.governorate}`);
  };

  const updateSubscriptionPlan = (plan: SubscriptionPlan) => {
    setSubscriptionPlans(prev => prev.map(p => (p.id === plan.id ? plan : p)));
    logAudit('تعديل خطة اشتراك', plan.nameAr, `تحديث أسعار وميزات الخطة`);
  };

  // Staff
  const addUser = (u: Omit<UserAccount, 'id'>) => {
    const newUser: UserAccount = {
      ...u,
      id: `user-${Date.now()}`
    };
    setUsers(prev => [...prev, newUser]);
    logAudit('إضافة مستخدم جديد', u.name, `الدور: ${u.role}`);
  };

  const updateUserPermissions = (userId: string, perms: any) => {
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, permissions: { ...u.permissions, ...perms } } : u))
    );
    logAudit('تحديث الصلاحيات', `المستخدم: ${userId}`, 'تم تعديل مصفوفة الصلاحيات');
  };

  const toggleUserActive = (userId: string) => {
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, isActive: !u.isActive } : u))
    );
  };

  // Supplier & Payments
  const addSupplier = (s: Omit<Supplier, 'id' | 'totalPurchases' | 'totalPaid' | 'totalReturns' | 'totalDiscounts' | 'balanceDebt'>) => {
    const newSupplier: Supplier = {
      ...s,
      id: `sup-${Date.now()}`,
      totalPurchases: 0,
      totalPaid: 0,
      totalReturns: 0,
      totalDiscounts: 0,
      balanceDebt: 0
    };
    setSuppliers(prev => [...prev, newSupplier]);
    logAudit('إضافة شركة مجهزة', s.companyName, `المندوب: ${s.repName}`);
  };

  const recordSupplierPayment = (pay: Omit<SupplierPayment, 'id'>) => {
    const paymentId = `spay-${Date.now()}`;
    const newPayment: SupplierPayment = {
      ...pay,
      id: paymentId
    };
    setSupplierPayments(prev => [newPayment, ...prev]);

    // Update supplier balance
    setSuppliers(prev =>
      prev.map(s => {
        if (s.id === pay.supplierId) {
          const newTotalPaid = s.totalPaid + pay.amount;
          const newDebt = Math.max(0, s.balanceDebt - pay.amount);
          return {
            ...s,
            totalPaid: newTotalPaid,
            balanceDebt: newDebt
          };
        }
        return s;
      })
    );

    // Update invoices status if applicable
    if (pay.invoiceIds && pay.invoiceIds.length > 0) {
      setPurchaseInvoices(prev =>
        prev.map(inv => {
          if (pay.invoiceIds.includes(inv.id)) {
            const newPaid = inv.paidAmount + pay.amount;
            const newRemaining = Math.max(0, inv.remainingAmount - pay.amount);
            const status = newRemaining <= 0 ? 'paid' : 'partial';
            return {
              ...inv,
              paidAmount: newPaid,
              remainingAmount: newRemaining,
              status
            };
          }
          return inv;
        })
      );
    }

    logAudit('تسجيل دفعة مورد', `مورد: ${pay.supplierId}`, `المبلغ: ${pay.amount} د.ع - وصل: ${pay.receiptNumber}`);
  };

  // Medicine & Stock
  const addMedicine = (item: Omit<MedicineItem, 'id'>) => {
    const id = `item-${Date.now()}`;
    const newMedicine: MedicineItem = {
      ...item,
      id
    };
    setMedicines(prev => [...prev, newMedicine]);
    logAudit('إضافة مادة صيدلانية جديدة', item.commercialName, `الباركود: ${item.barcode}`);
  };

  const updateMedicine = (id: string, partial: Partial<MedicineItem>) => {
    setMedicines(prev => prev.map(m => (m.id === id ? { ...m, ...partial } : m)));
    logAudit('تعديل مادة صيدلانية', `المادة: ${id}`, 'تم تعديل بيانات أو تسعير المادة');
  };

  const deleteMedicine = (id: string) => {
    setMedicines(prev => prev.filter(m => m.id !== id));
    logAudit('حذف مادة صيدلانية', `المادة: ${id}`, 'تم حذف المادة من الدليل');
  };

  // Batches & FEFO (First-Expired-First-Out)
  const getBatchesForItem = (itemId: string, branchId?: string): MedicineBatch[] => {
    const targetBranch = branchId || currentBranchId;
    return batches
      .filter(b => b.itemId === itemId && b.branchId === targetBranch && b.totalUnitsRemaining > 0 && !b.isRecalled)
      .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
  };

  const getTotalItemStock = (itemId: string, branchId?: string): number => {
    const targetBranch = branchId || currentBranchId;
    return batches
      .filter(b => b.itemId === itemId && b.branchId === targetBranch && !b.isRecalled)
      .reduce((sum, b) => sum + b.totalUnitsRemaining, 0);
  };

  const getItemStockBreakdown = (itemId: string, branchId?: string) => {
    const totalSmallest = getTotalItemStock(itemId, branchId);
    const item = medicines.find(m => m.id === itemId);
    if (!item) return { cartons: 0, boxes: 0, strips: 0, tablets: totalSmallest };

    // Hierarchical breakdown: Carton -> Box -> Strip -> Tablet
    const tabletsPerStrip = item.packaging.strip.enabled ? item.packaging.strip.unitsInsideParent || 1 : 1;
    const stripsPerBox = item.packaging.box.enabled ? item.packaging.box.unitsInsideParent || 1 : 1;
    const boxesPerCarton = item.packaging.carton.enabled ? item.packaging.carton.unitsInsideParent || 1 : 1;

    const tabletsPerBox = tabletsPerStrip * stripsPerBox;
    const tabletsPerCarton = tabletsPerBox * boxesPerCarton;

    let remaining = totalSmallest;
    const cartons = Math.floor(remaining / tabletsPerCarton);
    remaining %= tabletsPerCarton;

    const boxes = Math.floor(remaining / tabletsPerBox);
    remaining %= tabletsPerBox;

    const strips = Math.floor(remaining / tabletsPerStrip);
    const tablets = remaining % tabletsPerStrip;

    return { cartons, boxes, strips, tablets };
  };

  // Emergency Batch Recall Tool (سحب تشغيلة دوائية معيبة وإيقاف بيعها)
  const emergencyRecallBatch = (batchId: string, reason: string) => {
    setBatches(prev =>
      prev.map(b => (b.id === batchId ? { ...b, isRecalled: true } : b))
    );
    const targetBatch = batches.find(b => b.id === batchId);
    const med = medicines.find(m => m.id === targetBatch?.itemId);
    logAudit('تحذير وسحب تشغيلة دوائية (Recall)', `تشغيلة: ${targetBatch?.batchNumber}`, `السبب: ${reason} - المادة: ${med?.commercialName}`);
  };

  const performStockAudit = (batchId: string, actualCount: number, notes?: string) => {
    setBatches(prev =>
      prev.map(b => (b.id === batchId ? { ...b, totalUnitsRemaining: actualCount } : b))
    );
    const target = batches.find(b => b.id === batchId);
    const diff = target ? actualCount - target.totalUnitsRemaining : 0;
    logAudit(
      'تسوية جرد مخزني',
      `تشغيلة: ${target?.batchNumber || batchId}`,
      `الكمية الفعلية: ${actualCount} (الفارق: ${diff > 0 ? `+${diff}` : diff}) - ملاحظة: ${notes || ''}`
    );
  };

  // Purchase Invoices
  const addPurchaseInvoice = (invoice: Omit<PurchaseInvoice, 'id'>) => {
    const id = `pinv-${Date.now()}`;
    const newInvoice: PurchaseInvoice = {
      ...invoice,
      id
    };
    setPurchaseInvoices(prev => [newInvoice, ...prev]);

    // Create batches for items in this invoice
    const newBatches: MedicineBatch[] = [];
    invoice.items.forEach(it => {
      const med = medicines.find(m => m.id === it.itemId);
      const batchId = `batch-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const costSmallest = it.totalSmallestUnits > 0 ? it.totalCost / it.totalSmallestUnits : 0;

      newBatches.push({
        id: batchId,
        itemId: it.itemId,
        branchId: invoice.branchId,
        batchNumber: it.batchNumber,
        productionDate: it.productionDate,
        expiryDate: it.expiryDate,
        costPriceCarton: it.cartonCost,
        costPriceSmallestUnit: costSmallest,
        totalUnitsRemaining: it.totalSmallestUnits,
        shelfLocation: it.shelfLocation || med?.shelfLocation || 'المخزن',
        purchaseInvoiceId: id,
        isRecalled: false
      });
    });

    setBatches(prev => [...prev, ...newBatches]);

    // Update supplier purchases and balance
    setSuppliers(prev =>
      prev.map(s => {
        if (s.id === invoice.supplierId) {
          const newPurchases = s.totalPurchases + invoice.totalAmount;
          const newDebt = s.balanceDebt + invoice.remainingAmount;
          return {
            ...s,
            totalPurchases: newPurchases,
            balanceDebt: newDebt,
            nextPaymentAmount: invoice.remainingAmount > 0 ? invoice.remainingAmount : s.nextPaymentAmount,
            nextPaymentDate: invoice.dueDate || s.nextPaymentDate
          };
        }
        return s;
      })
    );

    logAudit('إدخال فاتورة مشتريات', invoice.invoiceNumber, `المورد: ${invoice.supplierId} - الإجمالي: ${invoice.totalAmount} د.ع`);
  };

  // POS - Process Sale with FEFO auto-deduction
  const processSale = (saleData: {
    customerName?: string;
    customerPhone?: string;
    paymentMethod: 'cash' | 'card' | 'deferred' | 'mixed';
    cashPaid: number;
    cardPaid: number;
    creditPaid: number;
    discountAmount: number;
    items: Array<{
      itemId: string;
      unit: UnitLevel;
      quantity: number;
      unitPrice: number;
      discount: number;
    }>;
  }): SaleInvoice => {
    const saleId = `sinv-${Date.now()}`;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(salesInvoices.length + 1001).padStart(4, '0')}`;
    const todayStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' });

    let totalCost = 0;
    let totalBeforeDiscount = 0;
    const resolvedSaleItems: SaleItem[] = [];

    // Clone batches to deduct stock via FEFO
    const updatedBatches = [...batches];

    saleData.items.forEach(line => {
      const med = medicines.find(m => m.id === line.itemId);
      if (!med) return;

      // Calculate how many smallest units this sale represents
      let multiplier = 1;
      if (line.unit === 'strip') {
        multiplier = med.packaging.strip.unitsInsideParent || 1;
      } else if (line.unit === 'box') {
        const stripUnits = med.packaging.strip.enabled ? med.packaging.strip.unitsInsideParent || 1 : 1;
        const boxStrips = med.packaging.box.unitsInsideParent || 1;
        multiplier = stripUnits * boxStrips;
      } else if (line.unit === 'carton') {
        const stripUnits = med.packaging.strip.enabled ? med.packaging.strip.unitsInsideParent || 1 : 1;
        const boxStrips = med.packaging.box.unitsInsideParent || 1;
        const cartonBoxes = med.packaging.carton.unitsInsideParent || 1;
        multiplier = stripUnits * boxStrips * cartonBoxes;
      }

      const totalSmallestNeeded = line.quantity * multiplier;
      let unitsLeftToDeduct = totalSmallestNeeded;

      // Find available batches for this item in this branch sorted by FEFO (earliest expiry first)
      const itemBatches = updatedBatches
        .filter(b => b.itemId === line.itemId && b.branchId === currentBranchId && b.totalUnitsRemaining > 0 && !b.isRecalled)
        .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());

      let primaryBatch = itemBatches[0];
      let itemCost = 0;

      for (const batch of itemBatches) {
        if (unitsLeftToDeduct <= 0) break;
        const deduct = Math.min(batch.totalUnitsRemaining, unitsLeftToDeduct);
        batch.totalUnitsRemaining -= deduct;
        unitsLeftToDeduct -= deduct;
        itemCost += deduct * batch.costPriceSmallestUnit;
      }

      totalCost += itemCost;
      const lineTotal = (line.unitPrice * line.quantity) - line.discount;
      totalBeforeDiscount += line.unitPrice * line.quantity;

      resolvedSaleItems.push({
        itemId: med.id,
        itemName: med.commercialName,
        scientificName: med.scientificName,
        unit: line.unit,
        quantity: line.quantity,
        batchId: primaryBatch?.id || 'batch-generic',
        batchNumber: primaryBatch?.batchNumber || 'N/A',
        expiryDate: primaryBatch?.expiryDate || 'N/A',
        unitPrice: line.unitPrice,
        discount: line.discount,
        total: lineTotal,
        costPriceSmallestUnit: primaryBatch?.costPriceSmallestUnit || 0
      });
    });

    setBatches(updatedBatches);

    const netTotal = Math.max(0, totalBeforeDiscount - saleData.discountAmount);
    const profit = Math.max(0, netTotal - totalCost);

    const newSaleInvoice: SaleInvoice = {
      id: saleId,
      invoiceNumber,
      branchId: currentBranchId,
      branchName: currentBranch.name,
      date: todayStr,
      time: timeStr,
      cashierId: currentUser.id,
      cashierName: currentUser.name,
      customerName: saleData.customerName || 'زبون نقدي',
      customerPhone: saleData.customerPhone || '',
      paymentMethod: saleData.paymentMethod,
      cashPaid: saleData.cashPaid,
      cardPaid: saleData.cardPaid,
      creditPaid: saleData.creditPaid,
      totalBeforeDiscount,
      discountAmount: saleData.discountAmount,
      netTotal,
      totalCost,
      profit,
      items: resolvedSaleItems,
      status: 'completed'
    };

    setSalesInvoices(prev => [newSaleInvoice, ...prev]);
    logAudit('إتمام عملية بيع (POS)', invoiceNumber, `الصافي: ${netTotal} د.ع - الأرباح: ${profit} د.ع`);
    return newSaleInvoice;
  };

  const cancelSaleInvoice = (invoiceId: string, reason: string) => {
    setSalesInvoices(prev =>
      prev.map(inv => (inv.id === invoiceId ? { ...inv, status: 'cancelled' } : inv))
    );
    logAudit('إلغاء فاتورة مبيعات', `فاتورة: ${invoiceId}`, `السبب: ${reason}`);
  };

  // Customer Return
  const addCustomerReturn = (ret: Omit<CustomerReturn, 'id' | 'returnNumber'>) => {
    const returnNumber = `CRET-${Date.now()}`;
    const newReturn: CustomerReturn = {
      ...ret,
      id: `cret-${Date.now()}`,
      returnNumber
    };
    setCustomerReturns(prev => [newReturn, ...prev]);

    // Restock items if condition is good
    ret.items.forEach(it => {
      if (it.action === 'restock' && it.condition === 'good') {
        const med = medicines.find(m => m.id === it.itemId);
        if (med) {
          // Add to first available batch
          setBatches(prev => {
            const batch = prev.find(b => b.itemId === it.itemId && b.branchId === ret.branchId);
            if (batch) {
              return prev.map(b => (b.id === batch.id ? { ...b, totalUnitsRemaining: b.totalUnitsRemaining + it.quantity } : b));
            }
            return prev;
          });
        }
      }
    });

    logAudit('تسجيل مرتجع زبون', returnNumber, `قيمة الإرجاع: ${ret.totalRefund} د.ع`);
  };

  // Supplier Return
  const addSupplierReturn = (ret: Omit<SupplierReturn, 'id' | 'returnNumber' | 'debitNoteNumber'>) => {
    const returnNumber = `SRET-${Date.now()}`;
    const debitNoteNumber = `DN-${Date.now().toString().slice(-6)}`;
    const newReturn: SupplierReturn = {
      ...ret,
      id: `sret-${Date.now()}`,
      returnNumber,
      debitNoteNumber
    };
    setSupplierReturns(prev => [newReturn, ...prev]);

    // Deduct debt from supplier balance
    setSuppliers(prev =>
      prev.map(s => {
        if (s.id === ret.supplierId) {
          return {
            ...s,
            totalReturns: s.totalReturns + ret.totalCreditAmount,
            balanceDebt: Math.max(0, s.balanceDebt - ret.totalCreditAmount)
          };
        }
        return s;
      })
    );

    // Deduct quantities from batches
    ret.items.forEach(it => {
      setBatches(prev =>
        prev.map(b => {
          if (b.itemId === it.itemId && b.batchNumber === it.batchNumber) {
            return {
              ...b,
              totalUnitsRemaining: Math.max(0, b.totalUnitsRemaining - it.quantitySmallestUnit)
            };
          }
          return b;
        })
      );
    });

    logAudit('تسجيل مرتجع مورد (إشعار خصم)', debitNoteNumber, `المبلغ: ${ret.totalCreditAmount} د.ع`);
  };

  // Damaged / Expired Writeoff
  const addDamagedWriteoff = (dmg: Omit<DamagedWriteoff, 'id'>) => {
    const id = `dmg-${Date.now()}`;
    const newWriteoff: DamagedWriteoff = {
      ...dmg,
      id
    };
    setDamagedWriteoffs(prev => [newWriteoff, ...prev]);

    // Deduct from batch
    setBatches(prev =>
      prev.map(b => {
        if (b.itemId === dmg.itemId && b.batchNumber === dmg.batchNumber && b.branchId === dmg.branchId) {
          return {
            ...b,
            totalUnitsRemaining: Math.max(0, b.totalUnitsRemaining - dmg.quantity)
          };
        }
        return b;
      })
    );

    logAudit('إتلاف وشطب مواد', dmg.itemName, `الكمية: ${dmg.quantity} - الخسارة: ${dmg.totalLoss} د.ع - السبب: ${dmg.reason}`);
  };

  // Treasury Transaction
  const addTreasuryTransaction = (tx: Omit<TreasuryTransaction, 'id' | 'date'>) => {
    const newTx: TreasuryTransaction = {
      ...tx,
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setTreasuryTransactions(prev => [newTx, ...prev]);
    logAudit(
      tx.type === 'inflow' ? 'إيداع نقدي في الصندوق' : 'سند صرف مصروفات',
      tx.category,
      `${tx.description} - المبلغ: ${tx.amount} د.ع`
    );
  };

  // Inter-branch stock transfer
  const transferStockBetweenBranches = (
    fromBranchId: string,
    toBranchId: string,
    itemId: string,
    batchId: string,
    qty: number,
    notes?: string
  ) => {
    const sourceBatch = batches.find(b => b.id === batchId);
    if (!sourceBatch || sourceBatch.totalUnitsRemaining < qty) return;

    setBatches(prev => {
      // Deduct from source batch
      const updated = prev.map(b => {
        if (b.id === batchId) {
          return { ...b, totalUnitsRemaining: b.totalUnitsRemaining - qty };
        }
        return b;
      });

      // Add to destination batch or create one
      const destBatch = updated.find(b => b.itemId === itemId && b.branchId === toBranchId && b.batchNumber === sourceBatch.batchNumber);
      if (destBatch) {
        return updated.map(b => (b.id === destBatch.id ? { ...b, totalUnitsRemaining: b.totalUnitsRemaining + qty } : b));
      } else {
        const newBatch: MedicineBatch = {
          ...sourceBatch,
          id: `batch-${Date.now()}`,
          branchId: toBranchId,
          totalUnitsRemaining: qty
        };
        return [...updated, newBatch];
      }
    });

    const med = medicines.find(m => m.id === itemId);
    const fromB = branches.find(b => b.id === fromBranchId)?.name;
    const toB = branches.find(b => b.id === toBranchId)?.name;
    logAudit('تحويل مخزني بين الفروع', med?.commercialName || itemId, `من ${fromB} إلى ${toB} - الكمية: ${qty} وحدة`);
  };

  // Notification Counters
  const now = new Date();
  const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysLater = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

  const expiringBatchesCount = useMemo(() => {
    return batches.filter(b => {
      if (b.totalUnitsRemaining <= 0 || b.isRecalled) return false;
      const exp = new Date(b.expiryDate);
      return exp <= sixtyDaysLater;
    }).length;
  }, [batches]);

  const outOfStockCount = useMemo(() => {
    return medicines.filter(m => getTotalItemStock(m.id) === 0).length;
  }, [medicines, batches]);

  const lowStockCount = useMemo(() => {
    return medicines.filter(m => {
      const stock = getTotalItemStock(m.id);
      return stock > 0 && stock <= m.minStockLimit;
    }).length;
  }, [medicines, batches]);

  const pendingSupplierDuesCount = useMemo(() => {
    return suppliers.filter(s => s.balanceDebt > 0 && s.nextPaymentDate && new Date(s.nextPaymentDate) <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)).length;
  }, [suppliers]);

  const recalledBatchesCount = useMemo(() => {
    return batches.filter(b => b.isRecalled).length;
  }, [batches]);

  return (
    <PharmacyContext.Provider
      value={{
        isAuthenticated,
        login,
        loginWithPin,
        loginAsDemoUser,
        logout,
        isScreenLocked,
        setIsScreenLocked,
        unlockScreen,
        currentUser,
        activeRole,
        switchRole,
        supportLoginAsOwner,
        currentPharmacy,
        currentBranch,
        pharmacies,
        branches,
        setCurrentPharmacyId,
        setCurrentBranchId,
        addPharmacy,
        updatePharmacyStatus,
        addBranch,
        activeView,
        setActiveView,
        baseCurrency,
        setBaseCurrency,
        exchangeRate,
        formatMoney,
        subscriptionPlans,
        updateSubscriptionPlan,
        users,
        addUser,
        updateUserPermissions,
        toggleUserActive,
        suppliers,
        addSupplier,
        recordSupplierPayment,
        supplierPayments,
        medicines,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        batches,
        stockCards,
        getBatchesForItem,
        getTotalItemStock,
        getItemStockBreakdown,
        emergencyRecallBatch,
        recallBatch: emergencyRecallBatch,
        performStockAudit,
        purchaseInvoices,
        addPurchaseInvoice,
        salesInvoices,
        processSale,
        cancelSaleInvoice,
        customerReturns,
        supplierReturns,
        damagedWriteoffs,
        addCustomerReturn,
        addSupplierReturn,
        addDamagedWriteoff,
        transferStockBetweenBranches,
        treasuryTransactions,
        addTreasuryTransaction,
        auditLogs,
        logAudit,
        expiringBatchesCount,
        outOfStockCount,
        lowStockCount,
        pendingSupplierDuesCount,
        recalledBatchesCount,
        isPosModalOpen,
        setIsPosModalOpen,
        selectedReceiptForPrint,
        setSelectedReceiptForPrint
      }}
    >
      {children}
    </PharmacyContext.Provider>
  );
};

export const usePharmacy = () => {
  const context = useContext(PharmacyContext);
  if (!context) {
    throw new Error('usePharmacy must be used within a PharmacyProvider');
  }
  return context;
};
