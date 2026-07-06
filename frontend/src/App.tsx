import { Route, Routes } from 'react-router-dom';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { CashRegisterPage } from './pages/CashRegisterPage';
import { CustomersPage } from './pages/CustomersPage';
import { HomePage } from './pages/HomePage';
import { InventoryPage } from './pages/InventoryPage';
import { PdvPage } from './pages/PdvPage';
import { ProductsPage } from './pages/ProductsPage';
import { ReportsPage } from './pages/ReportsPage';

export function App() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pdv" element={<PdvPage />} />
        <Route path="/clientes" element={<CustomersPage />} />
        <Route path="/produtos" element={<ProductsPage />} />
        <Route path="/caixa" element={<CashRegisterPage />} />
        <Route path="/estoque" element={<InventoryPage />} />
        <Route path="/relatorios" element={<ReportsPage />} />
      </Routes>
    </DashboardLayout>
  );
}
