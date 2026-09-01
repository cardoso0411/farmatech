import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  const createMutation = useMutation({
    mutationFn: async () => api.post('/product-categories', { code, name }),
    onSuccess: async () => {
      setCode('');
      setName('');
      await queryClient.invalidateQueries({ queryKey: ['product-categories'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/product-categories/${id}`),
    onSuccess: async () => {
      setIsDeleteDialogOpen(false);
      setSelectedCategoryId('');
      await queryClient.invalidateQueries({ queryKey: ['product-categories'] });
    },
  });

  const categories = categoriesQuery.data ?? [];

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
            <Button color="error" variant="outlined" onClick={() => setIsDeleteDialogOpen(true)} disabled={!categories.length}>
              Excluir
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
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.code}</TableCell>
                  <TableCell>{category.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Excluir categoria</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Categoria"
            value={selectedCategoryId}
            onChange={(event) => setSelectedCategoryId(event.target.value)}
            fullWidth
            sx={{ mt: 1 }}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.code} - {category.name}
              </MenuItem>
            ))}
          </TextField>
          {deleteMutation.isError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Não foi possível excluir a categoria. Ela pode estar vinculada a produtos.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => deleteMutation.mutate(selectedCategoryId)}
            disabled={!selectedCategoryId || deleteMutation.isPending}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
