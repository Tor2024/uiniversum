"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { BlockRenderer } from "@/components/blocks/renderer";

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [blocks, setBlocks] = useState<any[]>([]);
  const [cssVars, setCssVars] = useState("");
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    if (!token) return;
    fetch(`/api/preview-data?token=${token}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.data) {
          setBlocks(res.data.blocks || []);
          setCssVars(res.data.cssVars || "");
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  // Listen for postMessage updates from parent editor
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === "PREVIEW_UPDATE") {
        setBlocks(event.data.blocks || []);
        if (event.data.cssVars) setCssVars(event.data.cssVars);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "Inter, sans-serif", color: "#6b7280" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>⏳</div>
          <p>Загрузка превью...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {cssVars && <style dangerouslySetInnerHTML={{ __html: cssVars }} />}
      <main style={{ minHeight: "100vh", background: "var(--color-background, #fff)" }}>
        {blocks.length === 0 ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "Inter, sans-serif", color: "#9ca3af", textAlign: "center" }}>
            <div>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📄</div>
              <p style={{ fontSize: "16px", fontWeight: 600, color: "#374151" }}>Страница пустая</p>
              <p style={{ fontSize: "14px" }}>Добавьте блоки в редакторе слева</p>
            </div>
          </div>
        ) : (
          blocks.map((block: any) => (
            <BlockRenderer key={block.id} block={block} locale="de" />
          ))
        )}
      </main>
    </>
  );
}
