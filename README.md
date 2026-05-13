# SpendWise - AI Spend Audit Tool

SpendWise is a premium audit tool built for startups to optimize their AI tool stack. By analyzing subscriptions for Cursor, Claude, Copilot, and more, it surfaces immediate savings and identifies opportunities for discounted credits via Credex.

## Quick Start
1. **Install dependencies**: `npm install`
2. **Run locally**: `npm run dev`
3. **Run tests**: `npm test`
4. **Build**: `npm run build`

## Decisions & Trade-offs
1. **Rule-Based Engine vs LLM**: I chose a hardcoded rule-based engine for the audit math rather than an LLM. Trade-off: Accuracy and predictability over flexibility. Finance people trust logic they can audit.
2. **Next.js App Router**: Chose App Router for its built-in support for Open Graph image generation (`opengraph-image.tsx`) and Server Actions, which simplify lead capture without a separate backend repo.
3. **Vanilla CSS + Tailwind**: Used Tailwind for rapid UI development but stuck to a curated design system (via Shadcn) to avoid the "bootstrap look" and ensure a premium feel.
4. **Client-Side Form State**: Persisting form state in `localStorage`. Trade-off: User can refresh without losing data, but data isn't synced across devices. Given the "no-login" requirement, this is the optimal balance.
5. **Vitest over Jest**: Chose Vitest for its speed and native ESM support, which fits perfectly with the modern Next.js 15+ environment.

## Screenshots
*[Placeholder: Add 3+ screenshots or Loom link here]*

## Deployed URL
*[Placeholder: Live URL]*
