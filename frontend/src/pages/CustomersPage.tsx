import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import { PageHeader } from '../components/common/PageHeader';
import { useCustomerSupport } from '../hooks/useCustomerSupport';
import {
  maskCep,
  maskCnpj,
  maskCpf,
  maskMobilePhone,
  maskPhone,
  maskRg,
  maskStateRegistration,
} from '../utils/masks';

type PersonType = 'INDIVIDUAL' | 'COMPANY';
type ClassificationType = 'GOOD' | 'MEDIUM' | 'BAD';

type CustomerDetail = {
  id: string;
  personType: PersonType;
  customerTypeId: string | null;
  sellerId: string | null;
  fullName: string | null;
  tradeName: string | null;
  legalName: string | null;
  cpf: string | null;
  rg: string | null;
  cnpj: string | null;
  stateRegistration: string | null;
  address: string | null;
  district: string | null;
  zipCode: string | null;
  city: string | null;
  state: string | null;
  phone: string | null;
  mobilePhone: string | null;
  email: string | null;
  birthDate: string | null;
  spcDate: string | null;
  insurance: string | null;
  notes: string | null;
  isBlocked: boolean;
  hasSubscription: boolean;
  insuranceOnly: boolean;
  isSupplier: boolean;
  classification: ClassificationType;
  status: 'ACTIVE' | 'INACTIVE';
};

