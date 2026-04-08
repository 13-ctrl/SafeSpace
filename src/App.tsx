import { PasswordAnalyzer } from './components/PasswordAnalyzer';
import { EncryptionTool } from './components/EncryptionTool';
import { Logo } from './components/Logo';
import { Lock, Terminal, Github } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen technical-grid flex flex-col">
      {/* Header */}
      <header className="border-b border-security-border bg-security-bg/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="w-10 h-10" />
            <div>
              <h1 className="font-bold text-lg tracking-tight uppercase">Safe <span className="text-security-accent">Space</span></h1>
              <div className="flex items-center gap-2 text-[10px] font-mono text-security-muted uppercase tracking-widest">
                <span className="flex items-center gap-1">
                  <Terminal className="w-2.5 h-2.5" /> SecurePass Toolkit
                </span>
                <span className="w-1 h-1 bg-security-accent rounded-full animate-pulse shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
              </div>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <button className="p-2 text-security-muted hover:text-security-text transition-colors">
              <Github className="w-5 h-5" />
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Advanced Security <span className="text-security-accent">Utilities</span>
            </h2>
            <p className="text-security-muted text-lg">
              A professional-grade suite for analyzing password entropy and performing fundamental cryptographic operations.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <PasswordAnalyzer />
            <div className="mt-6 p-4 bg-security-accent/5 border border-security-accent/10 rounded-lg">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-security-accent shrink-0" />
                <p className="text-xs text-security-text/70 leading-relaxed">
                  Our analyzer uses the <span className="text-security-accent font-mono">zxcvbn</span> algorithm, which estimates password strength by simulating common cracking techniques and dictionary attacks.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <EncryptionTool />
            <div className="mt-6 p-4 bg-security-accent/5 border border-security-accent/10 rounded-lg">
              <div className="flex gap-3">
                <Lock className="w-5 h-5 text-security-accent shrink-0" />
                <p className="text-xs text-security-text/70 leading-relaxed">
                  The <span className="text-security-accent font-mono">Caesar Cipher</span> is a substitution cipher where each letter in the plaintext is replaced by a letter some fixed number of positions down the alphabet.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function Info({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
    </svg>
  );
}

