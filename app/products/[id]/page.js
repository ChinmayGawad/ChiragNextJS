"use client";

import { useEffect, useState, useContext, useRef } from "react";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import { CartContext } from "../../../components/CartContext";
import { supabase } from "../../../lib/supabaseClient";

export default function ProductDetails({ params }) {
  const { id } = params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { addToCart } = useContext(CartContext);
  const [added, setAdded] = useState(false);
  const confettiRef = useRef();

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      setProduct(data);
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (added && confettiRef.current) {
      // Simple confetti burst animation
      const canvas = confettiRef.current;
      const ctx = canvas.getContext('2d');
      const W = canvas.width = 320;
      const H = canvas.height = 120;
      let pieces = Array.from({length: 32}, () => ({
        x: Math.random()*W, y: H/2,
        r: Math.random()*7+4, c: `hsl(${Math.random()*360},90%,60%)`,
        vx: Math.random()*4-2, vy: Math.random()*-2-2
      }));
      let frame = 0;
      function draw() {
        ctx.clearRect(0,0,W,H);
        for (let p of pieces) {
          ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,2*Math.PI);
          ctx.fillStyle = p.c; ctx.fill();
          p.x += p.vx; p.y += p.vy; p.vy += 0.18;
        }
        frame++;
        if (frame < 32) requestAnimationFrame(draw);
        else ctx.clearRect(0,0,W,H);
      }
      draw();
    }
  }, [added]);

  if (loading) {
    return <main style={{ textAlign: "center", marginTop: "4rem" }}>Loading...</main>;
  }
  if (!product) {
    return notFound();
  }

  function handleAddToCart() {
    addToCart(product, true);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleBuyNow() {
    addToCart(product, false);
    router.push("/cart?checkout=1");
  }

  return (
    <main className="product-details-fadein" style={{ maxWidth: "600px", margin: "2rem auto", textAlign: "center", position: 'relative' }}>
      <canvas ref={confettiRef} style={{ position: 'absolute', left: '50%', top: 0, transform: 'translateX(-50%)', pointerEvents: 'none', zIndex: 2, width: 320, height: 120, display: added ? 'block' : 'none' }} width={320} height={120}></canvas>
      <div className="product-img-anim" style={{ display: 'inline-block', transition: 'transform 0.3s', boxShadow: '0 2px 16px #11448811', borderRadius: 12 }}>
        <Image src={product.image} alt={product.name} width={300} height={300} style={{ objectFit: "cover", borderRadius: "8px", transition: 'transform 0.3s' }} />
      </div>
      <h1 style={{ marginTop: 24 }}>{product.name}</h1>
      <p style={{ color: "#666", fontSize: "1rem", margin: "0.5rem 0" }}>{product.category}</p>
      <p style={{ fontSize: "1.2rem", color: "#888" }}>₹{product.price}</p>
      <p style={{ margin: "1rem 0" }}>{product.description}</p>
      <p style={{ fontStyle: "italic", color: "#555", fontSize: "1rem", marginBottom: "1.5rem" }}>&quot;{product.review}&quot;</p>
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", alignItems: "center", marginTop: 24 }}>
        <button className="animated-btn" onClick={handleAddToCart} style={{ padding: "0.75rem 2rem", background: "#222", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: 18, boxShadow: '0 2px 8px #2222' }}>
          Add to Cart
        </button>
        <button className="animated-btn" onClick={handleBuyNow} style={{ padding: "0.75rem 2rem", background: "#ff9800", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: 18, boxShadow: '0 2px 8px #ff980044' }}>
          Buy Now
        </button>
        {added && <span style={{ color: "green", marginLeft: 8, fontWeight: 600 }}>Added to cart! (+₹5 convenience fee)</span>}
      </div>
      <style jsx global>{`
        .product-details-fadein {
          animation: fadeIn 0.8s cubic-bezier(.4,0,.2,1) both;
        }
        .product-img-anim:hover img {
          transform: scale(1.06) rotateZ(-2deg);
          box-shadow: 0 8px 32px #11448822;
        }
        .animated-btn {
          transition: transform 0.18s, box-shadow 0.18s, background 0.18s;
        }
        .animated-btn:hover {
          transform: scale(1.07) translateY(-2px);
          box-shadow: 0 6px 24px rgba(0,0,0,0.12);
          background: #444;
        }
      `}</style>
    </main>
  );
}