import { Alert, Box, Button, Card, CardContent, TextField, Typography } from '@mui/material';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { api } from '../lib/api';

export function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  async function handleLogin() {
    try {
      const response = await api.post<{ token: string; user: { id: string; name: string; username: string; role: 'ADMIN' | 'MANAGER' | 'ATTENDANT' } }>('/auth/login', { username, password });
      login(response.data.token, response.data.user);
    } catch (requestError) { setError((requestError as AxiosError<{ message?: string }>).response?.data?.message ?? 'Não foi possível entrar no sistema.'); }
  }
  return <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 2, bgcolor: 'background.default' }}><Card sx={{ width: '100%', maxWidth: 420 }}><CardContent><Typography variant="h5" gutterBottom>Farmácia Brasil</Typography><Typography color="text.secondary" sx={{ mb: 3 }}>Entre com seu usuário e senha.</Typography><TextField autoFocus fullWidth label="Usuário" value={username} onChange={(event) => setUsername(event.target.value)} sx={{ mb: 2 }} /><TextField fullWidth type="password" label="Senha" value={password} onChange={(event) => setPassword(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && handleLogin()} sx={{ mb: 2 }} /><Button fullWidth variant="contained" disabled={!username || !password} onClick={handleLogin}>Entrar</Button>{error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}</CardContent></Card></Box>;
}
