import './globals.css';

export const metadata = {
  title: 'Garuda Tours And Travels',
  description: 'Created with ',
  generator: '',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

