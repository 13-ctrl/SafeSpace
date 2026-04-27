import React from 'react';
import { useAesEncryption } from '../hooks/useAesEncryption';
import { cn } from '../lib/utils';
import { ShieldCheck, Copy, Check, Eye, EyeOff, Loader2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function AesTool() {
  const { text, setText, passphrase, setPassphrase, mode, setMode, result, status, error } =
    useAesEncryption();

  const [copied, setCopied] = React.useState(false);
  const [showPassphrase, setShowPassphrase] = React.useState(false);

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusColor = {
    idle: 'text-security-muted',
    processing: 'text-security-accent',
    success: 'text-emerald-400',
    error: 'text-red-400',
  }[status];

  return (
    <div className="p-6 bg-security-card border border-security-border rounded-xl shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-security-accent/10 rounded-lg">
            <ShieldCheck className="w-6 h-6 text-security-accent" />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">AES-256-GCM</h2>
            <p className="text-sm text-security-muted font-mono uppercase tracking-wider">
              Module: CRYPTO-V2
            </p>
          </div>
        </div>

        {/* Encrypt / Decrypt toggle */}
        <div className="flex bg-security-bg p-1 rounded-lg border border-security-border">
          <button
            onClick={() => setMode('encrypt')}
            className={cn(
              'px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-md transition-all',
              mode === 'encrypt'
                ? 'bg-security-accent text-white shadow-lg'
                : 'text-security-muted hover:text-security-text',
            )}
          >
            Encrypt
          </button>
          <button
            onClick={() => setMode('decrypt')}
            className={cn(
              'px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-md transition-all',
              mode === 'decrypt'
                ? 'bg-security-accent text-white shadow-lg'
                : 'text-security-muted hover:text-security-text',
            )}
          >
            Decrypt
          </button>
        </div>
      </div>

      <div className="space-y-5">
        {/* Passphrase */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-security-muted uppercase tracking-widest">
            Passphrase (Secret Key)
          </label>
          <div className="relative">
            <input
              type={showPassphrase ? 'text' : 'password'}
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Enter a strong passphrase..."
              className="w-full bg-security-bg border border-security-border rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-security-accent/40 transition-all font-mono text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassphrase((v) => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-security-muted hover:text-security-text transition-colors"
            >
              {showPassphrase ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Input */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-security-muted uppercase tracking-widest">
            {mode === 'encrypt' ? 'Plaintext Input' : 'Ciphertext Input'}
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              mode === 'encrypt'
                ? 'Enter text to encrypt...'
                : 'Paste Base64 ciphertext to decrypt...'
            }
            className="w-full h-28 bg-security-bg border border-security-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-security-accent/40 transition-all font-mono text-sm resize-none"
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className={cn('text-xs font-mono uppercase tracking-widest flex items-center gap-2', statusColor)}>
              {status === 'processing' && (
                <Loader2 className="w-3 h-3 animate-spin" />
              )}
              {status === 'error' && <AlertTriangle className="w-3 h-3" />}
              {status === 'idle' && 'Result Output'}
              {status === 'processing' && 'Processing…'}
              {status === 'success' && 'Result Output'}
              {status === 'error' && 'Error'}
            </label>
            <button
              onClick={handleCopy}
              disabled={!result}
              className="flex items-center gap-1.5 text-xs font-mono text-security-accent hover:text-violet-300 transition-colors disabled:opacity-40"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied!' : 'Copy Result'}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {status === 'error' ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="w-full min-h-[100px] bg-red-500/5 border border-dashed border-red-500/30 rounded-lg px-4 py-3 font-mono text-sm text-red-400 flex items-center"
              >
                {error}
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="w-full min-h-[100px] bg-security-bg/50 border border-dashed border-security-border rounded-lg px-4 py-3 font-mono text-sm break-all text-security-text/90"
              >
                {result || (
                  <span className="text-security-muted italic">
                    {passphrase && text ? 'Computing…' : 'Awaiting input…'}
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
