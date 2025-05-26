"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useRef } from "react";

export default function Home() {
  const colorRef = useRef();
  const colorRef2 = useRef();

  useEffect(() => {
    let r = 120, g = 120, b = 255;
    let dr = 1, dg = 2, db = 3;
    let interval = setInterval(() => {
      r += dr; g += dg; b += db;
      if (r > 255 || r < 100) dr *= -1;
      if (g > 255 || g < 100) dg *= -1;
      if (b > 255 || b < 100) db *= -1;
      if (colorRef.current) {
        colorRef.current.style.background = `rgb(${r},${g},${b})`;
      }
      if (colorRef2.current) {
        colorRef2.current.style.background = `rgb(${255-r},${255-g},${255-b})`;
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <main style={{ textAlign: 'center', marginTop: '4rem' }}>
      <div ref={colorRef2} className="animated-fadein animated-float" style={{
        margin: '0 auto 2.5rem',
        maxWidth: 900,
        minHeight: 180,
        borderRadius: 32,
        padding: '2.5rem 2rem 2.5rem',
        color: '#fff',
        fontWeight: 700,
        fontSize: 32,
        transition: 'background 0.5s',
        boxShadow: '0 8px 32px rgba(0,0,0,0.13)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ fontSize: 40, fontWeight: 800, marginBottom: 12 }}>Welcome to Trendy Threads</div>
        <div style={{ fontSize: 22, fontWeight: 500 }}>Your one-stop shop for the latest fashion trends.</div>
      </div>
      <div ref={colorRef} className="animated-fadein animated-float" style={{
        margin: '0 auto 2.5rem',
        maxWidth: 900,
        minHeight: 300,
        borderRadius: 32,
        padding: '4rem 2rem 3rem',
        color: '#fff',
        fontWeight: 600,
        fontSize: 26,
        transition: 'background 0.5s',
        boxShadow: '0 8px 32px rgba(0,0,0,0.13)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ marginBottom: 24 }}>Discover the latest trends in fashion at Trendy Threads.</div>
        <div style={{ marginBottom: 40 }}>Shop quality shirts, t-shirts, and pants for every occasion.</div>
        <a href="/products" className="animated-btn" style={{ display: 'inline-block', padding: '1.2rem 3rem', background: '#222', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontSize: 22, fontWeight: 700, boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }}>
          Shop Now
        </a>
      </div>
    </main>
  );
}
