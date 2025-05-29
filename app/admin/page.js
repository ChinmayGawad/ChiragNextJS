"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import Image from "next/image";

export default function AdminPanel() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", image: "", category: "", rating: 5, review: "", reviews: 0, label: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (!user) {
        router.replace("/admin-login");
        return;
      }
      // Check admins table by email (not id)
      const { data: adminData } = await supabase.from("admins").select("email").eq("email", user.email).single();
      if (!adminData) {
        router.replace("/admin-login");
        return;
      }
      setIsAdmin(true);
    }
    checkAdmin();
    fetchProducts();
    fetchOrders();
  }, []);

  async function fetchProducts() {
    let { data } = await supabase.from("products").select("*");
    setProducts(data || []);
  }

  async function fetchOrders() {
    let { data } = await supabase.from("orders").select("*, user: user_id (email, full_name)");
    setOrders(data || []);
  }

  async function addProduct(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    if (!form.name || !form.price || !form.image || !form.category) {
      setError("All fields are required");
      setLoading(false);
      return;
    }
    const { error } = await supabase.from("products").insert([{ ...form, price: Number(form.price), reviews: Number(form.reviews) }]);
    setLoading(false);
    if (error) setError(error.message);
    else {
      setForm({ name: "", price: "", image: "", category: "", rating: 5, review: "", reviews: 0, label: "" });
      setSuccess("Product added successfully!");
      fetchProducts();
    }
  }

  async function deleteProduct(id) {
    setLoading(true);
    const { error } = await supabase.from("products").delete().eq("id", id);
    setLoading(false);
    if (error) setError(error.message);
    else fetchProducts();
  }

  if (!isAdmin) {
    return <div className="admin-panel-loading">Checking admin status...</div>;
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin-login");
  }

  return (
    <main className="admin-panel-bg">
      <div className="admin-panel-card">
        <div className="admin-panel-header">
          <div className="admin-panel-logo-title">
            <Image src="/images/clothefav.jpeg" alt="Admin Logo" width={60} height={60} style={{ objectFit: 'cover', borderRadius: 12 }} />
            <h2>Admin Dashboard</h2>
          </div>
          <button onClick={handleLogout}>Logout</button>
        </div>
        <div className="admin-panel-content">
          <section className="admin-panel-section">
            <h3>Add Product</h3>
            <form onSubmit={addProduct} className="admin-panel-form">
              <input placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              <input placeholder="Price" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
              <input placeholder="Image (e.g. /images/clothefav.jpeg)" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} />
              <input placeholder="Category (Shirts, T-Shirts, Pants)" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
              <input placeholder="Rating (1-5)" type="number" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))} />
              <input placeholder="Review" value={form.review} onChange={e => setForm(f => ({ ...f, review: e.target.value }))} />
              <input placeholder="Number of Reviews" type="number" value={form.reviews} onChange={e => setForm(f => ({ ...f, reviews: e.target.value }))} />
              <input placeholder="Label (e.g. s1, t1, p1)" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} />
              <button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Product"}</button>
            </form>
            {error && <p className="admin-panel-error">{error}</p>}
            {success && <p className="admin-panel-success">{success}</p>}
          </section>
          <section className="admin-panel-section admin-panel-products">
            <h3>Products</h3>
            <div className="admin-panel-products-list">
              {products.length === 0 && <p className="admin-panel-empty">No products found.</p>}
              {products.map(p => (
                <div key={p.id} className="admin-panel-product-card">
                  <img src={p.image} alt={p.name} />
                  <div>
                    <b>{p.name}</b>
                    <div className="admin-panel-product-meta">{p.category} • ₹{p.price}</div>
                  </div>
                  <button onClick={() => deleteProduct(p.id)} disabled={loading}>Delete</button>
                </div>
              ))}
            </div>
          </section>
          <section className="admin-panel-section admin-panel-orders">
            <h3>Orders</h3>
            <div className="admin-panel-orders-list">
              {orders.length === 0 && <p className="admin-panel-empty">No orders found.</p>}
              {orders.map(order => (
                <div key={order.id} className="admin-panel-order-card">
                  <b>Order #{order.id}</b>
                  <div className="admin-panel-order-meta">{order.user?.full_name || order.user?.email || 'User'} • ₹{order.total} • {new Date(order.created_at).toLocaleDateString()}</div>
                  <div className="admin-panel-order-products">{order.products?.join(', ') || 'No products'}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      <style jsx global>{`
        .admin-panel-bg {
          min-height: 100vh;
          background: linear-gradient(120deg, #e0e7ff 0%, #fffbe7 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeInBg 1.2s cubic-bezier(.4,0,.2,1) both;
        }
        .admin-panel-card {
          background: rgba(255,255,255,0.98);
          border-radius: 26px;
          box-shadow: 0 8px 40px #11448822, 0 1.5px 8px #ff980033;
          padding: 2.5rem 2.2rem 2rem 2.2rem;
          min-width: 340px;
          max-width: 1200px;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          position: relative;
          overflow: hidden;
          animation: popIn 0.7s cubic-bezier(.4,0,.2,1);
        }
        .admin-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
        }
        .admin-panel-logo-title {
          display: flex;
          align-items: center;
          gap: 18px;
        }
        .admin-panel-header h2 {
          color: #114488;
          font-weight: 900;
          font-size: 2.1rem;
          letter-spacing: 1px;
          margin: 0;
          text-shadow: 0 2px 8px #11448822;
        }
        .admin-panel-header button {
          padding: 10px 24px;
          background: linear-gradient(90deg, #114488 60%, #ff9800 100%);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-weight: 800;
          font-size: 1.08rem;
          box-shadow: 0 2px 8px #11448822;
          letter-spacing: 1px;
          transition: background 0.2s, transform 0.18s, box-shadow 0.18s;
          cursor: pointer;
        }
        .admin-panel-header button:active {
          transform: scale(0.97);
        }
        .admin-panel-content {
          display: flex;
          gap: 2.5rem;
          flex-wrap: wrap;
        }
        .admin-panel-section {
          background: #f6fafd;
          border-radius: 18px;
          box-shadow: 0 2px 8px #11448808;
          padding: 1.5rem 1.2rem;
          flex: 1 1 320px;
          min-width: 320px;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }
        .admin-panel-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .admin-panel-form input {
          padding: 10px 12px;
          border-radius: 8px;
          border: 1.5px solid #e3f0ff;
          font-size: 1.05rem;
          background: #fff;
          transition: border 0.2s, box-shadow 0.2s;
        }
        .admin-panel-form input:focus {
          border: 1.5px solid #114488;
          outline: none;
          box-shadow: 0 2px 8px #11448822;
        }
        .admin-panel-form button {
          padding: 12px 0;
          background: linear-gradient(90deg, #114488 60%, #ff9800 100%);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-weight: 800;
          font-size: 1.08rem;
          margin-top: 8px;
          box-shadow: 0 2px 8px #11448822;
          letter-spacing: 1px;
          transition: background 0.2s, transform 0.18s, box-shadow 0.18s;
          cursor: pointer;
        }
        .admin-panel-form button:active {
          transform: scale(0.97);
        }
        .admin-panel-error {
          color: #ff4d4f;
          font-weight: 700;
          font-size: 1.08rem;
          letter-spacing: 0.5px;
        }
        .admin-panel-success {
          color: #1bbf4c;
          font-weight: 700;
          font-size: 1.08rem;
          letter-spacing: 0.5px;
        }
        .admin-panel-products-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .admin-panel-product-card {
          display: flex;
          align-items: center;
          gap: 18px;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 1.5px 8px #11448811;
          padding: 10px 14px;
          transition: box-shadow 0.18s, transform 0.18s;
        }
        .admin-panel-product-card:hover {
          box-shadow: 0 4px 18px #11448822;
          transform: scale(1.02);
        }
        .admin-panel-product-card img {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          object-fit: cover;
          box-shadow: 0 2px 8px #11448822;
        }
        .admin-panel-product-meta {
          color: #888;
          font-size: 0.98rem;
        }
        .admin-panel-product-card button {
          margin-left: auto;
          background: #ff4d4f;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 7px 18px;
          cursor: pointer;
          font-weight: 700;
          font-size: 1rem;
          transition: background 0.2s, transform 0.18s;
        }
        .admin-panel-product-card button:active {
          transform: scale(0.97);
        }
        .admin-panel-orders-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .admin-panel-order-card {
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 1.5px 8px #11448811;
          padding: 10px 14px;
          font-size: 1.01rem;
        }
        .admin-panel-order-meta {
          color: #114488;
          font-size: 0.98rem;
          margin-bottom: 2px;
        }
        .admin-panel-order-products {
          color: #888;
          font-size: 0.97rem;
        }
        .admin-panel-empty {
          color: #888;
          font-size: 1.05rem;
          text-align: center;
        }
        .admin-panel-loading {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          color: #114488;
          background: linear-gradient(120deg, #e0e7ff 0%, #fffbe7 100%);
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
        @media (max-width: 900px) {
          .admin-panel-content {
            flex-direction: column;
            gap: 1.5rem;
          }
        }
        @media (max-width: 500px) {
          .admin-panel-card {
            min-width: 0;
            max-width: 98vw;
            padding: 1.2rem 0.5rem 1.2rem 0.5rem;
          }
        }
      `}</style>
    </main>
  );
}