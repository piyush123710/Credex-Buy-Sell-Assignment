import { AuditInput, AuditResult, Optimization, ToolInput, ToolName, BenchmarkData } from './types';
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

const CONVERSION_RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
};

const INDUSTRY_BENCHMARK_USD = 35;

export function runAudit(input: AuditInput): AuditResult {
  const currency = input.currency || 'USD';
  const rate = CONVERSION_RATES[currency];
  const optimizations: Optimization[] = [];
  
  // Convert tools to USD for standardized analysis
  const usdTools = input.tools.map(t => ({
    ...t,
    monthlySpend: t.monthlySpend / rate
  }));

  usdTools.forEach(tool => {
    const optimization = analyzeTool(tool, input.teamSize);
    if (optimization) {
      // Convert optimization numbers back to selected currency
      optimizations.push({
        ...optimization,
        currentSpend: optimization.currentSpend * rate,
        potentialSavings: optimization.potentialSavings * rate
      });
    }
  });

  const totalMonthlySavings = optimizations.reduce((acc, opt) => acc + opt.potentialSavings, 0);
  
  // Calculate Benchmarking (in USD for standardization)
  const totalSpendUSD = usdTools.reduce((acc, t) => acc + t.monthlySpend, 0);
  const spendPerSeatUSD = totalSpendUSD / input.teamSize;
  const status = spendPerSeatUSD < 25 ? 'optimal' : spendPerSeatUSD > 45 ? 'overspending' : 'average';
  
  // Percentile calculation (simplified heuristic)
  let percentile = 50;
  if (status === 'optimal') percentile = 85 + Math.random() * 10;
  else if (status === 'overspending') percentile = 15 + Math.random() * 20;
  else percentile = 40 + Math.random() * 30;

  const benchmark: BenchmarkData = {
    averageSpendPerSeat: spendPerSeatUSD * rate,
    industryBenchmark: INDUSTRY_BENCHMARK_USD * rate,
    percentile: Math.round(percentile),
    status
  };

  return {
    id: uuidv4(),
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    optimizations,
    currency,
    benchmark,
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
          reasoning = `Claude Team has a 5-seat minimum cost ($125). With ${seats} users, individual Pro seats ($20 each) save you $${Math.round(potentialSavings)}/mo.`;
        }
      }
      break;

    case 'GitHub Copilot':
      if (plan === 'Enterprise' && teamSize < 10) {
        const businessCost = 19 * seats;
        potentialSavings = monthlySpend - businessCost;
        if (potentialSavings > 0) {
          recommendedAction = 'Downgrade to Copilot Business';
          reasoning = 'Enterprise features (CLI, fine-tuning) are often underutilized by smaller teams. Business plan covers most needs at half the cost.';
        }
      }
      break;

    case 'Cursor':
      if (plan === 'Business' && seats === 1) {
        potentialSavings = monthlySpend - 20;
        if (potentialSavings > 0) {
          recommendedAction = 'Switch to Cursor Pro';
          reasoning = 'Business features like centralized billing and SSO aren\'t necessary for a single user. Pro provides the same AI capabilities.';
        }
      }
      break;

    case 'Gemini':
      if (plan === 'Ultra' && monthlySpend > 200) {
        recommendedAction = 'Switch to Gemini Pro API';
        potentialSavings = monthlySpend * 0.4;
        reasoning = 'High spend on Gemini Ultra often indicates heavy automated usage that is more cost-effective via the API.';
      }
      break;
      
    case 'ChatGPT':
      if (plan === 'Team' && seats < 2) {
         potentialSavings = monthlySpend - 20;
         if (potentialSavings > 0) {
           recommendedAction = 'Switch to ChatGPT Plus';
           reasoning = 'Team plans have a 2-seat minimum. A single user is better served by the Plus plan.';
         }
      }
      break;
  }

  // If no specific rule triggered, but spend is high, suggest Credex
  if (potentialSavings <= 0 && monthlySpend > 100) {
     const retailPrice = getRetailPrice(name, plan);
     if (retailPrice && monthlySpend >= retailPrice * seats * 0.95) {
        isCredexOpportunity = true;
        const credexSavings = monthlySpend * 0.2; 
        return {
          toolName: name,
          currentSpend: monthlySpend,
          recommendedAction: 'Source through Credex',
          potentialSavings: credexSavings,
          reasoning: `You're on the right plan, but paying retail. Credex can source these same seats at a 20-30% discount via our credit network.`,
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
      isCredexOpportunity: isCredexOpportunity || potentialSavings > 100,
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
