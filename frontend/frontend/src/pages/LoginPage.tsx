import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
  GlobalStyles,
  InputAdornment,
} from '@mui/material';
import MailRounded from '@mui/icons-material/MailRounded';
import KeyRounded from '@mui/icons-material/KeyRounded';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import { useNavigate } from 'react-router-dom';

// ⬇️ your headless email OTP hook (names from your earlier code)
import { useHeadlessEmailAuth } from '../services/dynamic';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [err, setErr] = useState<string | undefined>();
  const navigate = useNavigate();

  const { startEmailLogin, verifyEmailOtp } = useHeadlessEmailAuth();

  const onSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(undefined);
    setBusy(true);
    try {
      await startEmailLogin(email);
      setStep('otp');
    } catch (e: any) {
      setErr(e?.message || 'Failed to send OTP');
    } finally {
      setBusy(false);
    }
  };

  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(undefined);
    setBusy(true);
    try {
      await verifyEmailOtp(email, otp);
      // success → go to app
      navigate('/');
    } catch (e: any) {
      setErr(e?.message || 'Invalid code');
    } finally {
      setBusy(false);
    }
  };

  // styles reused for both inputs
  const inputSx = {
    '& .MuiOutlinedInput-root': {
      height: 56,
      borderRadius: 999,
      color: '#fff',
      '& fieldset': { borderColor: 'rgba(255,255,255,.8)' },
      '&:hover fieldset': { borderColor: '#fff' },
      '&.Mui-focused fieldset': { borderColor: '#29e3cf' },
    },
    '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,.8)' },
  };

  return (
    <>
      {/* Kill Chrome/Edge autofill white background so pills stay consistent */}
      <GlobalStyles
        styles={{
          'input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus': {
            WebkitTextFillColor: '#fff',
            WebkitBoxShadow: '0 0 0 1000px rgba(255,255,255,0.05) inset',
            transition: 'background-color 9999s ease-out, color 0s',
            borderRadius: 999,
          },
        }}
      />

      <Box
        sx={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          // reference purple
          background: '#5b007a',
          // subtle vignette for depth
          backgroundImage:
            'radial-gradient(ellipse at center, rgba(255,255,255,0.06) 0%, rgba(91,0,122,0) 60%)',
        }}
      >
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Stack spacing={4} alignItems="center">
            {/* Title & subtitle */}
            <Stack spacing={1}>
              <Typography
                variant="h3"
                sx={{
                  color: '#1fe3cd',
                  fontWeight: 800,
                  letterSpacing: 4,
                }}
              >
                WELCOME
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,.9)' }}>
                Enter your email to receive a one-time passcode.
              </Typography>
            </Stack>

            {/* Form */}
            {step === 'email' ? (
              <Box component="form" onSubmit={onSendOtp} sx={{ width: '100%' }}>
                <Stack spacing={3} alignItems="center">
                  <TextField
                    fullWidth
                    autoFocus
                    type="email"
                    placeholder="EMAIL ADDRESS"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MailRounded sx={{ color: '#fff' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={inputSx}
                  />

                  <Button
                    type="submit"
                    size="large"
                    disabled={busy || !email.trim()}
                    startIcon={<CheckCircleRounded />}
                    sx={{
                      px: 5,
                      height: 50,
                      borderRadius: 999,
                      color: '#222',
                      bgcolor: '#1fe3cd',
                      fontWeight: 800,
                      '&:hover': { bgcolor: '#19ccb9' },
                    }}
                  >
                    SIGN IN
                  </Button>

                  {err && (
                    <Typography sx={{ color: '#ffd6d6' }}>{err}</Typography>
                  )}
                </Stack>
              </Box>
            ) : (
              <Box component="form" onSubmit={onVerify} sx={{ width: '100%' }}>
                <Stack spacing={3} alignItems="center">
                  <TextField
                    fullWidth
                    autoFocus
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="ENTER 6-DIGIT CODE"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    autoComplete="one-time-code"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <KeyRounded sx={{ color: '#fff' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={inputSx}
                  />

                  <Button
                    type="submit"
                    size="large"
                    disabled={busy || otp.trim().length < 6}
                    startIcon={<CheckCircleRounded />}
                    sx={{
                      px: 5,
                      height: 50,
                      borderRadius: 999,
                      color: '#222',
                      bgcolor: '#1fe3cd',
                      fontWeight: 800,
                      '&:hover': { bgcolor: '#19ccb9' },
                    }}
                  >
                    VERIFY & SIGN IN
                  </Button>

                  <Typography
                    onClick={() => setStep('email')}
                    sx={{
                      color: 'rgba(255,255,255,.9)',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    Use a different email
                  </Typography>

                  {err && (
                    <Typography sx={{ color: '#ffd6d6' }}>{err}</Typography>
                  )}
                </Stack>
              </Box>
            )}

            {/* Footer */}
            <Typography sx={{ color: 'rgba(255,255,255,.7)', mt: 6 }} variant="caption">
              © {new Date().getFullYear()} Web3 Signer — All rights reserved
            </Typography>
          </Stack>
        </Container>
      </Box>
    </>
  );
}
