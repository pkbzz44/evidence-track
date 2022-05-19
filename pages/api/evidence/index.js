import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  const authorizationHeader = req.headers.authorization;
  const token = authorizationHeader?.split('Bearer ')[1];
  try {
    jwt.verify(token, process.env.JWT_KEY);
  } catch (error) {
    return res.status(401).json('unauthorized');
  }

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
