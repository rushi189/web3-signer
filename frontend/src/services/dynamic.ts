import {
  useDynamicContext,
  useIsLoggedIn,
  useConnectWithOtp,
  useMfa,
} from '@dynamic-labs/sdk-react-core';

export function useHeadlessEmailAuth() {
  const { sdkHasLoaded, user, handleLogOut  } = useDynamicContext();
  const isLoggedIn = useIsLoggedIn();
  const { connectWithEmail, verifyOneTimePassword } = useConnectWithOtp();

  async function startEmailLogin(email: string) {
    if (!sdkHasLoaded) throw new Error('Dynamic SDK not loaded yet');
    const toSend = email.trim();
    if (!toSend) throw new Error('Email required');
    await connectWithEmail(toSend);
  }

  async function verifyEmailOtp(_email: string, otp: string) {
    if (!sdkHasLoaded) throw new Error('Dynamic SDK not loaded yet');
    await verifyOneTimePassword(otp.trim());
  }

  async function logout() {
    try {
      await handleLogOut?.();
    } finally {
      try { localStorage.removeItem('sign-history'); } catch {}
      window.location.href = '/';
    }
  }

  return {
    user,
    isLoggedIn,
    sdkReady: sdkHasLoaded,
    startEmailLogin,
    verifyEmailOtp,
    logout,
  };
}

export function useEmbeddedSigner() {
  const { primaryWallet } = useDynamicContext();

  const toHex = (utf8: string) =>
    '0x' +
    Array.from(new TextEncoder().encode(utf8))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

  async function getProvider(): Promise<any | undefined> {
    const w: any = primaryWallet as any;
    const c: any = w?.connector;

    // try many places + lazy getters
    if (c?.provider) return c.provider;
    if (typeof c?.getProvider === 'function') return await c.getProvider().catch(() => undefined);
    if (w?.provider) return w.provider;
    if (typeof w?.getProvider === 'function') return await w.getProvider().catch(() => undefined);
    // last resort: window.ethereum (useful in dev)
    return (window as any).ethereum;
  }

  async function getAddress(): Promise<string> {
    const w: any = primaryWallet as any;
    const direct = w?.address ?? w?.account?.address ?? '';
    if (direct) return direct;

    const provider = await getProvider();
    if (provider?.request) {
      try {
        let acc: string[] = await provider.request({ method: 'eth_accounts' });
        if (!acc?.[0]) acc = await provider.request({ method: 'eth_requestAccounts' });
        if (acc?.[0]) return acc[0];
      } catch {}
    }
    return '';
  }

  function isUserRejected(e: any) {
    const code = e?.code ?? e?.error?.code;
    const msg = (e?.message || '').toLowerCase();
    return code === 4001 || msg.includes('user rejected') || msg.includes('rejected the request');
  }

async function signMessage(message: string): Promise<string> {
  if (!primaryWallet) throw new Error('No wallet connected');

  const w: any = primaryWallet as any;
  const c: any = w?.connector;

  const address = await getAddress();
  if (!address) throw new Error('No address available to sign with');

  if (typeof c?.signMessage === 'function') {
    try { return await c.signMessage(message); } catch (e) {
      if (isUserRejected(e)) throw new Error('USER_REJECTED');
      try { return await c.signMessage({ message }); } catch (e2) {
        if (isUserRejected(e2)) throw new Error('USER_REJECTED');
      }
    }
  }

  if (typeof w?.signMessage === 'function') {
    try { return await w.signMessage(message); } catch (e) {
      if (isUserRejected(e)) throw new Error('USER_REJECTED');
      try { return await w.signMessage({ message }); } catch (e2) {
        if (isUserRejected(e2)) throw new Error('USER_REJECTED');
      }
    }
  }

  if (typeof c?.getWalletClient === 'function') {
    try {
      const wc = await c.getWalletClient();
      if (wc?.signMessage) return await wc.signMessage({ account: address as any, message });
    } catch {}
  }
  if (typeof w?.getWalletClient === 'function') {
    try {
      const wc = await w.getWalletClient();
      if (wc?.signMessage) return await wc.signMessage({ account: address as any, message });
    } catch {}
  }

  if (typeof c?.getSigner === 'function') {
    try {
      const signer = await c.getSigner();
      if (signer?.signMessage) return await signer.signMessage(message);
    } catch {}
  }
  if (typeof w?.getSigner === 'function') {
    try {
      const signer = await w.getSigner();
      if (signer?.signMessage) return await signer.signMessage(message);
    } catch {}
  }

  const provider: any =
    c?.provider ??
    (typeof c?.getProvider === 'function' ? await c.getProvider() : undefined) ??
    w?.provider ??
    (typeof w?.getProvider === 'function' ? await w.getProvider() : undefined) ??
    (window as any).ethereum;

  const toHex = (utf8: string) =>
    '0x' + Array.from(new TextEncoder().encode(utf8)).map(b => b.toString(16).padStart(2, '0')).join('');

  if (provider?.request) {
    try {
      return await provider.request({ method: 'personal_sign', params: [message, address] });
    } catch (e1) {
      if (isUserRejected(e1)) throw new Error('USER_REJECTED');
      try {
        return await provider.request({ method: 'personal_sign', params: [toHex(message), address] });
      } catch (e2) {
        if (isUserRejected(e2)) throw new Error('USER_REJECTED');
        try {
          return await provider.request({ method: 'eth_sign', params: [address, toHex(message)] });
        } catch (e3) {
          if (isUserRejected(e3)) throw new Error('USER_REJECTED');
          throw e3;
        }
      }
    }
  }

  console.error('[sign] wallet keys:', Object.keys(w || {}));
  console.error('[sign] connector keys:', Object.keys((w?.connector as any) || {}));
  throw new Error('No signing route found (no viem signer, ethers signer, or provider)');
}
  return { getAddress, signMessage };
}

export function useMfaApi() {
  return useMfa();
}
