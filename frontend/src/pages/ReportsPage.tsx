import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { PageHeader } from '../components/common/PageHeader';

export function ReportsPage() {
  return (
    <Box>
      <PageHeader
        title="Relatórios"
        description="Página separada para relatórios e visão gerencial do sistema."
      />

      <Card>
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="h6">Estrutura planejada</Typography>
            <Typography color="text.secondary">
              Esse módulo pode crescer depois sem poluir a operação principal do balcão.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
