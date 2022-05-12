import { PrismaClient } from '@prisma/client';

export default function handler(req, res) {
  const prisma = new PrismaClient();

  async function main() {
    // Connect the client
    await prisma.$connect();

    const allUsers = await prisma.user.findMany();

    res.status(200).json(allUsers);

    // ... you will write your Prisma Client queries here
  }

  main()
    .catch((e) => {
      throw e;
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
