/**
 * RSA / Hybrid Encryption — CRYPTO-V3
 *
 * Architecture (mirrors real-world TLS / PGP):
 *   1. Generate an ephemeral AES-256-GCM key (session key).
 *   2. Encrypt the plaintext with that session key.
 *   3. RSA-OAEP-encrypt the session key with the recipient's RSA public key.
 *   4. Bundle everything into a single Base64 payload.
 *
 * Wire format (all sizes in bytes):
 *   [ encKeyLen (4) | encKey (variable) | iv (12) | ciphertext (variable) ]
 *
 * Key format exported for the UI:
 *   Public  key → Base64(SPKI)
 *   Private key → Base64(PKCS8)
 */

const RSA_ALG = {
  name: 'RSA-OAEP',
  modulusLength: 2048,
  publicExponent: new Uint8Array([1, 0, 1]), // 65537
  hash: 'SHA-256',
} as const;

const AES_ALG = 'AES-GCM';
const AES_KEY_LENGTH = 256;
const IV_BYTES = 12;

// ─── Helpers ────────────────────────────────────────────────────────────────

function bufToBase64(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function base64ToBuf(b64: string): Uint8Array {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

function u32ToBytes(n: number): Uint8Array {
  const buf = new ArrayBuffer(4);
  new DataView(buf).setUint32(0, n, false); // big-endian
  return new Uint8Array(buf);
}

function bytesToU32(bytes: Uint8Array, offset = 0): number {
  return new DataView(bytes.buffer, bytes.byteOffset + offset, 4).getUint32(0, false);
}

// ─── Key Generation ──────────────────────────────────────────────────────────

export interface RsaKeyPair {
  publicKeyB64: string;  // SPKI, Base64
  privateKeyB64: string; // PKCS8, Base64
}

export async function generateRsaKeyPair(): Promise<RsaKeyPair> {
  const keyPair = await crypto.subtle.generateKey(
    RSA_ALG,
    true, // extractable so we can export for display
    ['encrypt', 'decrypt'],
  );

  const [pubRaw, privRaw] = await Promise.all([
    crypto.subtle.exportKey('spki', keyPair.publicKey),
    crypto.subtle.exportKey('pkcs8', keyPair.privateKey),
  ]);

  return {
    publicKeyB64: bufToBase64(pubRaw),
    privateKeyB64: bufToBase64(privRaw),
  };
}

// ─── Import helpers ───────────────────────────────────────────────────────────

async function importPublicKey(b64: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'spki',
    base64ToBuf(b64) as BufferSource,
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    false,
    ['encrypt'],
  );
}

async function importPrivateKey(b64: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'pkcs8',
    base64ToBuf(b64) as BufferSource,
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    false,
    ['decrypt'],
  );
}

// ─── Encrypt ─────────────────────────────────────────────────────────────────

/**
 * Hybrid-encrypt plaintext with an RSA public key.
 * Returns a Base64 bundle containing the encrypted session key + ciphertext.
 */
export async function hybridEncrypt(plaintext: string, publicKeyB64: string): Promise<string> {
  const pubKey = await importPublicKey(publicKeyB64);

  // 1. Generate a one-time AES session key
  const sessionKey = await crypto.subtle.generateKey(
    { name: AES_ALG, length: AES_KEY_LENGTH },
    true,
    ['encrypt', 'decrypt'],
  );

  // 2. Encrypt the plaintext with the session key
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const enc = new TextEncoder();
  const ciphertext = await crypto.subtle.encrypt(
    { name: AES_ALG, iv: iv as BufferSource },
    sessionKey,
    enc.encode(plaintext) as BufferSource,
  );

  // 3. Export the raw session key bytes, then RSA-encrypt them
  const rawSessionKey = await crypto.subtle.exportKey('raw', sessionKey);
  const encryptedKey = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, pubKey, rawSessionKey);

  // 4. Pack: [encKeyLen(4)] + [encKey] + [iv(12)] + [ciphertext]
  const encKeyBytes = new Uint8Array(encryptedKey);
  const ciphertextBytes = new Uint8Array(ciphertext);

  const totalLen = 4 + encKeyBytes.byteLength + IV_BYTES + ciphertextBytes.byteLength;
  const payload = new Uint8Array(totalLen);
  let offset = 0;

  payload.set(u32ToBytes(encKeyBytes.byteLength), offset); offset += 4;
  payload.set(encKeyBytes, offset);                        offset += encKeyBytes.byteLength;
  payload.set(iv, offset);                                 offset += IV_BYTES;
  payload.set(ciphertextBytes, offset);

  return bufToBase64(payload);
}

// ─── Decrypt ─────────────────────────────────────────────────────────────────

/**
 * Hybrid-decrypt a Base64 bundle produced by hybridEncrypt.
 * Returns the original plaintext string.
 */
export async function hybridDecrypt(payloadB64: string, privateKeyB64: string): Promise<string> {
  const privKey = await importPrivateKey(privateKeyB64);
  const payload = base64ToBuf(payloadB64);

  let offset = 0;
  const encKeyLen = bytesToU32(payload, offset); offset += 4;
  const encryptedKey = payload.slice(offset, offset + encKeyLen); offset += encKeyLen;
  const iv = payload.slice(offset, offset + IV_BYTES);           offset += IV_BYTES;
  const ciphertext = payload.slice(offset);

  // 1. RSA-decrypt the session key
  const rawSessionKey = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, privKey, encryptedKey as BufferSource);

  // 2. Re-import the raw AES key
  const sessionKey = await crypto.subtle.importKey(
    'raw',
    rawSessionKey,
    { name: AES_ALG, length: AES_KEY_LENGTH },
    false,
    ['decrypt'],
  );

  // 3. AES-GCM decrypt the ciphertext
  const plaintext = await crypto.subtle.decrypt({ name: AES_ALG, iv: iv as BufferSource }, sessionKey, ciphertext as BufferSource);
  return new TextDecoder().decode(plaintext);
}
