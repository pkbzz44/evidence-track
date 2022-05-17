import { PrismaClient } from '@prisma/client';

export default function handler(req, res) {
  const prisma = new PrismaClient();

  async function main() {
    await prisma.$connect();
    const users = await prisma.evidence.findMany({
      include: {
        owner: true,
      },
    });
    return res.status(200).json(users);
  }

  main()
    .catch((e) => {
      throw e;
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
