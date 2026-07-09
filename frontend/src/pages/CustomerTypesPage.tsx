import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
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

  const createMutation = useMutation({
    mutationFn: async () => api.post('/customer-types', { name, description: description || undefined }),
    onSuccess: async () => {
      setName('');
      setDescription('');
      await queryClient.invalidateQueries({ queryKey: ['customer-types'] });
    },
  });

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
          </Stack>
          {createMutation.isError && <Alert severity="error" sx={{ mt: 2 }}>Erro ao salvar tipo de cliente.</Alert>}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="h6">Tipos cadastrados</Typography>
            {(customerTypesQuery.data ?? []).map((item) => (
              <Typography key={item.id} color="text.secondary">
                {item.name}
              </Typography>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
