import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  const prisma = new PrismaClient();
  const token = req.headers.Authorization;

  async function main() {
    // Connect the client
    try {
      const verify = jwt.verify(token, process.env.JWT_KEY);
      res.status(200).json(verify);
    } catch (error) {
      res.status(401).json(error);
    }
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
