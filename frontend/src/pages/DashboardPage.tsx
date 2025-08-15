// src/pages/DashboardPage.tsx
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useMfa } from '@dynamic-labs/sdk-react-core';

import SignCard from '../../src/sections/SignCard';
import HistoryCard from '../../src/sections/HistoryCard';
import MfaCard from '../../src/sections/MfaCard';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
export default function DashboardPage() {
  const mfa: any = useMfa();
  const [checking, setChecking] = useState(true);
  const [needsMfa, setNeedsMfa] = useState(false);
  const { user } = useDynamicContext();
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const devices = await mfa.getUserDevices?.();
        if (live) {
          setNeedsMfa((devices?.length ?? 0) === 0);
          setChecking(false);
        }
      } catch {
        if (live) {
          setNeedsMfa(false);
          setChecking(false);
        }
      }
    })();
    return () => { live = false; };
  }, [mfa, user?.userId]);

  if (checking) {
    return (
      <Box sx={{ py: 6, display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (needsMfa) {
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 720px)' },
          justifyContent: 'center',
          gap: 3,
        }}
      >
        <MfaCard sx={{ height: '100%' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: 3,
        alignItems: 'stretch',
      }}
    >
    <SignCard sx={{ height: '100%', minHeight: 320 }} />
    <HistoryCard sx={{ height: '100%', minHeight: 320 }} />
    </Box>
  );
}
