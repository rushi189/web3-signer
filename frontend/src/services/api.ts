import axios from 'axios';

const baseURL = import.meta.env.VITE_BACKEND_URL as string;

export const api = axios.create({
  baseURL,
  headers: { 'content-type': 'application/json' }
});

export async function verifySignature(payload: { message: string; signature: string }) {
  const { data } = await api.post('/verify-signature', payload);
  return data as { isValid: boolean; signer?: string; originalMessage?: string; error?: unknown };
}
