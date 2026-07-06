import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { PageHeader } from '../components/common/PageHeader';

export function InventoryPage() {
  return (
    <Box>
      <PageHeader
        title="Estoque"
        description="Página separada para consulta de estoque e movimentações futuras."
      />

      <Card>
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="h6">Estrutura planejada</Typography>
            <Typography color="text.secondary">
              Aqui vamos concentrar entradas, saídas, ajustes e alertas de estoque baixo.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
