/**
 * CloudinaryUpload — reusable drag-drop image uploader
 * Uses Cloudinary's unsigned upload preset (no backend changes needed).
 *
 * Props:
 *   value       — current image URL string
 *   onChange    — (url: string) => void
 *   disabled    — boolean
 */
import { useState, useRef, useCallback } from "react";
import { FiUploadCloud, FiX, FiImage, FiLoader, FiCheckCircle } from "react-icons/fi";

// ── Cloudinary config ─────────────────────────────────────────────────────────
// Set these in Frontend/.env:
//   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
//   VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
const CLOUD_NAME     = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET  = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const UPLOAD_URL     = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

const MAX_SIZE_MB = 5;

export default function CloudinaryUpload({ value, onChange, disabled = false }) {
  const [uploading,  setUploading]  = useState(false);
  const [progress,   setProgress]   = useState(0);
  const [error,      setError]      = useState("");
  const [dragOver,   setDragOver]   = useState(false);
  const fileRef = useRef(null);

  const uploadFile = useCallback(async (file) => {
    setError("");

    // Validate type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPG, PNG, WebP, etc.)");
      return;
    }
    // Validate size
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File too large. Max size is ${MAX_SIZE_MB}MB.`);
      return;
    }
    // Config check
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      setError("Cloudinary not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to .env");
      return;
    }

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file",           file);
    formData.append("upload_preset",  UPLOAD_PRESET);
    formData.append("folder",         "Buy-Ease");

    try {
      // Use XMLHttpRequest for progress tracking
      const url = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", UPLOAD_URL);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 90));
        };
        xhr.onload = () => {
          if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            setProgress(100);
            resolve(data.secure_url);
          } else {
            reject(new Error("Upload failed"));
          }
        };
        xhr.onerror = () => reject(new Error("Network error"));
        xhr.send(formData);
      });

      onChange(url);
    } catch (err) {
      setError("Upload failed. Check your Cloudinary config and try again.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [onChange]);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleRemove = () => {
    onChange("");
    setError("");
  };

  // ── If image already uploaded ──────────────────────────────────────────────
  if (value && !uploading) {
    return (
      <div className="space-y-2">
        <div className="relative group rounded-2xl overflow-hidden border-2 border-emerald-200 bg-gray-50">
          <img src={value} alt="Product"
            className="w-full max-h-56 object-contain p-4 bg-gradient-to-br from-gray-50 to-indigo-50/30" />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
            <button type="button" onClick={() => fileRef.current?.click()} disabled={disabled}
              className="flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-gray-50 transition btn-press">
              <FiUploadCloud /> Replace
            </button>
            <button type="button" onClick={handleRemove} disabled={disabled}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-red-600 transition btn-press">
              <FiX /> Remove
            </button>
          </div>
          {/* Success badge */}
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
            <FiCheckCircle className="text-xs" /> Uploaded
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <p className="text-xs text-gray-400 truncate">📎 {value.split("/").pop()}</p>
      </div>
    );
  }

  // ── Upload zone ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-2">
      <div
        onClick={() => !disabled && !uploading && fileRef.current?.click()}
        onDragOver={e => { e.preventDefault(); if (!disabled) setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
          transition-all duration-200
          ${uploading ? "border-indigo-300 bg-indigo-50/50 cursor-wait" :
            dragOver   ? "border-indigo-500 bg-indigo-50 scale-[1.01] shadow-lg shadow-indigo-100" :
            disabled   ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60" :
            "border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/30 bg-gray-50/50"}`}>

        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center">
              <FiLoader className="text-indigo-600 text-2xl animate-spin" />
            </div>
            <div className="w-full max-w-xs">
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>Uploading to Cloudinary...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200
              ${dragOver ? "bg-indigo-200 scale-110" : "bg-indigo-100"}`}>
              <FiUploadCloud className={`text-2xl transition-all duration-200
                ${dragOver ? "text-indigo-700" : "text-indigo-500"}`} />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-sm">
                {dragOver ? "Drop to upload!" : "Drop image here or click to browse"}
              </p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP, GIF — max {MAX_SIZE_MB}MB</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
              {["☁️ Cloudinary CDN", "🔒 Secure", "⚡ Fast"].map(b => (
                <span key={b} className="bg-white border border-gray-200 px-2 py-1 rounded-lg">{b}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1 animate-scale-in bg-red-50 border border-red-200 px-3 py-2 rounded-xl">
          <span className="flex-shrink-0">⚠️</span> {error}
        </p>
      )}

      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={disabled} />
    </div>
  );
}
