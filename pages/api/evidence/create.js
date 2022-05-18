import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  const authorizationHeader = req.headers.authorization;
  const token = authorizationHeader?.split('Bearer ')[1];
  const decoded = jwt.decode(token);
  const { id } = decoded;
  const prisma = new PrismaClient();
  const { body } = req;

  async function main() {
    await prisma.$connect();
    const newEvidence = await prisma.evidence.create({
      data: { ...body, ownerId: id },
    });
    res.status(200).json(newEvidence);
  }

  main()
    .catch((e) => {
      throw e;
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
