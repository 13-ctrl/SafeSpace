<div align="center">
  <img width="1200" height="475" alt="SafeSpace Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

  <h1>SafeSpace</h1>
  <p><strong>A comprehensive, browser-based cryptography & security toolkit</strong></p>

  ![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=flat-square&logo=typescript)
  ![Vite](https://img.shields.io/badge/Vite-6-646cff?style=flat-square&logo=vite)
  ![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
  ![Zero Backend](https://img.shields.io/badge/Backend-None-success?style=flat-square)

</div>

---

## What is SafeSpace?

SafeSpace is an interactive, browser-based security toolkit that gives users hands-on access to real cryptographic tools — no installation, no account, no server. Everything runs locally inside the browser tab, ensuring absolute privacy.

It features a modern, responsive, cyan-themed "hacker" UI and ships with seven independent security modules:

| Module | Algorithm | Purpose |
|---|---|---|
| 🔍 **Password Analyzer** | zxcvbn / CSPRNG | Real-time strength scoring & secure password generation |
| 🔐 **Caesar Cipher** | Classical substitution | Encrypt & decrypt text with a shift key |
| 🛡️ **AES-256-GCM** | Web Crypto API | Military-grade symmetric encryption |
| 🔑 **RSA Hybrid** | RSA-OAEP + AES-GCM | Asymmetric public/private key encryption |
| 🖼️ **Steganography** | LSB Substitution | Hide text invisibly inside image pixels |
| 🔢 **File Checksum** | SHA-256 / SHA-512 | Verify file integrity directly in memory |
| 🛡️ **HMAC Signature** | HMAC-SHA256 | Prove data integrity and authenticity |

---

## Features

### 🔍 Password Analyzer & Generator (SAFE-SCAN-01)
- Real-time strength scoring (Very Weak → Very Strong) powered by **zxcvbn-ts**.
- Displays estimated crack time (offline fast-hash attack) and entropy.
- **Cryptographically Secure Generator**: Generates 16-character strong passwords using `window.crypto.getRandomValues()`.

### 🔐 Caesar Cipher (CRYPTO-V1)
- Interactive slider to adjust shift key (1–25).
- Real-time text encoding and decoding.

### 🛡️ AES-256-GCM Encryption (CRYPTO-V2)
- Native Web Crypto API implementation of **AES-256-GCM**.
- Secure key derivation via **PBKDF2** (100,000 iterations, SHA-256, 16-byte random salt).
- Unique 12-byte random IV for every operation prevents ciphertext duplication.
- Outputs a self-contained Base64 string (`salt:iv:ciphertext`).

### 🔑 RSA-OAEP Hybrid Encryption (CRYPTO-V3)
- Mirrors real-world PGP and TLS architecture.
- Generates a **2048-bit RSA** keypair in the browser.
- Generates a random one-time AES session key to encrypt the payload.
- Wraps (encrypts) the AES session key with the RSA Public Key.
- Secure, lightning-fast asymmetric encryption.

### 🖼️ LSB Steganography (STEGO-01)
- Hides secret text inside the **Least Significant Bits (LSB)** of the Red, Green, and Blue channels of an image.
- Uses HTML5 Canvas for pure client-side image processing.
- Visually identical output saved as a lossless PNG to preserve the payload.

### 🔢 File Checksum Generator (HASH-01)
- Instantly generates **SHA-256** and **SHA-512** cryptographic hashes for any file.
- Reads files entirely into memory (supports files up to 100MB).
- Drag-and-drop UI with 1-click hash copying.

### 🛡️ HMAC Signature (AUTH-01)
- Real-time generation of Hash-based Message Authentication Codes.
- Dual modes: **GENERATE** a signature from a payload + secret, or **VERIFY** an existing 64-character hex signature.
- Strict validation ensures exact matches for message authenticity.

---

## Architecture & Layout

The UI uses a completely dynamic layout powered by Tailwind CSS grid and Flexbox. 
- It breaks down perfectly from a **3-column grid** on extra-large desktop monitors, to a **2-column grid** on laptops/tablets, down to a single column on mobile.
- All module cards utilize `flex-wrap` and `items-stretch` to guarantee perfect vertical alignment and prevent UI collisions on narrow screens.
- **Color System:** SafeSpace utilizes a unified dark cyan design system (`--color-security-accent`, `--color-security-bg`) for a cohesive, cyberpunk aesthetic.

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
| Cryptography Engine | Web Crypto API (Native browser) |
| Image Processing | HTML5 `<canvas>` API |
| Icons | Lucide React |

---

## Project Structure

```
src/
├── lib/
│   ├── utils.ts              # Class merging utility
│   ├── aes.ts                # AES-256-GCM + PBKDF2 logic
│   ├── rsa.ts                # RSA key generation & hybrid wrap/unwrap
│   ├── stego.ts              # LSB canvas pixel manipulation
│   ├── hash.ts               # File arrayBuffer hashing
│   └── hmac.ts               # HMAC signing and verification
│
├── hooks/
│   ├── usePasswordStrength.ts  # zxcvbn integration
│   ├── useEncryption.ts        # Caesar cipher state
│   ├── useAesEncryption.ts     # Debounced AES state
│   ├── useRsaEncryption.ts     # Keypair management & hybrid state
│   ├── useSteganography.ts     # Image upload & hiding logic
│   ├── useHasher.ts            # File drag-and-drop & hashing state
│   └── useHmac.ts              # Debounced HMAC state
│
├── components/               # The 7 isolated UI Modules
├── App.tsx                   # Root layout & responsive grid
└── index.css                 # Global design system & theme tokens
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

---

## Security Notes

- **Zero data transmission** — no password, file, image, or message is ever sent to a server.
- **Zero persistence** — nothing is written to localStorage, cookies, or any storage medium.
- **Standard algorithms** — AES, RSA-OAEP, PBKDF2, and SHA-256 are NIST-approved and implemented through the browser's hardened Web Crypto API.
- **Type Safety** — strict TypeScript assertions (`as BufferSource`) are enforced for all cryptographic payloads to ensure modern browser compatibility.

---

## License

MIT © [13-ctrl](https://github.com/13-ctrl)
