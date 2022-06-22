import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import prisma from '../../../../lib/prisma';

export default function handler(req, res) {
  const { id } = req.query;

  async function mainGet() {
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

  async function mainPatch() {
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

  if (req.method === 'GET') {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader?.split('Bearer ')[1];
    try {
      jwt.verify(token, process.env.JWT_KEY);
    } catch (error) {
      return res.status(401).json('unauthorized');
    }

    mainGet()
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
    const prisma = new PrismaClient();

    mainPatch()
      .catch((e) => {
        throw e;
      })
      .finally(async () => {
        await prisma.$disconnect();
      });
  }
  return null;
}

export const config = {
  api: {
    externalResolver: true,
  },
};
