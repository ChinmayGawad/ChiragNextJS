import './globals.css';
import { CartProvider } from '../components/CartContext';
import ClientLayout from '../components/ClientLayout';

export const metadata = {
  title: 'Cloth WebJS - Modern Shopping',
  description: 'A beautiful and modern shopping experience',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: 'var(--background)' }}>
        <CartProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </CartProvider>
      </body>
    </html>
  );
}