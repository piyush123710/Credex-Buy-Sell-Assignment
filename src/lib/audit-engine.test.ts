import { describe, it, expect } from 'vitest';
import { runAudit } from './audit-engine';
import { AuditInput } from './types';

describe('Audit Engine', () => {
  it('should identify savings for Claude Team with < 5 users', () => {
    const input: AuditInput = {
      tools: [
        {
          name: 'Claude',
          plan: 'Team',
          monthlySpend: 125, // 5 seats * $25 (min)
          seats: 2,
        },
      ],
      teamSize: 2,
      primaryUseCase: 'coding',
    };

    const result = runAudit(input);
    const claudeOpt = result.optimizations.find(o => o.toolName === 'Claude');
    
    expect(claudeOpt?.potentialSavings).toBeGreaterThan(0);
    expect(claudeOpt?.recommendedAction).toContain('Pro seats');
  });

  it('should identify savings for single-user Cursor Business', () => {
    const input: AuditInput = {
      tools: [
        {
          name: 'Cursor',
          plan: 'Business',
          monthlySpend: 40,
          seats: 1,
        },
      ],
      teamSize: 1,
      primaryUseCase: 'coding',
    };

    const result = runAudit(input);
    const cursorOpt = result.optimizations.find(o => o.toolName === 'Cursor');
    
    expect(cursorOpt?.potentialSavings).toBe(20);
    expect(cursorOpt?.recommendedAction).toBe('Switch to Cursor Pro');
  });

  it('should flag high spend as Credex opportunity', () => {
    const input: AuditInput = {
      tools: [
        {
          name: 'OpenAI API',
          plan: 'Usage',
          monthlySpend: 1200,
          seats: 1,
        },
      ],
      teamSize: 10,
      primaryUseCase: 'mixed',
    };

    const result = runAudit(input);
    const openaiOpt = result.optimizations.find(o => o.toolName === 'OpenAI API');
    
    expect(openaiOpt?.isCredexOpportunity).toBe(true);
  });

  it('should handle optimal setups correctly', () => {
    const input: AuditInput = {
      tools: [
        {
          name: 'GitHub Copilot',
          plan: 'Business',
          monthlySpend: 190,
          seats: 10,
        },
      ],
      teamSize: 10,
      primaryUseCase: 'coding',
    };

    const result = runAudit(input);
    const copilotOpt = result.optimizations.find(o => o.toolName === 'GitHub Copilot');
    
    expect(copilotOpt?.recommendedAction).toBe('Source through Credex'); // Since it's > $100 and retail
  });
});
