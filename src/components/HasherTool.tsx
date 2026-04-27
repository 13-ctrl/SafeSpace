import React, { useRef, useState } from 'react';
import { useHasher } from '../hooks/useHasher';
import { HashAlgorithm } from '../lib/hash';
import { Hash, Upload, FileDigit, Copy, Check, RotateCcw, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export function HasherTool() {
  const {
    file,
    algorithm,
    hashResult,
    status,
    error,
    handleFileUpload,
    handleAlgorithmChange,
    reset,
  } = useHasher();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (hashResult) {
      navigator.clipboard.writeText(hashResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'error': return 'text-red-400';
      case 'success': return 'text-security-accent';
      case 'hashing': return 'text-security-accent/60';
      default: return 'text-security-muted';
    }
  };

  return (
    <div className="p-6 bg-security-card border border-security-border rounded-xl shadow-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-security-accent/10 rounded-lg">
            <Hash className="w-6 h-6 text-security-accent" />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">File Checksum</h2>
            <p className="text-sm text-security-muted font-mono uppercase tracking-wider">Module: HASH-01</p>
          </div>
        </div>
        
        {file && (
          <button
            onClick={reset}
            className="p-2 text-security-muted hover:text-security-accent transition-colors rounded-lg hover:bg-security-accent/10"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Algorithm Toggle */}
        <div className="flex p-1 bg-security-bg border border-security-border rounded-lg">
          {(['SHA-256', 'SHA-512'] as HashAlgorithm[]).map((algo) => (
            <button
              key={algo}
              onClick={() => handleAlgorithmChange(algo)}
              className={cn(
                "flex-1 py-2 text-sm font-semibold rounded-md transition-all font-mono",
                algorithm === algo
                  ? 'bg-security-accent text-black shadow-lg'
                  : 'text-security-muted hover:text-security-text'
              )}
            >
              {algo}
            </button>
          ))}
        </div>

        {/* File Dropzone */}
        {!file && (
          <div className="relative">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-security-border rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-security-accent/50 hover:bg-security-accent/5 transition-all h-40"
            >
              <Upload className="w-8 h-8 text-security-muted mb-3" />
              <p className="text-sm font-semibold mb-1">Click to browse or drag file here</p>
              <p className="text-xs text-security-muted font-mono">Any file format • Max 100MB</p>
            </div>
          </div>
        )}

        {/* File Info */}
        <AnimatePresence mode="wait">
          {file && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-security-bg border border-security-border rounded-lg flex items-center justify-between"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <FileDigit className="w-8 h-8 text-security-accent shrink-0" />
                <div className="truncate">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-security-muted font-mono mt-0.5">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type || 'Unknown type'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-200"
          >
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}

        {/* Result */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm mb-1">
            <span className="font-mono text-security-muted uppercase tracking-tighter">Hash Digest Output</span>
            <span className={cn("font-semibold text-xs uppercase tracking-wider flex items-center gap-2", getStatusColor())}>
              {status === 'hashing' && (
                <span className="w-2 h-2 bg-security-accent rounded-full animate-pulse" />
              )}
              {status}
            </span>
          </div>
          
          <div className="relative group">
            <textarea
              readOnly
              value={hashResult}
              placeholder="Waiting for file..."
              className={cn(
                "w-full bg-security-bg border rounded-lg px-4 py-3 focus:outline-none transition-all font-mono text-sm resize-none h-28 leading-relaxed",
                status === 'success' ? "border-security-accent/50 text-security-accent" : "border-security-border text-security-text/50"
              )}
            />
            {status === 'success' && (
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 bg-security-card border border-security-border rounded hover:bg-security-accent hover:text-black transition-colors shadow-lg"
                title="Copy Hash"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
