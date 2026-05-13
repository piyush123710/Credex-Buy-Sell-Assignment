# SpendWise - AI Spend Audit Tool

SpendWise is a premium audit tool built for startups to optimize their AI tool stack. By analyzing subscriptions for Cursor, Claude, Copilot, and more, it surfaces immediate savings and identifies opportunities for discounted credits via Credex.

## 🚀 Live Demo
**URL**: [https://credex-buy-sell-assignment.vercel.app](https://credex-buy-sell-assignment.vercel.app) *(Update this if your Vercel URL is different)*

## 🛠 Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS v4, Framer Motion, Lucide React
- **Validation**: Zod + React Hook Form
- **Database**: Supabase (Lead Capture)
- **Email**: Resend (Transactional Reports)

## 💡 Decisions & Trade-offs
1. **Rule-Based Engine vs LLM**: I chose a hardcoded rule-based engine for the audit math rather than an LLM. Trade-off: Accuracy and predictability over flexibility. Finance people trust logic they can audit.
2. **Next.js App Router**: Chose App Router for its built-in support for Open Graph image generation (`opengraph-image.tsx`) and Server Actions.
3. **Vanilla CSS + Tailwind**: Used Tailwind for rapid UI development but stuck to a curated design system (via Shadcn) to ensure a premium feel.
4. **Client-Side Form State**: Persisting form state in `localStorage`. Trade-off: User can refresh without losing data without requiring a login.
5. **Vitest**: Chose Vitest for its speed and native ESM support.

## 📝 GitHub Repository
[https://github.com/piyush123710/Credex-Buy-Sell-Assignment](https://github.com/piyush123710/Credex-Buy-Sell-Assignment)

## 📸 Screenshots
*(Add your screenshots here)*
