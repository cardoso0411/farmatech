import { Box, Button, Card, CardContent, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import { PageHeader } from '../components/common/PageHeader';
import { productCategoryOptions } from '../data/productSupportData';

export function ProductCategoriesPage() {
  return (
    <Box>
      <PageHeader
        title="Cadastro de Categorias"
        description="Tabela de categorias para usar no select do cadastro de produtos."
      />

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField label="Código" placeholder="001" />
            <TextField fullWidth label="Categoria" placeholder="Ex.: Analgésicos" />
            <Button variant="contained">Salvar categoria</Button>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Categoria</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productCategoryOptions.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.code}</TableCell>
                  <TableCell>{category.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
}
