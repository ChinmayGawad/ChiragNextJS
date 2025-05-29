"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
      setLoading(false);
    };
    getUser();
  }, []);

  if (loading) return <div style={{textAlign:'center',marginTop:40}}>Loading profile...</div>;
  if (!user) return <div style={{textAlign:'center',marginTop:40}}>Not logged in.</div>;

  return (
    <main style={{ maxWidth: 400, margin: '4rem auto', padding: 24, background: '#fff', borderRadius: 16, boxShadow: '0 4px 16px #11448822' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 24 }}>User Profile</h1>
      <div style={{ fontSize: 18, marginBottom: 12 }}><b>Email:</b> {user.email}</div>
      <div style={{ fontSize: 16, marginBottom: 12 }}><b>User ID:</b> {user.id}</div>
      <button onClick={async () => { await supabase.auth.signOut(); location.reload(); }} style={{ width: '100%', padding: 12, background: '#ff9800', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, marginTop: 24 }}>Logout</button>
    </main>
  );
}