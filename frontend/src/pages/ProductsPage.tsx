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
  Stack,
  TextField,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { PageHeader } from '../components/common/PageHeader';
import { useProductSupport } from '../hooks/useProductSupport';
import { maskProductBarcode } from '../utils/masks';

type PisType = 'POSITIVA' | 'NEGATIVA' | 'NEUTRA' | '';

export function ProductsPage() {
  const navigate = useNavigate();
  const { categoriesQuery, groupsQuery } = useProductSupport();
  const [saveErrorMessage, setSaveErrorMessage] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [pisType, setPisType] = useState<PisType>('');
  const [formData, setFormData] = useState({
    barcode: '',
    categoryId: '',
    groupId: '',
    brand: '',
    summary: '',
    sngpc: '',
    description: '',
    rms: '',
    presentation: '',
    reference: '',
    activeIngredient: '',
    unit: '',
    dcb: '',
    packageQuantity: '',
    minimumQuantity: '',
    fractionQuantity: '',
    salePrice: '',
    cost: '',
    stockQuantity: '',
    ncmCode: '',
    origin: '',
    icms: '',
    saleOperation: '',
    observation: '',
    isGeneric: false,
    isControlled: false,
    isSpecial: false,
    isFractioned: false,
    isSimilar: false,
  });

  const sngpcOptions = useMemo(
    () => Array.from(new Set((groupsQuery.data ?? []).map((item) => item.sngpc))).filter(Boolean),
    [groupsQuery.data]
  );

  const saleOperationOptions = useMemo(
    () =>
      Array.from(new Set((groupsQuery.data ?? []).map((item) => item.saleOperation))).filter(Boolean),
    [groupsQuery.data]
  );

  const createProductMutation = useMutation({
    mutationFn: async () =>
      api.post('/products', {
        barcode: formData.barcode || undefined,
        categoryId: formData.categoryId || undefined,
        groupId: formData.groupId || undefined,
        brand: formData.brand.trim() || undefined,
        summary: formData.summary.trim(),
        sngpc: formData.sngpc || undefined,
        description: formData.description.trim(),
        rms: formData.rms.trim() || undefined,
        presentation: formData.presentation.trim() || undefined,
        reference: formData.reference.trim() || undefined,
        activeIngredient: formData.activeIngredient.trim() || undefined,
        unit: formData.unit.trim(),
        dcb: formData.dcb.trim() || undefined,
        packageQuantity: formData.packageQuantity ? Number(formData.packageQuantity) : undefined,
        minimumQuantity: formData.minimumQuantity ? Number(formData.minimumQuantity) : 0,
        fractionQuantity: formData.fractionQuantity ? Number(formData.fractionQuantity) : undefined,
        salePrice: Number(formData.salePrice.replace(',', '.')),
        costPrice: formData.cost ? Number(formData.cost.replace(',', '.')) : undefined,
        stockQuantity: formData.stockQuantity ? Number(formData.stockQuantity) : 0,
        isGeneric: formData.isGeneric,
        isControlled: formData.isControlled,
        isSpecial: formData.isSpecial,
        isFractioned: formData.isFractioned,
        isSimilar: formData.isSimilar,
        ncmCode: formData.ncmCode.trim() || undefined,
        pisList: pisType || undefined,
        origin: formData.origin.trim() || undefined,
        icms: formData.icms.trim() || undefined,
        saleOperation: formData.saleOperation || undefined,
        observation: formData.observation.trim() || undefined,
      }),
    onSuccess: () => {
      setSaveErrorMessage('');
      setValidationMessage('');
      setPisType('');
      setFormData({
        barcode: '',
        categoryId: '',
        groupId: '',
        brand: '',
        summary: '',
        sngpc: '',
        description: '',
        rms: '',
        presentation: '',
        reference: '',
        activeIngredient: '',
        unit: '',
        dcb: '',
        packageQuantity: '',
        minimumQuantity: '',
        fractionQuantity: '',
        salePrice: '',
        cost: '',
        stockQuantity: '',
        ncmCode: '',
        origin: '',
        icms: '',
        saleOperation: '',
        observation: '',
        isGeneric: false,
        isControlled: false,
        isSpecial: false,
        isFractioned: false,
        isSimilar: false,
      });
    },
    onError: () => {
      setSaveErrorMessage('Não foi possível salvar o produto.');
    },
  });

  function updateField<K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  function selectPis(type: PisType) {
    setPisType(type);
  }

  function validateBeforeSave() {
    if (!formData.summary.trim()) {
      setValidationMessage('Preencha o campo obrigatório: Nome do medicamento.');
      return false;
    }

    if (!formData.description.trim()) {
      setValidationMessage('Preencha o campo obrigatório: Descrição.');
      return false;
    }

    if (!formData.unit.trim()) {
      setValidationMessage('Preencha o campo obrigatório: Unidade.');
      return false;
    }

    if (!formData.salePrice.trim()) {
      setValidationMessage('Preencha o campo obrigatório: Preço de venda.');
      return false;
    }

    setValidationMessage('');
    return true;
  }

  function handleSaveProduct() {
    setSaveErrorMessage('');

    if (!validateBeforeSave()) {
      return;
    }

    createProductMutation.mutate();
  }

  return (
    <Box>
      <PageHeader
        title="Produtos"
        description="Cadastro de remédios ligado ao banco real com categorias, grupos, dados fiscais, estoque e flags."
      />

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <Button variant="contained" onClick={() => navigate('/produtos/consultar')}>
          Consultar
        </Button>
        <Button variant="outlined" onClick={() => navigate('/produtos/categorias')}>
          Cadastro de Categoria
        </Button>
        <Button variant="outlined" onClick={() => navigate('/produtos/grupos')}>
          Cadastro de Grupos
        </Button>
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, xl: 9 }}>
          <Card>
            <CardContent>
              <Stack spacing={3}>
                {createProductMutation.isSuccess && (
                  <Alert severity="success">Produto salvo com sucesso no banco de dados.</Alert>
                )}
                {validationMessage && <Alert severity="warning">{validationMessage}</Alert>}
                {createProductMutation.isError && <Alert severity="error">{saveErrorMessage}</Alert>}

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Código de barras"
                      fullWidth
                      value={formData.barcode}
                      onChange={(event) => updateField('barcode', maskProductBarcode(event.target.value))}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      select
                      label="Categoria"
                      fullWidth
                      value={formData.categoryId}
                      onChange={(event) => updateField('categoryId', event.target.value)}
                    >
                      {(categoriesQuery.data ?? []).map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.code} — {category.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      select
                      label="Grupo"
                      fullWidth
                      value={formData.groupId}
                      onChange={(event) => updateField('groupId', event.target.value)}
                    >
                      {(groupsQuery.data ?? []).map((group) => (
                        <MenuItem key={group.id} value={group.id}>
                          {group.groupName}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField label="Marca / laboratório" fullWidth value={formData.brand} onChange={(event) => updateField('brand', event.target.value)} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField required label="Nome do medicamento" fullWidth value={formData.summary} onChange={(event) => updateField('summary', event.target.value)} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      select
                      label="SNGPC"
                      fullWidth
                      value={formData.sngpc}
                      onChange={(event) => updateField('sngpc', event.target.value)}
                    >
                      {sngpcOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField required label="Descrição" fullWidth value={formData.description} onChange={(event) => updateField('description', event.target.value)} />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField label="RMS" fullWidth value={formData.rms} onChange={(event) => updateField('rms', event.target.value)} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField label="Apresentação" fullWidth value={formData.presentation} onChange={(event) => updateField('presentation', event.target.value)} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField label="Ref" fullWidth value={formData.reference} onChange={(event) => updateField('reference', event.target.value)} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField label="Princípio Ativo" fullWidth value={formData.activeIngredient} onChange={(event) => updateField('activeIngredient', event.target.value)} />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 2 }}>
                    <TextField required label="Unidade" fullWidth value={formData.unit} onChange={(event) => updateField('unit', event.target.value)} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField label="DCB" fullWidth value={formData.dcb} onChange={(event) => updateField('dcb', event.target.value)} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 2 }}>
                    <TextField label="Qtde Embalagem" fullWidth value={formData.packageQuantity} onChange={(event) => updateField('packageQuantity', event.target.value)} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 2 }}>
                    <TextField label="Qtde Mínima" fullWidth value={formData.minimumQuantity} onChange={(event) => updateField('minimumQuantity', event.target.value)} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField label="Qtde Fração" fullWidth value={formData.fractionQuantity} onChange={(event) => updateField('fractionQuantity', event.target.value)} />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField required label="Preço de venda" fullWidth value={formData.salePrice} onChange={(event) => updateField('salePrice', event.target.value)} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField label="Custo" fullWidth value={formData.cost} onChange={(event) => updateField('cost', event.target.value)} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField label="Qtd em estoque" fullWidth value={formData.stockQuantity} onChange={(event) => updateField('stockQuantity', event.target.value)} />
                  </Grid>
                </Grid>

                <Box>
                  <FormLabel>Flags</FormLabel>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} flexWrap="wrap" useFlexGap>
                    <FormControlLabel control={<Checkbox checked={formData.isGeneric} onChange={(event) => updateField('isGeneric', event.target.checked)} />} label="Genérico" />
                    <FormControlLabel control={<Checkbox checked={formData.isControlled} onChange={(event) => updateField('isControlled', event.target.checked)} />} label="Controlado" />
                    <FormControlLabel control={<Checkbox checked={formData.isSpecial} onChange={(event) => updateField('isSpecial', event.target.checked)} />} label="Especial" />
                    <FormControlLabel control={<Checkbox checked={formData.isFractioned} onChange={(event) => updateField('isFractioned', event.target.checked)} />} label="Fracionado" />
                    <FormControlLabel control={<Checkbox checked={formData.isSimilar} onChange={(event) => updateField('isSimilar', event.target.checked)} />} label="Similar" />
                  </Stack>
                </Box>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField label="Código NCM" fullWidth value={formData.ncmCode} onChange={(event) => updateField('ncmCode', event.target.value)} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField label="Origem" fullWidth value={formData.origin} onChange={(event) => updateField('origin', event.target.value)} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField label="ICMS" fullWidth value={formData.icms} onChange={(event) => updateField('icms', event.target.value)} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                      select
                      label="Operação Venda"
                      fullWidth
                      value={formData.saleOperation}
                      onChange={(event) => updateField('saleOperation', event.target.value)}
                    >
                      {saleOperationOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>

                <Box>
                  <FormLabel>Lista PIS</FormLabel>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} flexWrap="wrap" useFlexGap>
                    <FormControlLabel control={<Checkbox checked={pisType === 'POSITIVA'} onChange={() => selectPis(pisType === 'POSITIVA' ? '' : 'POSITIVA')} />} label="Positiva" />
                    <FormControlLabel control={<Checkbox checked={pisType === 'NEGATIVA'} onChange={() => selectPis(pisType === 'NEGATIVA' ? '' : 'NEGATIVA')} />} label="Negativa" />
                    <FormControlLabel control={<Checkbox checked={pisType === 'NEUTRA'} onChange={() => selectPis(pisType === 'NEUTRA' ? '' : 'NEUTRA')} />} label="Neutra" />
                  </Stack>
                </Box>

                <TextField
                  label="Observação"
                  multiline
                  minRows={4}
                  fullWidth
                  value={formData.observation}
                  onChange={(event) => updateField('observation', event.target.value)}
                />

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <Button variant="contained" onClick={handleSaveProduct} disabled={createProductMutation.isPending}>
                    Gravar produto
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setValidationMessage('');
                      setSaveErrorMessage('');
                      setPisType('');
                      setFormData({
                        barcode: '',
                        categoryId: '',
                        groupId: '',
                        brand: '',
                        summary: '',
                        sngpc: '',
                        description: '',
                        rms: '',
                        presentation: '',
                        reference: '',
                        activeIngredient: '',
                        unit: '',
                        dcb: '',
                        packageQuantity: '',
                        minimumQuantity: '',
                        fractionQuantity: '',
                        salePrice: '',
                        cost: '',
                        stockQuantity: '',
                        ncmCode: '',
                        origin: '',
                        icms: '',
                        saleOperation: '',
                        observation: '',
                        isGeneric: false,
                        isControlled: false,
                        isSpecial: false,
                        isFractioned: false,
                        isSimilar: false,
                      });
                    }}
                  >
                    Limpar
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
