"use client";
import { useContext, useState, useEffect, useRef } from "react";
import { CartContext, OrdersContext } from "../../components/CartContext";
import { useSearchParams } from "next/navigation";

function validateCard(card) {
  return (
    /^\d{16}$/.test(card.number) &&
    /^\d{2}\/\d{2}$/.test(card.expiry) &&
    /^\d{3}$/.test(card.cvv)
  );
}
function validateUPI(upi) {
  return /^[\w.-]+@[\w.-]+$/.test(upi);
}

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const { addOrder } = useContext(OrdersContext);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentType, setPaymentType] = useState("card");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "" });
  const [upi, setUPI] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const searchParams = useSearchParams();
  const [address, setAddress] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    mobile: ''
  });
  const confettiRef = useRef();
  useEffect(() => {
    if (success && typeof success === 'object' && confettiRef.current) {
      const canvas = confettiRef.current;
      const ctx = canvas.getContext('2d');
      const W = canvas.width = 400;
      const H = canvas.height = 200;
      let pieces = Array.from({length: 80}, () => ({
        x: Math.random()*W, y: Math.random()*H/2,
        r: Math.random()*8+4, c: `hsl(${Math.random()*360},90%,60%)`,
        vx: Math.random()*4-2, vy: Math.random()*-2-2
      }));
      let frame = 0;
      function draw() {
        ctx.clearRect(0,0,W,H);
        for (let p of pieces) {
          ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,2*Math.PI);
          ctx.fillStyle = p.c; ctx.fill();
          p.x += p.vx; p.y += p.vy; p.vy += 0.1;
        }
        frame++;
        if (frame < 60) requestAnimationFrame(draw);
      }
      draw();
    }
  }, [success]);

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  function handleCheckout(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    // Address validation
    if (!address.name || !address.address || !address.city || !address.state || !address.pincode || !address.mobile) {
      setError("All address fields are required.");
      return;
    }
    if (!/^\d{6}$/.test(address.pincode)) {
      setError("Pincode must be 6 digits.");
      return;
    }
    if (!/^\d{10}$/.test(address.mobile)) {
      setError("Mobile number must be 10 digits.");
      return;
    }
    if (paymentType === "card") {
      if (!validateCard(card)) {
        setError("Invalid card details. Card number must be 16 digits, expiry MM/YY, CVV 3 digits.");
        return;
      }
    } else if (paymentType === "upi") {
      if (!validateUPI(upi)) {
        setError("Invalid UPI ID.");
        return;
      }
    }
    let method = paymentType === 'card' ? 'Card' : paymentType === 'upi' ? 'UPI' : 'Cash on Delivery';
    const order = {
      items: cart,
      total,
      paymentType: method,
      date: new Date().toLocaleString()
    };
    addOrder(order);
    setSuccess({
      message: "Payment successful! Thank you for your purchase.",
      method,
      products: cart.map(item => item.name)
    });
    clearCart();
  }

  if (cart.length === 0 && !success) {
    return (
      <main style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h1>Your Cart</h1>
        <p>Your cart is currently empty.</p>
      </main>
    );
  }

  if (success && typeof success === 'object') {
    return (
      <main style={{ textAlign: 'center', marginTop: '4rem' }}>
        <canvas ref={confettiRef} style={{ display: 'block', margin: '0 auto 2rem', pointerEvents: 'none', background: 'transparent' }} width={400} height={200}></canvas>
        <h1>Thank You, {address.name}!</h1>
        <p style={{ fontSize: 18, margin: '1rem 0' }}>{success.message}</p>
        <p style={{ margin: '1rem 0' }}>You purchased:</p>
        <ul style={{ display: 'inline-block', textAlign: 'left', margin: '0 auto 1rem', padding: 0 }}>
          {success.products.map((name, i) => (
            <li key={i} style={{ marginBottom: 4 }}>{name}</li>
          ))}
        </ul>
        <p style={{ margin: '1rem 0' }}>Payment Method: <b>{success.method}</b></p>
      </main>
    );
  }

  if (showCheckout || searchParams.get("checkout") === "1") {
    return (
      <main style={{ maxWidth: 500, margin: '2rem auto' }}>
        <h1>Checkout</h1>
        <p style={{ fontWeight: 600 }}>Total: ₹{total}</p>
        <form onSubmit={handleCheckout} style={{ marginTop: 24 }}>
          <fieldset style={{ border: '1px solid #eee', padding: 16, marginBottom: 16 }}>
            <legend style={{ fontWeight: 600 }}>Shipping Address</legend>
            <input type="text" placeholder="Full Name" value={address.name} onChange={e => setAddress(a => ({ ...a, name: e.target.value }))} style={{ width: '100%', marginBottom: 8 }} />
            <input type="text" placeholder="Address" value={address.address} onChange={e => setAddress(a => ({ ...a, address: e.target.value }))} style={{ width: '100%', marginBottom: 8 }} />
            <input type="text" placeholder="City" value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} style={{ width: '48%', marginRight: '4%' }} />
            <input type="text" placeholder="State" value={address.state} onChange={e => setAddress(a => ({ ...a, state: e.target.value }))} style={{ width: '48%' }} />
            <input type="text" placeholder="Pincode" maxLength={6} value={address.pincode} onChange={e => setAddress(a => ({ ...a, pincode: e.target.value.replace(/\D/g,"") }))} style={{ width: '48%', marginRight: '4%', marginTop: 8 }} />
            <input type="text" placeholder="Mobile Number" maxLength={10} value={address.mobile} onChange={e => setAddress(a => ({ ...a, mobile: e.target.value.replace(/\D/g,"") }))} style={{ width: '48%', marginTop: 8 }} />
          </fieldset>
          <div style={{ marginBottom: 16 }}>
            <label>
              <input type="radio" name="payment" value="card" checked={paymentType === "card"} onChange={() => setPaymentType("card")}/> Card
            </label>
            <label style={{ marginLeft: 16 }}>
              <input type="radio" name="payment" value="upi" checked={paymentType === "upi"} onChange={() => setPaymentType("upi")}/> UPI
            </label>
            <label style={{ marginLeft: 16 }}>
              <input type="radio" name="payment" value="cod" checked={paymentType === "cod"} onChange={() => setPaymentType("cod")}/> Cash on Delivery
            </label>
          </div>
          {paymentType === "card" && (
            <div style={{ marginBottom: 16 }}>
              <input type="text" placeholder="Card Number" maxLength={16} value={card.number} onChange={e => setCard({ ...card, number: e.target.value.replace(/\D/g,"") })} style={{ width: '100%', marginBottom: 8 }} />
              <input type="text" placeholder="MM/YY" maxLength={5} value={card.expiry} onChange={e => setCard({ ...card, expiry: e.target.value })} style={{ width: '48%', marginRight: '4%' }} />
              <input type="text" placeholder="CVV" maxLength={3} value={card.cvv} onChange={e => setCard({ ...card, cvv: e.target.value.replace(/\D/g,"") })} style={{ width: '48%' }} />
            </div>
          )}
          {paymentType === "upi" && (
            <div style={{ marginBottom: 16 }}>
              <input type="text" placeholder="UPI ID" value={upi} onChange={e => setUPI(e.target.value)} style={{ width: '100%' }} />
            </div>
          )}
          {error && <p style={{ color: 'red', marginBottom: 8 }}>{error}</p>}
          {success && <p style={{ color: 'green', marginBottom: 8 }}>{success}</p>}
          <button type="submit" style={{ padding: '0.75rem 2rem', background: '#222', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Pay Now</button>
        </form>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 900, margin: '2rem auto', display: 'flex', justifyContent: 'center' }}>
      <div style={{
        background: 'var(--background)',
        borderRadius: 24,
        boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
        padding: '2.5rem 2rem 2rem',
        minWidth: 350,
        maxWidth: 500,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <h1 style={{ fontWeight: 800, fontSize: 32, marginBottom: 24 }}>Your Cart</h1>
        <ul style={{ listStyle: 'none', padding: 0, width: '100%' }}>
          {cart.map((item, idx) => (
            <li key={idx} style={{
              display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', padding: '1rem 0',
              gap: 16,
            }}>
              <img src={item.image} alt={item.name} width={60} height={60} style={{ objectFit: 'cover', borderRadius: 12, marginRight: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 18 }}>{item.name}</div>
                <div style={{ color: '#888', fontSize: 16 }}>₹{item.price}{item.fee ? ' (+₹5 convenience fee)' : ''}</div>
              </div>
              <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: '#f00', cursor: 'pointer', fontSize: 20, fontWeight: 700, padding: 4 }}>×</button>
            </li>
          ))}
        </ul>
        <div style={{ width: '100%', textAlign: 'right', marginTop: 24, fontWeight: 700, fontSize: 20, color: '#222' }}>Total: ₹{total}</div>
        <div style={{ width: '100%', textAlign: 'right', marginTop: 32 }}>
          <button onClick={() => setShowCheckout(true)} className="animated-pulse" style={{ padding: '1rem 2.5rem', background: '#ff9800', color: '#fff', border: 'none', borderRadius: '10px', fontSize: 20, fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }}>Checkout</button>
        </div>
      </div>
    </main>
  );
}