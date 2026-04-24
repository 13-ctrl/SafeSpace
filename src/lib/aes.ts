/**
 * AES-256-GCM encryption/decryption using the Web Crypto API.
 * The output format is: base64(iv + ciphertext + authTag)
 * IV is randomly generated (12 bytes) for each encryption.
 */

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12; // 96-bit IV recommended for GCM

/** Derive a 256-bit AES key from an arbitrary passphrase using PBKDF2. */
async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey'],
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100_000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt'],
  );
}

/** Convert an ArrayBuffer to a Base64 string. */
function bufToBase64(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

/** Convert a Base64 string back to a Uint8Array. */
function base64ToBuf(b64: string): Uint8Array {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

/**
 * Encrypt plaintext with AES-256-GCM.
 * Returns a Base64-encoded string containing the salt, iv, and ciphertext.
 */
export async function aesEncrypt(plaintext: string, passphrase: string): Promise<string> {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await deriveKey(passphrase, salt);

  const ciphertext = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    enc.encode(plaintext),
  );

  // Pack: salt (16) + iv (12) + ciphertext
  const payload = new Uint8Array(16 + IV_LENGTH + ciphertext.byteLength);
  payload.set(salt, 0);
  payload.set(iv, 16);
  payload.set(new Uint8Array(ciphertext), 16 + IV_LENGTH);

  return bufToBase64(payload.buffer);
}

/**
 * Decrypt a Base64-encoded AES-256-GCM ciphertext.
 * Returns the original plaintext string.
 */
export async function aesDecrypt(ciphertextB64: string, passphrase: string): Promise<string> {
  const payload = base64ToBuf(ciphertextB64);

  const salt = payload.slice(0, 16);
  const iv = payload.slice(16, 16 + IV_LENGTH);
  const ciphertext = payload.slice(16 + IV_LENGTH);

  const key = await deriveKey(passphrase, salt);

  const plaintext = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv },
    key,
    ciphertext,
  );

  return new TextDecoder().decode(plaintext);
}
