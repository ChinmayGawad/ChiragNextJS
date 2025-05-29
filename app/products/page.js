"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

function renderStars(rating) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

function ParallaxImage({ src, alt, label, onQuickView }) {
  const ref = useRef();
  const [imgSrc, setImgSrc] = useState(src);
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
  function handleError() {
    setImgSrc(`https://via.placeholder.com/140x140?text=${label?.toUpperCase() || 'IMG'}`);
  }
  return (
    <div
      ref={ref}
      className="product-img-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <span className="product-img-gradient" />
      <Image src={imgSrc} alt={alt} width={140} height={140} style={{ objectFit: 'cover', borderRadius: '8px' }} onError={handleError} />
      <button className="quick-view-btn" title="Quick View" onClick={onQuickView}>
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" stroke="#114488" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="#114488" strokeWidth="2"/></svg>
      </button>
    </div>
  );
}

function confettiBurst(ref) {
  if (!ref.current) return;
  const canvas = document.createElement('canvas');
  canvas.width = 220;
  canvas.height = 80;
  canvas.style.position = 'absolute';
  canvas.style.left = '50%';
  canvas.style.top = '0';
  canvas.style.transform = 'translateX(-50%)';
  canvas.style.pointerEvents = 'none';
  ref.current.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let pieces = Array.from({length: 24}, () => ({
    x: Math.random()*canvas.width, y: 0,
    r: Math.random()*6+4, c: `hsl(${Math.random()*360},90%,60%)`,
    vx: Math.random()*4-2, vy: Math.random()*-2-2
  }));
  let frame = 0;
  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for (let p of pieces) {
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,2*Math.PI);
      ctx.fillStyle = p.c; ctx.fill();
      p.x += p.vx; p.y += p.vy; p.vy += 0.18;
    }
    frame++;
    if (frame < 32) requestAnimationFrame(draw);
    else canvas.remove();
  }
  draw();
}

