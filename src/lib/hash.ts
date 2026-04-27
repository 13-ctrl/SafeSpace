/**
 * Cryptographic Hashing using the Web Crypto API.
 * Calculates the hash of a file using SHA-256 or SHA-512.
 */

export type HashAlgorithm = 'SHA-256' | 'SHA-512';

/**
 * Calculates the cryptographic hash of a given File.
 * Note: Web Crypto API `crypto.subtle.digest` requires loading the entire file into memory.
 * For production systems handling multi-gigabyte files, a streaming WebAssembly hash library 
 * is recommended. For educational purposes, this works perfectly for files < 100MB.
 * 
 * @param file The file to hash
 * @param algorithm The hashing algorithm ('SHA-256' or 'SHA-512')
 * @returns The hexadecimal string representation of the hash
 */
export async function generateFileHash(
  file: File,
  algorithm: HashAlgorithm
): Promise<string> {
  // Read the file entirely into memory
  const arrayBuffer = await file.arrayBuffer();
  
  // Calculate the digest
  const hashBuffer = await crypto.subtle.digest(algorithm, arrayBuffer);
  
  // Convert the ArrayBuffer to a hexadecimal string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}
