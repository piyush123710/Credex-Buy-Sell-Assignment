import React from 'react';
import AuditForm from '@/components/audit/AuditForm';
import { ShieldCheck, Zap, TrendingDown, Users, Globe } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black selection:bg-indigo-100 dark:selection:bg-indigo-900/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">SpendWise</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">Tool Pricing</a>
            <a href="https://credex.rocks" className="px-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-full text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all">Visit Credex</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/10 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-sm font-bold w-fit">
              <Zap className="w-4 h-4" />
              <span>Lead Gen for Credex</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
              Stop Overpaying for <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">AI Infrastructure</span>
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl">
              Most startups waste 20-40% on AI tool seats they don't need. Get a free, instant audit of your spend and find immediate savings.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <div className="font-bold">No Login Required</div>
                  <div className="text-sm text-zinc-500">100% Private Audit</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                  <div className="font-bold">$4k+ Saved/Year</div>
                  <div className="text-sm text-zinc-500">Average Per Team</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
             <div className="absolute inset-0 bg-indigo-500/5 blur-3xl rounded-full -z-10" />
             <AuditForm />
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 border-t border-zinc-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm font-bold uppercase tracking-widest text-zinc-400 mb-12">Trusted by founders at</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-50 grayscale dark:invert">
            {['Vercel', 'Linear', 'Supabase', 'Raycast', 'Ramp'].map(company => (
              <span key={company} className="text-2xl font-black">{company}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="how-it-works" className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">How SpendWise Works</h2>
            <p className="text-zinc-600 dark:text-zinc-400">Our engine analyzes your stack against 50+ optimization rules and Credex's proprietary credit marketplace data.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BenefitCard 
              icon={<Users className="w-6 h-6" />}
              title="Plan Optimization"
              description="We check if you're over-provisioned. 2 users on a 5-seat Team plan is a waste of $100/mo."
            />
            <BenefitCard 
              icon={<Globe className="w-6 h-6" />}
              title="Tool Alternatives"
              description="Sometimes Cursor is overkill and Windsurf is a better fit. We suggest the best tool for your use case."
            />
            <BenefitCard 
              icon={<TrendingDown className="w-6 h-6" />}
              title="Credex Credits"
              description="Get the exact same tools at 20-50% off by sourcing through Credex's credit ecosystem."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-100 dark:border-zinc-800 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-indigo-600" />
            <span className="font-bold">SpendWise</span>
          </div>
          <p className="text-sm text-zinc-500">
            A free tool by <a href="https://credex.rocks" className="text-indigo-600 font-bold hover:underline">Credex</a>. All tool logos are trademarks of their respective owners.
          </p>
        </div>
      </footer>
    </div>
  );
}

function BenefitCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 shadow-sm">
      <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{description}</p>
    </div>
  );
}
