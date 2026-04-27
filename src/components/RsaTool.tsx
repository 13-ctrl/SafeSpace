import React from 'react';
import { useRsaEncryption } from '../hooks/useRsaEncryption';
import { cn } from '../lib/utils';
import {
  KeyRound,
  Copy,
  Check,
  Loader2,
  AlertTriangle,
  RefreshCw,
  LockKeyhole,
  UnlockKeyhole,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ─── Small helper: truncated key display ─────────────────────────────────────
function KeyDisplay({ label, value, color }: { label: string; value: string; color: string }) {
  const [expanded, setExpanded] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const preview = value.slice(0, 40) + '…';

  return (
    <div className={`p-3 rounded-lg border ${color} bg-security-bg/60`}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-mono uppercase tracking-widest text-security-muted">
          {label}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[10px] font-mono text-security-muted hover:text-security-text transition-colors"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-security-muted hover:text-security-text transition-colors"
          >
            <ChevronDown
              className={cn('w-3.5 h-3.5 transition-transform', expanded && 'rotate-180')}
            />
          </button>
        </div>
      </div>
      <p className="font-mono text-[11px] text-security-text/70 break-all leading-relaxed">
        {expanded ? value : preview}
      </p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function RsaTool() {
  const {
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
  } = useRsaEncryption();

  const [resultCopied, setResultCopied] = React.useState(false);

  const handleResultCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setResultCopied(true);
    setTimeout(() => setResultCopied(false), 2000);
  };

  const handleModeChange = (m: 'encrypt' | 'decrypt') => {
    setMode(m);
    reset();
  };

  const isRunning = status === 'processing' || status === 'generating';
  const canRun = !!keyPair && !!text && !isRunning;

  const statusColor = {
    idle: 'text-security-muted',
    generating: 'text-security-accent',
    processing: 'text-sky-400',
    success: 'text-emerald-400',
    error: 'text-red-400',
  }[status];

  return (
    <div className="p-6 bg-security-card border border-security-border rounded-xl shadow-2xl">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-security-accent/10 rounded-lg">
            <KeyRound className="w-6 h-6 text-security-accent" />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">RSA Hybrid</h2>
            <p className="text-sm text-security-muted font-mono uppercase tracking-wider">
              Module: CRYPTO-V3
            </p>
          </div>
        </div>

        {/* Encrypt / Decrypt toggle */}
        <div className="flex bg-security-bg p-1 rounded-lg border border-security-border">
          <button
            onClick={() => handleModeChange('encrypt')}
            className={cn(
              'px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-md transition-all flex items-center gap-1.5',
              mode === 'encrypt'
                ? 'bg-security-accent text-black shadow-lg'
                : 'text-security-muted hover:text-security-text',
            )}
          >
            <LockKeyhole className="w-3 h-3" />
            Encrypt
          </button>
          <button
            onClick={() => handleModeChange('decrypt')}
            className={cn(
              'px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-md transition-all flex items-center gap-1.5',
              mode === 'decrypt'
                ? 'bg-security-accent text-black shadow-lg'
                : 'text-security-muted hover:text-security-text',
            )}
          >
            <UnlockKeyhole className="w-3 h-3" />
            Decrypt
          </button>
        </div>
      </div>

      <div className="space-y-5">
        {/* ── Key Generation ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono text-security-muted uppercase tracking-widest">
              RSA-2048 Key Pair
            </label>
            <button
              onClick={generateKeys}
              disabled={status === 'generating'}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all border',
                status === 'generating'
                  ? 'border-security-accent/30 text-security-accent/60 cursor-wait'
                  : 'border-security-accent/40 text-security-accent hover:bg-security-accent/10 hover:border-security-accent/60',
              )}
            >
              {status === 'generating' ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3" />
              )}
              {keyPair ? 'Regenerate' : 'Generate Keys'}
            </button>
          </div>

          <AnimatePresence>
            {keyPair ? (
              <motion.div
                key="keys"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                <KeyDisplay
                  label="Public Key (SPKI · Share freely)"
                  value={keyPair.publicKeyB64}
                  color="border-emerald-500/20"
                />
                <KeyDisplay
                  label="Private Key (PKCS8 · Keep secret)"
                  value={keyPair.privateKeyB64}
                  color="border-red-500/20"
                />
              </motion.div>
            ) : (
              <motion.div
                key="no-keys"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 p-3 border border-dashed border-security-border rounded-lg"
              >
                <KeyRound className="w-4 h-4 text-security-muted shrink-0" />
                <p className="text-xs text-security-muted font-mono">
                  No key pair yet — click <span className="text-security-accent">Generate Keys</span> to
                  create an RSA-2048 key pair in your browser.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Input ── */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-security-muted uppercase tracking-widest">
            {mode === 'encrypt' ? 'Plaintext Input' : 'Ciphertext Input (Base64)'}
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              mode === 'encrypt'
                ? 'Enter text to encrypt with the public key…'
                : 'Paste Base64 hybrid ciphertext to decrypt…'
            }
            className="w-full h-24 bg-security-bg border border-security-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-security-accent/30 transition-all font-mono text-sm resize-none"
          />
        </div>

        {/* ── Action button ── */}
        <button
          onClick={mode === 'encrypt' ? runEncrypt : runDecrypt}
          disabled={!canRun}
          className={cn(
            'w-full py-2.5 rounded-lg font-mono text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2',
            canRun
              ? 'bg-security-accent text-black hover:bg-security-accent shadow-lg shadow-security-accent/20'
              : 'bg-security-bg border border-security-border text-security-muted cursor-not-allowed',
          )}
        >
          {status === 'processing' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing…
            </>
          ) : mode === 'encrypt' ? (
            <>
              <LockKeyhole className="w-4 h-4" />
              Encrypt with Public Key
            </>
          ) : (
            <>
              <UnlockKeyhole className="w-4 h-4" />
              Decrypt with Private Key
            </>
          )}
        </button>

        {/* ── Output ── */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className={cn('text-xs font-mono uppercase tracking-widest flex items-center gap-2', statusColor)}>
              {(status === 'processing' || status === 'generating') && (
                <Loader2 className="w-3 h-3 animate-spin" />
              )}
              {status === 'error' && <AlertTriangle className="w-3 h-3" />}
              {status === 'idle' && 'Result Output'}
              {status === 'generating' && 'Generating Key Pair…'}
              {status === 'processing' && 'Computing…'}
              {status === 'success' && 'Result Output'}
              {status === 'error' && 'Error'}
            </label>
            <button
              onClick={handleResultCopy}
              disabled={!result}
              className="flex items-center gap-1.5 text-xs font-mono text-security-accent hover:text-amber-300 transition-colors disabled:opacity-40"
            >
              {resultCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {resultCopied ? 'Copied!' : 'Copy Result'}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {status === 'error' ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="w-full min-h-[80px] bg-red-500/5 border border-dashed border-red-500/30 rounded-lg px-4 py-3 font-mono text-sm text-red-400 flex items-start gap-2"
              >
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                {error}
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="w-full min-h-[80px] bg-security-bg/50 border border-dashed border-security-border rounded-lg px-4 py-3 font-mono text-[11px] break-all text-security-text/90 leading-relaxed"
              >
                {result || (
                  <span className="text-security-muted italic text-sm">
                    {!keyPair
                      ? 'Generate a key pair first…'
                      : !text
                        ? 'Enter text and press Encrypt / Decrypt…'
                        : 'Ready.'}
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
