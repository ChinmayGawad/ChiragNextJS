"use client";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CartProvider } from "./CartContext";
import { ThemeProvider, ThemeSwitcher } from "./ThemeContext";
import { supabase } from '../lib/supabaseClient';

export default function ClientLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  // Hide menu for all /admin and /admin-login pages (case-insensitive, robust)
  const hideMenu = /^\/admin(\/|$)/i.test(pathname) || pathname === '/admin-login' || pathname === '/login';
  const router = useRouter();

  // Remove stuck authentication check: always allow rendering (since admin/user auth is handled on page level)
  // const [authChecked, setAuthChecked] = useState(false);

  // useEffect(() => {
  //   if (typeof window === 'undefined') return;
  //   if (pathname === "/login" || pathname === "/admin-login") {
  //     setAuthChecked(true);
  //     return;
  //   }
  //   async function checkAuth() {
  //     const { data: { user }, error } = await supabase.auth.getUser();
  //     console.log('Supabase auth check:', { user, error }); // Debug log
  //     if (!user) {
  //       router.replace("/login");
  //     } else {
  //       setAuthChecked(true);
  //     }
  //   }
  //   checkAuth();
  // }, [pathname, router]);

  // Responsive menu logic: close menu on navigation
  useEffect(() => {
    if (menuOpen) {
      const close = () => setMenuOpen(false);
      window.addEventListener('resize', close);
      window.addEventListener('orientationchange', close);
      return () => {
        window.removeEventListener('resize', close);
        window.removeEventListener('orientationchange', close);
      };
    }
  }, [menuOpen]);

  return (
    <ThemeProvider>
      <CartProvider>
        {!hideMenu && (
          <nav
            className="main-nav"
            style={{
              position: 'sticky', top: 0, zIndex: 100,
              background: 'linear-gradient(90deg, #114488 60%, #ff9800 100%)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              padding: '0.7rem 3vw 0.7rem 2vw',
              display: 'flex', alignItems: 'center', gap: 32,
              minHeight: 70,
            }}
          >
            <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <img src="/images/clothefav.jpeg" alt="Logo" width={44} height={44} style={{ borderRadius: 12, boxShadow: '0 2px 8px #fff4', objectFit: 'cover' }} />
              <span style={{ fontWeight: 800, fontSize: 26, color: '#fff', letterSpacing: 1, textShadow: '0 2px 8px #11448844' }}>Trendy Threads</span>
            </a>
            <button
              className="hamburger-menu"
              aria-label="Open menu"
              onClick={() => setMenuOpen((v) => !v)}
              style={{ marginLeft: 18, background: 'none', border: 'none', display: 'none', cursor: 'pointer' }}
            >
              <span style={{ display: 'block', width: 32, height: 32 }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect y="6" width="32" height="4" rx="2" fill="#fff"/><rect y="14" width="32" height="4" rx="2" fill="#fff"/><rect y="22" width="32" height="4" rx="2" fill="#fff"/></svg>
              </span>
            </button>
            <div
              className={`nav-links${menuOpen ? ' open' : ''}`}
              style={{
                display: menuOpen ? 'flex' : 'flex',
                gap: 24, alignItems: 'center', marginLeft: 40,
                ...(menuOpen && window.innerWidth <= 900 ? {
                  flexDirection: 'column',
                  position: 'absolute',
                  left: 0, right: 0, top: 70,
                  background: 'linear-gradient(90deg, #114488 0%, #ff9800 100%)',
                  borderRadius: '0 0 24px 24px',
                  boxShadow: '0 8px 32px #11448822',
                  zIndex: 110,
                  padding: '1.5rem 2rem 2rem 2rem',
                  gap: 18,
                  animation: 'fadeIn 0.3s',
                } : {})
              }}
            >
              <a href="/" className="nav-link-animated" style={{ color: '#fff', fontWeight: 600, fontSize: 18, padding: '0.5em 1.2em', borderRadius: 8, transition: 'background 0.2s', textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>
                Home
              </a>
              <a href="/products" className="nav-link-animated" style={{ color: '#fff', fontWeight: 600, fontSize: 18, padding: '0.5em 1.2em', borderRadius: 8, transition: 'background 0.2s', textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>
                Products
              </a>
              <a href="/cart" className="nav-link-animated" style={{ color: '#fff', fontWeight: 600, fontSize: 18, padding: '0.5em 1.2em', borderRadius: 8, transition: 'background 0.2s', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => setMenuOpen(false)}>
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M6 6h15l-1.5 9h-13z" stroke="#fff" strokeWidth="2"/><circle cx="9" cy="20" r="1.5" fill="#fff"/><circle cx="18" cy="20" r="1.5" fill="#fff"/></svg>
                Cart
              </a>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 18 }}>
              <ThemeSwitcher />
            </div>
          </nav>
        )}
        {/* Responsive styles for hamburger menu */}
        <style jsx global>{`
          @media (max-width: 900px) {
            .main-nav .nav-links {
              display: none !important;
            }
            .main-nav .nav-links.open {
              display: flex !important;
              flex-direction: column;
              position: absolute;
              left: 0; right: 0; top: 70px;
              background: linear-gradient(90deg, #114488 0%, #ff9800 100%);
              border-radius: 0 0 24px 24px;
              box-shadow: 0 8px 32px #11448822;
              z-index: 110;
              padding: 1.5rem 2rem 2rem 2rem;
              gap: 18px;
              animation: fadeIn 0.3s;
            }
            .main-nav .hamburger-menu {
              display: block !important;
            }
          }
          .main-nav .nav-link-animated:hover {
            background: #fff2;
            color: #ffe082;
          }
        `}</style>
        {children}
      </CartProvider>
    </ThemeProvider>
  );
}
