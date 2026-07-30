import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
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
import { LoginPage } from './pages/LoginPage';

export function App() {
  const { user } = useAuth();
  if (!user) return <LoginPage />;
  const adminOnly = (element: JSX.Element) => user.role === 'ADMIN' ? element : <Navigate to="/" replace />;
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pdv" element={<PdvPage />} />
        <Route path="/clientes" element={<CustomersPage />} />
        <Route path="/clientes/consultar" element={<CustomersListPage />} />
        <Route path="/cadastros/tipos-clientes" element={adminOnly(<CustomerTypesPage />)} />
        <Route path="/cadastros/vendedores" element={adminOnly(<SellersPage />)} />
        <Route path="/produtos" element={adminOnly(<ProductsPage />)} />
        <Route path="/produtos/consultar" element={<ProductListPage />} />
        <Route path="/produtos/categorias" element={adminOnly(<ProductCategoriesPage />)} />
        <Route path="/produtos/grupos" element={adminOnly(<ProductGroupsPage />)} />
        <Route path="/produtos/formas-de-pagamento" element={adminOnly(<PaymentMethodsPage />)} />
        <Route path="/caixa" element={<CashRegisterPage />} />
        <Route path="/estoque" element={adminOnly(<InventoryPage />)} />
        <Route path="/relatorios" element={adminOnly(<ReportsPage />)} />
      </Routes>
    </DashboardLayout>
  );
}
