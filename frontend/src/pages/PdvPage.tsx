import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import RemoveIcon from '@mui/icons-material/Remove';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid2 as Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { formatMoney, money } from '../utils/currency';

type Customer = {
  id: string;
  name: string;
  cpf: string;
  insurance?: string;
};

type Product = {
  id: string;
  name: string;
  barcode: string;
  sku: string;
  price: number;
  stock: number;
  isActive: boolean;
};

type CartItem = {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
};

type PaymentMethod = 'CASH' | 'DEBIT_CARD' | 'CREDIT_CARD' | 'PIX' | 'INSURANCE';

type PaymentEntry = {
  id: string;
  method: PaymentMethod;
  amount: number;
};

const customersMock: Customer[] = [
  { id: 'c1', name: 'Maria Aparecida Silva', cpf: '123.456.789-00', insurance: 'Farmácia Popular' },
  { id: 'c2', name: 'João Carlos Souza', cpf: '987.654.321-00' },
  { id: 'c3', name: 'Mariana Costa', cpf: '456.111.222-99', insurance: 'Convênio Cristália' },
];

const productsMock: Product[] = [
  { id: 'p1', name: 'Dipirona 500mg', barcode: '7891000100101', sku: 'DP500', price: 7.5, stock: 42, isActive: true },
  { id: 'p2', name: 'Vitamina C 1g', barcode: '7891000100102', sku: 'VC1G', price: 18.9, stock: 20, isActive: true },
  { id: 'p3', name: 'Amoxicilina 500mg', barcode: '7891000100103', sku: 'AMX500', price: 32.75, stock: 15, isActive: true },
  { id: 'p4', name: 'Nebralgex Cart 10cp', barcode: '7891000100104', sku: 'NBR10', price: 4, stock: 60, isActive: true },
];

const paymentLabels: Record<PaymentMethod, string> = {
  CASH: 'Dinheiro',
  DEBIT_CARD: 'Cartão de débito',
  CREDIT_CARD: 'Cartão de crédito',
  PIX: 'Pix',
  INSURANCE: 'Convênio',
};

function createSaleState() {
  return {
    selectedCustomer: null as Customer | null,
    cartItems: [] as CartItem[],
    discountType: 'VALUE' as 'VALUE' | 'PERCENT',
    discountInput: '',
    payments: [] as PaymentEntry[],
  };
}

