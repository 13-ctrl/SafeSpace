<div align="center">
  <img width="1200" height="475" alt="SafeSpace Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

  <h1>SafeSpace</h1>
  <p><strong>A browser-based cryptography & password security toolkit</strong></p>

  ![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=flat-square&logo=typescript)
  ![Vite](https://img.shields.io/badge/Vite-6-646cff?style=flat-square&logo=vite)
  ![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
  ![Zero Backend](https://img.shields.io/badge/Backend-None-success?style=flat-square)

</div>

---

## What is SafeSpace?

SafeSpace is an interactive, browser-based security toolkit that gives users hands-on access to real cryptographic tools — no installation, no account, no server. Everything runs locally inside the browser tab.

It ships with three independent modules:

| Module | Algorithm | Purpose |
|---|---|---|
| 🔍 **Password Analyzer** | zxcvbn (Dropbox) | Real-time password strength & entropy analysis |
| 🔐 **Caesar Cipher** | Classical substitution | Encrypt & decrypt text with a shift key |
| 🛡️ **AES-256-GCM** | Web Crypto API | Military-grade symmetric encryption |

---

## Features

### 🔍 Password Strength Analyzer
- Real-time strength scoring (Very Weak → Very Strong) on every keystroke
- Powered by **zxcvbn-ts** — simulates dictionary attacks, keyboard patterns, and fuzzy matching (Levenshtein distance)
- Displays **estimated crack time** at 10 billion guesses/second (offline fast-hash attack)
- Shows **entropy** as log₁₀ of the estimated guess count
- Contextual **warnings** and **hardening suggestions** in plain language
- Show/hide password toggle

### 🔐 Caesar Cipher (CRYPTO-V1)
- Adjustable shift key from 1–25 via an interactive slider
- Real-time encrypt and decrypt with a single mode toggle
- Handles mixed-case text; non-alphabetic characters pass through unchanged
- One-click copy of the output

### 🛡️ AES-256-GCM Encryption (CRYPTO-V2)
- Full **AES-256-GCM** authenticated encryption using the browser's native **Web Crypto API**
- Passphrase → key derivation via **PBKDF2** (100,000 iterations, SHA-256, random 16-byte salt)
- Unique random **IV (12 bytes)** generated per encryption — identical inputs never produce the same ciphertext
- Output is a self-contained **Base64 string** (salt + IV + ciphertext + auth tag)
- **Authentication tag** verification on decrypt — tampered ciphertext is rejected, not silently corrupted
- Show/hide passphrase toggle + 400ms debounce on async crypto operations
- Animated error states for wrong passphrase or corrupted input

---

## How It Works

```
User Input
    │
    ├─► Password Analyzer
    │       └── zxcvbn() → score, crack time, entropy, suggestions
    │
    ├─► Caesar Cipher
    │       └── shift each letter by key → ciphertext  (reversible)
    │
    └─► AES-256-GCM
            ├── PBKDF2(passphrase + random salt, 100k iterations) → 256-bit key
            ├── crypto.subtle.encrypt(AES-GCM, key, IV, plaintext) → ciphertext
            └── Base64(salt ‖ IV ‖ ciphertext) → portable output string
```

All computation happens **in the browser**. No data is sent to any server.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript 5.8 |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS v4 |
| Animations | Motion (Framer Motion) |
| Password Analysis | @zxcvbn-ts/core |
| Encryption | Web Crypto API (native browser) |
| Icons | Lucide React |

---

## Project Structure

```
src/
├── lib/
│   ├── utils.ts              # Class merging utility (clsx + tailwind-merge)
│   └── aes.ts                # AES-256-GCM + PBKDF2 via Web Crypto API
│
├── hooks/
│   ├── usePasswordStrength.ts  # zxcvbn integration & reactive state
│   ├── useEncryption.ts        # Caesar cipher logic & state
│   └── useAesEncryption.ts     # Async AES state, debounce, error handling
│
├── components/
│   ├── Logo.tsx              # Brand logo
│   ├── PasswordAnalyzer.tsx  # Module SAFE-SCAN-01
│   ├── EncryptionTool.tsx    # Module CRYPTO-V1 (Caesar Cipher)
│   └── AesTool.tsx           # Module CRYPTO-V2 (AES-256-GCM)
│
├── App.tsx                   # Root layout & 3-column module grid
├── main.tsx                  # React DOM entry point
└── index.css                 # Global design system & Tailwind theme tokens
```

---

## Getting Started

**Prerequisites:** Node.js ≥ 18

### 1. Clone the repository
```bash
git clone https://github.com/13-ctrl/SafeSpace.git
cd SafeSpace
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

The app will be available at **http://localhost:3000**

### Other scripts

```bash
npm run build    # Production build
npm run preview  # Preview the production build locally
npm run lint     # TypeScript type checking
```

---

## Security Notes

- **Zero data transmission** — no password, passphrase, or message is ever sent to a server
- **Zero persistence** — nothing is written to localStorage, cookies, or any storage medium
- **Standard algorithms** — AES-256, PBKDF2, and SHA-256 are NIST-approved and implemented through the browser's hardened Web Crypto API
- **Fresh randomness** — a new salt and IV are generated for every AES encryption; the same message encrypted twice produces completely different ciphertext
- **Authenticated encryption** — AES-GCM's authentication tag detects any tampering before decryption proceeds

---

## License

MIT © [13-ctrl](https://github.com/13-ctrl)
