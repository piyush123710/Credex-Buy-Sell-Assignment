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

  it('should handle multi-currency conversion (EUR)', () => {
    const input: AuditInput = {
      tools: [
        {
          name: 'Claude',
          plan: 'Team',
          monthlySpend: 115, // Roughly 125 USD in EUR (125 * 0.92)
          seats: 2,
        },
      ],
      teamSize: 2,
      primaryUseCase: 'coding',
      currency: 'EUR',
    };

    const result = runAudit(input);
    expect(result.currency).toBe('EUR');
    expect(result.totalMonthlySavings).toBeGreaterThan(0);
    // 115 EUR / 0.92 = 125 USD. Savings in USD = 125 - 40 = 85 USD. 85 * 0.92 = 78.2 EUR.
    expect(result.totalMonthlySavings).toBeCloseTo(78.2, 1);
  });

  it('should calculate benchmark status correctly', () => {
    const input: AuditInput = {
      tools: [
        {
          name: 'Cursor',
          plan: 'Pro',
          monthlySpend: 200, // 10 users @ $20
          seats: 10,
        },
      ],
      teamSize: 10,
      primaryUseCase: 'coding',
      currency: 'USD',
    };

    const result = runAudit(input);
    expect(result.benchmark?.status).toBe('optimal'); // $20/seat < $25
    expect(result.benchmark?.percentile).toBeGreaterThan(80);
  });

  it('should flag overspending benchmark', () => {
     const input: AuditInput = {
      tools: [
        {
          name: 'Cursor',
          plan: 'Business',
          monthlySpend: 800, // 10 users @ $80 (incorrect high spend)
          seats: 10,
        },
      ],
      teamSize: 10,
      primaryUseCase: 'coding',
    };

    const result = runAudit(input);
    expect(result.benchmark?.status).toBe('overspending'); // $80/seat > $45
  });
});
