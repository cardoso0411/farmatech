import { Route, Routes } from 'react-router-dom';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { CustomersPage } from './pages/CustomersPage';
import { PdvPage } from './pages/PdvPage';
import { ProductsPage } from './pages/ProductsPage';

export function App() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<PdvPage />} />
        <Route path="/clientes" element={<CustomersPage />} />
        <Route path="/produtos" element={<ProductsPage />} />
      </Routes>
    </DashboardLayout>
  );
}
