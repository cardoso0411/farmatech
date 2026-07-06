import { Box, Button, Card, CardContent, Grid2 as Grid, Stack, TextField } from '@mui/material';
import { PageHeader } from '../components/common/PageHeader';

export function CustomersPage() {
  return (
    <Box>
      <PageHeader
        title="Clientes"
        description="Cadastro inicial de clientes com os dados que fazem sentido no atendimento."
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <TextField label="Nome completo" fullWidth />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField label="CPF/CNPJ" fullWidth />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField label="Telefone" fullWidth />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField label="E-mail" fullWidth />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField label="Convênio" fullWidth />
                  </Grid>
                </Grid>
                <TextField label="Observações" multiline minRows={3} fullWidth />
                <Button variant="contained">Salvar cliente</Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
