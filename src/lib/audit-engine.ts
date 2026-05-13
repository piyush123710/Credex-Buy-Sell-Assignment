import { AuditInput, AuditResult, Optimization, ToolInput, ToolName } from './types';
import { v4 as uuidv4 } from 'uuid';

export const PRICING = {
  Cursor: {
    Hobby: 0,
    Pro: 20,
    Business: 40,
  },
  'GitHub Copilot': {
    Individual: 10,
    Business: 19,
    Enterprise: 39,
  },
  Claude: {
    Free: 0,
    Pro: 20,
    Team: 25, // Min 5 seats
    Max: 100,
  },
  ChatGPT: {
    Plus: 20,
    Team: 25,
    Enterprise: 45, // Estimated
  },
  Windsurf: {
    Pro: 15,
    Team: 30,
  },
  Gemini: {
    Pro: 19.99,
    Ultra: 249.99,
  }
};

export function runAudit(input: AuditInput): AuditResult {
  const optimizations: Optimization[] = [];
  
  input.tools.forEach(tool => {
    const optimization = analyzeTool(tool, input.teamSize);
    if (optimization) {
      optimizations.push(optimization);
    }
  });

  const totalMonthlySavings = optimizations.reduce((acc, opt) => acc + opt.potentialSavings, 0);

  return {
    id: uuidv4(),
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    optimizations,
    createdAt: new Date().toISOString(),
  };
}

function analyzeTool(tool: ToolInput, teamSize: number): Optimization | null {
  const { name, plan, monthlySpend, seats } = tool;
  let recommendedAction = 'Keep current plan';
  let potentialSavings = 0;
  let reasoning = 'Your current plan is optimal for your team size.';
  let isCredexOpportunity = monthlySpend > 500;

  // Generic check for high spend
  if (monthlySpend > 500) {
    isCredexOpportunity = true;
  }

  switch (name) {
    case 'Claude':
      if (plan === 'Team' && seats < 5) {
        const proCost = 20 * seats;
        potentialSavings = monthlySpend - proCost;
        if (potentialSavings > 0) {
          recommendedAction = `Switch to ${seats} Claude Pro seats`;
          reasoning = `Claude Team has a 5-seat minimum cost. With ${seats} users, individual Pro seats save you $${potentialSavings}/mo.`;
        }
      }
      break;

    case 'GitHub Copilot':
      if (plan === 'Enterprise' && teamSize < 10) {
        const businessCost = 19 * seats;
        potentialSavings = monthlySpend - businessCost;
        if (potentialSavings > 0) {
          recommendedAction = 'Downgrade to Copilot Business';
          reasoning = 'Enterprise features (CLI, fine-tuning) are rarely fully utilized by teams under 10. Business plan covers most needs.';
        }
      }
      break;

    case 'Cursor':
      if (plan === 'Business' && seats === 1) {
        potentialSavings = monthlySpend - 20;
        if (potentialSavings > 0) {
          recommendedAction = 'Switch to Cursor Pro';
          reasoning = 'Business features like centralized billing and SSO aren\'t necessary for a single user.';
        }
      }
      // Alternative suggestion
      if (seats === 1 && monthlySpend >= 20) {
        // Suggest Windsurf if they want to save more
        const windsurfSavings = monthlySpend - 15;
        if (windsurfSavings > potentialSavings) {
          // This would be a secondary recommendation, but for now we'll stick to the tool itself
        }
      }
      break;

    case 'Gemini':
      if (plan === 'Ultra' && monthlySpend > 200) {
        recommendedAction = 'Switch to Gemini Pro API';
        potentialSavings = monthlySpend * 0.4; // Rough estimate of API savings for high usage
        reasoning = 'High spend on Gemini Ultra subscriptions often indicates heavy usage that is more cost-effective via the Flash/Pro API.';
      }
      break;
  }

  // If no specific rule triggered, but spend is high, suggest Credex
  if (potentialSavings <= 0 && monthlySpend > 100) {
     // Check if they are paying retail
     const retailPrice = getRetailPrice(name, plan);
     if (retailPrice && monthlySpend >= retailPrice * seats) {
        isCredexOpportunity = true;
        // Even if optimal, Credex can get them discounts
        const credexSavings = monthlySpend * 0.2; // Credex 20% discount estimate
        return {
          toolName: name,
          currentSpend: monthlySpend,
          recommendedAction: 'Source through Credex',
          potentialSavings: credexSavings,
          reasoning: `You're on the right plan, but paying retail. Credex can source these same seats at a ~20% discount.`,
          isCredexOpportunity: true
        };
     }
  }

  if (potentialSavings > 0) {
    return {
      toolName: name,
      currentSpend: monthlySpend,
      recommendedAction,
      potentialSavings,
      reasoning,
      isCredexOpportunity,
    };
  }

  return {
    toolName: name,
    currentSpend: monthlySpend,
    recommendedAction: 'Optimal',
    potentialSavings: 0,
    reasoning: 'You are already on the most cost-effective plan for this tool.',
    isCredexOpportunity,
  };
}

function getRetailPrice(name: ToolName, plan: string): number | null {
  const toolPricing = PRICING[name as keyof typeof PRICING] as Record<string, number>;
  if (toolPricing && toolPricing[plan] !== undefined) {
    return toolPricing[plan];
  }
  return null;
}
