"use client";
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    // Only allow admin login via login, not registration
    if (isAdmin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        setError(error.message);
      } else {
        router.push('/admin');
      }
      return;
    }
    // User login
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.push('/');
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');
    if (!registerEmail || !registerPassword) {
      setRegisterError('Please fill all fields.');
      return;
    }
    // Prevent admin registration
    if (isAdmin) {
      setRegisterError('Registration is only for users, not admins.');
      return;
    }
    const { error } = await supabase.auth.signUp({ email: registerEmail, password: registerPassword });
    if (error) {
      setRegisterError(error.message);
    } else {
      setRegisterSuccess('Registration successful! Please check your email to verify your account.');
      setRegisterEmail('');
      setRegisterPassword('');
    }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #e3f0ff 0%, #ffffff 100%)' }}>
      <div style={{
        maxWidth: 400,
        width: '100%',
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 8px 32px #11448822',
        padding: '2.5rem 2rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        animation: 'fadeIn 0.7s cubic-bezier(.4,0,.2,1) both',
      }}>
        <img src="/images/clothefav.jpeg" alt="Logo" style={{ width: 72, height: 72, borderRadius: 16, marginBottom: 16, boxShadow: '0 2px 8px #11448833' }} />
        <h1 style={{ textAlign: 'center', marginBottom: 18, fontWeight: 800, fontSize: 28, color: '#114488', letterSpacing: 1 }}>Sign in to Cloth WebJS</h1>
        <div style={{ color: '#4fc3f7', fontWeight: 600, fontSize: 16, marginBottom: 18, textAlign: 'center' }}>Welcome to the most modern and friendly shopping experience for clothing!</div>
        {!showRegister ? (
          <>
            <form onSubmit={handleLogin} style={{ width: '100%' }}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ width: '100%', marginBottom: 16, padding: 12, borderRadius: 8, border: '1px solid #b3d1f7', fontSize: 16, background: '#f6fafd' }}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ width: '100%', marginBottom: 16, padding: 12, borderRadius: 8, border: '1px solid #b3d1f7', fontSize: 16, background: '#f6fafd' }}
              />
              <label style={{ display: 'flex', alignItems: 'center', marginBottom: 16, fontSize: 15, color: '#114488', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={isAdmin}
                  onChange={e => setIsAdmin(e.target.checked)}
                  style={{ marginRight: 8 }}
                />
                Login as Admin
              </label>
              {error && <div style={{ color: '#f44336', marginBottom: 12, textAlign: 'center', fontWeight: 600 }}>{error}</div>}
              <button type="submit" style={{ width: '100%', padding: 14, background: 'linear-gradient(90deg, #114488 60%, #4fc3f7 100%)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 18, boxShadow: '0 2px 8px #11448833', marginTop: 8, transition: 'background 0.18s', cursor: 'pointer' }} disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            <div style={{ marginTop: 18, textAlign: 'center', color: '#888', fontSize: 15 }}>
              Don't have an account?{' '}
              <button type="button" onClick={() => setShowRegister(true)} style={{ color: '#114488', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }} disabled={isAdmin}>Register</button>
            </div>
          </>
        ) : (
          <>
            <form onSubmit={handleRegister} style={{ width: '100%' }}>
              <input
                type="email"
                placeholder="Email"
                value={registerEmail}
                onChange={e => setRegisterEmail(e.target.value)}
                required
                style={{ width: '100%', marginBottom: 16, padding: 12, borderRadius: 8, border: '1px solid #b3d1f7', fontSize: 16, background: '#f6fafd' }}
              />
              <input
                type="password"
                placeholder="Password"
                value={registerPassword}
                onChange={e => setRegisterPassword(e.target.value)}
                required
                style={{ width: '100%', marginBottom: 16, padding: 12, borderRadius: 8, border: '1px solid #b3d1f7', fontSize: 16, background: '#f6fafd' }}
              />
              {registerError && <div style={{ color: '#f44336', marginBottom: 12, textAlign: 'center', fontWeight: 600 }}>{registerError}</div>}
              {registerSuccess && <div style={{ color: '#4caf50', marginBottom: 12, textAlign: 'center', fontWeight: 600 }}>{registerSuccess}</div>}
              <button type="submit" style={{ width: '100%', padding: 14, background: 'linear-gradient(90deg, #114488 60%, #4fc3f7 100%)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 18, boxShadow: '0 2px 8px #11448833', marginTop: 8, transition: 'background 0.18s', cursor: 'pointer' }}>
                Register
              </button>
            </form>
            <div style={{ marginTop: 18, textAlign: 'center', color: '#888', fontSize: 15 }}>
              Already have an account?{' '}
              <button type="button" onClick={() => setShowRegister(false)} style={{ color: '#114488', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>Sign In</button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}