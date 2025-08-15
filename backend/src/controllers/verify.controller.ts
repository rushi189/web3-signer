import { Request, Response } from 'express';
import { verifySignature } from '../services/verify.service';
import { VerifyBodyType } from '../validators/verify.schema';

export function verifyController(req: Request, res: Response) {
  const { message, signature } = (req as any).parsed as VerifyBodyType;
  try {
    const result = verifySignature(message, signature);
    return res.json(result);
  } catch {
    return res.json({ isValid: false });
  }
}
