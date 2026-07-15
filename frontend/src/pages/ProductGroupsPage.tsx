import { Box, Button, Card, CardContent, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import { PageHeader } from '../components/common/PageHeader';
import { productGroupOptions } from '../data/productSupportData';

export function ProductGroupsPage() {
  return (
    <Box>
      <PageHeader
        title="Cadastro de Grupos"
        description="Tabela com local, grupo, SNGPC, operação de venda, código e cuidado."
      />

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} flexWrap="wrap" useFlexGap>
            <TextField label="Local" />
            <TextField label="Grupo" />
            <TextField label="SNGPC" />
            <TextField label="Operação de Venda" />
            <TextField label="Código" />
            <TextField label="Cuidado" />
            <Button variant="contained">Salvar grupo</Button>
          </Stack>
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
              {productGroupOptions.map((group) => (
                <TableRow key={group.id}>
                  <TableCell>{group.local}</TableCell>
                  <TableCell>{group.group}</TableCell>
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
    </Box>
  );
}
