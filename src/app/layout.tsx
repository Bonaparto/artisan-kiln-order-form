import type { Metadata, Viewport } from 'next';
import { Barlow_Condensed } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const barlowCondensed = Barlow_Condensed({
  variable: '--font-barlow-condensed',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Ceramic Tile Order Form · The Artisan Kiln',
  description:
    'Order hand-made ceramic tiles from The Artisan Kiln: build your cart, sketch a pattern on the 7×7 design board and check out securely.',
};

export const viewport: Viewport = {
  themeColor: '#e8dcc0',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={barlowCondensed.variable}>
      <body className="min-h-dvh">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