function ProductGrid({ products, bestSellerLabel = 'Best Seller' }) {
  const [quickView, setQuickView] = useState(null);
  const modalRef = useRef();
  useEffect(() => {
    if (quickView && modalRef.current) confettiBurst(modalRef);
  }, [quickView]);
  return (
    <>
      <div className="product-grid" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
        {products.length === 0 && <p>No products available.</p>}
        {products.map((product, idx) => (
          <div
            key={product.id}
            className={`animated-card fadein-card product-card-tilt${idx === 0 ? ' best-seller-card' : ''}`}
            style={{ border: '1px solid #eee', borderRadius: '8px', padding: '1rem', width: '220px', textAlign: 'center', animationDelay: `${idx * 90}ms` }}
          >
            {idx === 0 && (
              <span className="best-seller-badge animated-float">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2l2.09 6.26L20 9.27l-5 3.64L16.18 21 12 17.27 7.82 21 9 12.91l-5-3.64 5.91-.91L12 2z" fill="#ff9800"/></svg>
                {bestSellerLabel}
              </span>
            )}
            <ParallaxImage src={product.image} alt={product.name} label={product.label} onQuickView={() => setQuickView(product)} />
            <h3 style={{ fontSize: '1.1rem', margin: '1rem 0 0.5rem' }}>{product.name}</h3>
            <p style={{ margin: '0.5rem 0' }}>₹{product.price}</p>
            <p style={{ margin: '0.5rem 0', color: '#f5a623', fontSize: '1.1rem' }}>
              {renderStars(product.rating)} <span style={{ color: '#888', fontSize: '0.95rem' }}>({product.reviews?.toLocaleString() || 0} voted)</span>
            </p>
            <p style={{ fontStyle: 'italic', color: '#555', fontSize: '0.95rem' }}>&quot;{product.review}&quot;</p>
            <Link href={`/products/${product.id}`} className="animated-link ripple-link">View Details</Link>
          </div>
        ))}
      </div>
      {quickView && (
        <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.32)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setQuickView(null)}>
          <div ref={modalRef} style={{ background: '#fff', borderRadius: 16, padding: 32, minWidth: 320, maxWidth: 400, boxShadow: '0 8px 32px 0 #ff980055, 0 0 0 8px #11448811', position: 'relative', animation: 'pulse 1.2s infinite alternate' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setQuickView(null)} style={{ position: 'absolute', right: 16, top: 16, background: 'none', border: 'none', fontSize: 24, color: '#888', cursor: 'pointer' }}>&times;</button>
            <span className="sparkle-icon animated-float" style={{ position: 'absolute', left: 24, top: 18, zIndex: 2 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="#ff9800" strokeWidth="2" strokeLinecap="round"/></svg>
            </span>
            <Image src={quickView.image} alt={quickView.name} width={220} height={220} style={{ objectFit: 'cover', borderRadius: 12, marginBottom: 16 }} onError={e => { e.target.src = `https://via.placeholder.com/220x220?text=${quickView.label?.toUpperCase() || 'IMG'}`; }} />
            <h2 style={{ fontSize: 22, margin: '1rem 0 0.5rem' }}>{quickView.name}</h2>
            <p style={{ margin: '0.5rem 0', color: '#f5a623', fontSize: '1.1rem' }}>{renderStars(quickView.rating)} <span style={{ color: '#888', fontSize: '0.95rem' }}>({quickView.reviews?.toLocaleString() || 0} voted)</span></p>
            <p style={{ fontStyle: 'italic', color: '#555', fontSize: '1rem', marginBottom: 8 }}>&quot;{quickView.review}&quot;</p>
            <p style={{ fontWeight: 600, fontSize: 18, color: '#114488', marginBottom: 8 }}>₹{quickView.price}</p>
            <Link href={`/products/${quickView.id}`} className="animated-link ripple-link">Go to Product Page</Link>
          </div>
        </div>
      )}
    </>
  );
}

function Sidebar({ user, orders, onLogout }) {
  return (
    <aside style={{
      minWidth: 260,
      maxWidth: 320,
      background: 'linear-gradient(135deg, #e3f0ff 0%, #ffffff 100%)',
      borderRadius: 18,
      boxShadow: '0 2px 12px #11448811',
      padding: '2rem 1.5rem',
      marginRight: 32,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 24,
      height: 'fit-content',
    }}>
      <div style={{ textAlign: 'center' }}>
        <img src="/images/clothefav.jpeg" alt="Profile" width={70} height={70} style={{ borderRadius: '50%', boxShadow: '0 2px 8px #11448822', marginBottom: 10, objectFit: 'cover' }} />
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#114488', marginBottom: 4 }}>{user?.full_name || 'User Name'}</h2>
        <p style={{ color: '#888', fontSize: 15 }}>{user?.email || 'user@email.com'}</p>
      </div>
      <div style={{ width: '100%' }}>
        <h3 style={{ fontSize: 18, color: '#114488', marginBottom: 10, borderBottom: '1px solid #eee', paddingBottom: 4 }}>Order History</h3>
        {orders && orders.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {orders.map((order, idx) => (
              <li key={idx} style={{ marginBottom: 10, background: '#f6fafd', borderRadius: 8, padding: '8px 12px', color: '#222', fontSize: 15 }}>
                <b>Order #{order.id}</b><br />
                {order.products?.join(', ') || 'No products'}<br />
                <span style={{ color: '#888', fontSize: 13 }}>₹{order.total} • {new Date(order.created_at).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#aaa', fontSize: 15 }}>No orders yet.</p>
        )}
      </div>
      <button onClick={onLogout} style={{ marginTop: 24, width: '100%', padding: '12px 0', background: 'linear-gradient(90deg, #114488 60%, #ff9800 100%)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 16, boxShadow: '0 2px 8px #11448822', letterSpacing: 1, transition: 'background 0.2s', cursor: 'pointer' }}>Logout</button>
    </aside>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      let { data } = await supabase.from('products').select('*');
      setProducts(data || []);
      setLoading(false);
    }
    async function fetchUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    }
    async function fetchOrders() {
      // Example: fetch orders for the current user (customize table/logic as needed)
      if (!user) return;
      let { data } = await supabase.from('orders').select('*').eq('user_id', user.id);
      setOrders(data || []);
    }
    fetchProducts();
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      (async () => {
        let { data } = await supabase.from('orders').select('*').eq('user_id', user.id);
        setOrders(data || []);
      })();
    }
  }, [user]);

  const shirts = products.filter(p => p.category === 'Shirts');
  const tshirts = products.filter(p => p.category === 'T-Shirts');
  const pants = products.filter(p => p.category === 'Pants');

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <main style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 0, minHeight: '80vh', marginTop: 32 }}>
      <Sidebar user={user} orders={orders} onLogout={handleLogout} />
      <div style={{ flex: 1, paddingLeft: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 16 }}>
        </div>
        <h1 style={{ textAlign: 'left', marginLeft: 10, color: '#114488', fontWeight: 800, fontSize: 32, marginBottom: 24 }}>Products</h1>
        {loading ? <p>Loading products...</p> : <>
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: '#114488' }}>Shirts</h2>
            <ProductGrid products={shirts} bestSellerLabel="Shirts" />
          </section>
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: '#114488' }}>T-Shirts</h2>
            <ProductGrid products={tshirts} bestSellerLabel="T-Shirts" />
          </section>
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: '#114488' }}>Pants</h2>
            <ProductGrid products={pants} bestSellerLabel="Pants" />
          </section>
        </>}
      </div>
    </main>
  );
}

if (typeof window !== 'undefined') {
  document.addEventListener('click', function(e) {
    const link = e.target.closest('.ripple-link');
    if (!link) return;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    link.appendChild(ripple);
    const rect = link.getBoundingClientRect();
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    setTimeout(() => ripple.remove(), 600);
  }, true);
}