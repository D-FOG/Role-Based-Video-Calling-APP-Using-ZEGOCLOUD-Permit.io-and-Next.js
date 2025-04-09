import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
//import CustomSessionProvider from '@/components/sessionProvider'
import ClientProviders from '@/components/clientProviders';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meet-Hub",
  description: "Welcome to Meet-Hub, your go-to platform for seamless meeting scheduling and management.",
};

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ClientProviders>{children}</ClientProviders>
        </body>
      </html>
    );
  }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//          <CustomSessionProvider>
//             {children}
//          </CustomSessionProvider>
//       </body>
//     </html>
//   );
// }
