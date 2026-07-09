import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const customerTypes = ['Cliente Particular', 'Convênio Empresa', 'Farmácia Brasil'];
  for (const name of customerTypes) {
    const existing = await prisma.customerType.findFirst({ where: { name } });
    if (!existing) {
      await prisma.customerType.create({ data: { name } });
    }
  }

  const sellers = [
    { code: '0001', name: 'Israel' },
    { code: '0002', name: 'Marta' },
    { code: '0003', name: 'Equipe Balcão' },
  ];
  for (const seller of sellers) {
    await prisma.seller.upsert({
      where: { code: seller.code },
      update: { name: seller.name },
      create: seller,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
