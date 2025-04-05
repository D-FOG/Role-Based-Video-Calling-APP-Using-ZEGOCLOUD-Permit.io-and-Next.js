// src/components/CustomSessionProvider.ts

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

interface Props {
  children: React.ReactNode;
}

const CustomSessionProvider: React.FC<Props> = ({ children }) => {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
};

export default CustomSessionProvider;
