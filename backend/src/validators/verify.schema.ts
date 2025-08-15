import { z } from 'zod';

export const VerifyBody = z.object({
  message: z.string().min(1, 'message is required'),
  signature: z.string().regex(/^0x[0-9a-fA-F]+$/, 'signature must be 0x-hex'),
});
export type VerifyBodyType = z.infer<typeof VerifyBody>;
