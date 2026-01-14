'use client';

import { ThemeProvider } from '@/components/ThemeProvider';
import { SessionProvider } from 'next-auth/react';
import AnimatedBackground3D from '@/components/sections/AnimatedBackground3D';
import AIAssistant from '@/components/common/AIAssistant';

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <AnimatedBackground3D />
        {children}
        <AIAssistant />
      </ThemeProvider>
    </SessionProvider>
  );
}
