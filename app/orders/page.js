"use client";
import { useContext } from 'react';
import { OrdersContext } from '../../components/CartContext';

export default function OrdersPage() {
  const { orders } = useContext(OrdersContext);

  return (
    <main style={{ maxWidth: 700, margin: '3rem auto', padding: 24, background: '#fff', borderRadius: 16, boxShadow: '0 4px 16px #11448822' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 32, fontWeight: 800, fontSize: 32, color: '#114488' }}>Order Summary</h1>
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#888', fontSize: 20 }}>No orders yet.</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {orders.map((order, idx) => (
            <li key={idx} style={{ marginBottom: 32, borderBottom: '1px solid #eee', paddingBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Order #{idx + 1}</div>
              <div style={{ marginBottom: 8 }}>
                <b>Items:</b>
                <ul style={{ margin: '8px 0 0 20px' }}>
                  {order.items.map((item, i) => (
                    <li key={i} style={{ fontSize: 16 }}>{item.name} - ₹{item.price}</li>
                  ))}
                </ul>
              </div>
              <div><b>Total:</b> ₹{order.total}</div>
              <div><b>Payment:</b> {order.paymentType}</div>
              <div><b>Date:</b> {order.date}</div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
