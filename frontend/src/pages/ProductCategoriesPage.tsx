import { Alert, Box, Button, Card, CardContent, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { useProductSupport } from '../hooks/useProductSupport';
import { api } from '../lib/api';

export function ProductCategoriesPage() {
  const queryClient = useQueryClient();
  const { categoriesQuery } = useProductSupport();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');

  const createMutation = useMutation({
    mutationFn: async () => api.post('/product-categories', { code, name }),
    onSuccess: async () => {
      setCode('');
      setName('');
      await queryClient.invalidateQueries({ queryKey: ['product-categories'] });
    },
  });

  return (
    <Box>
      <PageHeader
        title="Cadastro de Categorias"
        description="Categorias reais salvas no banco para o select do cadastro de produtos."
      />

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField label="Código" placeholder="001" value={code} onChange={(event) => setCode(event.target.value)} />
            <TextField fullWidth label="Categoria" placeholder="Ex.: Analgésicos" value={name} onChange={(event) => setName(event.target.value)} />
            <Button variant="contained" onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
              Salvar categoria
            </Button>
          </Stack>
          {createMutation.isError && <Alert severity="error" sx={{ mt: 2 }}>Erro ao salvar categoria.</Alert>}
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
              {(categoriesQuery.data ?? []).map((category) => (
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
