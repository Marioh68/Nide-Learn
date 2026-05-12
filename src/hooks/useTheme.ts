'use client';

import { use } from 'react';
import { ThemeContext } from '@/components/ThemeProvider';

export type { Theme } from '@/components/ThemeProvider';

export function useTheme() {
  return use(ThemeContext);
}
