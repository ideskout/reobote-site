"use client";

import { useCallback, useSyncExternalStore } from "react";

const KEY = "reobote-favoritos";
const EVENT = "reobote-favoritos";

function read() {
  if (typeof window === "undefined") return "[]";
  return window.localStorage.getItem(KEY) ?? "[]";
}

function subscribe(onStoreChange: () => void) {
  const handler = () => onStoreChange();
  window.addEventListener("storage", handler);
  window.addEventListener(EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(EVENT, handler);
  };
}

function parse(raw: string) {
  try {
    const value = JSON.parse(raw) as unknown;
    return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const raw = useSyncExternalStore(subscribe, read, () => "[]");
  const ids = parse(raw);

  const toggle = useCallback((id: string) => {
    const next = parse(read());
    const updated = next.includes(id) ? next.filter((item) => item !== id) : [...next, id];
    window.localStorage.setItem(KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { ids, toggle, has: (id: string) => ids.includes(id) };
}
