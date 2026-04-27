import React from 'react';
import { useEncryption } from '../hooks/useEncryption';
import { cn } from '../lib/utils';
import { Lock, Unlock, RefreshCw, Copy, Check, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function EncryptionTool() {
  const { text, setText, shift, setShift, mode, setMode, result } = useEncryption();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 bg-security-card border border-security-border rounded-xl shadow-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-security-accent/10 rounded-lg">
            <Lock className="w-6 h-6 text-security-accent" />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Caesar Cipher</h2>
            <p className="text-sm text-security-muted font-mono uppercase tracking-wider">Module: CRYPTO-V1</p>
          </div>
        </div>
        
        <div className="flex bg-security-bg p-1 rounded-lg border border-security-border">
          <button
            onClick={() => setMode('encrypt')}
            className={cn(
              "px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-md transition-all",
              mode === 'encrypt' ? "bg-security-accent text-white shadow-lg" : "text-security-muted hover:text-security-text"
            )}
          >
            Encrypt
          </button>
          <button
            onClick={() => setMode('decrypt')}
            className={cn(
              "px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-md transition-all",
              mode === 'decrypt' ? "bg-security-accent text-white shadow-lg" : "text-security-muted hover:text-security-text"
            )}
          >
            Decrypt
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-mono text-security-muted uppercase tracking-widest flex items-center gap-2">
            <Hash className="w-3 h-3" />
            Shift Value (Key)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="25"
              value={shift}
              onChange={(e) => setShift(parseInt(e.target.value))}
              className="flex-1 accent-security-accent"
            />
            <span className="w-8 text-center font-mono font-bold text-security-accent bg-security-accent/10 rounded py-1 border border-security-accent/20">
              {shift}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono text-security-muted uppercase tracking-widest">Input Message</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={mode === 'encrypt' ? "Enter plain text to encode..." : "Enter cipher text to decode..."}
            className="w-full h-32 bg-security-bg border border-security-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-security-accent/50 transition-all font-mono resize-none"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-mono text-security-muted uppercase tracking-widest">Result Output</label>
            <button
              onClick={handleCopy}
              disabled={!result}
              className="flex items-center gap-1.5 text-xs font-mono text-security-accent hover:text-security-accent/80 transition-colors disabled:opacity-50"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied!' : 'Copy Result'}
            </button>
          </div>
          <div className="w-full min-h-[128px] bg-security-bg/50 border border-dashed border-security-border rounded-lg px-4 py-3 font-mono break-all text-security-text/90">
            {result || <span className="text-security-muted italic">Awaiting input...</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
