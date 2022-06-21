import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  const authorizationHeader = req.headers.authorization;
  const token = authorizationHeader?.split('Bearer ')[1];
  const verify = jwt.verify(token, process.env.JWT_KEY);
  const decoded = jwt.decode(token);
  const { id } = decoded;
  const prisma = new PrismaClient();
  const { body } = req;
  const now = new Date();

  async function main() {
    if (!verify) {
      return res.status(401).json('unauthorized');
    }
    await prisma.$connect();
    try {
      const newEvidence = await prisma.evidence.create({
        data: { ...body, ownerId: id, createdAt: now, updatedAt: now },
      });
      return res.status(200).json(newEvidence);
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
