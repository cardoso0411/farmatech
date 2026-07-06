import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { PageHeader } from '../components/common/PageHeader';

export function CashRegisterPage() {
  return (
    <Box>
      <PageHeader
        title="Caixa"
        description="Página separada para rotina de caixa. Aqui entram abertura, fechamento e conferência."
      />

      <Card>
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="h6">Estrutura planejada</Typography>
            <Typography color="text.secondary">
              Esse módulo vai ficar em um arquivo próprio e será acessado pelo menu lateral e pelos
              botões da página inicial.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
