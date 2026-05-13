'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { AuditResult, Optimization } from '@/lib/types';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Share2, 
  Download, 
  CheckCircle2, 
  Zap, 
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import LeadForm from '@/components/audit/LeadForm';
import { Input } from '@/components/ui/input';

export default function AuditResultsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [result, setResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(false);
  
  const isPublic = searchParams.get('view') === 'public';

  const fetchSummary = useCallback(async (auditData: AuditResult) => {
    setSummaryLoading(true);
    try {
      const formDataStr = localStorage.getItem('spendwise-audit-form');
      const formData = formDataStr ? JSON.parse(formDataStr) : {};

      const res = await fetch('/api/audit/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auditData: { ...auditData, ...formData } }),
      });
      const data = await res.json();
      
      const updatedResult = { ...auditData, personalizedSummary: data.summary };
      setResult(updatedResult);
      localStorage.setItem(`audit-${params.id}`, JSON.stringify(updatedResult));
    } catch (e) {
      console.error("Failed to fetch AI summary", e);
    } finally {
      setSummaryLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    const initAudit = async () => {
      const saved = localStorage.getItem(`audit-${params.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setResult(parsed);
        
        if (!parsed.personalizedSummary) {
          fetchSummary(parsed);
        }
      }
      setLoading(false);
    };

    initAudit();
  }, [params.id, fetchSummary]);

  const handleShare = () => {
    const url = `${window.location.origin}/audit/${params.id}?view=public`;
    navigator.clipboard.writeText(url);
    alert("Public share link copied to clipboard! (Emails and company details will be hidden)");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Audit...</div>;
  if (!result) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Audit Not Found</h1>
      <Button onClick={() => router.push('/')}>Go Home</Button>
    </div>
  );

  const hasHighSavings = result.totalMonthlySavings > 500;
  const isOptimal = result.totalMonthlySavings < 50;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-20 px-6">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <Button variant="ghost" onClick={() => router.push('/')} className="w-fit gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Editor
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2" onClick={handleShare}>
              <Share2 className="w-4 h-4" /> Share
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" /> Export PDF
            </Button>
          </div>
        </div>

        {/* Hero: Savings Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-indigo-600 p-8 md:p-12 text-white shadow-2xl shadow-indigo-500/20"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-sm font-bold">
                <Zap className="w-4 h-4" />
                <span>Audit Complete</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                {isOptimal ? "Your Stack is Lean" : "We Found Significant Savings"}
              </h1>
              <p className="text-indigo-100 text-lg max-w-md">
                {isOptimal 
                  ? "Great job! You&apos;re already on the most efficient plans for your current toolset." 
                  : `You could be saving $${result.totalMonthlySavings.toLocaleString()} every single month by making a few simple changes.`}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
                  <div className="text-indigo-200 text-sm font-bold uppercase mb-1">Monthly Savings</div>
                  <div className="text-4xl font-black tracking-tight">${result.totalMonthlySavings.toLocaleString()}</div>
               </div>
               <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
                  <div className="text-indigo-200 text-sm font-bold uppercase mb-1">Annual Savings</div>
                  <div className="text-4xl font-black tracking-tight">${result.totalAnnualSavings.toLocaleString()}</div>
               </div>
            </div>
          </div>
        </motion.div>

        {/* AI Summary and Lead Capture Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="h-full border-indigo-100 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-900/10">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle>AI Personalized Summary</CardTitle>
                  <CardDescription>Tailored insights based on your team&apos;s workflow</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                {summaryLoading ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full"></div>
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6"></div>
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-4/6"></div>
                  </div>
                ) : (
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed italic">
                    &quot;{result.personalizedSummary || "Generating your personalized summary..."}&quot;
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            {!isPublic ? (
              <LeadForm auditId={result.id} savings={result.totalMonthlySavings} />
            ) : (
              <Card className="h-full border-dashed flex flex-col items-center justify-center p-8 text-center space-y-4">
                <Zap className="w-8 h-8 text-indigo-600" />
                <h3 className="font-bold">Want your own audit?</h3>
                <p className="text-sm text-zinc-500">Run a free 60-second audit of your own AI stack and find hidden savings.</p>
                <Button onClick={() => router.push('/')} className="w-full bg-indigo-600">Start Free Audit</Button>
              </Card>
            )}
          </div>
        </div>

        {/* Optimization Breakdown */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            Recommended Actions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {result.optimizations.map((opt, i) => (
              <OptimizationCard key={i} optimization={opt} index={i} />
            ))}
          </div>
        </div>

        {/* Credex CTA */}
        {hasHighSavings && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-3xl bg-gradient-to-br from-zinc-900 to-black text-white border border-zinc-800 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 max-w-xl">
                <div className="px-3 py-1 rounded-full bg-indigo-600 text-xs font-bold w-fit uppercase tracking-widest">High Potential Savings</div>
                <h3 className="text-3xl font-bold">Get these tools for even less through Credex</h3>
                <p className="text-zinc-400">
                  Your monthly spend qualifies for our secondary marketplace. We can often secure an additional 15-25% off these tools via pre-purchased credits.
                </p>
              </div>
              <Button className="bg-white text-black hover:bg-zinc-200 px-8 py-6 text-lg font-bold rounded-xl h-fit w-full md:w-auto">
                Book Credex Consultation
              </Button>
            </div>
          </motion.div>
        )}

        {isOptimal && (
           <Card className="text-center p-12 border-dashed">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-2xl mb-2">You&apos;re Optimized!</CardTitle>
              <CardDescription className="max-w-md mx-auto mb-8">
                Your current AI spend is already aligned with the best industry benchmarks. We&apos;ll notify you if new plans or credit pools open up.
              </CardDescription>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <Input placeholder="Email address" className="max-w-xs" />
                 <Button className="bg-indigo-600 hover:bg-indigo-700">Notify Me</Button>
              </div>
           </Card>
        )}
      </div>
    </div>
  );
}

function OptimizationCard({ optimization, index }: { optimization: Optimization, index: number }) {
  const isPositive = optimization.potentialSavings > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={`h-full border-l-4 ${isPositive ? 'border-l-green-500' : 'border-l-zinc-200 dark:border-l-zinc-800'}`}>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{optimization.toolName}</CardTitle>
            {isPositive ? (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-md">
                Save ${optimization.potentialSavings}/mo
              </span>
            ) : (
              <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-xs font-bold rounded-md">
                Optimal
              </span>
            )}
          </div>
          <CardDescription>
            Current Spend: ${optimization.currentSpend}/mo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
             <div className="text-xs font-bold text-zinc-400 uppercase mb-1">Recommended Action</div>
             <div className="font-bold text-indigo-600 dark:text-indigo-400">{optimization.recommendedAction}</div>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {optimization.reasoning}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
