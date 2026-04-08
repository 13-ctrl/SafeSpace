import React from 'react';
import { usePasswordStrength } from '../hooks/usePasswordStrength';
import { cn } from '../lib/utils';
import { Shield, ShieldAlert, ShieldCheck, Info, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function PasswordAnalyzer() {
  const { password, setPassword, result } = usePasswordStrength();
  const [showPassword, setShowPassword] = React.useState(false);

  const getScoreColor = (score: number) => {
    switch (score) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-orange-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      case 4: return 'bg-emerald-500';
      default: return 'bg-zinc-800';
    }
  };

  const getScoreLabel = (score: number) => {
    switch (score) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Strong';
      case 4: return 'Very Strong';
      default: return 'Enter Password';
    }
  };

  const getScoreIcon = (score: number) => {
    if (score < 2) return <ShieldAlert className="w-5 h-5 text-red-500" />;
    if (score < 4) return <Shield className="w-5 h-5 text-blue-500" />;
    return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
  };

  return (
    <div className="p-6 bg-security-card border border-security-border rounded-xl shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-security-accent/10 rounded-lg">
          <Shield className="w-6 h-6 text-security-accent" />
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Strength Analyzer</h2>
          <p className="text-sm text-security-muted font-mono uppercase tracking-wider">Module: SAFE-SCAN-01</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Analyze password..."
            className="w-full bg-security-bg border border-security-border rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-security-accent/50 transition-all font-mono"
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-security-muted hover:text-security-text transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm mb-1">
            <span className="font-mono text-security-muted uppercase tracking-tighter">Security Level</span>
            <span className={cn(
              "font-semibold",
              result ? (result.score < 2 ? 'text-red-400' : result.score < 4 ? 'text-blue-400' : 'text-emerald-400') : 'text-security-muted'
            )}>
              {getScoreLabel(result?.score ?? -1)}
            </span>
          </div>
          <div className="flex gap-1.5 h-1.5">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "flex-1 rounded-full transition-all duration-500",
                  result && result.score > i ? getScoreColor(result.score) : 'bg-zinc-800'
                )}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4 pt-4 border-t border-security-border"
            >
              {result.feedback.warning && (
                <div className="flex gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-200">
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                  <p>{result.feedback.warning}</p>
                </div>
              )}

              {result.feedback.suggestions.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-security-muted uppercase tracking-widest">
                    <Info className="w-3 h-3" />
                    <span>Hardening Suggestions</span>
                  </div>
                  <ul className="space-y-2">
                    {result.feedback.suggestions.map((suggestion, i) => (
                      <li key={i} className="text-sm text-security-text/80 flex gap-2 items-start">
                        <span className="text-security-accent mt-1">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-security-bg/50 border border-security-border rounded-lg">
                  <p className="text-[10px] font-mono text-security-muted uppercase tracking-widest mb-1">Crack Time (Offline)</p>
                  <p className="text-sm font-semibold">{result.crackTimesDisplay.offlineFastHashing1e10PerSecond}</p>
                </div>
                <div className="p-3 bg-security-bg/50 border border-security-border rounded-lg">
                  <p className="text-[10px] font-mono text-security-muted uppercase tracking-widest mb-1">Entropy</p>
                  <p className="text-sm font-semibold">{Math.round(result.guessesLog10 * 100) / 100} bits</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
