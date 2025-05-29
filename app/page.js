"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState, useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CartContext } from '../components/CartContext';

const shirts = [
  { id: 1, name: 'Classic Shirt', price: 799, image: '/images/s1.jpg' },
  { id: 2, name: 'Denim Jacket', price: 1499, image: '/images/s2.jpg' },
  { id: 3, name: 'Summer Dress', price: 1199, image: '/images/s3.jpeg' },
  { id: 4, name: 'Hoodie', price: 1299, image: '/images/s4.png' },
  { id: 5, name: 'Shirt', price: 999, image: '/images/s5.jpeg' },
];

const tshirts = [
  { id: 11, name: 'T-shirt Blue', price: 499, image: '/images/t1.jpg' },
  { id: 12, name: 'T-shirt Red', price: 599, image: '/images/t2.jpg' },
  { id: 13, name: 'T-shirt White', price: 549, image: '/images/t3.jpeg' },
  { id: 14, name: 'T-shirt Black', price: 649, image: '/images/t4.jpeg' },
  { id: 15, name: 'T-shirt Green', price: 699, image: '/images/t5.jpg' },
];

const pants = [
  { id: 6, name: 'Casual Trousers', price: 999, image: '/images/p1.jpeg' },
  { id: 7, name: 'Jeans', price: 1399, image: '/images/p2.jpeg' },
  { id: 8, name: 'Formal Pants', price: 1599, image: '/images/p3.jpeg' },
  { id: 9, name: 'Joggers', price: 899, image: '/images/p4.jpg' },
  { id: 10, name: 'Chinos', price: 1199, image: '/images/p5.jpeg' },
];

export default function HomePage() {
  const router = useRouter();
  const [active, setActive] = useState('home');
  const { addToCart } = useContext(CartContext);

  // Animated menu bar
  const menuItems = [
    { href: '/', label: 'Home', key: 'home' },
    { href: '/products', label: 'Products', key: 'products' },
    { href: '/cart', label: 'Cart', key: 'cart' },
    { href: '/orders', label: 'Orders', key: 'orders' },
    { href: '/profile', label: 'Profile', key: 'profile' },
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const found = menuItems.find(m => path.startsWith(m.href) && m.href !== '/');
      setActive(found ? found.key : 'home');
    }
  }, []);

  const menuLink = (item) => (
    <Link
      key={item.key}
      href={item.href}
      className={active === item.key ? 'active-menu-link' : 'menu-link'}
      style={{
        color: active === item.key ? '#ffe082' : '#fff',
        textDecoration: 'none',
        borderBottom: active === item.key ? '2px solid #ffe082' : 'none',
        padding: '0 12px',
        fontWeight: 600,
        fontSize: 18,
        letterSpacing: 1,
        transition: 'color 0.18s, border-bottom 0.18s',
        position: 'relative',
      }}
      onClick={() => setActive(item.key)}
    >
      {item.label}
      {active === item.key && (
        <span className="menu-underline" style={{
          position: 'absolute', left: 0, right: 0, bottom: -2, height: 3, background: '#ffe082', borderRadius: 2, transition: 'all 0.2s'
        }} />
      )}
    </Link>
  );

  // Product card with hover and animated button
  const productCard = (product) => (
    <div key={product.id} className="animated-card" style={{
      background: '#fff',
      borderRadius: 16,
      boxShadow: '0 4px 16px #11448822',
      padding: 20,
      textAlign: 'center',
      transition: 'transform 0.18s',
      cursor: 'pointer',
      minHeight: 340,
      position: 'relative',
      overflow: 'hidden',
      animation: 'fadeIn 0.7s cubic-bezier(.4,0,.2,1) both',
    }}>
      <Image src={product.image} alt={product.name} width={180} height={180} style={{ borderRadius: 12, objectFit: 'cover', marginBottom: 16, boxShadow: '0 2px 8px #11448833' }} />
      <h3 style={{ fontSize: 20, fontWeight: 700, margin: '12px 0 6px' }}>{product.name}</h3>
      <div style={{ color: '#114488', fontWeight: 600, fontSize: 18 }}>₹{product.price}</div>
      <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'center' }}>
        <button
          className="animated-btn"
          style={{
            padding: '0.6rem 1.5rem',
            background: '#ff9800',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
            boxShadow: '0 2px 8px #ff980033',
            transition: 'background 0.18s'
          }}
          onClick={() => { addToCart(product); router.push('/cart'); }}
        >
          Add to Cart
        </button>
        <button
          className="animated-btn"
          style={{
            padding: '0.6rem 1.5rem',
            background: '#114488',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
            boxShadow: '0 2px 8px #11448833',
            transition: 'background 0.18s'
          }}
          onClick={() => { addToCart(product); router.push('/cart?buynow=' + product.id); }}
        >
          Buy Now
        </button>
      </div>
    </div>
  );

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e3f0ff 0%, #ffffff 100%)', padding: 0 }}>
      <header style={{
        width: '100%',
        background: 'linear-gradient(90deg, #114488 60%, #4fc3f7 100%)',
        color: '#fff',
        padding: '1.2rem 0 1.2rem 0',
        marginBottom: 32,
        boxShadow: '0 2px 12px #11448822',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: 18,
        animation: 'fadeIn 1s',
      }}>
        <nav style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 40,
          fontSize: 18,
          fontWeight: 600,
          alignItems: 'center',
        }}>
          {menuItems.map(menuLink)}
        </nav>
      </header>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 320, margin: '2rem 0' }}>
        <div style={{
          background: '#fff',
          borderRadius: 18,
          boxShadow: '0 8px 32px #11448822',
          padding: '2.5rem 2rem 2rem',
          maxWidth: 600,
          width: '100%',
          textAlign: 'center',
          margin: '0 1rem',
          animation: 'fadeIn 0.7s cubic-bezier(.4,0,.2,1) both',
        }}>
          <h1 style={{ fontWeight: 800, fontSize: 32, color: '#114488', marginBottom: 18, letterSpacing: 1 }}>Welcome to Cloth WebJS</h1>
          <div style={{ color: '#4fc3f7', fontWeight: 600, fontSize: 20, marginBottom: 18 }}>
            Discover the latest trends in shirts, t-shirts, and pants. Enjoy a seamless, modern shopping experience with fast checkout, order tracking, and more!
          </div>
          <div style={{ color: '#888', fontSize: 16, marginBottom: 8 }}>
            Shop with confidence. Quality clothing, secure payments, and friendly support.
          </div>
        </div>
      </div>
      <main style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: 32, fontWeight: 800, fontSize: 36, color: '#114488', letterSpacing: 1 }}>Welcome to the Clothing Store!</h1>
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, color: '#114488' }}>Shirts</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 32
          }}>
            {shirts.map(productCard)}
          </div>
        </section>
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, color: '#114488' }}>T-Shirts</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 32
          }}>
            {tshirts.map(productCard)}
          </div>
        </section>
        <section>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, color: '#114488' }}>Pants</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 32
          }}>
            {pants.map(productCard)}
          </div>
        </section>
      </main>
    </main>
  );
}