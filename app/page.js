"use client";
import styles from "./page.module.css";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleShopNow(e) {
    e.preventDefault();
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    setLoading(false);
    if (session && session.user) {
      router.push('/products');
    } else {
      router.push('/login');
    }
  }

  return (
    <main style={{ textAlign: 'center', marginTop: '4rem', minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        margin: '0 auto 2.5rem',
        maxWidth: 700,
        minHeight: 320,
        borderRadius: 32,
        padding: '3.5rem 2rem 2.5rem',
        background: 'rgba(255,255,255,0.95)',
        color: '#114488',
        fontWeight: 700,
        fontSize: 28,
        boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        <div style={{ fontSize: 44, fontWeight: 800, marginBottom: 10, letterSpacing: '-1px', position: 'relative' }}>
          Welcome to Trendy Threads
          <span style={{
            display: 'block',
            width: 80,
            height: 5,
            background: 'linear-gradient(90deg, #ff9800 40%, #114488 100%)',
            borderRadius: 8,
            margin: '16px auto 0',
          }}></span>
        </div>
        <div style={{ fontSize: 22, fontWeight: 500, marginBottom: 32, color: '#2d5c8a' }}>
          Your one-stop shop for the latest fashion trends.
        </div>
        <div style={{ marginBottom: 18, fontSize: 18, color: '#3a3a3a', fontWeight: 500 }}>Discover the latest trends in fashion at Trendy Threads.</div>
        <div style={{ marginBottom: 40, fontSize: 18, color: '#3a3a3a', fontWeight: 500 }}>Shop quality shirts, t-shirts, and pants for every occasion.</div>
        <button onClick={handleShopNow} className="animated-btn" style={{ display: 'inline-block', padding: '1.2rem 3rem', background: 'linear-gradient(90deg, #114488 60%, #ff9800 100%)', color: '#fff', borderRadius: '12px', textDecoration: 'none', fontSize: 22, fontWeight: 700, boxShadow: '0 2px 12px rgba(0,0,0,0.10)', letterSpacing: '1px', border: 'none', transition: 'background 0.2s', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }} disabled={loading}>
          {loading ? 'Checking...' : 'Shop Now'}
        </button>
      </div>
    </main>
  );
}
