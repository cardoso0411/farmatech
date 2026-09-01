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

export function ProductGroupsPage() {
  const queryClient = useQueryClient();
  const { groupsQuery } = useProductSupport();
  const [formData, setFormData] = useState({
    local: '',
    groupName: '',
    sngpc: '',
    saleOperation: '',
    code: '',
    caution: '',
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState('');

  const createMutation = useMutation({
    mutationFn: async () => api.post('/product-groups', formData),
    onSuccess: async () => {
      setFormData({
        local: '',
        groupName: '',
        sngpc: '',
        saleOperation: '',
        code: '',
        caution: '',
      });
      await queryClient.invalidateQueries({ queryKey: ['product-groups'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/product-groups/${id}`),
    onSuccess: async () => {
      setIsDeleteDialogOpen(false);
      setSelectedGroupId('');
      await queryClient.invalidateQueries({ queryKey: ['product-groups'] });
    },
  });

  const groups = groupsQuery.data ?? [];

  function updateField<K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  return (
    <Box>
      <PageHeader
        title="Cadastro de Grupos"
        description="Grupos reais com local, SNGPC, operação de venda, código e cuidado."
      />

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} flexWrap="wrap" useFlexGap>
            <TextField label="Local" value={formData.local} onChange={(event) => updateField('local', event.target.value)} />
            <TextField label="Grupo" value={formData.groupName} onChange={(event) => updateField('groupName', event.target.value)} />
            <TextField label="SNGPC" value={formData.sngpc} onChange={(event) => updateField('sngpc', event.target.value)} />
            <TextField label="Operação de Venda" value={formData.saleOperation} onChange={(event) => updateField('saleOperation', event.target.value)} />
            <TextField label="Código" value={formData.code} onChange={(event) => updateField('code', event.target.value)} />
            <TextField label="Cuidado" value={formData.caution} onChange={(event) => updateField('caution', event.target.value)} />
            <Button variant="contained" onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
              Salvar grupo
            </Button>
            <Button color="error" variant="outlined" onClick={() => setIsDeleteDialogOpen(true)} disabled={!groups.length}>
              Excluir
            </Button>
          </Stack>
          {createMutation.isError && <Alert severity="error" sx={{ mt: 2 }}>Erro ao salvar grupo.</Alert>}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Local</TableCell>
                <TableCell>Grupo</TableCell>
                <TableCell>SNGPC</TableCell>
                <TableCell>Operação de Venda</TableCell>
                <TableCell>Código</TableCell>
                <TableCell>Cuidado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell>{group.local}</TableCell>
                  <TableCell>{group.groupName}</TableCell>
                  <TableCell>{group.sngpc}</TableCell>
                  <TableCell>{group.saleOperation}</TableCell>
                  <TableCell>{group.code}</TableCell>
                  <TableCell>{group.caution}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Excluir grupo</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Grupo"
            value={selectedGroupId}
            onChange={(event) => setSelectedGroupId(event.target.value)}
            fullWidth
            sx={{ mt: 1 }}
          >
            {groups.map((group) => (
              <MenuItem key={group.id} value={group.id}>
                {group.code} - {group.groupName}
              </MenuItem>
            ))}
          </TextField>
          {deleteMutation.isError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Não foi possível excluir o grupo. Ele pode estar vinculado a produtos.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => deleteMutation.mutate(selectedGroupId)}
            disabled={!selectedGroupId || deleteMutation.isPending}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
