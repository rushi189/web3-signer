import { useState } from 'react';
import {
  Card, CardHeader, CardContent, TextField, Button, Stack, Typography
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import useSigner from '../hooks/useSigner';
import { verifySignature } from '../services/api';
import useSignHistory from '../state/signHistory';
import useMfaGuard from '../hooks/useMfaGuard';

type Props = { sx?: SxProps<Theme> };

export default function SignCard({ sx }: Props) {
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const { signMessage } = useSigner();
  const { add } = useSignHistory();
  const { ensureMfa } = useMfaGuard();

  async function onSign() {
    const message = msg.trim();
    if (!message) return;

    setBusy(true);
    try {
      // local OTP prompt; nothing sent to backend
      await ensureMfa();

      const signature = await signMessage(message);
      const isValid = await verifySignature({ message, signature });

      add({
        id: crypto.randomUUID(),
        message,
        signature,
        verified: isValid,
        createdAt: Date.now(),
      });

      alert('Signed & verified ✅');
    } catch (e: any) {
      console.error(e);
      alert(e?.message || 'Signing failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card sx={{ height: '100%', ...sx }}>
      <CardHeader
        title="Sign & Verify"
        titleTypographyProps={{ variant: 'h5', fontWeight: 700 }}
      />
      <CardContent>
        <Stack spacing={2}>
          <TextField
            label="Message"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !busy) onSign(); }}
            fullWidth
            autoComplete="off"
          />
          <Button
            variant="contained"
            size="large"
            onClick={onSign}
            disabled={!msg.trim() || busy}
          >
            {busy ? 'Signing…' : 'Sign & Verify'}
          </Button>
          <Typography variant="caption" color="text.secondary">
            We never store your private key. The signature is verified server-side.
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
