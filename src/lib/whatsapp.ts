import { site } from "@/config/site";
import type { CartLine } from "@/lib/cart";

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function buildMailtoUrl(subject: string, body: string) {
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export const formatCartLines = (lines: Pick<CartLine, "product" | "qty">[]) =>
  lines.map((l) => `- ${l.product.name} (Réf: ${l.product.sku}) x ${l.qty}`).join("\n");

export function cartWhatsAppMessage(lines: Pick<CartLine, "product" | "qty">[]) {
  return `Bonjour ${site.name}, je souhaite obtenir un devis pour :\n${formatCartLines(lines)}\n\nMerci.`;
}

export function productWhatsAppMessage(name: string, sku: string, qty = 1) {
  return `Bonjour ${site.name}, je suis intéressé(e) par :\n- ${name} (Réf: ${sku}) x ${qty}\n\nPouvez-vous me faire parvenir un devis ?`;
}

export const defaultWhatsAppMessage = `Bonjour ${site.name}, j'aimerais avoir des informations sur vos produits.`;
