import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';
import prisma from '../../../lib/prisma';

export default function handler(req, res) {
  const RESULTS_PER_PAGE = 10;

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
        evidenceId: {
          contains: evidenceId,
        },
        stationType: Number(stationType) || undefined,
        status: status || {
          not: 'deleted',
        },
        receivedDate: receivedDateQuery(),
        policeStation: policeStation || undefined,
      };

      const total = await prisma.evidence.count({ where });
      const totalPages = Math.ceil(total / RESULTS_PER_PAGE);

      const evidences = await prisma.evidence.findMany({
        where,
        include: {
          owner: true,
        },
        take: RESULTS_PER_PAGE,
        skip: RESULTS_PER_PAGE * page,
        orderBy: {
          createdAt: 'desc',
        },
      });
      if (evidences.length === 0)
        return res.json({
          count: 0,
          total: 0,
          totalPages: 0,
          data: [],
        });
      return res.status(200).json({
        count: evidences.length,
        total,
        totalPages,
        data: evidences,
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
  return null;
}

export const config = {
  api: {
    externalResolver: true,
  },
};
