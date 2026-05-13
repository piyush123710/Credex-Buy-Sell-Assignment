'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Loader2, Mail } from 'lucide-react';

const leadFormSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  company: z.string().min(2, "Company name is too short").optional().or(z.literal("")),
  honeypot: z.string().max(0).optional(),
});

type LeadFormValues = z.infer<typeof leadFormSchema>;

interface LeadFormProps {
  auditId: string;
  savings: number;
}

export default function LeadForm({ auditId, savings }: LeadFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
  });

  const onSubmit = async (data: LeadFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          audit_id: auditId,
          savings: savings,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit. Please try again.");
      }

      setSubmitted(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card className="border-green-100 bg-green-50/30 dark:border-green-900/30 dark:bg-green-900/10 transition-all duration-500">
        <CardContent className="pt-6 pb-6 text-center space-y-4">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto text-white">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold">Report Sent!</h3>
          <p className="text-zinc-600 dark:text-zinc-400">
            Check your inbox. We've sent a detailed breakdown of these savings to your email.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-indigo-100 dark:border-indigo-900">
      <CardHeader className="bg-indigo-50/50 dark:bg-indigo-900/10">
        <CardTitle className="text-xl">Get the full report</CardTitle>
        <CardDescription>
          We'll send the detailed breakdown to your inbox and notify you of new optimizations.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="pt-6 space-y-4">
          {/* Honeypot */}
          <input type="text" {...register('honeypot')} className="hidden" tabIndex={-1} autoComplete="off" />
          
          <div className="space-y-2">
            <Label htmlFor="email">Work Email</Label>
            <Input 
              id="email" 
              placeholder="alex@startup.com" 
              {...register('email')}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company Name (Optional)</Label>
            <Input 
              id="company" 
              placeholder="Acme Inc." 
              {...register('company')}
            />
          </div>

          {error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">{error}</p>}
        </CardContent>
        <CardFooter className="bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 p-6">
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Mail className="w-4 h-4 mr-2" /> Send Detailed Report</>}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
