import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';

export default function handler(req, res) {
  const RESULTS_PER_PAGE = 10;

  const authorizationHeader = req.headers.authorization;
  const token = authorizationHeader?.split('Bearer ')[1];
  try {
    jwt.verify(token, process.env.JWT_KEY);
  } catch (error) {
    return res.status(401).json('unauthorized');
  }

  const prisma = new PrismaClient();

  const startDay = dayjs();
  const start = startDay.startOf('day').toISOString();
  const end = startDay.add(1, 'day').toISOString();
  async function main() {
    await prisma.$connect();

    try {
      const whereCreatedToday = {
        createdAt: {
          gte: start,
          lt: end,
        },
      };

      const whereReturned = {
        createdAt: {
          gte: start,
          lt: end,
        },
        OR: [
          {
            status: 'returnedAll',
          },
          {
            status: 'returnedPartial',
          },
        ],
      };

      const pendings = await prisma.evidence.findMany({
        where: whereCreatedToday,
        include: {
          owner: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const returns = await prisma.evidence.findMany({
        where: whereReturned,
        include: {
          owner: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      if (pendings.length === 0 && returns.length === 0)
        return res.status(404).json('not found');
      return res.status(200).json({
        count: {
          pendings: pendings.length,
          returns: returns.length,
        },
        data: {
          pendings,
          returns,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
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