export function PdvPage() {
  const [saleState, setSaleState] = useState(createSaleState);
  const [customerQuery, setCustomerQuery] = useState('');
  const [customerMatches, setCustomerMatches] = useState<Customer[]>([]);
  const [productQuery, setProductQuery] = useState('');
  const [barcodeQuery, setBarcodeQuery] = useState('');
  const [productMatches, setProductMatches] = useState<Product[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'warning' | 'error'; message: string } | null>(null);

  const subtotal = useMemo(
    () =>
      saleState.cartItems.reduce(
        (accumulator, item) => money(accumulator).add(money(item.unitPrice).multiply(item.quantity)).value,
        0
      ),
    [saleState.cartItems]
  );

  const discountValue = useMemo(() => {
    if (!saleState.discountInput.trim()) {
      return 0;
    }

    const normalizedDiscount = Number(saleState.discountInput.replace(',', '.'));

    if (Number.isNaN(normalizedDiscount) || normalizedDiscount < 0) {
      return 0;
    }

    if (saleState.discountType === 'PERCENT') {
      return money(subtotal).multiply(normalizedDiscount / 100).value;
    }

    return normalizedDiscount;
  }, [saleState.discountInput, saleState.discountType, subtotal]);

  const safeDiscount = Math.min(discountValue, subtotal);
  const total = money(subtotal).subtract(safeDiscount).value;
  const paidTotal = saleState.payments.reduce((accumulator, payment) => money(accumulator).add(payment.amount).value, 0);
  const cashPaid = saleState.payments
    .filter((payment) => payment.method === 'CASH')
    .reduce((accumulator, payment) => money(accumulator).add(payment.amount).value, 0);
  const nonCashPaid = saleState.payments
    .filter((payment) => payment.method !== 'CASH')
    .reduce((accumulator, payment) => money(accumulator).add(payment.amount).value, 0);
  const remaining = Math.max(money(total).subtract(paidTotal).value, 0);
  const cashNeeded = Math.max(money(total).subtract(nonCashPaid).value, 0);
  const change = Math.max(money(cashPaid).subtract(cashNeeded).value, 0);

  function resetSale(message?: string) {
    setSaleState(createSaleState());
    setCustomerQuery('');
    setCustomerMatches([]);
    setProductQuery('');
    setBarcodeQuery('');
    setProductMatches([]);
    setPaymentMethod('CASH');
    setPaymentAmount('');
    setFeedback(message ? { type: 'success', message } : null);
  }

  function searchCustomer() {
    const query = customerQuery.trim().toLowerCase();

    if (!query) {
      setCustomerMatches([]);
      setFeedback({ type: 'warning', message: 'Digite CPF ou nome para localizar um cliente.' });
      return;
    }

    const matches = customersMock.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) ||
        customer.cpf.replace(/\D/g, '').includes(query.replace(/\D/g, ''))
    );

    setCustomerMatches(matches);

    if (matches.length === 1) {
      setSaleState((current) => ({ ...current, selectedCustomer: matches[0] }));
      setFeedback({ type: 'success', message: `Cliente ${matches[0].name} selecionado.` });
      return;
    }

    if (matches.length > 1) {
      setFeedback({ type: 'warning', message: 'Mais de um cliente encontrado. Escolha abaixo.' });
      return;
    }

    setFeedback({ type: 'warning', message: 'Nenhum cliente encontrado. A venda pode continuar sem cliente.' });
  }

  function selectCustomer(customer: Customer) {
    setSaleState((current) => ({ ...current, selectedCustomer: customer }));
    setCustomerMatches([]);
    setCustomerQuery(customer.name);
    setFeedback({ type: 'success', message: `Cliente ${customer.name} identificado na venda.` });
  }

  function findProducts() {
    const barcode = barcodeQuery.trim();
    const query = productQuery.trim().toLowerCase();

    if (!barcode && !query) {
      setProductMatches([]);
      setFeedback({ type: 'warning', message: 'Digite o código de barras ou o nome do produto.' });
      return;
    }

    let matches: Product[] = [];

    if (barcode) {
      matches = productsMock.filter((product) => product.barcode === barcode);
    } else {
      matches = productsMock.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query) ||
          product.barcode.includes(query)
      );
    }

    setProductMatches(matches);

    if (matches.length === 1) {
      addProduct(matches[0]);
      return;
    }

    if (matches.length > 1) {
      setFeedback({ type: 'warning', message: 'Mais de um produto encontrado. Escolha abaixo.' });
      return;
    }

    setFeedback({ type: 'warning', message: 'Produto não encontrado.' });
  }

  function addProduct(product: Product) {
    if (!product.isActive) {
      setFeedback({ type: 'error', message: 'Esse produto está inativo.' });
      return;
    }

    setSaleState((current) => {
      const existingItem = current.cartItems.find((item) => item.productId === product.id);

      if (existingItem) {
        const nextQuantity = existingItem.quantity + 1;

        if (nextQuantity > product.stock) {
          setFeedback({ type: 'error', message: `Estoque insuficiente para ${product.name}.` });
          return current;
        }

        return {
          ...current,
          cartItems: current.cartItems.map((item) =>
            item.productId === product.id ? { ...item, quantity: nextQuantity } : item
          ),
        };
      }

      if (product.stock < 1) {
        setFeedback({ type: 'error', message: `Sem estoque para ${product.name}.` });
        return current;
      }

      return {
        ...current,
        cartItems: [
          ...current.cartItems,
          {
            id: `${product.id}-${Date.now()}`,
            productId: product.id,
            name: product.name,
            quantity: 1,
            unitPrice: product.price,
          },
        ],
      };
    });

    setProductQuery('');
    setBarcodeQuery('');
    setProductMatches([]);
    setFeedback({ type: 'success', message: `${product.name} adicionado à venda.` });
  }

  function updateQuantity(productId: string, operation: 'increment' | 'decrement') {
    const product = productsMock.find((item) => item.id === productId);
    if (!product) return;

    setSaleState((current) => ({
      ...current,
      cartItems: current.cartItems
        .map((item) => {
          if (item.productId !== productId) {
            return item;
          }

          const nextQuantity = operation === 'increment' ? item.quantity + 1 : item.quantity - 1;

          if (nextQuantity > product.stock) {
            setFeedback({ type: 'error', message: `Estoque insuficiente para ${item.name}.` });
            return item;
          }

          return { ...item, quantity: nextQuantity };
        })
        .filter((item) => item.quantity > 0),
    }));
  }

  function removeItem(productId: string) {
    setSaleState((current) => ({
      ...current,
      cartItems: current.cartItems.filter((item) => item.productId !== productId),
    }));
  }

  function addPayment() {
    const parsedAmount = Number(paymentAmount.replace(',', '.'));

    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setFeedback({ type: 'warning', message: 'Informe um valor de pagamento válido.' });
      return;
    }

    setSaleState((current) => ({
      ...current,
      payments: [
        ...current.payments,
        {
          id: `${paymentMethod}-${Date.now()}`,
          method: paymentMethod,
          amount: parsedAmount,
        },
      ],
    }));

    setPaymentAmount('');
    setFeedback({ type: 'success', message: 'Pagamento adicionado à venda.' });
  }

  function removePayment(paymentId: string) {
    setSaleState((current) => ({
      ...current,
      payments: current.payments.filter((payment) => payment.id !== paymentId),
    }));
  }

  function concludeSale() {
    if (saleState.cartItems.length === 0) {
      setFeedback({ type: 'error', message: 'Adicione ao menos um produto antes de concluir a venda.' });
      return;
    }

    if (total <= 0) {
      setFeedback({ type: 'error', message: 'O total da venda precisa ser maior que zero.' });
      return;
    }

    if (saleState.payments.length === 0) {
      setFeedback({ type: 'error', message: 'Informe ao menos uma forma de pagamento.' });
      return;
    }

    if (paidTotal < total) {
      setFeedback({ type: 'error', message: 'O valor pago ainda não cobre o total da venda.' });
      return;
    }

    setFeedback({
      type: 'success',
      message: `Venda concluída com sucesso. Total ${formatMoney(total)}${change > 0 ? ` | Troco ${formatMoney(change)}` : ''}.`,
    });

    setTimeout(() => {
      resetSale();
    }, 1200);
  }

  return (
    <Box>
      <PageHeader
        title="Ponto de venda"
        description="Fluxo principal da farmácia com nova venda, cliente, produtos, desconto, pagamento e conclusão."
      />

      {feedback && (
        <Alert severity={feedback.type} sx={{ mb: 3 }} onClose={() => setFeedback(null)}>
          {feedback.message}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={3}>
            <Card>
              <CardContent>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  justifyContent="space-between"
                  alignItems={{ xs: 'flex-start', md: 'center' }}
                  spacing={2}
                  sx={{ mb: 2 }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <PointOfSaleIcon color="primary" />
                    <Typography variant="h6">Nova venda</Typography>
                  </Stack>
                  <Button variant="outlined" startIcon={<RestartAltIcon />} onClick={() => resetSale()}>
                    Iniciar nova venda
                  </Button>
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip
                    color={saleState.selectedCustomer ? 'primary' : 'default'}
                    label={`Cliente: ${saleState.selectedCustomer?.name ?? 'não identificado'}`}
                  />
                  <Chip
                    variant="outlined"
                    label={`Convênio: ${saleState.selectedCustomer?.insurance ?? 'sem convênio'}`}
                  />
                  <Chip variant="outlined" label={`Itens: ${saleState.cartItems.length}`} />
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                  <PersonSearchIcon color="primary" />
                  <Typography variant="h6">Identificar cliente</Typography>
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    label="Buscar por CPF ou nome"
                    placeholder="Ex.: 12345678900 ou Maria"
                    value={customerQuery}
                    onChange={(event) => setCustomerQuery(event.target.value)}
                  />
                  <Button variant="contained" startIcon={<SearchIcon />} onClick={searchCustomer}>
                    Buscar
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSaleState((current) => ({ ...current, selectedCustomer: null }));
                      setCustomerQuery('');
                      setCustomerMatches([]);
                    }}
                  >
                    Sem cliente
                  </Button>
                </Stack>

                {customerMatches.length > 1 && (
                  <Stack spacing={1} sx={{ mt: 2 }}>
                    {customerMatches.map((customer) => (
                      <Button
                        key={customer.id}
                        variant="text"
                        sx={{ justifyContent: 'flex-start' }}
                        onClick={() => selectCustomer(customer)}
                      >
                        {customer.name} — {customer.cpf}
                      </Button>
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                  <ShoppingCartCheckoutIcon color="primary" />
                  <Typography variant="h6">Adicionar produto</Typography>
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Código de barras"
                    placeholder="Bipar produto"
                    value={barcodeQuery}
                    onChange={(event) => setBarcodeQuery(event.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Nome, código ou SKU"
                    placeholder="Buscar produto"
                    value={productQuery}
                    onChange={(event) => setProductQuery(event.target.value)}
                  />
                  <Button variant="contained" onClick={findProducts}>
                    Adicionar
                  </Button>
                </Stack>

                {productMatches.length > 1 && (
                  <Stack spacing={1.5} sx={{ mb: 2 }}>
                    {productMatches.map((product) => (
                      <Button
                        key={product.id}
                        variant="text"
                        sx={{ justifyContent: 'space-between' }}
                        onClick={() => addProduct(product)}
                      >
                        <span>{product.name}</span>
                        <span>{formatMoney(product.price)}</span>
                      </Button>
                    ))}
                  </Stack>
                )}

                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Produto</TableCell>
                      <TableCell align="center">Qtd.</TableCell>
                      <TableCell align="right">Valor un.</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell align="center">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {saleState.cartItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          Nenhum produto na venda ainda.
                        </TableCell>
                      </TableRow>
                    ) : (
                      saleState.cartItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell align="center">{item.quantity}</TableCell>
                          <TableCell align="right">{formatMoney(item.unitPrice)}</TableCell>
                          <TableCell align="right">
                            {formatMoney(money(item.unitPrice).multiply(item.quantity).value)}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton onClick={() => updateQuantity(item.productId, 'decrement')}>
                              <RemoveIcon />
                            </IconButton>
                            <IconButton onClick={() => updateQuantity(item.productId, 'increment')}>
                              <AddIcon />
                            </IconButton>
                            <IconButton color="error" onClick={() => removeItem(item.productId)}>
                              <DeleteOutlineIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Desconto e resumo
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                  <TextField
                    select
                    fullWidth
                    label="Tipo de desconto"
                    value={saleState.discountType}
                    onChange={(event) =>
                      setSaleState((current) => ({
                        ...current,
                        discountType: event.target.value as 'VALUE' | 'PERCENT',
                      }))
                    }
                  >
                    <MenuItem value="VALUE">Em R$</MenuItem>
                    <MenuItem value="PERCENT">Em %</MenuItem>
                  </TextField>
                  <TextField
                    fullWidth
                    label={saleState.discountType === 'VALUE' ? 'Valor do desconto' : 'Percentual'}
                    placeholder={saleState.discountType === 'VALUE' ? '0,00' : '0'}
                    value={saleState.discountInput}
                    onChange={(event) =>
                      setSaleState((current) => ({ ...current, discountInput: event.target.value }))
                    }
                  />
                </Stack>

                <List disablePadding>
                  <ListItem disableGutters>
                    <ListItemText primary="Subtotal" />
                    <Typography>{formatMoney(subtotal)}</Typography>
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemText primary="Desconto" />
                    <Typography color="error.main">- {formatMoney(safeDiscount)}</Typography>
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemText primary="Total final" />
                    <Typography variant="h6">{formatMoney(total)}</Typography>
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Informar pagamento
                </Typography>

                <Stack spacing={2}>
                  <TextField
                    select
                    label="Forma de pagamento"
                    value={paymentMethod}
                    onChange={(event) => setPaymentMethod(event.target.value as PaymentMethod)}
                  >
                    {Object.entries(paymentLabels).map(([value, label]) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    label="Valor do pagamento"
                    placeholder="0,00"
                    value={paymentAmount}
                    onChange={(event) => setPaymentAmount(event.target.value)}
                  />

                  <Button variant="outlined" onClick={addPayment}>
                    Adicionar pagamento
                  </Button>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={1.2}>
                  {saleState.payments.length === 0 ? (
                    <Typography color="text.secondary">Nenhum pagamento informado.</Typography>
                  ) : (
                    saleState.payments.map((payment) => (
                      <Stack
                        key={payment.id}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={1}
                      >
                        <Typography variant="body2">
                          {paymentLabels[payment.method]} — {formatMoney(payment.amount)}
                        </Typography>
                        <IconButton size="small" color="error" onClick={() => removePayment(payment.id)}>
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    ))
                  )}
                </Stack>

                <Divider sx={{ my: 2 }} />

                <List disablePadding>
                  <ListItem disableGutters>
                    <ListItemText primary="Total pago" />
                    <Typography>{formatMoney(paidTotal)}</Typography>
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemText primary="Falta pagar" />
                    <Typography color={remaining > 0 ? 'warning.main' : 'success.main'}>
                      {formatMoney(remaining)}
                    </Typography>
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemText primary="Troco" />
                    <Typography color="success.main">{formatMoney(change)}</Typography>
                  </ListItem>
                </List>

                <Button
                  fullWidth
                  size="large"
                  sx={{ mt: 2 }}
                  variant="contained"
                  startIcon={<CheckCircleOutlineIcon />}
                  onClick={concludeSale}
                >
                  Concluir venda
                </Button>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
