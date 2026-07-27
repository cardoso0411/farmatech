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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { api } from '../lib/api';

type PaymentMethodConfig = {
  id: string;
  abbreviation: string;
  description: string;
};

export function PaymentMethodsPage() {
  const queryClient = useQueryClient();
  const [abbreviation, setAbbreviation] = useState('');
  const [description, setDescription] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState('');
  const [createErrorMessage, setCreateErrorMessage] = useState('');

  const paymentMethodsQuery = useQuery({
    queryKey: ['payment-method-configs'],
    queryFn: async () => {
      const response = await api.get<{ paymentMethods: PaymentMethodConfig[] }>('/payment-method-configs');
      return response.data.paymentMethods;
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => api.post('/payment-method-configs', { abbreviation, description }),
    onSuccess: async () => {
      setAbbreviation('');
      setDescription('');
      setCreateErrorMessage('');
      await queryClient.invalidateQueries({ queryKey: ['payment-method-configs'] });
    },
    onError: (error) => {
      const apiMessage = (error as AxiosError<{ message?: string }>).response?.data?.message;
      setCreateErrorMessage(apiMessage ?? 'Não foi possível cadastrar a forma de pagamento.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/payment-method-configs/${id}`),
    onSuccess: async () => {
      setIsDeleteDialogOpen(false);
      setSelectedPaymentMethodId('');
      await queryClient.invalidateQueries({ queryKey: ['payment-method-configs'] });
    },
  });

  const paymentMethods = paymentMethodsQuery.data ?? [];

  return (
    <Box>
      <PageHeader
        title="Cadastro de Formas de Pagamento"
        description="Cadastre abreviações e descrições das formas de pagamento usadas no sistema."
      />

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
            <TextField
              label="Abreviação"
              placeholder="Ex.: DI"
              value={abbreviation}
              onChange={(event) => setAbbreviation(event.target.value.toUpperCase())}
              inputProps={{ maxLength: 10 }}
            />
            <TextField
              label="Descrição"
              placeholder="Ex.: Dinheiro"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              fullWidth
            />
            <Button
              variant="contained"
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending || !abbreviation.trim() || !description.trim()}
            >
              Cadastrar
            </Button>
            <Button color="error" variant="outlined" onClick={() => setIsDeleteDialogOpen(true)} disabled={!paymentMethods.length}>
              Excluir
            </Button>
          </Stack>
          {createMutation.isError && <Alert severity="error" sx={{ mt: 2 }}>{createErrorMessage}</Alert>}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Abreviação</TableCell>
                <TableCell>Descrição</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paymentMethods.map((paymentMethod) => (
                <TableRow key={paymentMethod.id}>
                  <TableCell>{paymentMethod.abbreviation}</TableCell>
                  <TableCell>{paymentMethod.description}</TableCell>
                </TableRow>
              ))}
              {!paymentMethodsQuery.isLoading && paymentMethods.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} align="center">Nenhuma forma de pagamento cadastrada.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Excluir forma de pagamento</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Forma de pagamento"
            value={selectedPaymentMethodId}
            onChange={(event) => setSelectedPaymentMethodId(event.target.value)}
            fullWidth
            sx={{ mt: 1 }}
          >
            {paymentMethods.map((paymentMethod) => (
              <MenuItem key={paymentMethod.id} value={paymentMethod.id}>
                {paymentMethod.abbreviation} — {paymentMethod.description}
              </MenuItem>
            ))}
          </TextField>
          {deleteMutation.isError && <Alert severity="error" sx={{ mt: 2 }}>Não foi possível excluir a forma de pagamento.</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => deleteMutation.mutate(selectedPaymentMethodId)}
            disabled={!selectedPaymentMethodId || deleteMutation.isPending}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
