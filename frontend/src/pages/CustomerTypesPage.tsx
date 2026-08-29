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
  TextField,
  Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { useCustomerSupport } from '../hooks/useCustomerSupport';
import { api } from '../lib/api';

export function CustomerTypesPage() {
  const queryClient = useQueryClient();
  const { customerTypesQuery } = useCustomerSupport();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCustomerTypeId, setSelectedCustomerTypeId] = useState('');

  const createMutation = useMutation({
    mutationFn: async () => api.post('/customer-types', { name, description: description || undefined }),
    onSuccess: async () => {
      setName('');
      setDescription('');
      await queryClient.invalidateQueries({ queryKey: ['customer-types'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/customer-types/${id}`),
    onSuccess: async () => {
      setIsDeleteDialogOpen(false);
      setSelectedCustomerTypeId('');
      await queryClient.invalidateQueries({ queryKey: ['customer-types'] });
    },
  });

  const customerTypes = customerTypesQuery.data ?? [];

  return (
    <Box>
      <PageHeader
        title="Cadastro de tipos de clientes"
        description="Página separada para manter os tipos que depois aparecem no select do cadastro de clientes."
      />

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Descrição do tipo"
              placeholder="Ex.: Cliente Particular"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <TextField
              fullWidth
              label="Observação"
              placeholder="Opcional"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
            <Button variant="contained" onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
              Salvar tipo
            </Button>
            <Button color="error" variant="outlined" onClick={() => setIsDeleteDialogOpen(true)} disabled={!customerTypes.length}>
              Excluir
            </Button>
          </Stack>
          {createMutation.isError && <Alert severity="error" sx={{ mt: 2 }}>Erro ao salvar tipo de cliente.</Alert>}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="h6">Tipos cadastrados</Typography>
            {customerTypes.map((item) => (
              <Typography key={item.id} color="text.secondary">
                {item.name}
              </Typography>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Excluir tipo de cliente</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Tipo de cliente"
            value={selectedCustomerTypeId}
            onChange={(event) => setSelectedCustomerTypeId(event.target.value)}
            fullWidth
            sx={{ mt: 1 }}
          >
            {customerTypes.map((customerType) => (
              <MenuItem key={customerType.id} value={customerType.id}>
                {customerType.name}
              </MenuItem>
            ))}
          </TextField>
          {deleteMutation.isError && <Alert severity="error" sx={{ mt: 2 }}>Não foi possível excluir o tipo de cliente.</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => deleteMutation.mutate(selectedCustomerTypeId)}
            disabled={!selectedCustomerTypeId || deleteMutation.isPending}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
