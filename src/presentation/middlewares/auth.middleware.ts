import { NextFunction, Request, Response } from "express";
import { JWTAdapter } from "../../config";
import { prisma } from "../../data/mysql";
import { UserEntity } from "../../domain";

export class AuthMiddleware {
  static async validateJWT(req: Request, res: Response, next: NextFunction) {
    const authorization = req.header('Authorization');
    if (!authorization) return res.status(400).json({ error: 'No token provided' });
    if (!authorization.startsWith('Bearer ')) return res.status(401).json({ error: 'Invalid token' });

    const token = authorization.split(' ')[1];

    try {
      const payload = await JWTAdapter.validateToken<{ id: string }>(token);
      if (!payload) return res.status(401).json({ error: 'Invalid token' });

      const user = await prisma.user.findFirst({ where: { id: payload.id } });
      if (!user) return res.status(401).json({ error: 'Invalid token - User not found' });

      req.body.user = UserEntity.fromObject(user);
      next();
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}