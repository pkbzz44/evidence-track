import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const saltRounds = 10;

export default function handler(req, res) {
  const prisma = new PrismaClient();

  async function main() {
    // Connect the client
    await prisma.$connect();
    const user = await prisma.user.findUnique({
      where: {
        name: 'kwandaoh',
      },
    });
    const hashedPassword = user.password;
    const match = await bcrypt.compare('0899999999', hashedPassword);
    if (match) {
      const token = jwt.sign(user, process.env.JWT_KEY);
      res.status(200).json(token);
    }
    // const password = await bcrypt.hash('0899999999', saltRounds);
    // const user = await prisma.user.create({
    //   data: {
    //     name: 'kwandaoh',
    //     password,
    //   },
    // });
    res.status(401).json('Unauthorized');

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
