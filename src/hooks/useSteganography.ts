import { useState, useCallback, useEffect } from 'react';
import { encodeStego, decodeStego } from '../lib/stego';

export type StegoMode = 'encode' | 'decode';
export type StegoStatus = 'idle' | 'processing' | 'success' | 'error';

export function useSteganography() {
  const [mode, setMode] = useState<StegoMode>('encode');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [resultText, setResultText] = useState('');
  const [status, setStatus] = useState<StegoStatus>('idle');
  const [error, setError] = useState('');

  // Cleanup object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imagePreviewUrl && !imagePreviewUrl.startsWith('data:')) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const handleImageUpload = useCallback((file: File) => {
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreviewUrl((prev) => {
      if (prev && !prev.startsWith('data:')) URL.revokeObjectURL(prev);
      return url;
    });
    // Reset state on new image upload
    setResultImage(null);
    setResultText('');
    setStatus('idle');
    setError('');
  }, []);

  const runEncode = useCallback(async () => {
    if (!imageFile || !text) return;
    setStatus('processing');
    setError('');
    try {
      const dataUrl = await encodeStego(imageFile, text);
      setResultImage(dataUrl);
      setStatus('success');
    } catch (err: any) {
      setResultImage(null);
      setStatus('error');
      setError(err.message || 'Encoding failed.');
    }
  }, [imageFile, text]);

  const runDecode = useCallback(async () => {
    if (!imageFile) return;
    setStatus('processing');
    setError('');
    try {
      const message = await decodeStego(imageFile);
      setResultText(message);
      setStatus('success');
    } catch (err: any) {
      setResultText('');
      setStatus('error');
      setError(err.message || 'Decryption failed or no hidden message found.');
    }
  }, [imageFile]);

  const reset = useCallback(() => {
    setText('');
    setImageFile(null);
    setImagePreviewUrl((prev) => {
      if (prev && !prev.startsWith('data:')) URL.revokeObjectURL(prev);
      return null;
    });
    setResultImage(null);
    setResultText('');
    setStatus('idle');
    setError('');
  }, []);

  return {
    mode,
    setMode,
    imageFile,
    imagePreviewUrl,
    handleImageUpload,
    text,
    setText,
    resultImage,
    resultText,
    status,
    error,
    runEncode,
    runDecode,
    reset,
  };
}
