import { useState, useEffect } from 'react';
import { zxcvbn, zxcvbnOptions, type ZxcvbnResult } from '@zxcvbn-ts/core';
import { dictionary } from '@zxcvbn-ts/language-common';

const options = {
  dictionary: {
    ...dictionary,
  },
  graphs: {},
  useLevenshteinDistance: true,
};

zxcvbnOptions.setOptions(options);

export function usePasswordStrength() {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<ZxcvbnResult | null>(null);

  useEffect(() => {
    if (password) {
      setResult(zxcvbn(password));
    } else {
      setResult(null);
    }
  }, [password]);

  return {
    password,
    setPassword,
    result,
  };
}
