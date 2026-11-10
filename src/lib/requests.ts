/** Client-side quote requests: reference generation + localStorage persistence. No backend. */

export type QuoteRequest = {
  reference: string;
  createdAt: string;
  customer: {
    type: "particulier" | "professionnel";
    nom: string;
    societe?: string;
    telephone: string;
    email?: string;
    ville: string;
    adresse?: string;
    message?: string;
    contactPrefere: "appel" | "whatsapp" | "email";
  };
  items: { productId: string; name: string; sku: string; qty: number }[];
};

const STORAGE_KEY = "michigan-requests-v1";
const LAST_KEY = "michigan-last-request-v1";

export function generateReference(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
  return `MCH-${y}${m}${d}-${rand}`;
}

export function saveRequest(request: QuoteRequest) {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const list: unknown = raw ? JSON.parse(raw) : [];
    const next = Array.isArray(list) ? [...list, request] : [request];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next.slice(-20)));
    window.localStorage.setItem(LAST_KEY, JSON.stringify(request));
  } catch {
    /* storage unavailable */
  }
}

export function readLastRequest(): QuoteRequest | null {
  try {
    const raw = window.localStorage.getItem(LAST_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as QuoteRequest;
    return parsed && typeof parsed.reference === "string" ? parsed : null;
  } catch {
    return null;
  }
}

const CONTACT_LABEL = { appel: "Appel", whatsapp: "WhatsApp", email: "Email" } as const;

export function formatRequestSummary(r: QuoteRequest) {
  const c = r.customer;
  const lines = [
    `Demande de devis — ${r.reference}`,
    "",
    "Produits :",
    ...r.items.map((i) => `- ${i.name} (Réf: ${i.sku}) x ${i.qty}`),
    "",
    "Client :",
    `Type : ${c.type === "professionnel" ? "Professionnel" : "Particulier"}`,
    `Nom : ${c.nom}`,
    ...(c.societe ? [`Société : ${c.societe}`] : []),
    `Téléphone : ${c.telephone}`,
    ...(c.email ? [`Email : ${c.email}`] : []),
    `Ville : ${c.ville}`,
    ...(c.adresse ? [`Adresse de livraison : ${c.adresse}`] : []),
    `Contact préféré : ${CONTACT_LABEL[c.contactPrefere]}`,
    ...(c.message ? ["", `Message : ${c.message}`] : []),
  ];
  return lines.join("\n");
}
