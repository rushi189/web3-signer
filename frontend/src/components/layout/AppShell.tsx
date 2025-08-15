import type { PropsWithChildren } from 'react';
import { useMemo } from 'react';
import {
  AppBar, Toolbar, Typography, Box, Container, Avatar, Stack, Chip
} from '@mui/material';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

export default function AppShell({ children }: PropsWithChildren) {
  const { user, primaryWallet, handleLogOut } = useDynamicContext();

  const address = useMemo(
    () =>
      (primaryWallet as any)?.address ??
      (primaryWallet as any)?.account?.address ??
      '',
    [primaryWallet]
  );

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'primary.main' }}>
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Web3 Signer & Verifier
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            {address && (
              <Chip
                label={`Wallet: ${address.slice(0, 6)}…${address.slice(-4)}`}
                color="secondary"
                variant="filled"
              />
            )}
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar sx={{ width: 32, height: 32 }}>
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </Avatar>
              <Typography sx={{ fontSize: 14 }}>
                {user?.email || 'User'}
              </Typography>
              <Typography
                onClick={() => handleLogOut?.()}
                sx={{ ml: 1, fontSize: 13, opacity: 0.8, cursor: 'pointer' }}
              >
                Logout
              </Typography>
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        {children}
      </Container>

      <Box component="footer" sx={{ py: 3, textAlign: 'center', opacity: 0.6 }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} Your Company
        </Typography>
      </Box>
    </Box>
  );
}
