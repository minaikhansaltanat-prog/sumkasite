"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export function SingleImageUpload({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    setUploading(false);
    if (res.ok) onChange(data.url);
  }

  return (
    <div
      className="relative w-32 h-32 rounded-card border-2 border-dashed border-line flex items-center justify-center cursor-pointer overflow-hidden bg-cream"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
      }}
    >
      {value ? (
        <Image src={value} alt="" fill className="object-cover" />
      ) : (
        <span className="text-xs text-ink-muted text-center px-2">{uploading ? "Жүктелуде..." : "Сурет таңдау"}</span>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}
