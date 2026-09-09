import React from 'react';
import { PharmacyProvider, usePharmacy } from './context/PharmacyContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';

// View Components
import { SuperAdminDashboard } from './components/superadmin/SuperAdminDashboard';
import { OwnerDashboard } from './components/owner/OwnerDashboard';
import { PointOfSale } from './components/pos/PointOfSale';
import { ItemCatalog } from './components/catalog/ItemCatalog';
import { PurchaseInvoices } from './components/purchases/PurchaseInvoices';
import { InventoryManagement } from './components/inventory/InventoryManagement';
import { SupplierManagement } from './components/suppliers/SupplierManagement';
import { ReturnsAndDamaged } from './components/returns/ReturnsAndDamaged';
import { BranchManagement } from './components/branches/BranchManagement';
import { TreasuryView } from './components/treasury/TreasuryView';
import { ReportsView } from './components/reports/ReportsView';
import { StaffManagement } from './components/staff/StaffManagement';
import { AuditLogView } from './components/audit/AuditLogView';
import { ReceiptModal } from './components/common/ReceiptModal';
import { LoginView } from './components/auth/LoginView';
import { LockScreenModal } from './components/auth/LockScreenModal';

const MainViewRenderer: React.FC = () => {
  const { activeView, activeRole } = usePharmacy();

  // If role is super_admin
  if (activeRole === 'super_admin') {
    if (activeView === 'audit' || activeView === 'audit_logs') {
      return <AuditLogView />;
    }
    return <SuperAdminDashboard />;
  }

  switch (activeView) {
    case 'dashboard':
    case 'owner_dashboard':
      return <OwnerDashboard />;
    case 'pos':
      return <PointOfSale />;
    case 'catalog':
      return <ItemCatalog />;
    case 'purchases':
      return <PurchaseInvoices />;
    case 'inventory':
      return <InventoryManagement />;
    case 'suppliers':
    case 'payments':
      return <SupplierManagement />;
    case 'returns':
      return <ReturnsAndDamaged />;
    case 'branches':
      return <BranchManagement />;
    case 'treasury':
      return <TreasuryView />;
    case 'reports':
      return <ReportsView />;
    case 'staff':
      return <StaffManagement />;
    case 'audit':
    case 'audit_logs':
      return <AuditLogView />;
    default:
      return <OwnerDashboard />;
  }
};

const PharmacyAppInner: React.FC = () => {
  const {
    isAuthenticated,
    isScreenLocked,
    selectedReceiptForPrint,
    setSelectedReceiptForPrint
  } = usePharmacy();

  // If not logged in, display full-screen professional Login View
  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans" dir="rtl">
      {/* Top Universal Navbar */}
      <Navbar />

      {/* Main Body with Sidebar and Content View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50 relative pb-16 lg:pb-8">
          <MainViewRenderer />
        </main>
      </div>

      {/* Quick Shift / Lock Screen Terminal Overlay */}
      {isScreenLocked && <LockScreenModal />}

      {/* Global Receipt Print / WhatsApp Share Modal */}
      {selectedReceiptForPrint && (
        <ReceiptModal
          invoice={selectedReceiptForPrint}
          onClose={() => setSelectedReceiptForPrint(null)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <PharmacyProvider>
      <PharmacyAppInner />
    </PharmacyProvider>
  );
}
