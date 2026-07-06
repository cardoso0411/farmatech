import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid2 as Grid,
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
import { PageHeader } from '../components/common/PageHeader';

const saleItems = [
  { product: 'Dipirona 500mg', quantity: 2, unitPrice: 7.5, total: 15 },
  { product: 'Vitamina C 1g', quantity: 1, unitPrice: 18.9, total: 18.9 },
];

export function PdvPage() {
  const subtotal = saleItems.reduce((accumulator, item) => accumulator + item.total, 0);
  const discount = 3;
  const total = subtotal - discount;

  return (
    <Box>
      <PageHeader
        title="Ponto de venda"
        description="Fluxo principal da farmácia com foco em rapidez, clareza e poucos cliques."
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={3}>
            <Card>
              <CardContent>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField fullWidth label="Buscar cliente" placeholder="Nome, CPF ou telefone" />
                  <Button variant="contained" startIcon={<SearchIcon />}>
                    Buscar
                  </Button>
                  <Button variant="outlined">Venda sem cliente</Button>
                </Stack>

                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Chip label="Cliente: não identificado" color="default" />
                  <Chip label="Convênio: sem convênio" variant="outlined" />
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
                  <TextField fullWidth label="Código de barras" placeholder="Bipar produto" />
                  <TextField fullWidth label="Buscar produto" placeholder="Nome ou código" />
                  <Button variant="contained">Adicionar item</Button>
                </Stack>

                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Produto</TableCell>
                      <TableCell align="center">Qtd.</TableCell>
                      <TableCell align="right">Valor un.</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {saleItems.map((item) => (
                      <TableRow key={item.product}>
                        <TableCell>{item.product}</TableCell>
                        <TableCell align="center">{item.quantity}</TableCell>
                        <TableCell align="right">R$ {item.unitPrice.toFixed(2)}</TableCell>
                        <TableCell align="right">R$ {item.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
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
                  Resumo da venda
                </Typography>

                <List disablePadding>
                  <ListItem disableGutters>
                    <ListItemText primary="Subtotal" />
                    <Typography>R$ {subtotal.toFixed(2)}</Typography>
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemText primary="Desconto" />
                    <Typography color="error.main">R$ {discount.toFixed(2)}</Typography>
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemText primary="Total" />
                    <Typography variant="h6">R$ {total.toFixed(2)}</Typography>
                  </ListItem>
                </List>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={2}>
                  <TextField select label="Forma de pagamento" defaultValue="CASH">
                    <MenuItem value="CASH">Dinheiro</MenuItem>
                    <MenuItem value="DEBIT_CARD">Cartão de débito</MenuItem>
                    <MenuItem value="CREDIT_CARD">Cartão de crédito</MenuItem>
                    <MenuItem value="PIX">Pix</MenuItem>
                    <MenuItem value="INSURANCE">Convênio</MenuItem>
                  </TextField>
                  <TextField label="Valor recebido" defaultValue={total.toFixed(2)} />
                  <TextField label="Troco" value="R$ 0,00" slotProps={{ input: { readOnly: true } }} />
                  <Button size="large" variant="contained">
                    Finalizar venda
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Atalhos rápidos
                </Typography>
                <Stack spacing={1.5}>
                  <Button variant="outlined">Cadastrar cliente</Button>
                  <Button variant="outlined">Cadastrar produto</Button>
                  <Button variant="outlined">Abrir caixa</Button>
                  <Button variant="outlined">Consultar estoque</Button>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
