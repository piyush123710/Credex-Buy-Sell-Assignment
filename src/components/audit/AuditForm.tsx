'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ArrowRight, ArrowLeft, Calculator, Sparkles } from 'lucide-react';
import { auditFormSchema, AuditFormValues } from '@/lib/schema';
import { TOOLS, TOOL_PLANS, USE_CASES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { runAudit } from '@/lib/audit-engine';

const STORAGE_KEY = 'spendwise-audit-form';

export default function AuditForm() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  
  const form = useForm<AuditFormValues>({
    resolver: zodResolver(auditFormSchema),
    defaultValues: {
      tools: [],
      teamSize: 1,
      primaryUseCase: 'coding',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tools",
  });

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        form.reset(parsed);
      } catch (e) {
        console.error("Failed to load saved form state", e);
      }
    }
  }, [form]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const nextStep = async () => {
    const fieldsToValidate = step === 1 ? ['tools'] : step === 2 ? ['teamSize', 'primaryUseCase'] : [];
    const isValid = await form.trigger(fieldsToValidate as Array<keyof AuditFormValues>);
    if (isValid) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const onSubmit = (data: AuditFormValues) => {
    const result = runAudit(data);
    // In a real app, we'd save this to a DB and redirect to a shareable URL
    // For now, we'll store in session/local and redirect
    localStorage.setItem(`audit-${result.id}`, JSON.stringify(result));
    router.push(`/audit/${result.id}`);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl border-zinc-200/50 bg-white/80 backdrop-blur-sm dark:bg-zinc-950/80 dark:border-zinc-800/50">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <Calculator className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">Step {step} of 3</span>
        </div>
        <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
          {step === 1 ? 'Your Tool Stack' : step === 2 ? 'Team & Usage' : 'Review Audit'}
        </CardTitle>
        <CardDescription className="text-lg">
          {step === 1 ? 'Select the AI tools you currently pay for.' : step === 2 ? 'Tell us about your team and primary use case.' : 'Double-check your inputs before we run the audit.'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="min-h-[400px]">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {TOOLS.map((tool) => {
                    const isSelected = fields.some(f => f.name === tool);
                    return (
                      <div
                        key={tool}
                        onClick={() => {
                          if (isSelected) {
                            const index = fields.findIndex(f => f.name === tool);
                            remove(index);
                          } else {
                            append({ name: tool, plan: TOOL_PLANS[tool][0], monthlySpend: 0, seats: 1 });
                          }
                        }}
                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                          isSelected 
                            ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20' 
                            : 'border-zinc-100 hover:border-indigo-200 dark:border-zinc-800 dark:hover:border-indigo-800'
                        }`}
                      >
                        <span className="font-semibold text-sm">{tool}</span>
                      </div>
                    );
                  })}
                </div>

                {fields.length > 0 && (
                  <div className="mt-8 space-y-4">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-500" />
                      Configure your spend
                    </h3>
                    {fields.map((field, index) => (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={field.id} 
                        className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 relative group"
                      >
                        <button 
                          type="button"
                          onClick={() => remove(index)}
                          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs uppercase tracking-wider text-zinc-500">Tool</Label>
                            <div className="font-bold">{field.name}</div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs uppercase tracking-wider text-zinc-500">Plan</Label>
                            <Select 
                              onValueChange={(val) => form.setValue(`tools.${index}.plan`, val)}
                              defaultValue={field.plan}
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {TOOL_PLANS[field.name as keyof typeof TOOL_PLANS].map(p => (
                                  <SelectItem key={p} value={p}>{p}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs uppercase tracking-wider text-zinc-500">Monthly Spend ($)</Label>
                            <Input 
                              type="number"
                              className="h-9"
                              {...form.register(`tools.${index}.monthlySpend`)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs uppercase tracking-wider text-zinc-500">Seats</Label>
                            <Input 
                              type="number"
                              className="h-9"
                              {...form.register(`tools.${index}.seats`)}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <Label className="text-lg font-bold">Total Team Size</Label>
                  <p className="text-zinc-500 text-sm">Include everyone who uses these tools, even if they share accounts.</p>
                  <Input 
                    type="number" 
                    className="text-2xl h-14 font-bold"
                    {...form.register('teamSize')}
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-lg font-bold">Primary Use Case</Label>
                  <p className="text-zinc-500 text-sm">This helps us recommend the best tool for your workflow.</p>
                  <div className="grid grid-cols-2 gap-3">
                    {USE_CASES.map((uc) => (
                      <div 
                        key={uc}
                        onClick={() => form.setValue('primaryUseCase', uc)}
                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all capitalize ${
                          form.watch('primaryUseCase') === uc 
                            ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20' 
                            : 'border-zinc-100 dark:border-zinc-800'
                        }`}
                      >
                        {uc}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-6 dark:border-indigo-900/30 dark:bg-indigo-900/10">
                   <h3 className="font-bold text-indigo-900 dark:text-indigo-100 mb-4">Stack Summary</h3>
                   <div className="space-y-3">
                      {fields.map((f, i) => (
                        <div key={f.id} className="flex justify-between items-center text-sm">
                          <span className="text-zinc-600 dark:text-zinc-400">{f.name} ({form.getValues(`tools.${i}.plan`)})</span>
                          <span className="font-mono font-bold">${form.getValues(`tools.${i}.monthlySpend`)}/mo</span>
                        </div>
                      ))}
                      <div className="pt-3 border-t border-indigo-200 dark:border-indigo-800 flex justify-between items-center font-bold">
                        <span>Total Monthly Spend</span>
                        <span className="text-xl text-indigo-600">
                          ${fields.reduce((acc, _, i) => acc + Number(form.getValues(`tools.${i}.monthlySpend`)), 0)}
                        </span>
                      </div>
                   </div>
                </div>
                
                <div className="p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-zinc-500">Team Size</span>
                    <span className="font-bold">{form.getValues('teamSize')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Use Case</span>
                    <span className="font-bold capitalize">{form.getValues('primaryUseCase')}</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 text-center px-8">
                  By clicking &quot;Run Audit&quot;, you agree to our processing of this data. Your individual details are never shared publicly.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </CardContent>

      <CardFooter className="flex justify-between border-t border-zinc-100 dark:border-zinc-800 p-6">
        {step > 1 ? (
          <Button variant="ghost" onClick={prevStep} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        ) : (
          <div />
        )}
        
        {step < 3 ? (
          <Button onClick={nextStep} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 gap-2 group">
            Continue <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        ) : (
          <Button 
            onClick={form.handleSubmit(onSubmit)}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-10 h-12 text-lg font-bold gap-2 shadow-lg shadow-indigo-500/20"
          >
            Run Free Audit
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
