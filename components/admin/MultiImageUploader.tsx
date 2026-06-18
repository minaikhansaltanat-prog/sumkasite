"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export interface UploaderImage {
  url: string;
  thumbUrl?: string | null;
  order: number;
  isMain: boolean;
}

const MAX_IMAGES = 10;

export function MultiImageUploader({
  images,
  onChange,
}: {
  images: UploaderImage[];
  onChange: (images: UploaderImage[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const dragIndex = useRef<number | null>(null);

  async function uploadFiles(files: FileList | File[]) {
    const remaining = MAX_IMAGES - images.length;
    const list = Array.from(files).slice(0, remaining);
    if (list.length === 0) return;
    setUploading(true);
    const uploaded: UploaderImage[] = [];
    for (const file of list) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        uploaded.push({ url: data.url, thumbUrl: data.thumbUrl, order: 0, isMain: false });
      }
    }
    setUploading(false);
    const merged = [...images, ...uploaded].map((img, i) => ({ ...img, order: i, isMain: i === 0 }));
    onChange(merged);
  }

  function setMain(index: number) {
    onChange(images.map((img, i) => ({ ...img, isMain: i === index })));
  }

  function remove(index: number) {
    const next = images.filter((_, i) => i !== index).map((img, i) => ({ ...img, order: i, isMain: i === 0 }));
    onChange(next);
  }

  function onDrop(index: number) {
    if (dragIndex.current === null || dragIndex.current === index) return;
    const next = [...images];
    const [moved] = next.splice(dragIndex.current, 1);
    next.splice(index, 0, moved);
    onChange(next.map((img, i) => ({ ...img, order: i })));
    dragIndex.current = null;
  }

  return (
    <div>
      <div
        className="border-2 border-dashed border-line rounded-card p-6 text-center cursor-pointer hover:border-gold transition-colors"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          uploadFiles(e.dataTransfer.files);
        }}
      >
        <p className="text-sm text-ink-muted">
          {uploading ? "Жүктелуде..." : "Суреттерді осы жерге тастаңыз немесе таңдау үшін басыңыз"}
        </p>
        <p className="text-xs text-ink-muted mt-1">JPG, PNG, WebP · максимум 5 МБ · {images.length}/{MAX_IMAGES}</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
          {images.map((img, i) => (
            <div
              key={img.url + i}
              draggable
              onDragStart={() => (dragIndex.current = i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(i)}
              className="relative aspect-square rounded-card overflow-hidden border-2 border-line group cursor-move"
            >
              <Image src={img.thumbUrl || img.url} alt="" fill className="object-cover" />
              {img.isMain && (
                <span className="absolute top-1 left-1 label-tag bg-gold text-ink px-1.5 py-0.5 rounded text-[10px]">
                  Негізгі
                </span>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                {!img.isMain && (
                  <button
                    type="button"
                    onClick={() => setMain(i)}
                    className="text-white text-xs bg-ink/80 px-2 py-1 rounded"
                  >
                    Негізгі
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="text-white text-xs bg-danger/90 px-2 py-1 rounded"
                >
                  Жою
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
