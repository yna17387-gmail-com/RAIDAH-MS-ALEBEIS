export const metadata = { title: 'محفظتي وبطاقتي البنكية' };

export default function RootLayout({ children }) {
  return (
    <html lang="ar">
      <body style={{ margin: 0, backgroundColor: '#e2e8f0' }}>{children}</body>
    </html>
  );
}
