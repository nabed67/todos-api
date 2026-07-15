import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, _res: Response, next: NextFunction) {
  console.log(
    `[${req.method.toUpperCase()}] - ${new Date().toISOString()} - ${req.originalUrl}`,
  );

  next();
}
