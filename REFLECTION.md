# Reflection

## 1. The Hardest Bug
The hardest bug I encountered was handling the **client-side state persistence vs. server-side hydration** in Next.js. Because I stored the audit form state in `localStorage` to meet the "persist across reloads" requirement, the initial render on the server (which has no access to `localStorage`) frequently mismatched the client render, leading to hydration errors. 

**Hypothesis**: The server was rendering the "Step 1" empty state while the client had "Step 3" data from a previous session.
**Attempt 1**: I tried using a standard `useState` with a default value. This caused the UI to flicker from empty to full.
**Attempt 2**: I tried a custom hook with `useSyncExternalStore`. This was overkill for a simple form.
**Workaround**: I moved the `localStorage` loading logic into a `useEffect` and added a `mounted` state check. This ensured the form only rendered the persistent data once it reached the client, eliminating hydration warnings and providing a smooth "resume" experience for the user.

## 2. A Decision Reversed
Mid-week, I reversed the decision to use an **LLM-based audit engine**. Originally, I wanted the LLM to look at the tools and "figure out" the savings.

**Reason for Reversal**: After testing with sample data, I realized that LLMs are inconsistent with arithmetic and often "hallucinate" pricing tiers that don't exist (e.g., imagining a "Claude Mini" plan). For a tool designed to be used by finance and operations people, "hallucinated math" is a fatal flaw. I pivoted to a **hardcoded rule-based engine** for the savings logic, using the LLM only for the **qualitative personalized summary**. This ensures the numbers are always defensible and traceable to `PRICING_DATA.md`.

## 3. Week 2 Plan
If I had a second week, I would focus on **Benchmark Mode** and **PDF Exports**:
1. **Benchmark Mode**: Aggregating anonymized audit data to tell a user: "Your spend per developer is $45/mo, but the average for a company your size is $32/mo." This creates a powerful social comparison trigger.
2. **PDF Export**: Engineering Managers often need to "present" these findings to their CFO. A professional, branded PDF summary would make the lead-capture value proposition much stronger.
3. **Multi-Currency Support**: Currently, everything is in USD. Supporting EUR and GBP based on the user's location would broaden the tool's reach significantly.

## 4. How I Used AI Tools
I used **Antigravity (Gemini/Claude)** extensively for:
- **Boilerplate**: Generating the initial Shadcn component structures and Tailwind layouts.
- **Research**: Quickly gathering pricing data for the initial `PRICING_DATA.md` (which I then manually verified).
- **Audit Logic**: Brainstorming the "Optimization Rules" (e.g., the 5-seat minimum for Claude Team).

**What I didn't trust**: I did not trust the AI with the **final audit math** or the **GTM strategy**. GTM requires specific, weird, real-world knowledge that AI often replaces with generic "content marketing" advice. 
**AI Error**: One AI suggested that GitHub Copilot Enterprise was $19/mo. I caught this during manual verification; $19 is the Business price, Enterprise is $39. This reinforced the need for my `PRICING_DATA.md` verification step.

## 5. Self-Rating (1-10)
- **Discipline (9/10)**: I maintained a clear `DEVLOG.md` and committed daily for 7 days, following a structured implementation plan without "weekend cramming."
- **Code Quality (8/10)**: Used TypeScript throughout, implemented unit tests for core logic, and followed idiomatic Next.js App Router patterns.
- **Design Sense (9/10)**: Prioritized a premium "wow" factor using Framer Motion and a curated dark-mode palette, avoiding generic templates.
- **Problem Solving (8/10)**: Successfully navigated the trade-off between AI qualitative value and hardcoded quantitative accuracy.
- **Entrepreneurial Thinking (10/10)**: Focused heavily on the "Why Credex" angle, building a tool that isn't just a calculator, but a high-conversion lead generation asset.
