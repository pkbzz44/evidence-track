import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader?.split('Bearer ')[1];
    try {
      jwt.verify(token, process.env.JWT_KEY);
    } catch (error) {
      return res.status(401).json('unauthorized');
    }
    const { id } = req.query;
    const prisma = new PrismaClient();

    async function main() {
      await prisma.$connect();
      try {
        const user = await prisma.evidence.findUnique({
          where: {
            id,
          },
        });
        return res.status(200).json(user);
      } catch (err) {
        return res.status(404).json('id not found');
      }
    }

    main()
      .catch((e) => {
        throw e;
      })
      .finally(async () => {
        await prisma.$disconnect();
      });
  } else if (req.method === 'PATCH') {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader?.split('Bearer ')[1];
    try {
      jwt.verify(token, process.env.JWT_KEY);
    } catch (error) {
      return res.status(401).json('unauthorized');
    }
    const { id } = req.query;
    const prisma = new PrismaClient();

    async function main() {
      await prisma.$connect();
      try {
        const user = await prisma.evidence.update({
          where: {
            id,
          },
          data: {
            ...req.body,
            updatedAt: new Date(),
          },
        });
        return res.status(200).json(user);
      } catch (err) {
        return res.status(404).json('id not found');
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
}
