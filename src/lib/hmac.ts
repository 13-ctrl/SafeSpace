/**
 * HMAC (Hash-based Message Authentication Code) implementation
 * using the native Web Crypto API.
 */

/**
 * Generates an HMAC-SHA256 signature for a message using a secret key.
 * 
 * @param message The plaintext message to authenticate
 * @param secret The shared secret key
 * @returns A hexadecimal string representing the HMAC signature
 */
export async function generateHmac(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  
  // Import the raw secret as an HMAC key
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret) as BufferSource,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  // Generate the signature
  const signature = await crypto.subtle.sign(
    'HMAC',
    keyMaterial,
    enc.encode(message) as BufferSource
  );

  // Convert the ArrayBuffer to a hex string
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verifies if a provided HMAC hex string matches the message and secret.
 */
export async function verifyHmac(message: string, secret: string, macToVerifyHex: string): Promise<boolean> {
  if (!macToVerifyHex || macToVerifyHex.length !== 64) return false;
  
  try {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret) as BufferSource,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    // Convert hex string back to Uint8Array safely
    const match = macToVerifyHex.match(/.{1,2}/g);
    if (!match) return false;
    const macBytes = new Uint8Array(match.map(byte => parseInt(byte, 16)));

    // Verify the signature
    return await crypto.subtle.verify(
      'HMAC',
      keyMaterial,
      macBytes as BufferSource,
      enc.encode(message) as BufferSource
    );
  } catch (err) {
    return false;
  }
}
