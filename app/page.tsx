"use client";
import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (action: "remove-bg" | "enhance") => {
    if (!image) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, action }),
      });

      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      alert("Error processing image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: "30px", textAlign: "center", fontFamily: "sans-serif", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <h1 style={{ color: "#333", marginBottom: "20px" }}>Look AI</h1>
      
      <div style={{ marginBottom: "30px" }}>
        <input type="file" accept="image/*" onChange={handleUpload} style={{ padding: "10px" }} />
      </div>

      {image && (
        <div style={{ marginBottom: "20px" }}>
          <button 
            onClick={() => processImage("remove-bg")} 
            disabled={loading}
            style={{ padding: "10px 20px", marginRight: "15px", cursor: "pointer", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "5px" }}
          >
            Remove BG
          </button>
          <button 
            onClick={() => processImage("enhance")} 
            disabled={loading}
            style={{ padding: "10px 20px", cursor: "pointer", backgroundColor: "#9333ea", color: "white", border: "none", borderRadius: "5px" }}
          >
            Enhance Photo
          </button>
        </div>
      )}

      {loading && <p style={{ color: "#2563eb", fontWeight: "bold" }}>AI is working... please wait a few seconds.</p>}

      <div style={{ display: "flex", justifyContent: "center", gap: "30px", marginTop: "30px", flexWrap: "wrap" }}>
        {image && (
          <div>
            <h3 style={{ color: "#555" }}>Original</h3>
            <img src={image} alt="Original" style={{ maxWidth: "300px", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }} />
          </div>
        )}
        {result && (
          <div>
            <h3 style={{ color: "#555" }}>Result</h3>
            <img src={result} alt="Result" style={{ maxWidth: "300px", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }} />
            <br />
            <a href={result} target="_blank" rel="noreferrer" download style={{ display: "inline-block", marginTop: "15px", color: "#2563eb", textDecoration: "none", fontWeight: "bold" }}>
              Download Image
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
