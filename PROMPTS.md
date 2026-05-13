# AI Prompts

This file documents the LLM prompts used in SpendWise for generating personalized audit summaries.

## Audit Summary Prompt
**System Role**: You are a world-class financial analyst and AI infrastructure expert.
**Task**: Generate a ~100-word personalized summary paragraph based on a startup's AI spend audit.

**Prompt Template**:
```text
Analyze this AI spend audit data:
- Team Size: {{teamSize}}
- Primary Use Case: {{useCase}}
- Current Monthly Spend: ${{currentSpend}}
- Potential Monthly Savings: ${{potentialSavings}}
- Key Optimizations: {{optimizations}}

Write a professional, data-driven summary for a founder or engineering manager. 
- Acknowledge their current stack.
- Highlight the biggest efficiency gap.
- Mention how Credex can help if savings are high (>$500/mo).
- Be concise (approx. 100 words).
- Maintain a helpful, objective tone.
```

## Prompt Design Decisions
1. **Context First**: I provide the core numbers (spend, savings, team size) immediately so the LLM has the "ground truth" before generating prose.
2. **Constraint Enforcement**: Explicitly asking for "approx. 100 words" and a "professional, data-driven" tone prevents the LLM from being too "salesy" or verbose.
3. **Reasoning over Prose**: By including the `Key Optimizations` list, the LLM can reference specific tools (e.g., "Switching Claude seats") rather than giving generic advice.

## Iterations & Failures
- **Initial Try**: I didn't include the Use Case. Result: The LLM gave generic advice that didn't match their workflow (e.g., suggesting coding tools to a writing-focused team).
- **Second Try**: I asked for a bulleted list. Result: The UI looked cluttered. Switched back to a cohesive paragraph for better "readability" on a premium results page.
- **Current Version**: Uses the "Analyst" persona which yields much more defensible and serious-sounding summaries compared to the default "Helpful Assistant" persona.
