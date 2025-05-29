"use client";
import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function AdminPanel() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', image: '' });
  const [addingProduct, setAddingProduct] = useState(false);
  const addProductDialogRef = useRef();

  // Add product
  async function handleAddProduct() {
    const name = prompt('Enter product name:');
    if (!name) return;
    const price = prompt('Enter product price:');
    if (!price || isNaN(price)) return alert('Invalid price');
    const category = prompt('Enter product category:');
    const image = prompt('Enter image URL (optional):');
    const { data, error } = await supabase.from('products').insert([
      { name, price: Number(price), category, image }
    ]).select();
    if (!error && data) setProducts(products => [...products, ...data]);
    else alert(error?.message || 'Failed to add product');
  }

  async function handleAddProductSubmit(e) {
    e.preventDefault();
    setAddingProduct(true);
    const { name, price, category, image } = newProduct;
    if (!name || !price || isNaN(price) || !category) {
      alert('Please fill all fields correctly.');
      setAddingProduct(false);
      return;
    }
    const { data, error } = await supabase.from('products').insert([
      { name, price: Number(price), category, image }
    ]).select();
    setAddingProduct(false);
    if (!error && data) {
      setProducts(products => [...products, ...data]);
      setShowAddProduct(false);
      setNewProduct({ name: '', price: '', category: '', image: '' });
    } else {
      alert(error?.message || 'Failed to add product');
    }
  }

  // Delete product
  async function handleDeleteProduct(productId) {
    if (!window.confirm('Delete this product?')) return;
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (!error) setProducts(products => products.filter(p => p.id !== productId));
    else alert(error?.message || 'Failed to delete product');
  }

  // Edit product
  async function handleEditProduct(product) {
    const name = prompt('Edit product name:', product.name);
    if (!name) return;
    const price = prompt('Edit product price:', product.price);
    if (!price || isNaN(price)) return alert('Invalid price');
    const category = prompt('Edit product category:', product.category);
    const image = prompt('Edit image URL:', product.image);
    const { error } = await supabase.from('products').update({ name, price: Number(price), category, image }).eq('id', product.id);
    if (!error) setProducts(products => products.map(p => p.id === product.id ? { ...p, name, price: Number(price), category, image } : p));
    else alert(error?.message || 'Failed to update product');
  }

  // Fetch orders and products (assuming you have 'orders' and 'products' tables in Supabase)
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const { data: ordersData, error: ordersError } = await supabase.from('orders').select('*');
        const { data: productsData, error: productsError } = await supabase.from('products').select('*');
        if (ordersError || productsError) {
          setError('Failed to fetch data. ' + (ordersError?.message || '') + ' ' + (productsError?.message || ''));
        } else {
          setOrders(ordersData || []);
          setProducts(productsData || []);
        }
      } catch (e) {
        setError('Error loading admin data: ' + e.message);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // Delete order
  async function handleDeleteOrder(orderId) {
    await supabase.from('orders').delete().eq('id', orderId);
    setOrders(orders => orders.filter(o => o.id !== orderId));
  }

  // Track order (dummy status update)
  async function handleTrackOrder(orderId) {
    await supabase.from('orders').update({ status: 'Shipped' }).eq('id', orderId);
    setOrders(orders => orders.map(o => o.id === orderId ? { ...o, status: 'Shipped' } : o));
  }

  // Add order (demo, you can expand this form as needed)
  async function handleAddOrder() {
    const { data, error } = await supabase.from('orders').insert([{ status: 'Pending', created_at: new Date() }]);
    if (!error && data) setOrders(orders => [...orders, ...data]);
  }

  if (loading) return <div style={{textAlign:'center',marginTop:40}}>Loading admin panel...</div>;
  if (error) return <div style={{color:'red',textAlign:'center',marginTop:40}}>{error}</div>;

  return (
    <main style={{ maxWidth: 1000, margin: '2rem auto', padding: 32, background: 'linear-gradient(135deg, #e3f0ff 0%, #ffffff 100%)', borderRadius: 24, boxShadow: '0 8px 32px #11448822', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 32, fontWeight: 800, fontSize: 36, color: '#114488', letterSpacing: 1, textShadow: '0 2px 8px #11448822' }}>🛒 Admin Panel</h1>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 40 }}>
        <section style={{ flex: 1, minWidth: 350 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontWeight: 700, color: '#114488', fontSize: 26, margin: 0 }}>Orders</h2>
            <button onClick={handleAddOrder} style={{ padding: '12px 28px', background: 'linear-gradient(90deg, #114488 60%, #4fc3f7 100%)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 18, boxShadow: '0 2px 8px #11448833', cursor: 'pointer', transition: 'background 0.18s' }}>+ Add Dummy Order</button>
          </div>
          <div style={{ overflowX: 'auto', borderRadius: 12, boxShadow: '0 2px 8px #11448811' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 12, overflow: 'hidden' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(90deg, #e3f0ff 60%, #b3d1f7 100%)' }}>
                  <th style={{ padding: 14, border: 'none', fontWeight: 700, color: '#114488', fontSize: 17 }}>Order ID</th>
                  <th style={{ padding: 14, border: 'none', fontWeight: 700, color: '#114488', fontSize: 17 }}>User ID</th>
                  <th style={{ padding: 14, border: 'none', fontWeight: 700, color: '#114488', fontSize: 17 }}>Status</th>
                  <th style={{ padding: 14, border: 'none', fontWeight: 700, color: '#114488', fontSize: 17 }}>Created At</th>
                  <th style={{ padding: 14, border: 'none', fontWeight: 700, color: '#114488', fontSize: 17 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32, color: '#aaa', fontSize: 20 }}>No orders found.</td></tr>
                )}
                {orders.map(order => (
                  <tr key={order.id} style={{ transition: 'background 0.2s', background: order.status === 'Shipped' ? '#e3ffe3' : 'inherit' }}>
                    <td style={{ padding: 12, borderBottom: '1px solid #e3eaf7', fontWeight: 600 }}>{order.id}</td>
                    <td style={{ padding: 12, borderBottom: '1px solid #e3eaf7', color: '#4fc3f7', fontWeight: 600 }}>{order.user_id || '-'}</td>
                    <td style={{ padding: 12, borderBottom: '1px solid #e3eaf7', fontWeight: 600 }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 14px',
                        borderRadius: 8,
                        background: order.status === 'Shipped' ? '#4fc3f7' : '#ff9800',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 15
                      }}>{order.status || 'Pending'}</span>
                    </td>
                    <td style={{ padding: 12, borderBottom: '1px solid #e3eaf7', color: '#888', fontWeight: 500 }}>{order.created_at ? new Date(order.created_at).toLocaleString() : '-'}</td>
                    <td style={{ padding: 12, borderBottom: '1px solid #e3eaf7' }}>
                      <button onClick={() => handleTrackOrder(order.id)} style={{ marginRight: 10, padding: '7px 18px', background: '#4fc3f7', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 1px 4px #4fc3f733', transition: 'background 0.18s' }}>Mark Shipped</button>
                      <button onClick={() => handleDeleteOrder(order.id)} style={{ padding: '7px 18px', background: '#f44336', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 1px 4px #f4433633', transition: 'background 0.18s' }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section style={{ flex: 1, minWidth: 350 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontWeight: 700, color: '#114488', fontSize: 26, margin: 0 }}>Products</h2>
            <button onClick={() => setShowAddProduct(true)} style={{ padding: '12px 28px', background: 'linear-gradient(90deg, #114488 60%, #4fc3f7 100%)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 18, boxShadow: '0 2px 8px #11448833', cursor: 'pointer', transition: 'background 0.18s' }}>+ Add Product</button>
          </div>
          {/* Add Product Dialog */}
          {showAddProduct && (
            <div ref={addProductDialogRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <form onSubmit={handleAddProductSubmit} style={{ background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px #11448833', padding: '2.5rem 2rem 2rem', minWidth: 340, maxWidth: 380, display: 'flex', flexDirection: 'column', gap: 18, position: 'relative' }}>
                <button type="button" onClick={() => setShowAddProduct(false)} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer', fontWeight: 700 }} title="Close">×</button>
                <h3 style={{ textAlign: 'center', marginBottom: 8, fontWeight: 800, fontSize: 22, color: '#114488' }}>Add New Product</h3>
                <label style={{ fontWeight: 600, color: '#114488' }}>Product Name
                  <input type="text" value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} required style={{ width: '100%', marginTop: 6, padding: 10, borderRadius: 8, border: '1px solid #b3d1f7', fontSize: 16, background: '#f6fafd' }} />
                </label>
                <label style={{ fontWeight: 600, color: '#114488' }}>Price (₹)
                  <input type="number" min="0" value={newProduct.price} onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))} required style={{ width: '100%', marginTop: 6, padding: 10, borderRadius: 8, border: '1px solid #b3d1f7', fontSize: 16, background: '#f6fafd' }} />
                </label>
                <label style={{ fontWeight: 600, color: '#114488' }}>Category
                  <input type="text" value={newProduct.category} onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))} required style={{ width: '100%', marginTop: 6, padding: 10, borderRadius: 8, border: '1px solid #b3d1f7', fontSize: 16, background: '#f6fafd' }} />
                </label>
                <label style={{ fontWeight: 600, color: '#114488' }}>Image URL
                  <input type="text" value={newProduct.image} onChange={e => setNewProduct(p => ({ ...p, image: e.target.value }))} placeholder="https://..." style={{ width: '100%', marginTop: 6, padding: 10, borderRadius: 8, border: '1px solid #b3d1f7', fontSize: 16, background: '#f6fafd' }} />
                </label>
                <button type="submit" disabled={addingProduct} style={{ width: '100%', padding: 14, background: 'linear-gradient(90deg, #114488 60%, #4fc3f7 100%)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 18, boxShadow: '0 2px 8px #11448833', marginTop: 8, transition: 'background 0.18s', cursor: 'pointer' }}>{addingProduct ? 'Adding...' : 'Add Product'}</button>
              </form>
            </div>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18 }}>
            {products.length === 0 && <div style={{ color: '#aaa', fontSize: 20 }}>No products found.</div>}
            {products.map(product => (
              <div key={product.id} style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px #11448811', padding: 18, minWidth: 180, maxWidth: 220, flex: '1 1 180px', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'box-shadow 0.18s', border: '1px solid #e3eaf7' }}>
                <img src={product.image || '/images/clothefav.jpeg'} alt={product.name} style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 10, marginBottom: 10, boxShadow: '0 1px 4px #11448822' }} />
                <div style={{ fontWeight: 700, fontSize: 18, color: '#114488', marginBottom: 6 }}>{product.name}</div>
                <div style={{ color: '#4fc3f7', fontWeight: 600, fontSize: 16, marginBottom: 6 }}>₹{product.price}</div>
                <div style={{ color: '#888', fontSize: 14, marginBottom: 10 }}>{product.category || 'Product'}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => handleEditProduct(product)} style={{ padding: '6px 14px', background: '#ff9800', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 15, cursor: 'pointer', boxShadow: '0 1px 4px #ff980033', transition: 'background 0.18s' }}>Edit</button>
                  <button onClick={() => handleDeleteProduct(product.id)} style={{ padding: '6px 14px', background: '#f44336', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 15, cursor: 'pointer', boxShadow: '0 1px 4px #f4433633', transition: 'background 0.18s' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div style={{ marginTop: 40, textAlign: 'center', color: '#888', fontSize: 16 }}>
        <b>Tip:</b> All sections are fully interactive. Manage orders and products easily!
      </div>
    </main>
  );
}
