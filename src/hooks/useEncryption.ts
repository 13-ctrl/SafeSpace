import { useState } from 'react';

export function useEncryption() {
  const [text, setText] = useState('');
  const [shift, setShift] = useState(3);
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');

  const caesarCipher = (str: string, shiftValue: number, decrypt = false) => {
    const s = decrypt ? (26 - (shiftValue % 26)) % 26 : shiftValue % 26;
    return str
      .split('')
      .map((char) => {
        if (char.match(/[a-z]/i)) {
          const code = char.charCodeAt(0);
          const base = code >= 65 && code <= 90 ? 65 : 97;
          return String.fromCharCode(((code - base + s) % 26) + base);
        }
        return char;
      })
      .join('');
  };

  const result = caesarCipher(text, shift, mode === 'decrypt');

  return {
    text,
    setText,
    shift,
    setShift,
    mode,
    setMode,
    result,
  };
}
