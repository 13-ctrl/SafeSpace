import { useState, useEffect, useRef } from 'react';
import { generateHmac, verifyHmac } from '../lib/hmac';

export type HmacMode = 'generate' | 'verify';
export type HmacStatus = 'idle' | 'processing' | 'success' | 'error';

export function useHmac() {
  const [mode, setMode] = useState<HmacMode>('generate');
  const [message, setMessage] = useState('');
  const [secret, setSecret] = useState('');
  const [macToVerify, setMacToVerify] = useState('');
  
  const [result, setResult] = useState('');
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [status, setStatus] = useState<HmacStatus>('idle');

  const debounceTimer = useRef<number>();

  useEffect(() => {
    // Clear previous timer on every keystroke
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (!message || !secret) {
      setResult('');
      setIsVerified(null);
      setStatus('idle');
      return;
    }

    if (mode === 'verify' && macToVerify.length !== 64) {
      setIsVerified(null);
      setStatus('idle');
      return;
    }

    setStatus('processing');

    // Wait 300ms after the last keystroke before running crypto ops
    debounceTimer.current = window.setTimeout(async () => {
      try {
        if (mode === 'generate') {
          const mac = await generateHmac(message, secret);
          setResult(mac);
          setStatus('success');
        } else {
          const valid = await verifyHmac(message, secret, macToVerify);
          setIsVerified(valid);
          setStatus('success');
        }
      } catch (err) {
        setStatus('error');
      }
    }, 300);

    return () => clearTimeout(debounceTimer.current);
  }, [message, secret, macToVerify, mode]);

  return {
    mode, setMode,
    message, setMessage,
    secret, setSecret,
    macToVerify, setMacToVerify,
    result, isVerified, status
  };
}
