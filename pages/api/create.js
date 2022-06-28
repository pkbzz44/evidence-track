import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const saltRounds = 10;

export default function handler(req, res) {
  const { name, password, fullName } = req?.body;
  const prisma = new PrismaClient();

  async function main() {
    try {
      await prisma.$connect();
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const user = await prisma.user.create({
        data: {
          name,
          password: hashedPassword,
          fullName,
        },
      });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  main()
    .catch((e) => {
      throw e;
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
