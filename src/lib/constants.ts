import { ToolName, AIUseCase } from './types';

export const TOOLS: ToolName[] = [
  'Cursor',
  'GitHub Copilot',
  'Claude',
  'ChatGPT',
  'Anthropic API',
  'OpenAI API',
  'Gemini',
  'Windsurf',
  'v0'
];

export const USE_CASES: AIUseCase[] = [
  'coding',
  'writing',
  'data',
  'research',
  'mixed'
];

export const TOOL_PLANS: Record<ToolName, string[]> = {
  Cursor: ['Hobby', 'Pro', 'Business', 'Enterprise'],
  'GitHub Copilot': ['Individual', 'Business', 'Enterprise'],
  Claude: ['Free', 'Pro', 'Max', 'Team', 'Enterprise', 'API direct'],
  ChatGPT: ['Plus', 'Team', 'Enterprise', 'API direct'],
  'Anthropic API': ['API direct'],
  'OpenAI API': ['API direct'],
  Gemini: ['Pro', 'Ultra', 'API'],
  Windsurf: ['Pro', 'Team'],
  v0: ['Pro']
};
