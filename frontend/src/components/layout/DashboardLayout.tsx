import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
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
  { label: 'PDV', path: '/', icon: <PointOfSaleIcon /> },
  { label: 'Clientes', path: '/clientes', icon: <PeopleAltIcon /> },
  { label: 'Produtos', path: '/produtos', icon: <VaccinesIcon /> },
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
          <Typography variant="body2">Operação de balcão simplificada</Typography>
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
