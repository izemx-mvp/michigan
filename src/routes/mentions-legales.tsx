import { createFileRoute } from "@tanstack/react-router";
import { site } from "@/config/site";
import { seo } from "@/lib/seo";
import { LegalPage } from "@/components/common/LegalPage";

export const Route = createFileRoute("/mentions-legales")({
  head: () =>
    seo({
      title: "Mentions légales",
      description: "Mentions légales du site Michigan Air Technology.",
      path: "/mentions-legales",
    }),
  component: () => (
    <LegalPage title="Mentions légales">
      {/* CONTENU EXEMPLE À REMPLACER */}
      <h2>Éditeur du site</h2>
      <p>
        Raison sociale : À compléter
        <br />
        Forme juridique et capital : À compléter
        <br />
        Siège social : {site.address}
        <br />
        RC / ICE / IF : À compléter
        <br />
        Téléphone : {site.phone} · Email : {site.email}
      </p>
      <h2>Directeur de la publication</h2>
      <p>À compléter.</p>
      <h2>Hébergement</h2>
      <p>Hébergeur, adresse et coordonnées : À compléter.</p>
      <h2>Propriété intellectuelle</h2>
      <p>
        L'ensemble des contenus de ce site (textes, images, logos) est protégé. Toute reproduction sans
        autorisation préalable est interdite. Conditions détaillées : À compléter.
      </p>
      <h2>Données personnelles</h2>
      <p>
        Les formulaires de ce site ne transmettent aucune donnée à nos serveurs : les informations saisies
        sont envoyées par WhatsApp ou par email à l'initiative de l'utilisateur. Le panier et les demandes
        sont conservés uniquement dans le navigateur de l'utilisateur. Politique complète et coordonnées du
        responsable de traitement : À compléter.
      </p>
    </LegalPage>
  ),
});
