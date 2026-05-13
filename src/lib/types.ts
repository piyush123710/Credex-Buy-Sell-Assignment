export type AIUseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed';

export type ToolName = 
  | 'Cursor' 
  | 'GitHub Copilot' 
  | 'Claude' 
  | 'ChatGPT' 
  | 'Anthropic API' 
  | 'OpenAI API' 
  | 'Gemini' 
  | 'Windsurf' 
  | 'v0';

export interface ToolInput {
  name: ToolName;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditInput {
  tools: ToolInput[];
  teamSize: number;
  primaryUseCase: AIUseCase;
}

export interface Optimization {
  toolName: ToolName;
  currentSpend: number;
  recommendedAction: string;
  potentialSavings: number;
  reasoning: string;
  isCredexOpportunity: boolean;
}

export interface AuditResult {
  id: string;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  optimizations: Optimization[];
  personalizedSummary?: string;
  createdAt: string;
}
