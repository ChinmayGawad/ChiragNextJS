"use client";
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import Image from 'next/image';
import { CartContext } from '../../components/CartContext';

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

export default function ProductsPage() {
  const router = useRouter();
  const { addToCart } = useContext(CartContext);

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
    <main style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 32, fontWeight: 800, fontSize: 36, color: '#114488', letterSpacing: 1 }}>All Products</h1>
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
  );
}
