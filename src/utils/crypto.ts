/**
 * AES-256-GCM encryption/decryption using Web Crypto API.
 * Works in both Node.js (Astro build) and browsers.
 */

const SALT = new Uint8Array([
  112, 114, 111, 106, 101, 99, 116, 115,
  45, 103, 97, 116, 101, 45, 115, 97,
]); // "projects-gate-sa" as bytes

const ITERATIONS = 100_000;

async function deriveKey(password: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: SALT, iterations: ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

/** Encrypt plaintext with a password. Returns a base64 string (IV + ciphertext). */
export async function encrypt(plaintext: string, password: string): Promise<string> {
  const key = await deriveKey(password);
  const enc = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(plaintext),
  );
  // Prepend IV to ciphertext
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);
  return btoa(String.fromCharCode(...combined));
}

/** Decrypt a base64 blob (IV + ciphertext) with a password. Returns plaintext string. */
export async function decrypt(encoded: string, password: string): Promise<string> {
  const key = await deriveKey(password);
  const raw = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0));
  const iv = raw.slice(0, 12);
  const ciphertext = raw.slice(12);
  const plainBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext,
  );
  return new TextDecoder().decode(plainBuffer);
}
