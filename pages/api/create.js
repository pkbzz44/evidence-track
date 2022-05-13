import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const saltRounds = 10;

export default function handler(req, res) {
  const prisma = new PrismaClient();

  async function main() {
    // Connect the client
    await prisma.$connect();
    let password = '0899999999';
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      const user = await prisma.user.create({
        data: {
          name: 'kwandaoh',
          password: hash,
        },
      });
      res.status(200).json(user);
    });

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
