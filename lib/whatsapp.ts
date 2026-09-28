const FALLBACK_PHONE = "5519990101192";

export function getWhatsAppPhone() {
  const fromEnv = (process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "").replace(/\D/g, "");
  return fromEnv || FALLBACK_PHONE;
}

export function buildWhatsAppUrl(text: string) {
  const phone = getWhatsAppPhone();
  if (!phone) return null;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
