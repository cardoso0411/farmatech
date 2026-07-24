import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { AxiosError } from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { PageHeader } from '../components/common/PageHeader';

type ProductRow = {
  id: string;
  barcode: string | null;
  summary: string;
  description: string;
  brand: string | null;
  unit: string;
  salePrice: string | number;
  costPrice: string | number | null;
  stockQuantity: number;
  minimumStock: number;
  category: { code: string; name: string } | null;
  group: { code: string; groupName: string } | null;
  isGeneric: boolean;
  isControlled: boolean;
  isSpecial: boolean;
  isFractioned: boolean;
  isSimilar: boolean;
  isActive: boolean;
};

function formatMoney(value: string | number | null) {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  return Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function buildFlags(product: ProductRow) {
  const flags = [];

  if (product.isGeneric) flags.push('Generico');
  if (product.isControlled) flags.push('Controlado');
  if (product.isSpecial) flags.push('Especial');
  if (product.isFractioned) flags.push('Fracionado');
  if (product.isSimilar) flags.push('Similar');

  return flags;
}

export function ProductListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [actionError, setActionError] = useState('');
  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await api.get<{ products: ProductRow[] }>('/products');
      return response.data.products;
    },
  });
  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => api.delete(`/products/${productId}`),
    onSuccess: () => {
      setActionError('');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        setActionError(error.response?.data?.message || 'Não foi possível excluir o produto.');
        return;
      }

      setActionError('Não foi possível excluir o produto.');
    },
  });

  function handleDeleteProduct(product: ProductRow) {
    if (!window.confirm(`Deseja realmente excluir ${product.summary}?`)) {
      return;
    }

    deleteProductMutation.mutate(product.id);
  }

  return (
    <Box>
      <PageHeader
        title="Consultar produtos"
        description="Lista com os produtos cadastrados, incluindo categoria, grupo, estoque, valores e status."
      />

      <Card>
        <CardContent>
          {actionError && <Alert severity="error" sx={{ mb: 2 }}>{actionError}</Alert>}

          {productsQuery.isLoading && (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <CircularProgress size={22} />
              <Typography>Carregando produtos...</Typography>
            </Stack>
          )}

          {productsQuery.isError && (
            <Alert severity="error">
              Nao foi possivel carregar os produtos. Verifique se o backend esta rodando.
            </Alert>
          )}

          {!productsQuery.isLoading && !productsQuery.isError && (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Codigo de barras</TableCell>
                    <TableCell>Nome do medicamento</TableCell>
                    <TableCell>Descricao</TableCell>
                    <TableCell>Categoria</TableCell>
                    <TableCell>Grupo</TableCell>
                    <TableCell>Marca</TableCell>
                    <TableCell>Unidade</TableCell>
                    <TableCell>Preco venda</TableCell>
                    <TableCell>Custo</TableCell>
                    <TableCell>Estoque</TableCell>
                    <TableCell>Minimo</TableCell>
                    <TableCell>Flags</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Acoes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(productsQuery.data ?? []).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={14} align="center">
                        Nenhum produto cadastrado ainda.
                      </TableCell>
                    </TableRow>
                  ) : (
                    (productsQuery.data ?? []).map((product) => {
                      const flags = buildFlags(product);

                      return (
                        <TableRow key={product.id} hover>
                          <TableCell>{product.barcode || '-'}</TableCell>
                          <TableCell>{product.summary}</TableCell>
                          <TableCell>{product.description}</TableCell>
                          <TableCell>
                            {product.category
                              ? `${product.category.code} - ${product.category.name}`
                              : '-'}
                          </TableCell>
                          <TableCell>
                            {product.group
                              ? `${product.group.code} - ${product.group.groupName}`
                              : '-'}
                          </TableCell>
                          <TableCell>{product.brand || '-'}</TableCell>
                          <TableCell>{product.unit}</TableCell>
                          <TableCell>{formatMoney(product.salePrice)}</TableCell>
                          <TableCell>{formatMoney(product.costPrice)}</TableCell>
                          <TableCell>{product.stockQuantity}</TableCell>
                          <TableCell>{product.minimumStock}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap">
                              {flags.length === 0 ? (
                                <Typography variant="body2">-</Typography>
                              ) : (
                                flags.map((flag) => <Chip key={flag} size="small" label={flag} />)
                              )}
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              color={product.isActive ? 'success' : 'default'}
                              label={product.isActive ? 'Ativo' : 'Inativo'}
                            />
                          </TableCell>
                          <TableCell>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => navigate(`/produtos?editar=${product.id}`)}
                              >
                                Editar
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                onClick={() => handleDeleteProduct(product)}
                                disabled={deleteProductMutation.isPending}
                              >
                                Excluir
                              </Button>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
