import { ReactNode } from 'react';
import LenisProvider from '@/components/LenisProvider';
import CursorGlobal from '@/components/CursorGlobal';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <LenisProvider>
      <Navbar />
      {children}
      <Footer />
      <CursorGlobal />
    </LenisProvider>
  );
}
