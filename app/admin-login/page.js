"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import Image from "next/image";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState("");
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    // 1. Sign in with email and password
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    const { user } = data;
    if (!user) {
      setError("No user found");
      return;
    }
    // 2. Check if this email is in the admins table (not UUID)
    const { data: adminData } = await supabase.from("admins").select("id").eq("email", email).single();
    if (!adminData) {
      setError("You are not an admin.");
      return;
    }
    router.push("/admin");
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    setResetError("");
    setResetSent(false);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail || email);
    if (error) setResetError(error.message);
    else setResetSent(true);
  }

  return (
    <main className="admin-login-bg">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <Image src="/images/clothefav.jpeg" alt="Admin Logo" width={70} height={70} style={{ objectFit: 'cover', borderRadius: 12 }} />
        </div>
        <h2 className="admin-login-title">Admin Login</h2>
        <form onSubmit={handleLogin} className="admin-login-form">
          <input type="email" placeholder="Admin Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login as Admin"}</button>
        </form>
        <button style={{marginTop:8, background:'none', color:'#114488', border:'none', cursor:'pointer', fontWeight:600, fontSize:'1rem'}} onClick={()=>{
          setResetEmail(email); setResetSent(false); setResetError("");
          document.getElementById('admin-reset-form').style.display = 'block';
        }}>Forgot password?</button>
        <form id="admin-reset-form" style={{display:'none', marginTop:10}} onSubmit={handleResetPassword}>
          <input type="email" placeholder="Enter your email" value={resetEmail} onChange={e=>setResetEmail(e.target.value)} required />
          <button type="submit" style={{marginTop:4}}>Send Reset Link</button>
        </form>
        {resetSent && <p style={{color:'#1bbf4c', marginTop:8}}>Password reset link sent! Check your email.</p>}
        {resetError && <p style={{color:'#ff4d4f', marginTop:8}}>{resetError}</p>}
        {error && <p className="admin-login-error">{error}</p>}
      </div>
      <style jsx global>{`
        .admin-login-bg {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(120deg, #e0e7ff 0%, #fffbe7 100%);
          animation: fadeInBg 1.2s cubic-bezier(.4,0,.2,1) both;
        }
        .admin-login-card {
          background: rgba(255,255,255,0.98);
          border-radius: 22px;
          box-shadow: 0 8px 40px #11448822, 0 1.5px 8px #ff980033;
          padding: 2.5rem 2.2rem 2rem 2.2rem;
          min-width: 320px;
          max-width: 370px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          overflow: hidden;
          animation: popIn 0.7s cubic-bezier(.4,0,.2,1);
        }
        .admin-login-logo {
          margin-bottom: 18px;
          animation: logoPop 1.1s cubic-bezier(.4,0,.2,1);
        }
        .admin-login-title {
          color: #114488;
          font-weight: 900;
          font-size: 2.1rem;
          margin-bottom: 24px;
          letter-spacing: 1px;
          text-shadow: 0 2px 8px #11448822;
        }
        .admin-login-form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .admin-login-form input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1.5px solid #e3f0ff;
          font-size: 1.08rem;
          background: #f6fafd;
          margin-bottom: 2px;
          transition: border 0.2s, box-shadow 0.2s;
        }
        .admin-login-form input:focus {
          border: 1.5px solid #114488;
          outline: none;
          box-shadow: 0 2px 8px #11448822;
        }
        .admin-login-form button {
          width: 100%;
          padding: 13px 0;
          background: linear-gradient(90deg, #114488 60%, #ff9800 100%);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-weight: 800;
          font-size: 1.15rem;
          margin-top: 8px;
          box-shadow: 0 2px 8px #11448822;
          letter-spacing: 1px;
          transition: background 0.2s, transform 0.18s, box-shadow 0.18s;
          cursor: pointer;
        }
        .admin-login-form button:active {
          transform: scale(0.97);
        }
        .admin-login-error {
          color: #ff4d4f;
          margin-top: 18px;
          font-weight: 700;
          font-size: 1.08rem;
          letter-spacing: 0.5px;
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
        @media (max-width: 500px) {
          .admin-login-card {
            min-width: 0;
            max-width: 98vw;
            padding: 1.2rem 0.5rem 1.2rem 0.5rem;
          }
        }
      `}</style>
    </main>
  );
}
