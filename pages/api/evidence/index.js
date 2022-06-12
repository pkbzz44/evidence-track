import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';

export default function handler(req, res) {
  const RESULTS_PER_PAGE = 1;

  const {
    evidenceId,
    stationType,
    status,
    receivedStartDate,
    receivedEndDate,
    policeStation,
    page = 0,
  } = req?.query || {};
  const authorizationHeader = req.headers.authorization;
  const token = authorizationHeader?.split('Bearer ')[1];
  try {
    jwt.verify(token, process.env.JWT_KEY);
  } catch (error) {
    return res.status(401).json('unauthorized');
  }

  const prisma = new PrismaClient();

  const receivedDateQuery = () => {
    // no input
    if (!receivedStartDate && !receivedEndDate) {
      return undefined;
    }
    // only startdate
    if (receivedStartDate && !receivedEndDate) {
      return {
        gte: receivedStartDate,
      };
    }
    // only enddate
    if (!receivedStartDate && receivedEndDate) {
      return {
        lt: dayjs(receivedEndDate).add(1, 'day').toISOString(),
      };
    }
    // both
    return {
      gte: receivedStartDate,
      lt: dayjs(receivedEndDate).add(1, 'day').toISOString(),
    };
  };

  async function main() {
    await prisma.$connect();

    try {
      const where = {
        evidenceId: evidenceId || undefined,
        stationType: Number(stationType) || undefined,
        status: status || {
          not: 'deleted',
        },
        receivedDate: receivedDateQuery(),
        policeStation: policeStation || undefined,
      };

      const total = await prisma.evidence.count({ where });
      const totalPages = Math.ceil(total / RESULTS_PER_PAGE);

      const users = await prisma.evidence.findMany({
        where,
        include: {
          owner: true,
        },
        take: RESULTS_PER_PAGE,
        skip: RESULTS_PER_PAGE * page,
      });
      if (users.length === 0) return res.status(404).json('not found');
      return res.status(200).json({
        count: users.length,
        total,
        totalPages,
        data: users,
      });
    } catch (error) {
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
