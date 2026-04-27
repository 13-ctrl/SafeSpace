import React, { useState, useCallback } from 'react';
import { generateFileHash, HashAlgorithm } from '../lib/hash';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export function useHasher() {
  const [file, setFile] = useState<File | null>(null);
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('SHA-256');
  const [hashResult, setHashResult] = useState('');
  const [status, setStatus] = useState<'idle' | 'hashing' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const processFile = useCallback(async (selectedFile: File, selectedAlgorithm: HashAlgorithm) => {
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError('File is too large. For browser stability, please select a file under 100MB.');
      setStatus('error');
      setFile(null);
      setHashResult('');
      return;
    }

    setFile(selectedFile);
    setStatus('hashing');
    setError('');
    setHashResult('');

    try {
      const hash = await generateFileHash(selectedFile, selectedAlgorithm);
      setHashResult(hash);
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate file hash');
      setStatus('error');
    }
  }, []);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile, algorithm);
    }
  }, [algorithm, processFile]);

  const handleAlgorithmChange = useCallback((newAlgo: HashAlgorithm) => {
    setAlgorithm(newAlgo);
    if (file && status !== 'error') {
      // Re-hash the existing file if they switch algorithms
      processFile(file, newAlgo);
    }
  }, [file, status, processFile]);

  const reset = useCallback(() => {
    setFile(null);
    setHashResult('');
    setStatus('idle');
    setError('');
  }, []);

  return {
    file,
    algorithm,
    hashResult,
    status,
    error,
    handleFileUpload,
    handleAlgorithmChange,
    reset,
  };
}
