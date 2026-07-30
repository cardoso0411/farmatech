import {
  Alert, Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle,
  Grid2 as Grid, MenuItem, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { useCustomerSupport } from '../hooks/useCustomerSupport';
import { api } from '../lib/api';
import { SellerOption } from '../types/customer-support';
import { maskCep, maskCpf, maskMobilePhone, maskPhone, maskRg } from '../utils/masks';

const emptyForm = {
  name: '', username: '', password: '', role: 'ATTENDANT' as 'ADMIN' | 'ATTENDANT', cpf: '', rg: '', zipCode: '',
  address: '', district: '', city: '', state: '', mobilePhone: '', phone: '', email: '', observation: '',
};

export function SellersPage() {
  const queryClient = useQueryClient();
  const { sellersQuery } = useCustomerSupport();
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saveErrorMessage, setSaveErrorMessage] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteSearch, setDeleteSearch] = useState('');
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingId) {
        const { password, ...data } = formData;
        return api.put(`/sellers/${editingId}`, password ? formData : data);
      }
      return api.post('/sellers', formData);
    },
    onSuccess: async () => {
      setFormData(emptyForm);
      setEditingId(null);
      setSaveErrorMessage('');
      await queryClient.invalidateQueries({ queryKey: ['sellers'] });
    },
    onError: (error) => setSaveErrorMessage(getApiErrorMessage(error, 'Não foi possível salvar o usuário.')),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/sellers/${id}`),
    onSuccess: async () => {
      setIsDeleteDialogOpen(false);
      setDeleteSearch('');
      setDeleteErrorMessage('');
      await queryClient.invalidateQueries({ queryKey: ['sellers'] });
    },
    onError: (error) => setDeleteErrorMessage(getApiErrorMessage(error, 'Não foi possível excluir o usuário.')),
  });

  function updateField<K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  function startEditing(seller: SellerOption) {
    setEditingId(seller.id);
    setSaveErrorMessage('');
    setFormData({
      name: seller.name, username: seller.username ?? '', password: '', role: seller.role === 'ADMIN' ? 'ADMIN' : 'ATTENDANT',
      cpf: seller.cpf ?? '', rg: seller.rg ?? '', zipCode: seller.zipCode ?? '', address: seller.address ?? '',
      district: seller.district ?? '', city: seller.city ?? '', state: seller.state ?? '', mobilePhone: seller.mobilePhone ?? '',
      phone: seller.phone ?? '', email: seller.email ?? '', observation: seller.observation ?? '',
    });
  }

  const normalizedSearch = deleteSearch.replace(/\D/g, '').toLowerCase();
  const sellerToDelete = (sellersQuery.data ?? []).find((seller) => {
    const normalizedCpf = (seller.cpf ?? '').replace(/\D/g, '');
    return seller.name.toLowerCase() === deleteSearch.trim().toLowerCase() || (normalizedSearch.length > 0 && normalizedCpf === normalizedSearch);
  });

  return (
    <Box>
      <PageHeader title="Cadastro de usuários" description="Cadastre administradores e funcionários que poderão acessar o sistema quando o login for habilitado." />
      <Card sx={{ mb: 3 }}><CardContent>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}><TextField required fullWidth label="Nome" value={formData.name} onChange={(event) => updateField('name', event.target.value)} /></Grid>
          <Grid size={{ xs: 12, md: 3 }}><TextField required fullWidth label="Usuário" value={formData.username} onChange={(event) => updateField('username', event.target.value)} /></Grid>
          <Grid size={{ xs: 12, md: 3 }}><TextField required={!editingId} fullWidth type="password" label={editingId ? 'Nova senha (opcional)' : 'Senha'} value={formData.password} onChange={(event) => updateField('password', event.target.value)} helperText={editingId ? 'Preencha apenas para trocar a senha.' : 'Mínimo de 6 caracteres'} /></Grid>
          <Grid size={{ xs: 12, md: 3 }}><TextField required select fullWidth label="Tipo de acesso" value={formData.role} onChange={(event) => updateField('role', event.target.value as 'ADMIN' | 'ATTENDANT')}><MenuItem value="ADMIN">Administrador</MenuItem><MenuItem value="ATTENDANT">Funcionário</MenuItem></TextField></Grid>
          <Grid size={{ xs: 12, md: 3 }}><TextField required fullWidth label="CPF" value={formData.cpf} onChange={(event) => updateField('cpf', maskCpf(event.target.value))} /></Grid>
          <Grid size={{ xs: 12, md: 3 }}><TextField required fullWidth label="RG" value={formData.rg} onChange={(event) => updateField('rg', maskRg(event.target.value))} /></Grid>
          <Grid size={{ xs: 12, md: 3 }}><TextField required fullWidth label="CEP" value={formData.zipCode} onChange={(event) => updateField('zipCode', maskCep(event.target.value))} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><TextField required fullWidth label="Endereço" value={formData.address} onChange={(event) => updateField('address', event.target.value)} /></Grid>
          <Grid size={{ xs: 12, md: 3 }}><TextField required fullWidth label="Bairro" value={formData.district} onChange={(event) => updateField('district', event.target.value)} /></Grid>
          <Grid size={{ xs: 12, md: 2 }}><TextField required fullWidth label="Cidade" value={formData.city} onChange={(event) => updateField('city', event.target.value)} /></Grid>
          <Grid size={{ xs: 12, md: 1 }}><TextField required fullWidth label="UF" value={formData.state} inputProps={{ maxLength: 2 }} onChange={(event) => updateField('state', event.target.value.toUpperCase())} /></Grid>
          <Grid size={{ xs: 12, md: 3 }}><TextField required fullWidth label="Celular" value={formData.mobilePhone} onChange={(event) => updateField('mobilePhone', maskMobilePhone(event.target.value))} /></Grid>
          <Grid size={{ xs: 12, md: 3 }}><TextField fullWidth label="Telefone" value={formData.phone} onChange={(event) => updateField('phone', maskPhone(event.target.value))} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth type="email" label="E-mail" value={formData.email} onChange={(event) => updateField('email', event.target.value)} /></Grid>
          <Grid size={{ xs: 12 }}><TextField fullWidth multiline minRows={3} label="Observação" value={formData.observation} onChange={(event) => updateField('observation', event.target.value)} /></Grid>
        </Grid>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
          <Button variant="contained" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>{editingId ? 'Salvar alterações' : 'Salvar usuário'}</Button>
          {editingId && <Button variant="outlined" onClick={() => { setEditingId(null); setFormData(emptyForm); setSaveErrorMessage(''); }}>Cancelar edição</Button>}
          <Button color="error" variant="outlined" onClick={() => setIsDeleteDialogOpen(true)}>Excluir usuário</Button>
        </Stack>
        {saveMutation.isError && <Alert severity="error" sx={{ mt: 2 }}>{saveErrorMessage}</Alert>}
      </CardContent></Card>

      <Card><CardContent><Table><TableHead><TableRow><TableCell>Nome</TableCell><TableCell>Usuário</TableCell><TableCell>Tipo</TableCell><TableCell>CPF</TableCell><TableCell>Celular</TableCell><TableCell>Ação</TableCell></TableRow></TableHead><TableBody>
        {(sellersQuery.data ?? []).map((seller) => <TableRow key={seller.id}><TableCell>{seller.name}</TableCell><TableCell>{seller.username || '—'}</TableCell><TableCell>{seller.role === 'ADMIN' ? 'Administrador' : 'Funcionário'}</TableCell><TableCell>{seller.cpf || '—'}</TableCell><TableCell>{seller.mobilePhone || '—'}</TableCell><TableCell><Button size="small" onClick={() => startEditing(seller)}>Editar</Button></TableCell></TableRow>)}
      </TableBody></Table></CardContent></Card>

      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} fullWidth maxWidth="xs"><DialogTitle>Excluir usuário</DialogTitle><DialogContent>
        <TextField autoFocus fullWidth label="Nome ou CPF" value={deleteSearch} onChange={(event) => { setDeleteSearch(event.target.value); setDeleteErrorMessage(''); }} sx={{ mt: 1 }} />
        {deleteSearch && <Alert severity={sellerToDelete ? 'warning' : 'info'} sx={{ mt: 2 }}>{sellerToDelete ? `Usuário encontrado: ${sellerToDelete.name}.` : 'Nenhum usuário encontrado com este nome ou CPF.'}</Alert>}
        {deleteErrorMessage && <Alert severity="error" sx={{ mt: 2 }}>{deleteErrorMessage}</Alert>}
      </DialogContent><DialogActions><Button onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button><Button color="error" variant="contained" disabled={!sellerToDelete || deleteMutation.isPending} onClick={() => sellerToDelete && deleteMutation.mutate(sellerToDelete.id)}>Excluir</Button></DialogActions></Dialog>
    </Box>
  );
}

function getApiErrorMessage(error: unknown, fallback: string) {
  const apiError = error as AxiosError<{ message?: string; issues?: { fieldErrors?: Record<string, string[]> } }>;
  const fieldErrors = apiError.response?.data?.issues?.fieldErrors;
  return (fieldErrors ? Object.values(fieldErrors).flat()[0] : undefined) ?? apiError.response?.data?.message ?? fallback;
}
