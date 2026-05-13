import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { AuditResult, Optimization } from '@/lib/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(req: NextRequest) {
  try {
    const { auditData }: { auditData: AuditResult & { primaryUseCase: string; teamSize: number } } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      console.warn("ANTHROPIC_API_KEY not found. Using fallback summary.");
      return NextResponse.json({ summary: getFallbackSummary(auditData) });
    }

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 250,
      system: "You are a world-class financial analyst and AI infrastructure expert. Generate a ~100-word personalized summary paragraph based on a startup's AI spend audit.",
      messages: [
        {
          role: "user",
          content: `Analyze this AI spend audit data:
- Team Size: ${auditData.teamSize}
- Primary Use Case: ${auditData.primaryUseCase}
- Total Monthly Savings Found: $${auditData.totalMonthlySavings}
- Key Optimizations: ${auditData.optimizations.map((o: Optimization) => `${o.toolName}: ${o.recommendedAction}`).join(', ')}

Write a professional summary for a founder. Highlight the biggest gap and mention Credex if savings are >$500/mo.`
        }
      ],
    });

    const content = response.content[0];
    const text = content.type === 'text' ? content.text : '';

    return NextResponse.json({ summary: text });
  } catch (error) {
    console.error("AI Summary Error:", error);
    return NextResponse.json({ summary: getFallbackSummary(null) }, { status: 200 }); // Always return fallback gracefully
  }
}

function getFallbackSummary(data: (AuditResult & { primaryUseCase: string; teamSize: number }) | null) {
  if (!data) return "Based on our analysis, your AI stack has several optimization opportunities. Implementing the recommended plan changes could significantly reduce your monthly overhead while maintaining your current development velocity.";
  
  const toolCount = data.optimizations?.length || 0;
  const savings = data.totalMonthlySavings || 0;
  
  if (savings > 500) {
    return `Your stack of ${toolCount} AI tools is significantly over-provisioned. By optimizing your ${data.primaryUseCase} workflow and leveraging Credex's credit marketplace, you could recover over $${savings} per month. We recommend booking a consultation to capture these savings immediately.`;
  }
  
  if (savings < 50) {
    return `Your current AI infrastructure is exceptionally lean. For a team of ${data.teamSize}, you've selected the most cost-effective plans available. We recommend staying on your current stack and monitoring usage as you scale.`;
  }

  return `We identified $${savings}/mo in potential savings across your ${toolCount} tools. The primary opportunity lies in plan right-sizing. Implementing these changes will streamline your ${data.primaryUseCase} operations without impacting output.`;
}
