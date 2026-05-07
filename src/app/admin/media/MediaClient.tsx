"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface MediaFile {
  id: string;
  filename: string;
  originalName?: string;
  path: string;
  size?: number;
  type?: string;
  uploadedAt?: string;
}

interface MediaClientProps {
  initialFiles: MediaFile[];
  // If provided, renders as a picker modal (for use inside editor)
  pickerMode?: boolean;
  onPick?: (path: string) => void;
  onClose?: () => void;
}

export default function MediaClient({ initialFiles, pickerMode, onPick, onClose }: MediaClientProps) {
  const [files, setFiles] = useState<MediaFile[]>(initialFiles);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    setError(null);

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      setUploadProgress(`Загружаю ${file.name}...`);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (res.ok && data.file) {
          setFiles((prev) => [data.file, ...prev]);
        } else {
          setError(data.error || "Ошибка загрузки");
        }
      } catch {
        setError("Ошибка сети");
      }
    }
    setUploading(false);
    setUploadProgress(null);
  }, []);

  const copyPath = useCallback((path: string) => {
    navigator.clipboard?.writeText(path);
    setCopied(path);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  }, [handleUpload]);

  const isImage = (path: string) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(path);

  const content = (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Header */}
      {!pickerMode && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#111", margin: "0 0 4px" }}>🖼️ Медиатека</h1>
            <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
              {files.length} файлов · Изображения хранятся в GitHub
            </p>
          </div>
        </div>
      )}

      {pickerMode && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#111", margin: 0 }}>Выбрать изображение</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#6b7280" }}>✕</button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", fontSize: "13px", color: "#dc2626" }}>
          ✗ {error}
          <button onClick={() => setError(null)} style={{ marginLeft: "8px", background: "none", border: "none", cursor: "pointer", color: "#dc2626" }}>✕</button>
        </div>
      )}

      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        style={{
          background: dragOver ? "#ede9fe" : "#fff",
          borderRadius: "12px",
          border: `2px dashed ${dragOver ? "#6366f1" : "#e5e7eb"}`,
          padding: "24px",
          textAlign: "center",
          cursor: uploading ? "not-allowed" : "pointer",
          marginBottom: "20px",
          transition: "all 0.15s",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          multiple
          style={{ display: "none" }}
          onChange={(e) => handleUpload(e.target.files)}
        />
        {uploading ? (
          <div>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>⏳</div>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#6366f1", margin: 0 }}>{uploadProgress}</p>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>📤</div>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#374151", margin: "0 0 4px" }}>
              Перетащите файлы или нажмите для выбора
            </p>
            <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>JPG, PNG, WebP, SVG · до 5 МБ</p>
          </div>
        )}
      </div>

      {/* Picker confirm button */}
      {pickerMode && selected && (
        <div style={{ marginBottom: "16px", display: "flex", gap: "8px", alignItems: "center" }}>
          <div style={{
            flex: 1,
            padding: "8px 12px",
            background: "#f9fafb",
            borderRadius: "6px",
            fontSize: "12px",
            fontFamily: "monospace",
            color: "#374151",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            {selected}
          </div>
          <button
            onClick={() => onPick?.(selected)}
            style={{
              padding: "8px 20px",
              background: "#6366f1",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            ✓ Выбрать
          </button>
        </div>
      )}

      {/* Files grid */}
      {files.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px", color: "#9ca3af" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🗂️</div>
          <p style={{ fontSize: "15px", fontWeight: 500, color: "#6b7280" }}>Файлов пока нет</p>
          <p style={{ fontSize: "13px", marginTop: "4px" }}>Загрузите первое изображение</p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(auto-fill, minmax(${pickerMode ? "120px" : "160px"}, 1fr))`,
          gap: "10px",
        }}>
          {files.map((file) => {
            const isSelected = selected === file.path;
            return (
              <div
                key={file.id || file.filename}
                onClick={() => {
                  if (pickerMode) {
                    setSelected(file.path);
                  }
                }}
                style={{
                  background: "#fff",
                  borderRadius: "10px",
                  overflow: "hidden",
                  border: `2px solid ${isSelected ? "#6366f1" : "#f3f4f6"}`,
                  boxShadow: isSelected ? "0 0 0 3px #c7d2fe" : "0 1px 4px rgba(0,0,0,0.08)",
                  cursor: pickerMode ? "pointer" : "default",
                  transition: "border-color 0.15s",
                }}
              >
                {/* Thumbnail */}
                <div style={{
                  height: pickerMode ? "80px" : "120px",
                  background: "#f9fafb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  position: "relative",
                }}>
                  {isImage(file.path) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={file.path}
                      alt={file.originalName || file.filename}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <span style={{ fontSize: "32px" }}>📄</span>
                  )}
                  {isSelected && (
                    <div style={{
                      position: "absolute",
                      top: "6px",
                      right: "6px",
                      background: "#6366f1",
                      color: "#fff",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                    }}>✓</div>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: "8px 10px" }}>
                  <p style={{
                    fontSize: "11px",
                    color: "#374151",
                    margin: "0 0 4px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}>
                    {file.originalName || file.filename}
                  </p>
                  {!pickerMode && (
                    <div style={{ display: "flex", gap: "4px" }}>
                      <button
                        onClick={() => copyPath(file.path)}
                        style={{
                          flex: 1,
                          fontSize: "10px",
                          color: copied === file.path ? "#22c55e" : "#6b7280",
                          background: "none",
                          border: "1px solid #e5e7eb",
                          borderRadius: "4px",
                          cursor: "pointer",
                          padding: "3px 0",
                        }}
                      >
                        {copied === file.path ? "✓ Скопировано" : "📋 Путь"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  if (pickerMode) {
    return (
      <div style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
      >
        <div style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "24px",
          width: "100%",
          maxWidth: "700px",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}>
          {content}
        </div>
      </div>
    );
  }

  return content;
}