import { useMfa } from '@dynamic-labs/sdk-react-core';

export default function useMfaGuard() {
  const { authenticateDevice } = useMfa();

  async function ensureMfa(): Promise<void> {
    const code = window.prompt('Enter your 6-digit authenticator code');
    if (code === null) {
      // user hit Cancel
      const err: any = new Error('MFA_CANCELLED');
      err.code = 'MFA_CANCELLED';
      throw err;
    }
    const trimmed = code.trim();
    if (!trimmed) {
      const err: any = new Error('MFA_CANCELLED');
      err.code = 'MFA_CANCELLED';
      throw err;
    }
    await authenticateDevice({ createMfaToken: { singleUse: true }, code: trimmed });
  }

  return { ensureMfa };
}
