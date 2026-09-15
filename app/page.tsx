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

  // नया सॉलिड डाउनलोड सिस्टम
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

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        // 1. पहला तरीका: Android का Native शेयर/सेव (APK के लिए सबसे बेस्ट)
        if (navigator.canShare) {
          try {
            const file = new File([blob], `LookAI_${Date.now()}.png`, { type: "image/png" });
            await navigator.share({
              files: [file],
              title: 'Look AI Edit',
            });
            return; 
          } catch (error) {
            console.log("Native share cancelled or failed");
          }
        }

        // 2. दूसरा तरीका: डायरेक्ट ऑटो-डाउनलोड (अगर पहला फेल हो जाए)
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `LookAI_${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, "image/png");
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", color: "#f8fafc", fontFamily: "sans-serif", display: "flex", flexDirection: "column" }}>
      <header style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #334155" }}>
        <h1 style={{ fontSize: "20px", fontWeight: "bold", margin: 0, color: "#38bdf8" }}>Look AI</h1>
        {image && (
          <button onClick={handleDownload} style={{ background: "#22c55e", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
            Export
          </button>
        )}
      </header>

      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", overflow: "hidden" }}>
        {!image ? (
          <label style={{ border: "2px dashed #475569", padding: "40px 20px", borderRadius: "16px", textAlign: "center", cursor: "pointer", width: "100%", maxWidth: "340px" }}>
            <span style={{ display: "block", fontSize: "16px", color: "#94a3b8", marginBottom: "12px" }}>Tap to pick an image</span>
            <span style={{ background: "#38bdf8", color: "#0f172a", padding: "10px 18px", borderRadius: "8px", fontWeight: "bold", display: "inline-block" }}>Choose Photo</span>
            <input type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />
          </label>
        ) : (
          <div style={{ position: "relative", maxWidth: "100%", maxHeight: "55vh" }}>
            <img ref={imageRef} src={image} alt="Workspace" style={{ maxHeight: "55vh", maxWidth: "100%", objectFit: "contain", borderRadius: "12px", filter: getCombinedFilter(), transition: "filter 0.2s ease" }} />
          </div>
        )}
      </main>

      {image && (
        <div style={{ backgroundColor: "#1e293b", padding: "16px", borderTopLeftRadius: "24px", borderTopRightRadius: "24px", borderTop: "1px solid #334155" }}>
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

          <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px" }}>
            {FILTERS.map((f) => (
              <button key={f.name} onClick={() => setActiveFilter(f.filter)} style={{ background: activeFilter === f.filter ? "#38bdf8" : "#334155", color: activeFilter === f.filter ? "#0f172a" : "#f8fafc", border: "none", padding: "8px 14px", borderRadius: "20px", fontSize: "13px", whiteSpace: "nowrap", cursor: "pointer" }}>
                {f.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
