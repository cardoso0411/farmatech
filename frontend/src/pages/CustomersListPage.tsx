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

type CustomerRow = {
  id: string;
  code: number;
  fullName: string | null;
  legalName: string | null;
  tradeName: string | null;
  cpf: string | null;
  cnpj: string | null;
  city: string | null;
  state: string | null;
  phone: string | null;
  mobilePhone: string | null;
  classification: 'GOOD' | 'MEDIUM' | 'BAD';
  status: 'ACTIVE' | 'INACTIVE';
  customerType: { name: string } | null;
};

const classificationLabel: Record<CustomerRow['classification'], string> = {
  GOOD: 'Bom',
  MEDIUM: 'Médio',
  BAD: 'Ruim',
};

const statusLabel: Record<CustomerRow['status'], string> = {
  ACTIVE: 'Ativo',
  INACTIVE: 'Inativo',
};

export function CustomersListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [actionError, setActionError] = useState('');
  const customersQuery = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const response = await api.get<{ customers: CustomerRow[] }>('/customers');
      return response.data.customers;
    },
  });
  const deleteCustomerMutation = useMutation({
    mutationFn: async (customerId: string) => api.delete(`/customers/${customerId}`),
    onSuccess: () => {
      setActionError('');
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        setActionError(error.response?.data?.message || 'Não foi possível excluir o cliente.');
        return;
      }

      setActionError('Não foi possível excluir o cliente.');
    },
  });

  function handleDeleteCustomer(customer: CustomerRow) {
    const customerName = customer.legalName || customer.fullName || customer.tradeName || 'este cliente';

    if (!window.confirm(`Deseja realmente excluir ${customerName}?`)) {
      return;
    }

    deleteCustomerMutation.mutate(customer.id);
  }

  return (
    <Box>
      <PageHeader
        title="Consultar clientes"
        description="Lista com os clientes cadastrados no sistema."
      />

      <Card>
        <CardContent>
          {actionError && <Alert severity="error" sx={{ mb: 2 }}>{actionError}</Alert>}

          {customersQuery.isLoading && (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <CircularProgress size={22} />
              <Typography>Carregando clientes...</Typography>
            </Stack>
          )}

          {customersQuery.isError && (
            <Alert severity="error">
              Não foi possível carregar os clientes. Verifique se o backend está rodando.
            </Alert>
          )}

          {!customersQuery.isLoading && !customersQuery.isError && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Código</TableCell>
                    <TableCell>Nome completo</TableCell>
                    <TableCell>Documento</TableCell>
                    <TableCell>Tipo cliente</TableCell>
                    <TableCell>Cidade</TableCell>
                    <TableCell>Telefone</TableCell>
                    <TableCell>Classificação</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(customersQuery.data ?? []).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        Nenhum cliente cadastrado ainda.
                      </TableCell>
                    </TableRow>
                  ) : (
                    (customersQuery.data ?? []).map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>{customer.code}</TableCell>
                        <TableCell>{customer.legalName || customer.fullName || customer.tradeName || '-'}</TableCell>
                        <TableCell>{customer.cpf || customer.cnpj || '-'}</TableCell>
                        <TableCell>{customer.customerType?.name ?? '-'}</TableCell>
                        <TableCell>
                          {[customer.city, customer.state].filter(Boolean).join(' / ') || '-'}
                        </TableCell>
                        <TableCell>{customer.mobilePhone || customer.phone || '-'}</TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={classificationLabel[customer.classification]}
                            color={
                              customer.classification === 'GOOD'
                                ? 'success'
                                : customer.classification === 'MEDIUM'
                                  ? 'warning'
                                  : 'error'
                            }
                          />
                        </TableCell>
                        <TableCell>{statusLabel[customer.status]}</TableCell>
                        <TableCell>
                          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => navigate(`/clientes?editar=${customer.id}`)}
                            >
                              Editar
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => handleDeleteCustomer(customer)}
                              disabled={deleteCustomerMutation.isPending}
                            >
                              Excluir
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
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
