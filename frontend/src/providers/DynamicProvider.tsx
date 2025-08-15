import type { PropsWithChildren } from 'react';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';

export default function DynamicProvider({ children }: PropsWithChildren) {
  const environmentId = import.meta.env.VITE_DYNAMIC_ENV_ID as string;

  if (!environmentId) {
    console.error('Missing VITE_DYNAMIC_ENV_ID in .env');
  }

  return (
    <DynamicContextProvider
      settings={{
        environmentId,
        walletConnectors: [EthereumWalletConnectors],
        initialAuthenticationMode: 'connect-only',
      }}
    >
      {children}
    </DynamicContextProvider>
  );
}
