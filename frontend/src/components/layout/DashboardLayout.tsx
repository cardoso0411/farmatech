import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import AssessmentIcon from '@mui/icons-material/Assessment';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import {
  AppBar,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { useAuth } from '../../auth/AuthContext';

const drawerWidth = 240;

const items = [
  { label: 'Início', path: '/', icon: <HomeRoundedIcon /> },
  { label: 'PDV', path: '/pdv', icon: <PointOfSaleIcon /> },
  { label: 'Clientes', path: '/clientes', icon: <PeopleAltIcon /> },
  { label: 'Produtos', path: '/produtos', icon: <VaccinesIcon /> },
  { label: 'Caixa', path: '/caixa', icon: <PaymentsRoundedIcon /> },
  { label: 'Estoque', path: '/estoque', icon: <Inventory2Icon /> },
  { label: 'Relatórios', path: '/relatorios', icon: <AssessmentIcon /> },
  { label: 'Usuarios', path: '/cadastros/vendedores', icon: <PeopleAltIcon /> },
];

export function DashboardLayout({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [currentDateTime, setCurrentDateTime] = useState(() => new Date());
  const visibleItems = user?.role === 'ADMIN'
    ? items
    : items
        .filter((item) => !['Estoque', 'Relatórios'].includes(item.label))
        .filter((item) => item.label !== 'Usuarios')
        .map((item) => item.label === 'Produtos' ? { ...item, path: '/produtos/consultar' } : item);

  useEffect(() => {
    const interval = window.setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <LocalPharmacyIcon />
            <Typography variant="h6">Farmácia Brasil</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="string" sx={{ fontWeight: 'bold' }}>
              Usuário: {user?.username}
            </Typography>
            <Typography variant="body2">
            {currentDateTime.toLocaleDateString()} {currentDateTime.toLocaleTimeString()}
            </Typography>
            <Button color="inherit" onClick={logout}>Sair</Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 1 }}>
          <List>
            {visibleItems.map((item) => (
              <ListItemButton
                key={item.path}
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
