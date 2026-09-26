export function getWhatsAppPhone() {
  return (process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "").replace(/\D/g, "");
}

export function buildWhatsAppUrl(text: string) {
  const phone = getWhatsAppPhone();
  if (!phone) return null;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
