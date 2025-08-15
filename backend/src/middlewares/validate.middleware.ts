import { AnyZodObject } from 'zod';
import { RequestHandler } from 'express';

export const validate =
  (schema: AnyZodObject): RequestHandler =>
  (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ isValid: false, error: parsed.error.flatten() });
    }
    (req as any).parsed = parsed.data;
    next();
  };
