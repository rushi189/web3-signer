import { useEmbeddedSigner } from '../services/dynamic';

export default function useSigner() {
  const { getAddress, signMessage } = useEmbeddedSigner();
  return { getAddress, signMessage };
}