export function CustomersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('editar');
  const isEditing = Boolean(editId);
  const { customerTypesQuery, sellersQuery } = useCustomerSupport();
  const [personType, setPersonType] = useState<PersonType>('INDIVIDUAL');
  const [classification, setClassification] = useState<ClassificationType>('GOOD');
  const [isSupplier, setIsSupplier] = useState(false);
  const [selectedCustomerTypeId, setSelectedCustomerTypeId] = useState('');
  const [selectedSellerId, setSelectedSellerId] = useState('');
  const [saveErrorMessage, setSaveErrorMessage] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    tradeName: '',
    legalName: '',
    cpf: '',
    rg: '',
    cnpj: '',
    stateRegistration: '',
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

  const customerQuery = useQuery({
    queryKey: ['customer', editId],
    enabled: isEditing,
    queryFn: async () => {
      const response = await api.get<{ customer: CustomerDetail }>(`/customers/${editId}`);
      return response.data.customer;
    },
  });

  useEffect(() => {
    if (!customerQuery.data) {
      return;
    }

    const customer = customerQuery.data;

    setPersonType(customer.personType);
    setClassification(customer.classification);
    setIsSupplier(customer.isSupplier);
    setSelectedCustomerTypeId(customer.customerTypeId ?? '');
    setSelectedSellerId(customer.sellerId ?? '');
    setFormData({
      fullName: customer.fullName ?? '',
      tradeName: customer.tradeName ?? '',
      legalName: customer.legalName ?? '',
      cpf: customer.cpf ?? '',
      rg: customer.rg ?? '',
      cnpj: customer.cnpj ?? '',
      stateRegistration: customer.stateRegistration ?? '',
      address: customer.address ?? '',
      district: customer.district ?? '',
      zipCode: customer.zipCode ?? '',
      city: customer.city ?? '',
      state: customer.state ?? '',
      phone: customer.phone ?? '',
      mobilePhone: customer.mobilePhone ?? '',
      email: customer.email ?? '',
      birthDate: customer.birthDate ? customer.birthDate.slice(0, 10) : '',
      spcDate: customer.spcDate ? customer.spcDate.slice(0, 10) : '',
      insurance: customer.insurance ?? '',
      notes: customer.notes ?? '',
      isBlocked: customer.isBlocked,
      hasSubscription: customer.hasSubscription,
      insuranceOnly: customer.insuranceOnly,
      status: customer.status,
    });
  }, [customerQuery.data]);

  const createCustomerMutation = useMutation({
    mutationFn: async () =>
      isEditing
        ? api.put(`/customers/${editId}`, {
            personType,
            customerTypeId: selectedCustomerTypeId || undefined,
            fullName: personType === 'INDIVIDUAL' ? formData.fullName.trim() : undefined,
            tradeName: personType === 'COMPANY' ? formData.tradeName.trim() || undefined : undefined,
            legalName: personType === 'COMPANY' ? formData.legalName.trim() || undefined : undefined,
            cpf: personType === 'INDIVIDUAL' ? formData.cpf.replace(/\D/g, '') || undefined : undefined,
            rg: personType === 'INDIVIDUAL' ? formData.rg.replace(/\D/g, '') || undefined : undefined,
            cnpj: personType === 'COMPANY' ? formData.cnpj.replace(/\D/g, '') || undefined : undefined,
            stateRegistration: personType === 'COMPANY' ? formData.stateRegistration.trim() || undefined : undefined,
            address: formData.address.trim() || undefined,
            district: formData.district.trim() || undefined,
            zipCode: formData.zipCode.replace(/\D/g, '') || undefined,
            city: formData.city.trim() || undefined,
            state: formData.state.trim() || undefined,
            phone: formData.phone.replace(/\D/g, '') || undefined,
            mobilePhone: formData.mobilePhone.replace(/\D/g, '') || undefined,
            email: formData.email.trim() || undefined,
            birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : undefined,
            spcDate: formData.spcDate ? new Date(formData.spcDate).toISOString() : undefined,
            isBlocked: formData.isBlocked,
            hasSubscription: formData.hasSubscription,
            classification,
            sellerId: selectedSellerId || undefined,
            status: formData.status,
            isSupplier,
            insuranceOnly: formData.insuranceOnly,
            insurance: formData.insurance.trim() || undefined,
            notes: formData.notes.trim() || undefined,
          })
        : api.post('/customers', {
        personType,
        customerTypeId: selectedCustomerTypeId || undefined,
        fullName: personType === 'INDIVIDUAL' ? formData.fullName.trim() : undefined,
        tradeName: personType === 'COMPANY' ? formData.tradeName.trim() || undefined : undefined,
        legalName: personType === 'COMPANY' ? formData.legalName.trim() || undefined : undefined,
        cpf: personType === 'INDIVIDUAL' ? formData.cpf.replace(/\D/g, '') || undefined : undefined,
        rg: personType === 'INDIVIDUAL' ? formData.rg.replace(/\D/g, '') || undefined : undefined,
        cnpj: personType === 'COMPANY' ? formData.cnpj.replace(/\D/g, '') || undefined : undefined,
        stateRegistration: personType === 'COMPANY' ? formData.stateRegistration.trim() || undefined : undefined,
        address: formData.address.trim() || undefined,
        district: formData.district.trim() || undefined,
        zipCode: formData.zipCode.replace(/\D/g, '') || undefined,
        city: formData.city.trim() || undefined,
        state: formData.state.trim() || undefined,
        phone: formData.phone.replace(/\D/g, '') || undefined,
        mobilePhone: formData.mobilePhone.replace(/\D/g, '') || undefined,
        email: formData.email.trim() || undefined,
        birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : undefined,
        spcDate: formData.spcDate ? new Date(formData.spcDate).toISOString() : undefined,
        isBlocked: formData.isBlocked,
        hasSubscription: formData.hasSubscription,
        classification,
        sellerId: selectedSellerId || undefined,
        status: formData.status,
        isSupplier,
        insuranceOnly: formData.insuranceOnly,
        insurance: formData.insurance.trim() || undefined,
        notes: formData.notes.trim() || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setSaveErrorMessage('');
      setValidationMessage('');
      if (isEditing) {
        navigate('/clientes/consultar');
        return;
      }

      setFormData({
        fullName: '',
        tradeName: '',
        legalName: '',
        cpf: '',
        rg: '',
        cnpj: '',
        stateRegistration: '',
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
        const fieldErrors = error.response?.data?.issues?.fieldErrors as
          | Record<string, string[]>
          | undefined;
        const firstFieldError = fieldErrors
          ? Object.values(fieldErrors).flat().find(Boolean)
          : undefined;

        setSaveErrorMessage(
          firstFieldError ||
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

  function validateBeforeSave() {
    if (personType === 'INDIVIDUAL') {
      if (!formData.fullName.trim()) {
        setValidationMessage('Preencha o campo obrigatório: Nome completo.');
        return false;
      }

      if (!formData.cpf.trim() && !formData.rg.trim()) {
        setValidationMessage('Preencha os campos obrigatórios: CPF e RG.');
        return false;
      }

      if (!formData.cpf.trim()) {
        setValidationMessage('Preencha o campo obrigatório: CPF.');
        return false;
      }

      if (!formData.rg.trim()) {
        setValidationMessage('Preencha o campo obrigatório: RG.');
        return false;
      }
    }

    if (personType === 'COMPANY') {
      if (!formData.cnpj.trim()) {
        setValidationMessage('Preencha o campo obrigatório: CNPJ.');
        return false;
      }

      if (!formData.stateRegistration.trim()) {
        setValidationMessage('Preencha o campo obrigatório: Inscrição Estadual.');
        return false;
      }

      if (!formData.tradeName.trim()) {
        setValidationMessage('Preencha o campo obrigatório: Nome fantasia.');
        return false;
      }

      if (!formData.legalName.trim()) {
        setValidationMessage('Preencha o campo obrigatório: Razão social.');
        return false;
      }
    }

    setValidationMessage('');
    return true;
  }

  function handleSaveCustomer() {
    setSaveErrorMessage('');

    if (!validateBeforeSave()) {
      return;
    }

    createCustomerMutation.mutate();
  }

  return (
    <Box>
      <PageHeader
        title={isEditing ? 'Editar cliente' : 'Cadastro de clientes'}
        description={
          isEditing
            ? 'Atualize os dados do cliente selecionado.'
            : 'Pessoa física e pessoa jurídica com campos obrigatórios diferentes.'
        }
      />

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <Button variant="contained" onClick={() => navigate('/clientes/consultar')}>
          Consultar
        </Button>
        <Button variant="outlined" onClick={() => navigate('/cadastros/tipos-clientes')}>
          Cadastro de Tipos de Clientes
        </Button>
        <Button variant="outlined" onClick={() => navigate('/cadastros/vendedores')}>
          Cadastro de Vendedores
        </Button>
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, xl: 8 }}>
          <Card>
            <CardContent>
              <Stack spacing={3}>
                {!isEditing && createCustomerMutation.isSuccess && (
                  <Alert severity="success">Cliente salvo com sucesso no banco de dados.</Alert>
                )}
                {customerQuery.isLoading && (
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <CircularProgress size={22} />
                    <Typography>Carregando dados do cliente...</Typography>
                  </Stack>
                )}
                {customerQuery.isError && (
                  <Alert severity="error">Não foi possível carregar os dados do cliente.</Alert>
                )}
                {validationMessage && <Alert severity="warning">{validationMessage}</Alert>}
                {createCustomerMutation.isError && <Alert severity="error">{saveErrorMessage}</Alert>}

                {!customerQuery.isLoading && !customerQuery.isError && (
                  <>
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

                {personType === 'INDIVIDUAL' ? (
                  <>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          required
                          label="Nome completo"
                          fullWidth
                          value={formData.fullName}
                          onChange={(event) => updateField('fullName', event.target.value)}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                          required
                          label="CPF"
                          fullWidth
                          value={formData.cpf}
                          onChange={(event) => updateField('cpf', maskCpf(event.target.value))}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                          required
                          label="RG"
                          fullWidth
                          value={formData.rg}
                          onChange={(event) => updateField('rg', maskRg(event.target.value))}
                        />
                      </Grid>
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                          required
                          label="CNPJ"
                          fullWidth
                          value={formData.cnpj}
                          onChange={(event) => updateField('cnpj', maskCnpj(event.target.value))}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                          required
                          label="Inscrição Estadual"
                          fullWidth
                          value={formData.stateRegistration}
                          onChange={(event) =>
                            updateField('stateRegistration', maskStateRegistration(event.target.value))
                          }
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          required
                          label="Nome fantasia"
                          fullWidth
                          value={formData.tradeName}
                          onChange={(event) => updateField('tradeName', event.target.value)}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          required
                          label="Razão social"
                          fullWidth
                          value={formData.legalName}
                          onChange={(event) => updateField('legalName', event.target.value)}
                        />
                      </Grid>
                    </Grid>
                  </>
                )}

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <TextField
                      label="Endereço"
                      fullWidth
                      value={formData.address}
                      onChange={(event) => updateField('address', event.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Bairro"
                      fullWidth
                      value={formData.district}
                      onChange={(event) => updateField('district', event.target.value)}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                      label="CEP"
                      fullWidth
                      value={formData.zipCode}
                      onChange={(event) => updateField('zipCode', maskCep(event.target.value))}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 5 }}>
                    <TextField
                      label="Cidade"
                      fullWidth
                      value={formData.city}
                      onChange={(event) => updateField('city', event.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Estado"
                      fullWidth
                      value={formData.state}
                      onChange={(event) => updateField('state', event.target.value)}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Telefone"
                      fullWidth
                      value={formData.phone}
                      onChange={(event) => updateField('phone', maskPhone(event.target.value))}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <TextField
                      label="Celular"
                      fullWidth
                      value={formData.mobilePhone}
                      onChange={(event) => updateField('mobilePhone', maskMobilePhone(event.target.value))}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="E-mail"
                      fullWidth
                      value={formData.email}
                      onChange={(event) => updateField('email', event.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                      label="Data nascimento"
                      type="date"
                      fullWidth
                      value={formData.birthDate}
                      onChange={(event) => updateField('birthDate', event.target.value)}
                      slotProps={{ inputLabel: { shrink: true } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                      label="Data cadastro"
                      type="date"
                      fullWidth
                      disabled
                      value={new Date().toISOString().slice(0, 10)}
                      slotProps={{ inputLabel: { shrink: true } }}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Data SPC"
                      type="date"
                      fullWidth
                      value={formData.spcDate}
                      onChange={(event) => updateField('spcDate', event.target.value)}
                      slotProps={{ inputLabel: { shrink: true } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      select
                      fullWidth
                      label="Vendedor"
                      value={selectedSellerId}
                      onChange={(event) => setSelectedSellerId(event.target.value)}
                    >
                      {(sellersQuery.data ?? []).map((seller) => (
                        <MenuItem key={seller.id} value={seller.id}>
                          {seller.code ? `${seller.code} — ` : ''}
                          {seller.name}
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
                    <TextField
                      label="Convênios"
                      fullWidth
                      value={formData.insurance}
                      onChange={(event) => updateField('insurance', event.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      select
                      label="Status"
                      fullWidth
                      value={formData.status}
                      onChange={(event) => updateField('status', event.target.value)}
                    >
                      <MenuItem value="ACTIVE">Ativo</MenuItem>
                      <MenuItem value="INACTIVE">Inativo</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} flexWrap="wrap" useFlexGap>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.isBlocked}
                        onChange={(event) => updateField('isBlocked', event.target.checked)}
                      />
                    }
                    label="Bloqueado"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.hasSubscription}
                        onChange={(event) => updateField('hasSubscription', event.target.checked)}
                      />
                    }
                    label="Assinatura"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={isSupplier} onChange={(event) => setIsSupplier(event.target.checked)} />}
                    label="Cliente também é fornecedor"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.insuranceOnly}
                        onChange={(event) => updateField('insuranceOnly', event.target.checked)}
                      />
                    }
                    label="Somente convênio"
                  />
                </Stack>

                <TextField
                  label="Observação"
                  multiline
                  minRows={4}
                  fullWidth
                  value={formData.notes}
                  onChange={(event) => updateField('notes', event.target.value)}
                />

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <Button variant="contained" onClick={handleSaveCustomer} disabled={createCustomerMutation.isPending}>
                    {isEditing ? 'Salvar alterações' : 'Gravar'}
                  </Button>
                  <Button variant="outlined">Excluir</Button>
                  {isEditing ? (
                    <Button variant="outlined" onClick={() => navigate('/clientes/consultar')}>
                      Cancelar edição
                    </Button>
                  ) : (
                    <Button variant="outlined" onClick={() => window.location.reload()}>
                      Limpar
                    </Button>
                  )}
                </Stack>
                  </>
                )}
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
                  <Typography color="text.secondary">`Bom`: pode vender fiado normalmente.</Typography>
                  <Typography color="text.secondary">`Médio`: pode vender fiado com atenção ao vencimento.</Typography>
                  <Typography color="text.secondary">`Ruim`: não deve vender fiado até revisão manual.</Typography>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Campos obrigatórios
                </Typography>
                <Stack spacing={1.5}>
                  <Typography color="text.secondary">
                    Pessoa física exige `Nome completo`, `CPF` e `RG`.
                  </Typography>
                  <Typography color="text.secondary">
                    Pessoa jurídica exige `CNPJ`, `Inscrição Estadual`, `Nome fantasia` e `Razão social`.
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
