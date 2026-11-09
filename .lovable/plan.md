# Michigan Air Technology French Website MVP

## Goal
Replace the starter screen with a premium French-language Michigan Air Technology catalogue and quote-request experience based on the supplied brief and logo.

## Build
- Establish the requested blue, ice, and ink design system and use the supplied Michigan logo in the shared brand shell and favicon.
- Create a responsive storefront with shared navigation, search, product/category browsing, product details, persistent cart, WhatsApp handoff, and quote-request confirmation.
- Add the requested home, category, product, solutions, about, blog, contact, legal, and terms pages, with unique French metadata and real navigation links.
- Keep catalogue, categories, posts, contact settings, and estimator coefficients in typed data/config files; clearly label sample products and avoid inventing specifications, prices, company contact facts, or guarantees.
- Persist quote and contact/lead requests through Lovable Cloud with server-side validation and protected submission storage.
- Add an optional French catalogue assistant only if it can use the requested Lovable AI Gateway model and can be safely wired server-side; otherwise leave it out and report the blocker.

## Validation
- Check the homepage and key browse-to-quote flows in the running preview, at desktop and mobile widths.
- Run relevant tests and inspect the latest build/runtime signals.
- Re-read the task roadmap and report any external setup still needed, such as real business contact details or product data.

## Technical notes
- This project uses TanStack Start and Tailwind v4; implement pages with file-based routes and semantic CSS tokens.
- Use Lovable Cloud for durable quote/lead submissions. Do not implement payments, accounts, or admin dashboards.
- Preserve the supplied brand mark and use no stock people imagery; use generic equipment visuals only.
