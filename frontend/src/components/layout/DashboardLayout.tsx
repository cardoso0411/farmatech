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
import { PropsWithChildren } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const items = [
  { label: 'Início', path: '/', icon: <HomeRoundedIcon /> },
  { label: 'PDV', path: '/pdv', icon: <PointOfSaleIcon /> },
  { label: 'Clientes', path: '/clientes', icon: <PeopleAltIcon /> },
  { label: 'Produtos', path: '/produtos', icon: <VaccinesIcon /> },
  { label: 'Caixa', path: '/caixa', icon: <PaymentsRoundedIcon /> },
  { label: 'Estoque', path: '/estoque', icon: <Inventory2Icon /> },
  { label: 'Relatórios', path: '/relatorios', icon: <AssessmentIcon /> },
];

export function DashboardLayout({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <LocalPharmacyIcon />
            <Typography variant="h6">Farmatech</Typography>
          </Box>
          <Typography variant="body2">Sistema web da farmácia</Typography>
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
            {items.map((item) => (
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
