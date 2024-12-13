// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';
import localFont from 'next/font/local';
import Nav from './components/Nav';
import { Snowfall } from "./components/snowfall";
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { ChildProvider } from '@/lib/context/ChildContext'; 
import Footer from './components/Footer';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'regenerator-runtime/runtime';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

const SantasSleighFull = localFont({
  src: './fonts/SantasSleighFull.woff2',
  variable: '--font-santa-sans',
  weight: '100 900',
});

const santasSleighFullBold = localFont({
  src: './fonts/SantasSleighFullBold.woff2',
  variable: '--font-santa-mono',
  weight: '100 900',
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${SantasSleighFull.variable} ${santasSleighFullBold.variable} antialiased`}>
        <main className="flex flex-col h-screen max-h-screen">
          {/* Wrap the entire app with both ClerkProvider and ChildProvider */}
          <ClerkProvider>
            <ChildProvider> {/* Add ChildProvider here */}
            <div className="inset-0 z-[100]">
                <Snowfall />
            </div>
              <Nav />
              <div className="flex-grow bg-gradient-to-r from-[#0a1c3f] via-[#063d5e] to-[#003b5c] text-white">
                {children}
                <Toaster />
              </div>
              <Footer /> 
            </ChildProvider> {/* Close ChildProvider here */}
          </ClerkProvider>
        </main>
      </body>
    </html>
  );
}
