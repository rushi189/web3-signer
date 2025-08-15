import { verifyEthersSignature } from '../utils/crypto';

export function verifySignature(message: string, signature: string) {
  return verifyEthersSignature(message, signature);
}
