import { useState, useCallback } from 'react';
import { generateRsaKeyPair, hybridEncrypt, hybridDecrypt, type RsaKeyPair } from '../lib/rsa';

export type RsaMode = 'encrypt' | 'decrypt';
export type RsaStatus = 'idle' | 'generating' | 'processing' | 'success' | 'error';

export function useRsaEncryption() {
  const [keyPair, setKeyPair] = useState<RsaKeyPair | null>(null);
  const [mode, setMode] = useState<RsaMode>('encrypt');
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [status, setStatus] = useState<RsaStatus>('idle');
  const [error, setError] = useState('');

  const generateKeys = useCallback(async () => {
    setStatus('generating');
    setError('');
    setResult('');
    try {
      const kp = await generateRsaKeyPair();
      setKeyPair(kp);
      setStatus('idle');
    } catch {
      setStatus('error');
      setError('Key generation failed unexpectedly.');
    }
  }, []);

  const runEncrypt = useCallback(async () => {
    if (!keyPair || !text) return;
    setStatus('processing');
    setError('');
    try {
      const out = await hybridEncrypt(text, keyPair.publicKeyB64);
      setResult(out);
      setStatus('success');
    } catch {
      setResult('');
      setStatus('error');
      setError('Encryption failed. Ensure a key pair has been generated.');
    }
  }, [keyPair, text]);

  const runDecrypt = useCallback(async () => {
    if (!keyPair || !text) return;
    setStatus('processing');
    setError('');
    try {
      const out = await hybridDecrypt(text, keyPair.privateKeyB64);
      setResult(out);
      setStatus('success');
    } catch {
      setResult('');
      setStatus('error');
      setError('Decryption failed — wrong key or corrupted ciphertext.');
    }
  }, [keyPair, text]);

  const reset = useCallback(() => {
    setText('');
    setResult('');
    setStatus('idle');
    setError('');
  }, []);

  return {
    keyPair,
    mode,
    setMode,
    text,
    setText,
    result,
    status,
    error,
    generateKeys,
    runEncrypt,
    runDecrypt,
    reset,
  };
}
