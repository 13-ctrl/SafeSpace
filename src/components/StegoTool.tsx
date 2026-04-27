import React, { useRef } from 'react';
import { useSteganography } from '../hooks/useSteganography';
import { cn } from '../lib/utils';
import {
  ImageIcon,
  Download,
  Check,
  Loader2,
  AlertTriangle,
  Upload,
  Eye,
  EyeOff,
  ImagePlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function StegoTool() {
  const {
    mode,
    setMode,
    imageFile,
    imagePreviewUrl,
    handleImageUpload,
    text,
    setText,
    resultImage,
    resultText,
    status,
    error,
    runEncode,
    runDecode,
    reset,
  } = useSteganography();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [downloadCopied, setDownloadCopied] = React.useState(false);

  const handleModeChange = (m: 'encode' | 'decode') => {
    setMode(m);
    reset();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
    // Reset file input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownloadImage = () => {
    if (!resultImage) return;
    const a = document.createElement('a');
    a.href = resultImage;
    a.download = `stego-hidden-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    setDownloadCopied(true);
    setTimeout(() => setDownloadCopied(false), 2000);
  };

  const isRunning = status === 'processing';
  const canEncode = !!imageFile && !!text && !isRunning;
  const canDecode = !!imageFile && !isRunning;

  const statusColor = {
    idle: 'text-security-muted',
    processing: 'text-security-accent',
    success: 'text-emerald-400',
    error: 'text-red-400',
  }[status];

  return (
    <div className="p-6 bg-security-card border border-security-border rounded-xl shadow-2xl flex flex-col h-full">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-security-accent/10 rounded-lg">
            <ImageIcon className="w-6 h-6 text-security-accent" />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">LSB Steganography</h2>
            <p className="text-sm text-security-muted font-mono uppercase tracking-wider">
              Module: STEGO-01
            </p>
          </div>
        </div>

        {/* Encode / Decode toggle */}
        <div className="flex bg-security-bg p-1 rounded-lg border border-security-border">
          <button
            onClick={() => handleModeChange('encode')}
            className={cn(
              'px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-md transition-all flex items-center gap-1.5',
              mode === 'encode'
                ? 'bg-security-accent text-black shadow-lg'
                : 'text-security-muted hover:text-security-text',
            )}
          >
            <EyeOff className="w-3 h-3" />
            Hide
          </button>
          <button
            onClick={() => handleModeChange('decode')}
            className={cn(
              'px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-md transition-all flex items-center gap-1.5',
              mode === 'decode'
                ? 'bg-security-accent text-black shadow-lg'
                : 'text-security-muted hover:text-security-text',
            )}
          >
            <Eye className="w-3 h-3" />
            Reveal
          </button>
        </div>
      </div>

      <div className="space-y-5 flex-1 flex flex-col">
        {/* ── File Upload ── */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-security-muted uppercase tracking-widest flex justify-between">
            <span>Carrier Image</span>
            {imageFile && (
               <span className="text-security-accent opacity-80 cursor-pointer hover:opacity-100" onClick={() => fileInputRef.current?.click()}>
                 Change Image
               </span>
            )}
          </label>
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
            ref={fileInputRef}
            onChange={onFileChange}
          />
          
          <AnimatePresence mode="wait">
            {imagePreviewUrl ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="relative rounded-lg overflow-hidden border border-security-border bg-security-bg group"
              >
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                   <p className="text-sm font-mono text-white flex items-center gap-2">
                     <ImagePlus className="w-4 h-4" /> Click Change Image
                   </p>
                </div>
                <img 
                  src={imagePreviewUrl} 
                  alt="Carrier preview" 
                  className="w-full h-32 object-cover object-center opacity-80 group-hover:opacity-60 transition-opacity"
                />
              </motion.div>
            ) : (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-security-border rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-security-accent/50 hover:bg-security-accent/5 transition-all h-32"
              >
                <Upload className="w-8 h-8 text-security-muted mb-2" />
                <p className="text-sm font-mono text-security-muted text-center leading-relaxed">
                  Click to select carrier image<br />
                  <span className="text-[10px] opacity-70">PNG, JPG, or WebP</span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Input ── */}
        {mode === 'encode' && (
          <motion.div 
             initial={{ opacity: 0, height: 0 }}
             animate={{ opacity: 1, height: 'auto' }}
             className="space-y-2"
          >
            <label className="text-xs font-mono text-security-muted uppercase tracking-widest">
              Secret Message
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to hide inside the image..."
              className="w-full h-24 bg-security-bg border border-security-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-security-accent/30 transition-all font-mono text-sm resize-none"
            />
          </motion.div>
        )}

        <div className="flex-1" />

        {/* ── Action button ── */}
        <button
          onClick={mode === 'encode' ? runEncode : runDecode}
          disabled={mode === 'encode' ? !canEncode : !canDecode}
          className={cn(
            'w-full py-2.5 rounded-lg font-mono text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 mt-4',
            (mode === 'encode' ? canEncode : canDecode)
              ? 'bg-security-accent text-black hover:bg-security-accent shadow-lg shadow-security-accent/20'
              : 'bg-security-bg border border-security-border text-security-muted cursor-not-allowed',
          )}
        >
          {status === 'processing' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing Image…
            </>
          ) : mode === 'encode' ? (
            <>
              <EyeOff className="w-4 h-4" />
              Hide Text in Image
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              Reveal Hidden Text
            </>
          )}
        </button>

        {/* ── Output ── */}
        <div className="space-y-2 mt-4">
          <div className="flex justify-between items-center">
            <label className={cn('text-xs font-mono uppercase tracking-widest flex items-center gap-2', statusColor)}>
              {status === 'processing' && (
                <Loader2 className="w-3 h-3 animate-spin" />
              )}
              {status === 'error' && <AlertTriangle className="w-3 h-3" />}
              {status === 'idle' && 'Result Output'}
              {status === 'processing' && 'Computing…'}
              {status === 'success' && 'Result Output'}
              {status === 'error' && 'Error'}
            </label>
            
            {mode === 'encode' && resultImage && status === 'success' && (
              <button
                onClick={handleDownloadImage}
                className="flex items-center gap-1.5 text-xs font-mono text-security-accent hover:text-pink-300 transition-colors"
              >
                {downloadCopied ? <Check className="w-3 h-3" /> : <Download className="w-3 h-3" />}
                {downloadCopied ? 'Downloaded!' : 'Download Image'}
              </button>
            )}
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
            ) : mode === 'encode' && resultImage ? (
              <motion.div
                key="result-image"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="w-full bg-security-accent/5 border border-dashed border-security-accent/30 rounded-lg p-3 flex items-center gap-4"
              >
                 <img src={resultImage} alt="Stego output" className="w-16 h-16 object-cover rounded-md border border-security-border" />
                 <div>
                   <p className="text-sm font-semibold text-security-text mb-1">Encoding Complete</p>
                   <p className="text-xs text-security-muted font-mono leading-relaxed">
                     Your message is now hidden inside the image pixels. Download the PNG to share it securely.
                   </p>
                 </div>
              </motion.div>
            ) : mode === 'decode' && resultText ? (
              <motion.div
                key="result-text"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="w-full min-h-[80px] bg-security-bg/50 border border-dashed border-security-border rounded-lg px-4 py-3 font-mono text-sm break-all text-security-text/90"
              >
                {resultText}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="w-full min-h-[80px] bg-security-bg/50 border border-dashed border-security-border rounded-lg px-4 py-3 font-mono text-sm break-all text-security-text/90"
              >
                <span className="text-security-muted italic text-sm">
                  {!imageFile 
                    ? 'Upload an image first...' 
                    : mode === 'encode' && !text 
                      ? 'Enter a message to hide...' 
                      : 'Ready to process.'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
