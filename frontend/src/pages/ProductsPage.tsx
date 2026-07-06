import { Box, Button, Card, CardContent, Grid2 as Grid, Stack, TextField } from '@mui/material';
import { PageHeader } from '../components/common/PageHeader';

export function ProductsPage() {
  return (
    <Box>
      <PageHeader
        title="Produtos"
        description="Cadastro base de produtos para começarmos estoque e venda já com uma estrutura boa."
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <TextField label="Nome do produto" fullWidth />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField label="Código interno" fullWidth />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField label="Código de barras" fullWidth />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField label="Categoria" fullWidth />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField label="Unidade" fullWidth />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField label="Preço de venda" fullWidth />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField label="Custo" fullWidth />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField label="Estoque inicial" fullWidth />
                  </Grid>
                </Grid>
                <Button variant="contained">Salvar produto</Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
