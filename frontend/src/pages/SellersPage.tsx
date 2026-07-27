import { Alert, Box, Button, Card, CardContent, Grid2 as Grid, MenuItem, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { useCustomerSupport } from '../hooks/useCustomerSupport';
import { api } from '../lib/api';
import { maskCep, maskCpf, maskMobilePhone, maskPhone, maskRg } from '../utils/masks';

export function SellersPage() {
  const queryClient = useQueryClient();
  const { sellersQuery } = useCustomerSupport();
  const [formData, setFormData] = useState({
    name: '', username: '', password: '', role: 'ATTENDANT', cpf: '', rg: '', zipCode: '', address: '', district: '', city: '', state: '', mobilePhone: '', phone: '', email: '', observation: '',
  });
  const [saveErrorMessage, setSaveErrorMessage] = useState('');

  const createMutation = useMutation({
    mutationFn: async () => api.post('/sellers', formData),
    onSuccess: async () => {
      setFormData({ name: '', username: '', password: '', role: 'ATTENDANT', cpf: '', rg: '', zipCode: '', address: '', district: '', city: '', state: '', mobilePhone: '', phone: '', email: '', observation: '' });
      setSaveErrorMessage('');
      await queryClient.invalidateQueries({ queryKey: ['sellers'] });
    },
    onError: (error) => {
      const apiError = error as AxiosError<{ message?: string; issues?: { fieldErrors?: Record<string, string[]> } }>;
      const fieldErrors = apiError.response?.data?.issues?.fieldErrors;
      const firstFieldError = fieldErrors ? Object.values(fieldErrors).flat()[0] : undefined;
      setSaveErrorMessage(firstFieldError ?? apiError.response?.data?.message ?? 'Não foi possível salvar o usuário.');
    },
  });

  function updateField<K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  return (
    <Box>
      <PageHeader
        title="Cadastro de usuários"
        description="Cadastre administradores e funcionários que poderão acessar o sistema quando o login for habilitado."
      />

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}><TextField required fullWidth label="Nome" value={formData.name} onChange={(event) => updateField('name', event.target.value)} /></Grid>
            <Grid size={{ xs: 12, md: 3 }}><TextField required fullWidth label="Usuário" value={formData.username} onChange={(event) => updateField('username', event.target.value)} /></Grid>
            <Grid size={{ xs: 12, md: 3 }}><TextField required fullWidth type="password" label="Senha" value={formData.password} onChange={(event) => updateField('password', event.target.value)} helperText="Mínimo de 6 caracteres" /></Grid>
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
          <Button sx={{ mt: 2 }} variant="contained" onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>Salvar usuário</Button>
          {createMutation.isError && <Alert severity="error" sx={{ mt: 2 }}>{saveErrorMessage}</Alert>}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Table><TableHead><TableRow><TableCell>Nome</TableCell><TableCell>Usuário</TableCell><TableCell>Tipo</TableCell><TableCell>CPF</TableCell><TableCell>Celular</TableCell></TableRow></TableHead><TableBody>{(sellersQuery.data ?? []).map((item) => (<TableRow key={item.id}><TableCell>{item.name}</TableCell><TableCell>{item.username || '—'}</TableCell><TableCell>{item.role === 'ADMIN' ? 'Administrador' : 'Funcionário'}</TableCell><TableCell>{item.cpf || '—'}</TableCell><TableCell>{item.mobilePhone || '—'}</TableCell></TableRow>))}</TableBody></Table>
        </CardContent>
      </Card>
    </Box>
  );
}
