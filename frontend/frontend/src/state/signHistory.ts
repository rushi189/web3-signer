import { useMemo, useSyncExternalStore, useCallback } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

export type SignHistoryItem = {
  id: string;
  message: string;
  signature: string;
  verified: boolean;
  createdAt: number;
};

type Store = {
  map: Map<string, SignHistoryItem[]>;
  subs: Set<() => void>;
};

const store: Store = {
  map: new Map(),
  subs: new Set(),
};

function notify() {
  for (const s of store.subs) s();
}

function subscribe(cb: () => void) {
  store.subs.add(cb);
  return () => store.subs.delete(cb);
}

function read(key: string): SignHistoryItem[] {
  if (!store.map.has(key)) {
    try {
      const raw = localStorage.getItem(key);
      store.map.set(key, raw ? (JSON.parse(raw) as SignHistoryItem[]) : []);
    } catch {
      store.map.set(key, []);
    }
  }
  return store.map.get(key)!;
}

function write(key: string, items: SignHistoryItem[]) {
  store.map.set(key, items);
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch {}
  notify();
}

function makeUserKey(user: any, primaryWallet: any) {
  const uid =
    user?.userId ||
    user?.email ||
    primaryWallet?.address ||
    'anonymous';
  const env = (window as any).__DYNAMIC_ENV_ID__ || '';
  return `sign-history:${env}:${uid}`;
}

export default function useSignHistory() {
  const { user, primaryWallet } = useDynamicContext();

  const key = useMemo(
    () => makeUserKey(user, primaryWallet),
    [user?.userId, user?.email, primaryWallet?.address]
  );

  useMemo(() => {
    try {
      const legacy = localStorage.getItem('sign-history');
      if (legacy && !localStorage.getItem(key)) {
        localStorage.setItem(key, legacy);
      }
      localStorage.removeItem('sign-history');
    } catch {}
  }, [key]);

  const list = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => read(key)
  );

  const add = useCallback(
    (entry: SignHistoryItem) => {
      const next = [entry, ...read(key)];
      write(key, next);
    },
    [key]
  );

  const clear = useCallback(() => {
    write(key, []);
    try {
      localStorage.removeItem(key);
    } catch {}
  }, [key]);

  return { list, add, clear };
}
