import { useEffect, useState } from 'react';
import {
  Card, CardHeader, CardContent, Button, Chip, Stack, Typography,
  Box, TextField
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { useMfa } from '@dynamic-labs/sdk-react-core';
import QRCode from 'qrcode';

type Props = {
  onEnrolled?: () => void;
  sx?: SxProps<Theme>;
};

export default function MfaCard({ onEnrolled, sx }: Props) {
  const mfa: any = useMfa();
  const { getUserDevices, addDevice, authenticateDevice } = mfa;

  const [devices, setDevices] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);

  const [enrolling, setEnrolling] = useState(false);
  const [secret, setSecret] = useState('');
  const [uri, setUri] = useState('');
  const [qrImg, setQrImg] = useState<string>('');
  const [otp, setOtp] = useState('');

  async function refresh() {
    try {
      const d = await getUserDevices();
      setDevices(d || []);
    } catch { }
  }
  useEffect(() => { refresh(); }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!uri) { setQrImg(''); return; }
      try {
        const img = await QRCode.toDataURL(uri, { errorCorrectionLevel: 'M', margin: 2, scale: 6 });
        if (active) setQrImg(img);
      } catch { }
    })();
    return () => { active = false; };
  }, [uri]);

  function resetEnroll() {
    setEnrolling(false);
    setSecret('');
    setUri('');
    setQrImg('');
    setOtp('');
  }

  async function onStartEnroll() {
    setBusy(true);
    try {
      const { secret, uri } = await addDevice();
      setSecret(secret);
      setUri(uri);
      setEnrolling(true);
    } catch (e: any) {
      const msg = String(e?.message || '');
      if (msg.toLowerCase().includes('multiple mfa devices')) {
        alert('Only one authenticator is supported. Remove the existing one to add a new device.');
      } else {
        alert(msg || 'Failed to start enrollment');
      }
    } finally {
      setBusy(false);
    }
  }

  async function onVerify() {
    const code = otp.trim();
    if (!code) return;
    setBusy(true);
    try {
      await authenticateDevice({ code });
      await refresh();
      resetEnroll();
      alert('Authenticator added!');
      onEnrolled?.();
    } catch (e: any) {
      alert(e?.message || 'Verification failed');
    } finally {
      setBusy(false);
    }
  }

  const hasDevice = devices.length > 0;

  return (
    <Card sx={{ height: '100%', ...sx }}>
      <CardHeader
        title={enrolling || !hasDevice ? 'Set up Authenticator' : 'Multi-factor Authentication'}
        subheader={hasDevice ? 'Configured devices' : undefined}
      />

      <CardContent>
        {}
        {hasDevice && !enrolling && (
          <>
            <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
              {devices.map((d: any) => (
                <Chip key={d.id} label={`${(d.type || 'totp').toUpperCase()} • ${d.id.slice(0, 6)}…`} />
              ))}
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              You already have an authenticator. Remove it first to add another.
            </Typography>
          </>
        )}

        {}
        {!hasDevice && !enrolling && (
          <>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              No authenticators yet. Add one to protect signing.
            </Typography>
            <Button variant="contained" onClick={onStartEnroll} disabled={busy}>
              Add Authenticator
            </Button>
          </>
        )}

        {}
        {enrolling && (
          <Box sx={{ display: 'grid', gap: 2 }}>
            <Typography>
              Scan this QR in Google Authenticator / 1Password, then enter the 6-digit code.
            </Typography>

            <Box
              sx={{
                width: 240, height: 240, borderRadius: 2, border: '1px solid',
                borderColor: 'divider', display: 'grid', placeItems: 'center', overflow: 'hidden'
              }}
            >
              {qrImg ? <img src={qrImg} alt="MFA QR" width={240} height={240} /> : 'Generating QR…'}
            </Box>

            <Typography variant="body2" sx={{ mt: 1 }}>
              Secret:&nbsp;<code>{secret}</code>
            </Typography>

            <TextField
              label="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 6 }}
              autoFocus
            />

            <Stack direction="row" spacing={1}>
              <Button variant="contained" onClick={onVerify} disabled={busy || otp.trim().length < 6}>
                Verify
              </Button>
              <Button variant="text" onClick={resetEnroll} disabled={busy}>
                Cancel
              </Button>
            </Stack>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
