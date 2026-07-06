import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';

type ModuleCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  actionLabel: string;
  onClick: () => void;
};

export function ModuleCard({
  title,
  description,
  icon,
  actionLabel,
  onClick,
}: ModuleCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, height: '100%' }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          {icon}
          <Typography variant="h6">{title}</Typography>
        </Stack>

        <Typography color="text.secondary" sx={{ flexGrow: 1 }}>
          {description}
        </Typography>

        <Button variant="contained" endIcon={<ArrowForwardRoundedIcon />} onClick={onClick}>
          {actionLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
