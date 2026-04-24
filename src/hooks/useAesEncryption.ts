import { useState, useEffect, useRef } from 'react';
import { aesEncrypt, aesDecrypt } from '../lib/aes';

export type AesMode = 'encrypt' | 'decrypt';
export type AesStatus = 'idle' | 'processing' | 'success' | 'error';

export function useAesEncryption() {
  const [text, setText] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [mode, setMode] = useState<AesMode>('encrypt');
  const [result, setResult] = useState('');
  const [status, setStatus] = useState<AesStatus>('idle');
  const [error, setError] = useState('');

  // Debounce ref so rapid typing doesn't spam crypto operations
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!text || !passphrase) {
      setResult('');
      setStatus('idle');
      setError('');
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setStatus('processing');
      setError('');
      try {
        const output =
          mode === 'encrypt'
            ? await aesEncrypt(text, passphrase)
            : await aesDecrypt(text, passphrase);
        setResult(output);
        setStatus('success');
      } catch {
        setResult('');
        setStatus('error');
        setError(
          mode === 'decrypt'
            ? 'Decryption failed — wrong passphrase or corrupted ciphertext.'
            : 'Encryption failed unexpectedly.',
        );
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [text, passphrase, mode]);

  return { text, setText, passphrase, setPassphrase, mode, setMode, result, status, error };
}
