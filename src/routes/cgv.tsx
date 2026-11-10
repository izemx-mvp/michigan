import { createFileRoute } from "@tanstack/react-router";
import { site } from "@/config/site";
import { seo } from "@/lib/seo";
import { LegalPage } from "@/components/common/LegalPage";

export const Route = createFileRoute("/cgv")({
  head: () =>
    seo({
      title: "Conditions générales de vente",
      description: "Conditions générales de vente de Michigan Air Technology.",
      path: "/cgv",
    }),
  component: () => (
    <LegalPage title="Conditions générales de vente">
      {/* CONTENU EXEMPLE À REMPLACER */}
      <h2>1. Objet</h2>
      <p>Les présentes conditions régissent les ventes de produits Michigan Air Technology. Texte : À compléter.</p>
      <h2>2. Devis et commandes</h2>
      <p>
        Les prix sont communiqués sur devis. Une commande est considérée comme ferme après acceptation du
        devis. Modalités détaillées : À compléter.
      </p>
      <h2>3. Prix et paiement</h2>
      <p>{site.paymentNote}. Conditions détaillées : À compléter.</p>
      <h2>4. Livraison</h2>
      <p>{site.delivery}. Délais, frais et conditions : À compléter.</p>
      <h2>5. Garantie</h2>
      <p>{site.warranty}.</p>
      <h2>6. Service après-vente</h2>
      <p>Le service après-vente est assuré via {site.distributor.name}. Modalités : À compléter.</p>
      <h2>7. Droit applicable</h2>
      <p>À compléter.</p>
    </LegalPage>
  ),
});
