import { Route, Routes } from 'react-router-dom';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { CashRegisterPage } from './pages/CashRegisterPage';
import { CustomerTypesPage } from './pages/CustomerTypesPage';
import { CustomersListPage } from './pages/CustomersListPage';
import { CustomersPage } from './pages/CustomersPage';
import { HomePage } from './pages/HomePage';
import { InventoryPage } from './pages/InventoryPage';
import { PdvPage } from './pages/PdvPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductCategoriesPage } from './pages/ProductCategoriesPage';
import { ProductGroupsPage } from './pages/ProductGroupsPage';
import { ProductListPage } from './pages/ProductListPage';
import { PaymentMethodsPage } from './pages/PaymentMethodsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SellersPage } from './pages/SellersPage';

export function App() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pdv" element={<PdvPage />} />
        <Route path="/clientes" element={<CustomersPage />} />
        <Route path="/clientes/consultar" element={<CustomersListPage />} />
        <Route path="/cadastros/tipos-clientes" element={<CustomerTypesPage />} />
        <Route path="/cadastros/vendedores" element={<SellersPage />} />
        <Route path="/produtos" element={<ProductsPage />} />
        <Route path="/produtos/consultar" element={<ProductListPage />} />
        <Route path="/produtos/categorias" element={<ProductCategoriesPage />} />
        <Route path="/produtos/grupos" element={<ProductGroupsPage />} />
        <Route path="/produtos/formas-de-pagamento" element={<PaymentMethodsPage />} />
        <Route path="/caixa" element={<CashRegisterPage />} />
        <Route path="/estoque" element={<InventoryPage />} />
        <Route path="/relatorios" element={<ReportsPage />} />
      </Routes>
    </DashboardLayout>
  );
}
