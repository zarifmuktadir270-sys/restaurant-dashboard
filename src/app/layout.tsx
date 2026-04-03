import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Restaurant Agent Dashboard',
  description: 'AI Agent Platform for Restaurants',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#0a0a0a' }}>{children}</body>
    </html>
  );
}