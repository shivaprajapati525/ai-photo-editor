"use client";
import React, { useState, useRef } from "react";

const FILTERS = [
  { name: "Normal", filter: "none" },
  { name: "Vintage", filter: "sepia(0.6) contrast(1.2) brightness(0.9)" },
  { name: "B&W", filter: "grayscale(1)" },
  { name: "Warm", filter: "sepia(0.35) saturate(1.4)" },
  { name: "Cool", filter: "hue-rotate(180deg) saturate(0.8)" },
  { name: "Cinema", filter: "contrast(1.4) brightness(0.85) saturate(1.2)" },
  { name: "Vivid", filter: "saturate(2) contrast(1.1)" },
  { name: "Soft Glow", filter: "brightness(1.15) blur(0.5px)" },
];

export default function LookAI() {
  const [image, setImage] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("none");
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const getCombinedFilter = () => {
    return `${activeFilter === "none" ? "" : activeFilter} brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
  };

  const handleDownload = () => {
    if (!image) return;
    const canvas = document.createElement("canvas");
    const img = imageRef.current;
    if (!img) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.filter = getCombinedFilter();
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      // सीधे डाउनलोड करने की बजाय, फोटो को स्क्रीन पर दिखाएँ
      setFinalImage(canvas.toDataURL("image/png"));
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", color: "#f8fafc", fontFamily: "sans-serif", display: "flex", flexDirection: "column" }}>
      {/* Top Header */}
      <header style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #334155" }}>
        <h1 style={{ fontSize: "20px", fontWeight: "bold", margin: 0, color: "#38bdf8" }}>Look AI</h1>
        {image && (
          <button onClick={handleDownload} style={{ background: "#22c55e", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
            Export
          </button>
        )}
      </header>

      {/* Main Canvas Area */}
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", overflow: "hidden" }}>
        {!image ? (
          <label style={{ border: "2px dashed #475569", padding: "40px 20px", borderRadius: "16px", textAlign: "center", cursor: "pointer", width: "100%", maxWidth: "340px" }}>
            <span style={{ display: "block", fontSize: "16px", color: "#94a3b8", marginBottom: "12px" }}>Tap to pick an image</span>
            <span style={{ background: "#38bdf8", color: "#0f172a", padding: "10px 18px", borderRadius: "8px", fontWeight: "bold", display: "inline-block" }}>Choose Photo</span>
            <input type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />
          </label>
        ) : (
          <div style={{ position: "relative", maxWidth: "100%", maxHeight: "55vh" }}>
            <img
              ref={imageRef}
              src={image}
              alt="Workspace"
              style={{ maxHeight: "55vh", maxWidth: "100%", objectFit: "contain", borderRadius: "12px", filter: getCombinedFilter(), transition: "filter 0.2s ease" }}
            />
          </div>
        )}
      </main>

      {/* Bottom Tool Deck */}
      {image && (
        <div style={{ backgroundColor: "#1e293b", padding: "16px", borderTopLeftRadius: "24px", borderTopRightRadius: "24px", borderTop: "1px solid #334155" }}>
          {/* Sliders */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", fontSize: "12px", gap: "8px" }}>
              <span style={{ width: "70px" }}>Bright</span>
              <input type="range" min="50" max="150" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} style={{ flex: 1 }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", fontSize: "12px", gap: "8px" }}>
              <span style={{ width: "70px" }}>Contrast</span>
              <input type="range" min="50" max="150" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} style={{ flex: 1 }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", fontSize: "12px", gap: "8px" }}>
              <span style={{ width: "70px" }}>Color</span>
              <input type="range" min="0" max="200" value={saturation} onChange={(e) => setSaturation(Number(e.target.value))} style={{ flex: 1 }} />
            </div>
          </div>

          {/* Filter Scroller */}
          <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px" }}>
            {FILTERS.map((f) => (
              <button
                key={f.name}
                onClick={() => setActiveFilter(f.filter)}
                style={{
                  background: activeFilter === f.filter ? "#38bdf8" : "#334155",
                  color: activeFilter === f.filter ? "#0f172a" : "#f8fafc",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                }}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Final Image Modal for Saving */}
      {finalImage && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.95)", zIndex: 9999, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <p style={{ color: "#fff", fontSize: "16px", textAlign: "center", marginBottom: "20px", lineHeight: "1.5" }}>
            ✅ फोटो तैयार है!<br />
            इसे गैलरी में सेव करने के लिए <b>फोटो पर उंगली दबाकर रखें (Long Press)</b> और <span style={{color: "#38bdf8"}}>"Download Image"</span> चुनें।
          </p>
          <img src={finalImage} alt="Final Edit" style={{ maxWidth: "100%", maxHeight: "60vh", borderRadius: "8px", border: "2px solid #38bdf8" }} />
          
          <button onClick={() => setFinalImage(null)} style={{ marginTop: "30px", padding: "12px 30px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "25px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}>
            वापस जाएँ (Close)
          </button>
        </div>
      )}
    </div>
  );
}
