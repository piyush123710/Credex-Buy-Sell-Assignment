import { z } from 'zod';
import { TOOLS } from './constants';

export const toolInputSchema = z.object({
  name: z.enum(TOOLS as [string, ...string[]]),
  plan: z.string(),
  monthlySpend: z.coerce.number().min(0),
  seats: z.coerce.number().min(1),
});

export const auditFormSchema = z.object({
  tools: z.array(toolInputSchema).min(1, "Select at least one tool"),
  teamSize: z.coerce.number().min(1),
  primaryUseCase: z.enum(['coding', 'writing', 'data', 'research', 'mixed']),
  currency: z.enum(['USD', 'EUR', 'GBP']).default('USD'),
});

export type AuditFormValues = z.infer<typeof auditFormSchema>;
