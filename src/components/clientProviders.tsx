// src/components/ClientProviders.tsx
'use client'

import CustomSessionProvider from './sessionProvider';

interface Props {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: Props) {
  return <CustomSessionProvider>{children}</CustomSessionProvider>;
}
