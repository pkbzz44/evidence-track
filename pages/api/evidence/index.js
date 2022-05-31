import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  const {
    evidenceId,
    stationType,
    status,
    receivedStartDate,
    receivedEndDate,
    policeStation,
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
    if (!receivedStartDate && !receivedEndDate) return undefined;
    if (receivedStartDate && !receivedEndDate)
      return {
        gte: receivedStartDate,
      };
    return {
      gte: receivedStartDate,
      lt: receivedEndDate,
    };
  };

  async function main() {
    await prisma.$connect();
    try {
      const users = await prisma.evidence.findMany({
        where: {
          evidenceId: evidenceId || undefined,
          stationType: Number(stationType) || undefined,
          status: status || {
            not: 'deleted',
          },
          receivedDate: receivedDateQuery(),
          policeStation: policeStation || undefined,
        },
        include: {
          owner: true,
        },
      });
      if (users.length === 0) return res.status(404).json('not found');
      return res.status(200).json({
        count: users.length,
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
