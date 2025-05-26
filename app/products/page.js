"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

const products = [
  // Shirts (700-1200, end with 9)
  {
    id: 1,
    name: 'Green Polo Shirt',
    price: 799,
    image: '/green-polo-shirt.jpg',
    category: 'Shirts',
    rating: 4,
    review: 'Very comfortable and fits perfectly!',
    reviews: 1203
  },
  {
    id: 2,
    name: 'Blue Formal Shirt',
    price: 1199,
    image: '/blue-formal-shirt.jpg',
    category: 'Shirts',
    rating: 5,
    review: 'Great for office wear, looks sharp.',
    reviews: 18456
  },
  {
    id: 3,
    name: 'Checked Casual Shirt',
    price: 999,
    image: '/checked-casual-shirt.jpg',
    category: 'Shirts',
    rating: 3,
    review: 'Nice style, but the fabric could be softer.',
    reviews: 502
  },
  // T-Shirts (400-600, end with 9)
  {
    id: 4,
    name: 'Classic White T-Shirt',
    price: 499,
    image: '/classic-white-tshirt.jpg',
    category: 'T-Shirts',
    rating: 5,
    review: 'A must-have basic. Super soft!',
    reviews: 20000
  },
  {
    id: 5,
    name: 'Graphic Black T-Shirt',
    price: 599,
    image: '/graphic-black-tshirt.jpg',
    category: 'T-Shirts',
    rating: 4,
    review: 'Cool design and good quality.',
    reviews: 7890
  },
  {
    id: 6,
    name: 'Striped Navy T-Shirt',
    price: 409,
    image: '/striped-navy-tshirt.jpg',
    category: 'T-Shirts',
    rating: 3,
    review: 'Nice fit, but colors faded a bit after wash.',
    reviews: 1345
  },
  // Pants (500-1000, end with 9)
  {
    id: 7,
    name: 'Grey Sweatpants',
    price: 599,
    image: '/grey-sweatpants.jpg',
    category: 'Pants',
    rating: 5,
    review: 'Super comfy for lounging or gym.',
    reviews: 1567
  },
  {
    id: 8,
    name: 'Slim Fit Chinos',
    price: 909,
    image: '/slim-fit-chinos.jpg',
    category: 'Pants',
    rating: 4,
    review: 'Fits well and looks stylish.',
    reviews: 8450
  },
  {
    id: 9,
    name: 'Black Formal Trousers',
    price: 999,
    image: '/black-formal-trousers.jpg',
    category: 'Pants',
    rating: 4,
    review: 'Perfect for formal occasions.',
    reviews: 19999
  },
];

const shirts = products.filter(p => p.category === 'Shirts');
const tshirts = products.filter(p => p.category === 'T-Shirts');
const pants = products.filter(p => p.category === 'Pants');

function renderStars(rating) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

function ParallaxImage({ src, alt }) {
  const ref = useRef();
  function handleMouseMove(e) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dx = x - rect.width / 2;
    const dy = y - rect.height / 2;
    el.style.transform = `rotateY(${dx / 15}deg) rotateX(${-dy / 15}deg) scale(1.05)`;
  }
  function handleMouseLeave() {
    if (ref.current) ref.current.style.transform = '';
  }
  return (
    <div
      ref={ref}
      style={{ transition: 'transform 0.2s', willChange: 'transform', borderRadius: 8 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Image src={src} alt={alt} width={180} height={180} style={{ objectFit: 'cover', borderRadius: '8px' }} />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <main>
      <h1>Products</h1>
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Shirts</h2>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {shirts.length === 0 && <p>No shirts available.</p>}
          {shirts.map(product => (
            <div key={product.id} className="animated-card" style={{ border: '1px solid #eee', borderRadius: '8px', padding: '1rem', width: '220px', textAlign: 'center' }}>
              <ParallaxImage src={product.image} alt={product.name} />
              <h3 style={{ fontSize: '1.1rem', margin: '1rem 0 0.5rem' }}>{product.name}</h3>
              <p style={{ margin: '0.5rem 0' }}>₹{product.price}</p>
              <p style={{ margin: '0.5rem 0', color: '#f5a623', fontSize: '1.1rem' }}>
                {renderStars(product.rating)} <span style={{ color: '#888', fontSize: '0.95rem' }}>({product.reviews.toLocaleString()} voted)</span>
              </p>
              <p style={{ fontStyle: 'italic', color: '#555', fontSize: '0.95rem' }}>&quot;{product.review}&quot;</p>
              <Link href={`/products/${product.id}`} className="animated-link">View Details</Link>
            </div>
          ))}
        </div>
      </section>
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>T-Shirts</h2>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {tshirts.length === 0 && <p>No t-shirts available.</p>}
          {tshirts.map(product => (
            <div key={product.id} className="animated-card" style={{ border: '1px solid #eee', borderRadius: '8px', padding: '1rem', width: '220px', textAlign: 'center' }}>
              <ParallaxImage src={product.image} alt={product.name} />
              <h3 style={{ fontSize: '1.1rem', margin: '1rem 0 0.5rem' }}>{product.name}</h3>
              <p style={{ margin: '0.5rem 0' }}>₹{product.price}</p>
              <p style={{ margin: '0.5rem 0', color: '#f5a623', fontSize: '1.1rem' }}>
                {renderStars(product.rating)} <span style={{ color: '#888', fontSize: '0.95rem' }}>({product.reviews.toLocaleString()} voted)</span>
              </p>
              <p style={{ fontStyle: 'italic', color: '#555', fontSize: '0.95rem' }}>&quot;{product.review}&quot;</p>
              <Link href={`/products/${product.id}`} className="animated-link">View Details</Link>
            </div>
          ))}
        </div>
      </section>
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Pants</h2>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {pants.length === 0 && <p>No pants available.</p>}
          {pants.map(product => (
            <div key={product.id} className="animated-card" style={{ border: '1px solid #eee', borderRadius: '8px', padding: '1rem', width: '220px', textAlign: 'center' }}>
              <ParallaxImage src={product.image} alt={product.name} />
              <h3 style={{ fontSize: '1.1rem', margin: '1rem 0 0.5rem' }}>{product.name}</h3>
              <p style={{ margin: '0.5rem 0' }}>₹{product.price}</p>
              <p style={{ margin: '0.5rem 0', color: '#f5a623', fontSize: '1.1rem' }}>
                {renderStars(product.rating)} <span style={{ color: '#888', fontSize: '0.95rem' }}>({product.reviews.toLocaleString()} voted)</span>
              </p>
              <p style={{ fontStyle: 'italic', color: '#555', fontSize: '0.95rem' }}>&quot;{product.review}&quot;</p>
              <Link href={`/products/${product.id}`} className="animated-link">View Details</Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
} 