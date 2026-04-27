import { PasswordAnalyzer } from './components/PasswordAnalyzer';
import { EncryptionTool } from './components/EncryptionTool';
import { AesTool } from './components/AesTool';
import { RsaTool } from './components/RsaTool';
import { StegoTool } from './components/StegoTool';
import { HasherTool } from './components/HasherTool';
import { HmacTool } from './components/HmacTool';
import { Logo } from './components/Logo';
import { Lock, Terminal, ShieldCheck, KeyRound, Image as ImageIcon, Hash, Fingerprint } from 'lucide-react';
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
              A professional-grade suite for analyzing password entropy and performing fundamental cryptographic operations — including hybrid asymmetric encryption and LSB steganography.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col"
          >
            <div className="flex-1 flex flex-col [&>div]:flex-1">
              <PasswordAnalyzer />
            </div>
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col"
          >
            <div className="flex-1 flex flex-col [&>div]:flex-1">
              <EncryptionTool />
            </div>
            <div className="mt-6 p-4 bg-security-accent/5 border border-security-accent/10 rounded-lg">
              <div className="flex gap-3">
                <Lock className="w-5 h-5 text-security-accent shrink-0" />
                <p className="text-xs text-security-text/70 leading-relaxed">
                  The <span className="text-security-accent font-mono">Caesar Cipher</span> is a substitution cipher where each letter in the plaintext is replaced by a letter some fixed number of positions down the alphabet.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col"
          >
            <div className="flex-1 flex flex-col [&>div]:flex-1">
              <AesTool />
            </div>
            <div className="mt-6 p-4 bg-security-accent/5 border border-security-accent/10 rounded-lg">
              <div className="flex gap-3">
                <ShieldCheck className="w-5 h-5 text-security-accent shrink-0" />
                <p className="text-xs text-security-text/70 leading-relaxed">
                  <span className="text-security-accent font-mono">AES-256-GCM</span> is a military-grade symmetric cipher with authenticated encryption. Your passphrase is never stored — a unique key is derived via{' '}
                  <span className="text-security-accent font-mono">PBKDF2</span> for every operation.
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col"
          >
            <div className="flex-1 flex flex-col [&>div]:flex-1">
              <RsaTool />
            </div>
          <div className="mt-6 space-y-4">
            <div className="p-5 bg-security-accent/5 border border-security-accent/15 rounded-xl">
              <div className="flex gap-3">
                <KeyRound className="w-5 h-5 text-security-accent shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-security-accent mb-1">How Hybrid Encryption Works</p>
                  <p className="text-xs text-security-text/70 leading-relaxed">
                    <span className="text-security-accent font-mono">CRYPTO-V3</span> mirrors real-world TLS and PGP. A one-time{' '}
                    <span className="text-security-accent font-mono">AES-256-GCM</span> session key is generated per message and encrypts the payload. That session key is then wrapped with the recipient&apos;s{' '}
                    <span className="text-security-accent font-mono">RSA-2048 public key</span> — so only the private key holder can recover it.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-security-card border border-security-border rounded-xl">
                <p className="text-[10px] font-mono text-security-muted uppercase tracking-widest mb-2">Key Type</p>
                <p className="text-sm font-semibold font-mono">RSA-OAEP</p>
                <p className="text-xs text-security-muted mt-1">2048-bit modulus</p>
              </div>
              <div className="p-4 bg-security-card border border-security-border rounded-xl">
                <p className="text-[10px] font-mono text-security-muted uppercase tracking-widest mb-2">Payload Cipher</p>
                <p className="text-sm font-semibold font-mono">AES-256-GCM</p>
                <p className="text-xs text-security-muted mt-1">12-byte random IV</p>
              </div>
              <div className="p-4 bg-security-card border border-security-border rounded-xl">
                <p className="text-[10px] font-mono text-security-muted uppercase tracking-widest mb-2">Hash (OAEP)</p>
                <p className="text-sm font-semibold font-mono">SHA-256</p>
                <p className="text-xs text-security-muted mt-1">Mask generation</p>
              </div>
              <div className="p-4 bg-security-card border border-security-border rounded-xl">
                <p className="text-[10px] font-mono text-security-muted uppercase tracking-widest mb-2">Engine</p>
                <p className="text-sm font-semibold font-mono">Web Crypto API</p>
                <p className="text-xs text-security-muted mt-1">Native browser</p>
              </div>
              </div>
            </div>
          </motion.div>

          {/* Steganography */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col"
          >
            <div className="flex-1 flex flex-col [&>div]:flex-1">
              <StegoTool />
            </div>
            <div className="mt-6 space-y-4">
            <div className="p-5 bg-security-accent/5 border border-security-accent/15 rounded-xl">
              <div className="flex gap-3">
                <ImageIcon className="w-5 h-5 text-security-accent shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-security-accent mb-1">Data Hiding & Steganography</p>
                  <p className="text-xs text-security-text/70 leading-relaxed">
                    <span className="text-security-accent font-mono">STEGO-01</span> uses the Least Significant Bit (LSB) technique. It modifies the lowest bit of the Red, Green, and Blue channels of an image to encode your secret text. Since it only changes pixel values by a maximum of 1 out of 255, the difference is completely invisible to the human eye.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-security-card border border-security-border rounded-xl">
                <p className="text-[10px] font-mono text-security-muted uppercase tracking-widest mb-2">Technique</p>
                <p className="text-sm font-semibold font-mono">LSB Substitution</p>
                <p className="text-xs text-security-muted mt-1">RGB channels</p>
              </div>
              <div className="p-4 bg-security-card border border-security-border rounded-xl">
                <p className="text-[10px] font-mono text-security-muted uppercase tracking-widest mb-2">Capacity</p>
                <p className="text-sm font-semibold font-mono">~3 bits / pixel</p>
                <p className="text-xs text-security-muted mt-1">Excludes Alpha</p>
              </div>
              <div className="p-4 bg-security-card border border-security-border rounded-xl">
                <p className="text-[10px] font-mono text-security-muted uppercase tracking-widest mb-2">Output Format</p>
                <p className="text-sm font-semibold font-mono">Lossless PNG</p>
                <p className="text-xs text-security-muted mt-1">Preserves pixels</p>
              </div>
              <div className="p-4 bg-security-card border border-security-border rounded-xl">
                <p className="text-[10px] font-mono text-security-muted uppercase tracking-widest mb-2">Engine</p>
                <p className="text-sm font-semibold font-mono">HTML5 Canvas</p>
                <p className="text-xs text-security-muted mt-1">Client-side processing</p>
              </div>
            </div>
          </div>
          </motion.div>

          {/* Module 6: Hasher */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex flex-col"
          >
            <div className="flex-1 flex flex-col [&>div]:flex-1">
              <HasherTool />
            </div>
            <div className="mt-6 p-4 bg-security-accent/5 border border-security-accent/10 rounded-lg">
              <div className="flex gap-3">
                <Hash className="w-5 h-5 text-security-accent shrink-0" />
                <p className="text-xs text-security-text/70 leading-relaxed">
                  Cryptographic <span className="text-security-accent font-mono">Hash Functions</span> (like SHA-256) are one-way mathematical algorithms that map data of any size to a fixed-size bit string. They are used to verify file integrity and digital signatures.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Module 7: HMAC */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex flex-col"
          >
            <div className="flex-1 flex flex-col [&>div]:flex-1">
              <HmacTool />
            </div>
            <div className="mt-6 p-4 bg-security-accent/5 border border-security-accent/10 rounded-lg">
              <div className="flex gap-3">
                <Fingerprint className="w-5 h-5 text-security-accent shrink-0" />
                <p className="text-xs text-security-text/70 leading-relaxed">
                  An <span className="text-security-accent font-mono">HMAC</span> proves both data integrity and authenticity. It combines a cryptographic hash function with a secret cryptographic key, ensuring that a message has not been tampered with and was sent by someone holding the shared secret.
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

