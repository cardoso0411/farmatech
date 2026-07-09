import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { useCustomerSupport } from '../hooks/useCustomerSupport';
import { api } from '../lib/api';

export function SellersPage() {
  const queryClient = useQueryClient();
  const { sellersQuery } = useCustomerSupport();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');

  const createMutation = useMutation({
    mutationFn: async () => api.post('/sellers', { code: code || undefined, name }),
    onSuccess: async () => {
      setCode('');
      setName('');
      await queryClient.invalidateQueries({ queryKey: ['sellers'] });
    },
  });

  return (
    <Box>
      <PageHeader
        title="Cadastro de vendedores"
        description="Página separada para vendedores que podem ser vinculados ao cliente."
      />

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField label="Código" placeholder="0001" value={code} onChange={(event) => setCode(event.target.value)} />
            <TextField fullWidth label="Nome do vendedor" value={name} onChange={(event) => setName(event.target.value)} />
            <Button variant="contained" onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
              Salvar vendedor
            </Button>
          </Stack>
          {createMutation.isError && <Alert severity="error" sx={{ mt: 2 }}>Erro ao salvar vendedor.</Alert>}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="h6">Vendedores cadastrados</Typography>
            {(sellersQuery.data ?? []).map((item) => (
              <Typography key={item.id} color="text.secondary">
                {item.code ? `${item.code} — ` : ''}{item.name}
              </Typography>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
