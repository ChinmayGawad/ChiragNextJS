"use client";
import { use } from 'react';
import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
import { useContext } from 'react';
import { CartContext } from '../../../components/CartContext';
import { useState } from 'react';

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
    reviews: 1200
  },
  {
    id: 2,
    name: 'Blue Formal Shirt',
    price: 1199,
    image: '/blue-formal-shirt.jpg',
    category: 'Shirts',
    rating: 5,
    review: 'Great for office wear, looks sharp.',
    reviews: 1200
  },
  {
    id: 3,
    name: 'Checked Casual Shirt',
    price: 999,
    image: '/checked-casual-shirt.jpg',
    category: 'Shirts',
    rating: 3,
    review: 'Nice style, but the fabric could be softer.',
    reviews: 1200
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
    reviews: 1200
  },
  {
    id: 5,
    name: 'Graphic Black T-Shirt',
    price: 599,
    image: '/graphic-black-tshirt.jpg',
    category: 'T-Shirts',
    rating: 4,
    review: 'Cool design and good quality.',
    reviews: 1200
  },
  {
    id: 6,
    name: 'Striped Navy T-Shirt',
    price: 409,
    image: '/striped-navy-tshirt.jpg',
    category: 'T-Shirts',
    rating: 3,
    review: 'Nice fit, but colors faded a bit after wash.',
    reviews: 1200
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
    reviews: 1200
  },
  {
    id: 8,
    name: 'Slim Fit Chinos',
    price: 909,
    image: '/slim-fit-chinos.jpg',
    category: 'Pants',
    rating: 4,
    review: 'Fits well and looks stylish.',
    reviews: 1200
  },
  {
    id: 9,
    name: 'Black Formal Trousers',
    price: 999,
    image: '/black-formal-trousers.jpg',
    category: 'Pants',
    rating: 4,
    review: 'Perfect for formal occasions.',
    reviews: 1200
  },
];

function renderStars(rating) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

export default function ProductDetails({ params }) {
  const { id } = use(params);
  const product = products.find(p => p.id === Number(id));
  if (!product) return notFound();

  const router = useRouter();
  const { addToCart } = useContext(CartContext);
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    addToCart(product, true);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleBuyNow() {
    addToCart(product, false);
    router.push('/cart?checkout=1');
  }

  return (
    <main style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center' }}>
      <Image src={product.image} alt={product.name} width={300} height={300} style={{ objectFit: 'cover', borderRadius: '8px' }} />
      <h1>{product.name}</h1>
      <p style={{ color: '#666', fontSize: '1rem', margin: '0.5rem 0' }}>{product.category}</p>
      <p style={{ fontSize: '1.2rem', color: '#888' }}>₹{product.price}</p>
      <p style={{ margin: '1rem 0' }}>{product.description}</p>
      <p style={{ margin: '0.5rem 0', color: '#f5a623', fontSize: '1.2rem' }}>
        {renderStars(product.rating)} <span style={{ color: '#888', fontSize: '1rem' }}>({product.reviews.toLocaleString()} voted)</span>
      </p>
      <p style={{ fontStyle: 'italic', color: '#555', fontSize: '1rem', marginBottom: '1.5rem' }}>&quot;{product.review}&quot;</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center' }}>
        <button onClick={handleAddToCart} style={{ padding: '0.75rem 2rem', background: '#222', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Add to Cart
        </button>
        <button onClick={handleBuyNow} style={{ padding: '0.75rem 2rem', background: '#ff9800', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Buy Now
        </button>
        {added && <span style={{ color: 'green', marginLeft: 8 }}>Added to cart! (+₹5 convenience fee)</span>}
      </div>
    </main>
  );
} 