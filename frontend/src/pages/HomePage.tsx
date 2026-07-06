import AssessmentIcon from '@mui/icons-material/Assessment';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import { Box, Grid2 as Grid, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ModuleCard } from '../components/common/ModuleCard';
import { PageHeader } from '../components/common/PageHeader';

const modules = [
  {
    title: 'Ponto de venda',
    description: 'Tela principal para registrar vendas com rapidez e poucos cliques.',
    path: '/pdv',
    actionLabel: 'Abrir PDV',
    icon: <PointOfSaleIcon color="primary" fontSize="large" />,
  },
  {
    title: 'Cadastro de clientes',
    description: 'Área separada para cadastrar, consultar e editar clientes da farmácia.',
    path: '/clientes',
    actionLabel: 'Abrir clientes',
    icon: <PeopleAltIcon color="primary" fontSize="large" />,
  },
  {
    title: 'Cadastro de produtos',
    description: 'Página própria para produtos, preços, códigos e informações de estoque.',
    path: '/produtos',
    actionLabel: 'Abrir produtos',
    icon: <VaccinesIcon color="primary" fontSize="large" />,
  },
  {
    title: 'Caixa',
    description: 'Módulo para abertura, acompanhamento e fechamento do caixa da farmácia.',
    path: '/caixa',
    actionLabel: 'Abrir caixa',
    icon: <PaymentsRoundedIcon color="primary" fontSize="large" />,
  },
  {
    title: 'Estoque',
    description: 'Consulta e movimentação de estoque com foco em controle e reposição.',
    path: '/estoque',
    actionLabel: 'Abrir estoque',
    icon: <Inventory2Icon color="primary" fontSize="large" />,
  },
  {
    title: 'Relatórios',
    description: 'Acesso futuro a relatórios de vendas, caixa, estoque e desempenho.',
    path: '/relatorios',
    actionLabel: 'Abrir relatórios',
    icon: <AssessmentIcon color="primary" fontSize="large" />,
  },
];

export function HomePage() {
  const navigate = useNavigate();

  return (
    <Box>
      <PageHeader
        title="Página inicial"
        description="Essa é a entrada principal do sistema, com um menu simples para levar o usuário para cada módulo."
      />

      <Stack spacing={1} sx={{ mb: 3 }}>
        <Typography variant="h6">Formato do menu</Typography>
        <Typography color="text.secondary">
          O menu fica fixo na lateral esquerda e os botões principais também aparecem no centro da
          página inicial como atalhos grandes.
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {modules.map((module) => (
          <Grid key={module.path} size={{ xs: 12, md: 6, xl: 4 }}>
            <ModuleCard
              title={module.title}
              description={module.description}
              icon={module.icon}
              actionLabel={module.actionLabel}
              onClick={() => navigate(module.path)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
