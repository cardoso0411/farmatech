import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormLabel,
  Grid2 as Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { PageHeader } from '../components/common/PageHeader';
import { useCustomerSupport } from '../hooks/useCustomerSupport';

type PersonType = 'INDIVIDUAL' | 'COMPANY';
type ClassificationType = 'GOOD' | 'MEDIUM' | 'BAD';

export function CustomersPage() {
  const navigate = useNavigate();
  const { customerTypesQuery, sellersQuery } = useCustomerSupport();
  const [personType, setPersonType] = useState<PersonType>('INDIVIDUAL');
  const [classification, setClassification] = useState<ClassificationType>('GOOD');
  const [isSupplier, setIsSupplier] = useState(false);
  const [selectedCustomerTypeId, setSelectedCustomerTypeId] = useState('');
  const [selectedSellerId, setSelectedSellerId] = useState('');
  const [saveErrorMessage, setSaveErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    cpf: '',
    rg: '',
    cnpj: '',
    address: '',
    district: '',
    zipCode: '',
    city: '',
    state: '',
    phone: '',
    mobilePhone: '',
    email: '',
    birthDate: '',
    spcDate: '',
    insurance: '',
    notes: '',
    isBlocked: false,
    hasSubscription: false,
    insuranceOnly: false,
    status: 'ACTIVE',
  });

  const createCustomerMutation = useMutation({
    mutationFn: async () =>
      api.post('/customers', {
        personType,
        customerTypeId: selectedCustomerTypeId || undefined,
        fullName: formData.fullName,
        cpf: personType === 'INDIVIDUAL' ? formData.cpf || undefined : undefined,
        rg: personType === 'INDIVIDUAL' ? formData.rg || undefined : undefined,
        cnpj: personType === 'COMPANY' ? formData.cnpj || undefined : undefined,
        address: formData.address || undefined,
        district: formData.district || undefined,
        zipCode: formData.zipCode || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        phone: formData.phone || undefined,
        mobilePhone: formData.mobilePhone || undefined,
        email: formData.email || undefined,
        birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : undefined,
        spcDate: formData.spcDate ? new Date(formData.spcDate).toISOString() : undefined,
        isBlocked: formData.isBlocked,
        hasSubscription: formData.hasSubscription,
        classification,
        sellerId: selectedSellerId || undefined,
        status: formData.status,
        isSupplier,
        insuranceOnly: formData.insuranceOnly,
        insurance: formData.insurance || undefined,
        notes: formData.notes || undefined,
      }),
    onSuccess: () => {
      setSaveErrorMessage('');
      setFormData({
        fullName: '',
        cpf: '',
        rg: '',
        cnpj: '',
        address: '',
        district: '',
        zipCode: '',
        city: '',
        state: '',
        phone: '',
        mobilePhone: '',
        email: '',
        birthDate: '',
        spcDate: '',
        insurance: '',
        notes: '',
        isBlocked: false,
        hasSubscription: false,
        insuranceOnly: false,
        status: 'ACTIVE',
      });
      setPersonType('INDIVIDUAL');
      setClassification('GOOD');
      setIsSupplier(false);
      setSelectedCustomerTypeId('');
      setSelectedSellerId('');
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        setSaveErrorMessage(
          error.response?.data?.message ||
            'Não foi possível salvar o cliente. Verifique se o backend está rodando.'
        );
        return;
      }

      setSaveErrorMessage('Não foi possível salvar o cliente.');
    },
  });

  function updateField<K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  return (
    <Box>
      <PageHeader
        title="Cadastro de clientes"
        description="Formulário principal do cliente com tipo de pessoa, classificação, vínculo com vendedor e selects ligados aos cadastros auxiliares."
      />

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <Button variant="outlined" onClick={() => navigate('/cadastros/tipos-clientes')}>
          Cadastro de Tipos de Clientes
        </Button>
        <Button variant="outlined" onClick={() => navigate('/cadastros/vendedores')}>
          Cadastro de Vendedores
        </Button>
        <Button variant="outlined" onClick={() => navigate('/clientes/consultar')}>
          Consultar
        </Button>
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, xl: 8 }}>
          <Card>
            <CardContent>
              <Stack spacing={3}>
                {createCustomerMutation.isSuccess && (
                  <Alert severity="success">Cliente salvo com sucesso no banco de dados.</Alert>
                )}
                {createCustomerMutation.isError && (
                  <Alert severity="error">{saveErrorMessage}</Alert>
                )}
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField label="Código" fullWidth placeholder="Automático" disabled />
                  </Grid>
                  <Grid size={{ xs: 12, md: 9 }}>
                    <TextField
                      select
                      fullWidth
                      label="Tipo de cliente"
                      value={selectedCustomerTypeId}
                      onChange={(event) => setSelectedCustomerTypeId(event.target.value)}
                    >
                      {(customerTypesQuery.data ?? []).map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>

                <Box>
                  <FormLabel>Tipo de pessoa</FormLabel>
                  <RadioGroup
                    row
                    value={personType}
                    onChange={(event) => setPersonType(event.target.value as PersonType)}
                  >
                    <FormControlLabel value="INDIVIDUAL" control={<Radio />} label="Pessoa Física" />
                    <FormControlLabel value="COMPANY" control={<Radio />} label="Pessoa Jurídica" />
                  </RadioGroup>
                </Box>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 12 }}>
                    <TextField label="Nome completo / Razão social" fullWidth value={formData.fullName} onChange={(event) => updateField('fullName', event.target.value)} />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  {personType === 'INDIVIDUAL' ? (
                    <>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField label="CPF" fullWidth value={formData.cpf} onChange={(event) => updateField('cpf', event.target.value)} />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField label="RG" fullWidth value={formData.rg} onChange={(event) => updateField('rg', event.target.value)} />
                      </Grid>
                    </>
                  ) : (
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField label="CNPJ" fullWidth value={formData.cnpj} onChange={(event) => updateField('cnpj', event.target.value)} />
                    </Grid>
                  )}
                </Grid>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <TextField label="Endereço" fullWidth value={formData.address} onChange={(event) => updateField('address', event.target.value)} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField label="Bairro" fullWidth value={formData.district} onChange={(event) => updateField('district', event.target.value)} />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField label="CEP" fullWidth value={formData.zipCode} onChange={(event) => updateField('zipCode', event.target.value)} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 5 }}>
                    <TextField label="Cidade" fullWidth value={formData.city} onChange={(event) => updateField('city', event.target.value)} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField label="Estado" fullWidth value={formData.state} onChange={(event) => updateField('state', event.target.value)} />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField label="Telefone" fullWidth value={formData.phone} onChange={(event) => updateField('phone', event.target.value)} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <TextField label="Celular" fullWidth value={formData.mobilePhone} onChange={(event) => updateField('mobilePhone', event.target.value)} />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField label="E-mail" fullWidth value={formData.email} onChange={(event) => updateField('email', event.target.value)} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField label="Data nascimento" type="date" fullWidth value={formData.birthDate} onChange={(event) => updateField('birthDate', event.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField label="Data cadastro" type="date" fullWidth disabled value={new Date().toISOString().slice(0,10)} slotProps={{ inputLabel: { shrink: true } }} />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField label="Data SPC" type="date" fullWidth value={formData.spcDate} onChange={(event) => updateField('spcDate', event.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField select fullWidth label="Vendedor" value={selectedSellerId} onChange={(event) => setSelectedSellerId(event.target.value)}>
                      {(sellersQuery.data ?? []).map((seller) => (
                        <MenuItem key={seller.id} value={seller.id}>
                          {seller.code ? `${seller.code} — ` : ''}{seller.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>

                <Box>
                  <FormLabel>Classificação para fiado</FormLabel>
                  <RadioGroup
                    row
                    value={classification}
                    onChange={(event) => setClassification(event.target.value as ClassificationType)}
                  >
                    <FormControlLabel value="GOOD" control={<Radio />} label="Bom" />
                    <FormControlLabel value="MEDIUM" control={<Radio />} label="Médio" />
                    <FormControlLabel value="BAD" control={<Radio />} label="Ruim" />
                  </RadioGroup>
                  <Typography color="text.secondary" variant="body2">
                    Cliente com classificação ruim não deve comprar fiado até reclassificação manual.
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField label="Convênios" fullWidth value={formData.insurance} onChange={(event) => updateField('insurance', event.target.value)} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField select label="Status" fullWidth value={formData.status} onChange={(event) => updateField('status', event.target.value)}>
                      <MenuItem value="ACTIVE">Ativo</MenuItem>
                      <MenuItem value="INACTIVE">Inativo</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} flexWrap="wrap" useFlexGap>
                  <FormControlLabel control={<Checkbox checked={formData.isBlocked} onChange={(event) => updateField('isBlocked', event.target.checked)} />} label="Bloqueado" />
                  <FormControlLabel control={<Checkbox checked={formData.hasSubscription} onChange={(event) => updateField('hasSubscription', event.target.checked)} />} label="Assinatura" />
                  <FormControlLabel
                    control={<Checkbox checked={isSupplier} onChange={(event) => setIsSupplier(event.target.checked)} />}
                    label="Cliente também é fornecedor"
                  />
                  <FormControlLabel control={<Checkbox checked={formData.insuranceOnly} onChange={(event) => updateField('insuranceOnly', event.target.checked)} />} label="Somente convênio" />
                </Stack>

                <TextField label="Observação" multiline minRows={4} fullWidth value={formData.notes} onChange={(event) => updateField('notes', event.target.value)} />

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <Button variant="contained" onClick={() => createCustomerMutation.mutate()} disabled={createCustomerMutation.isPending}>
                    Gravar
                  </Button>
                  <Button variant="outlined">Excluir</Button>
                  <Button variant="outlined" onClick={() => window.location.reload()}>Limpar</Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, xl: 4 }}>
          <Stack spacing={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Regras de classificação
                </Typography>
                <Stack spacing={1.5}>
                  <Typography color="text.secondary">
                    `Bom`: pode vender fiado normalmente.
                  </Typography>
                  <Typography color="text.secondary">
                    `Médio`: pode vender fiado com atenção ao vencimento.
                  </Typography>
                  <Typography color="text.secondary">
                    `Ruim`: não deve vender fiado até revisão manual.
                  </Typography>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Comportamento do formulário
                </Typography>
                <Stack spacing={1.5}>
                  <Typography color="text.secondary">
                    Pessoa física mostra `CPF` e `RG`.
                  </Typography>
                  <Typography color="text.secondary">
                    Pessoa jurídica mostra `CNPJ`.
                  </Typography>
                  <Typography color="text.secondary">
                    O checkbox de fornecedor deixa explícito quando o cliente também fornece produtos.
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
