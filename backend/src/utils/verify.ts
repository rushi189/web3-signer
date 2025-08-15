import { verifyMessage, getAddress } from 'ethers';

export function verifyEthersSignature(message: string, signature: string) {
  const recovered = verifyMessage(message, signature);
  const signer = getAddress(recovered);
  return { isValid: true as const, signer, originalMessage: message };
}
