import { env } from './config/env';
import { prisma } from './lib/prisma';
import { app } from './app';

async function bootstrap() {
  await prisma.$connect();

  app.listen(env.PORT, () => {
    console.log(`Farmatech API rodando em http://localhost:${env.PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error('Erro ao iniciar a aplicação.', error);
  process.exit(1);
});
