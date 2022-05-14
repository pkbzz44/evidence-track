import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const saltRounds = 10;

export default function handler(req, res) {
  const { name, password } = req?.body;
  const prisma = new PrismaClient();

  async function main() {
    await prisma.$connect();
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await prisma.user.create({
      data: {
        name,
        password: hashedPassword,
      },
    });
    res.status(200).json(user);
  }

  main()
    .catch((e) => {
      throw e;
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
