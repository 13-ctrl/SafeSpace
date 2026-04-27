import React, { useState } from 'react';
import { useHmac } from '../hooks/useHmac';
import { Fingerprint, Copy, Check, KeySquare, ShieldCheck, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export function HmacTool() {
  const {
    mode, setMode,
    message, setMessage,
    secret, setSecret,
    macToVerify, setMacToVerify,
    result, isVerified, status
  } = useHmac();

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusColor = () => {
    if (mode === 'verify' && isVerified !== null) {
      return isVerified ? 'text-emerald-400' : 'text-red-400';
    }
    switch (status) {
      case 'error': return 'text-red-400';
      case 'success': return 'text-security-accent';
      case 'processing': return 'text-security-accent/60';
      default: return 'text-security-muted';
    }
  };

  return (
    <div className="p-6 bg-security-card border border-security-border rounded-xl shadow-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-security-accent/10 rounded-lg">
            <Fingerprint className="w-6 h-6 text-security-accent" />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">HMAC Signature</h2>
            <p className="text-sm text-security-muted font-mono uppercase tracking-wider">Module: AUTH-01</p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {/* Mode Toggle */}
        <div className="flex p-1 bg-security-bg border border-security-border rounded-lg mb-6">
          <button
            onClick={() => setMode('generate')}
            className={cn(
              "flex-1 py-2 text-sm font-semibold rounded-md transition-all font-mono",
              mode === 'generate' ? "bg-security-accent text-black shadow-lg" : "text-security-muted hover:text-security-text"
            )}
          >
            GENERATE
          </button>
          <button
            onClick={() => setMode('verify')}
            className={cn(
              "flex-1 py-2 text-sm font-semibold rounded-md transition-all font-mono",
              mode === 'verify' ? "bg-security-accent text-black shadow-lg" : "text-security-muted hover:text-security-text"
            )}
          >
            VERIFY
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-security-muted uppercase tracking-widest mb-1.5 ml-1">Message Payload</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter message to sign or verify..."
              className="w-full h-24 bg-security-bg border border-security-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-security-accent/40 transition-all font-mono text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-security-muted uppercase tracking-widest mb-1.5 ml-1">Secret Key</label>
            <div className="relative">
              <input
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Enter shared secret..."
                className="w-full bg-security-bg border border-security-border rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-security-accent/40 transition-all font-mono text-sm"
              />
              <KeySquare className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-security-muted" />
            </div>
          </div>

          {/* Verification specific input */}
          <AnimatePresence>
            {mode === 'verify' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="pt-2">
                  <label className="block text-xs font-mono text-security-muted uppercase tracking-widest mb-1.5 ml-1">MAC to Verify (Hex)</label>
                  <input
                    type="text"
                    value={macToVerify}
                    onChange={(e) => setMacToVerify(e.target.value)}
                    placeholder="Enter 64-character hex signature..."
                    maxLength={64}
                    className="w-full bg-security-bg border border-security-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-security-accent/40 transition-all font-mono text-sm"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Output */}
        <div className="pt-2 space-y-2">
          <div className="flex justify-between items-center text-sm mb-1">
            <span className="font-mono text-security-muted uppercase tracking-tighter">
              {mode === 'generate' ? 'Generated Signature' : 'Verification Status'}
            </span>
            <span className={cn("font-semibold text-xs uppercase tracking-wider flex items-center gap-2", getStatusColor())}>
              {status === 'processing' && (
                <span className="w-2 h-2 bg-security-accent rounded-full animate-pulse" />
              )}
              {mode === 'verify' && isVerified !== null ? (isVerified ? 'VERIFIED' : 'FAILED') : status}
            </span>
          </div>

          {mode === 'generate' ? (
            <div className="relative group">
              <input
                type="text"
                readOnly
                value={result}
                placeholder="Signature will appear here..."
                className={cn(
                  "w-full bg-security-bg border rounded-lg px-4 py-3 focus:outline-none transition-all font-mono text-sm",
                  status === 'success' ? "border-security-accent/50 text-security-accent" : "border-security-border text-security-text/50"
                )}
              />
              {status === 'success' && result && (
                <button
                  onClick={handleCopy}
                  className="absolute top-1/2 -translate-y-1/2 right-2 p-1.5 bg-security-card border border-security-border rounded hover:bg-security-accent hover:text-black transition-colors shadow-lg"
                  title="Copy Signature"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>
          ) : (
            <div className={cn(
              "w-full rounded-lg px-4 py-4 flex items-center justify-center gap-3 border transition-colors",
              isVerified === true ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" :
              isVerified === false ? "bg-red-500/10 border-red-500/30 text-red-400" :
              "bg-security-bg border-security-border text-security-muted"
            )}>
              {isVerified === true ? (
                <><ShieldCheck className="w-6 h-6" /><span className="font-semibold tracking-wide">AUTHENTIC (MATCH)</span></>
              ) : isVerified === false ? (
                <><ShieldAlert className="w-6 h-6" /><span className="font-semibold tracking-wide">INVALID (TAMPERED)</span></>
              ) : (
                <span className="font-mono text-sm">Awaiting full 64-char input...</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
