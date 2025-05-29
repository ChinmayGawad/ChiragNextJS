"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from '../../lib/supabaseClient';

export default function LoginPage() {
  const [showRegister, setShowRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState("");
  const router = useRouter();

  function clearAll() {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFullName("");
    setError("");
  }

  async function handleUserLogin(e) {
    e.preventDefault();
    setError("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else {
      // Check if user is admin
      const { user } = data;
      if (user) {
        const { data: adminData } = await supabase.from("admins").select("id").eq("id", user.id).single();
        if (adminData) {
          clearAll();
          router.push("/admin");
          return;
        }
      }
      clearAll();
      router.push("/products");
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else {
      const user = data.user;
      if (user) {
        await supabase.from('profiles').insert([
          {
            id: user.id,
            email,
            full_name: fullName,
            avatar_url: null
          }
        ]);
      }
      clearAll();
      router.push("/products");
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    setResetError("");
    setResetSent(false);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail || email);
    if (error) setResetError(error.message);
    else setResetSent(true);
  }

  function handleShowRegister(val) {
    clearAll();
    setShowRegister(val);
  }

  useEffect(() => {
    // On mount, always sign out any existing user to prevent auto-login
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        supabase.auth.signOut().then(() => {
          // Optionally, reload to clear any cached state
          window.location.reload();
        });
      }
    });
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <main className="auth-container-fadein">
      <div className="auth-container admin-login-card" style={{ borderRadius: 22, boxShadow: '0 8px 40px #11448822, 0 1.5px 8px #ff980033', padding: '2.5rem 2.2rem 2rem 2.2rem', minWidth: 320, maxWidth: 370, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden', animation: 'popIn 0.7s cubic-bezier(.4,0,.2,1)' }}>
        {!showRegister ? (
          <>
            <img src="/images/clothefav.jpeg" alt="Logo" width={70} height={70} style={{ objectFit: 'cover', borderRadius: 12, marginBottom: 18, animation: 'logoPop 1.1s cubic-bezier(.4,0,.2,1)' }} />
            <h2 className="admin-login-title" style={{ color: '#114488', fontWeight: 900, fontSize: '2.1rem', marginBottom: 24 }}>User Login</h2>
            <form onSubmit={handleUserLogin} style={{ width: '100%' }}>
              <input type="email" placeholder="Email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} required className="admin-login-input" style={{ width: '100%', marginBottom: 12, padding: '12px', borderRadius: 8, border: '1.5px solid #e3f0ff', fontSize: '1.05rem', background: '#fff', transition: 'border 0.2s, box-shadow 0.2s' }} />
              <input type="password" placeholder="Password" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} required className="admin-login-input" style={{ width: '100%', marginBottom: 12, padding: '12px', borderRadius: 8, border: '1.5px solid #e3f0ff', fontSize: '1.05rem', background: '#fff', transition: 'border 0.2s, box-shadow 0.2s' }} />
              <button type="submit" className="admin-login-btn" style={{ width: '100%', marginBottom: 16, padding: '12px 0', background: 'linear-gradient(90deg, #114488 60%, #ff9800 100%)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 800, fontSize: '1.08rem', boxShadow: '0 2px 8px #11448822', letterSpacing: 1, transition: 'background 0.2s, transform 0.18s, box-shadow 0.18s', cursor: 'pointer' }}>Login</button>
            </form>
            <button style={{marginTop:8, background:'none', color:'#114488', border:'none', cursor:'pointer', fontWeight:600, fontSize:'1rem'}} onClick={()=>{
              setResetEmail(email); setResetSent(false); setResetError("");
              document.getElementById('user-reset-form').style.display = 'block';
            }}>Forgot password?</button>
            <form id="user-reset-form" style={{display:'none', marginTop:10}} onSubmit={handleResetPassword}>
              <input type="email" placeholder="Enter your email" value={resetEmail} onChange={e=>setResetEmail(e.target.value)} required className="admin-login-input" style={{ width: '100%', marginBottom: 8, padding: '12px', borderRadius: 8, border: '1.5px solid #e3f0ff', fontSize: '1.05rem', background: '#fff' }} />
              <button type="submit" className="admin-login-btn" style={{marginTop:4, width:'100%', padding: '10px 0', background: 'linear-gradient(90deg, #114488 60%, #ff9800 100%)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>Send Reset Link</button>
            </form>
            {resetSent && <p style={{color:'#1bbf4c', marginTop:8}}>Password reset link sent! Check your email.</p>}
            {resetError && <p style={{color:'#ff4d4f', marginTop:8}}>{resetError}</p>}
            <button style={{ width: "100%", margin: "1rem 0 0.5rem 0", padding: 12, fontSize: 18, background: '#fff', color: '#114488', border: '2px solid #114488', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }} onClick={() => router.push('/admin-login')}>Admin Login</button>
            <button style={{ width: "100%", margin: "0.5rem 0", padding: 12, fontSize: 18, background: '#fff', color: '#114488', border: '2px solid #114488', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }} onClick={() => handleShowRegister(true)}>Register</button>
            {error && <p style={{ color: "#ff4d4f", marginTop: 8 }}>{error}</p>}
          </>
        ) : (
          <div style={{ maxWidth: 400, margin: "2rem auto" }}>
            <h2>User Registration</h2>
            <form onSubmit={handleRegister}>
              <input type="text" placeholder="Full Name" value={fullName} onChange={e => { setFullName(e.target.value); setError(""); }} required style={{ width: "100%", marginBottom: 8 }} />
              <input type="email" placeholder="Email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} required style={{ width: "100%", marginBottom: 8 }} />
              <input type="password" placeholder="Password" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} required style={{ width: "100%", marginBottom: 8 }} />
              <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => { setConfirmPassword(e.target.value); setError(""); }} required style={{ width: "100%", marginBottom: 8 }} />
              <button type="submit" style={{ width: "100%" }}>Register</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button onClick={() => handleShowRegister(false)} style={{ marginTop: 16 }}>Back to Login</button>
          </div>
        )}
      </div>
      <style jsx global>{`
        .auth-container-fadein {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(120deg, #e0e7ff 0%, #fffbe7 100%);
          animation: fadeInBg 1.2s cubic-bezier(.4,0,.2,1) both;
        }
        .auth-container {
          background: rgba(255,255,255,0.95);
          border-radius: 18px;
          box-shadow: 0 8px 40px #11448822, 0 1.5px 8px #ff980033;
          padding: 2.2rem 1.5rem 2rem 1.5rem;
          min-width: 270px;
          max-width: 370px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          overflow: hidden;
          animation: popIn 0.7s cubic-bezier(.4,0,.2,1);
        }
        .admin-login-card { border-radius: 22px !important; }
        .admin-login-title { color: #114488; font-weight: 900; font-size: 2.1rem; margin-bottom: 24px; }
        .admin-login-input:focus { border: 1.5px solid #114488; outline: none; box-shadow: 0 2px 8px #11448822; }
        .admin-login-btn:active { transform: scale(0.97); }
        @media (max-width: 500px) {
          .auth-container, .admin-login-card {
            min-width: 0;
            max-width: 98vw;
            padding: 1.2rem 0.5rem 1.2rem 0.5rem;
          }
        }
        @keyframes fadeInBg {
          from { opacity: 0; filter: blur(8px); }
          to { opacity: 1; filter: blur(0); }
        }
        @keyframes popIn {
          0% { transform: scale(0.92) translateY(40px); opacity: 0; }
          80% { transform: scale(1.04) translateY(-8px); opacity: 1; }
          100% { transform: scale(1) translateY(0); }
        }
        @keyframes logoPop {
          0% { transform: scale(0.7) rotate(-10deg); opacity: 0; }
          80% { transform: scale(1.1) rotate(3deg); opacity: 1; }
          100% { transform: scale(1) rotate(0); }
        }
        .auth-container::before {
          content: '';
          position: absolute;
          top: -60px; left: -60px;
          width: 160px; height: 160px;
          background: radial-gradient(circle, #ff9800 0%, #fff0 80%);
          opacity: 0.13;
          z-index: 0;
          pointer-events: none;
          animation: floatGlow 3.5s ease-in-out infinite alternate;
        }
        @keyframes floatGlow {
          from { transform: scale(1) translateY(0); }
          to { transform: scale(1.12) translateY(18px); }
        }
      `}</style>
    </main>
  );
}