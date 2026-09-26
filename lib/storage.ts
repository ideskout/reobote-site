"use client";

import { friendlyError } from "@/lib/errors";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "fotos-imoveis";
const MAX_BYTES = 5 * 1024 * 1024;

export function storagePathFromUrl(url: string | null) {
  if (!url) return null;
  const marker = `/${BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + marker.length).split("?")[0]);
}

export async function uploadFoto(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Envie um arquivo de imagem (JPG, PNG ou WebP).");
  }

  if (file.size > MAX_BYTES) {
    throw new Error("A imagem deve ter no máximo 5 MB.");
  }

  const supabase = createClient();
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });

  if (error) {
    throw new Error(friendlyError(error.message));
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function removeFoto(url: string | null) {
  const path = storagePathFromUrl(url);
  if (!path) return;

  const supabase = createClient();
  await supabase.storage.from(BUCKET).remove([path]);
}
