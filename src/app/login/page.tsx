'use client'
import { login, signup } from './actions'
import { motion } from 'framer-motion'
import { PlaneTakeoff, ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react'

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background Glows for Brand Consistency */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#0D9488]/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/[0.02] backdrop-blur-2xl p-10 lg:p-12 rounded-[3rem] shadow-2xl w-full max-w-md border border-white/10 relative z-10"
            >
                <div className="flex items-center gap-3 text-[#2DD4BF] mb-8">
                    <PlaneTakeoff size={32} strokeWidth={2.5} />
                    <span className="text-2xl font-black tracking-tighter uppercase">PagePilot</span>
                </div>

                <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">System Login.</h1>
                <p className="text-gray-500 mb-10 text-sm font-medium">Authentication required for mission access.</p>

                <form className="space-y-6">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                            <Mail size={12} className="text-teal-500" /> Email Address
                        </label>
                        <input
                            name="email"
                            type="email"
                            required
                            placeholder="pilot@agency.com"
                            className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#0D9488] transition-all font-medium placeholder:text-gray-700"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                            <Lock size={12} className="text-purple-500" /> Access Code
                        </label>
                        <input
                            name="password"
                            type="password"
                            required
                            placeholder="••••••••"
                            className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#0D9488] transition-all font-medium placeholder:text-gray-700"
                        />
                    </div>

                    <div className="flex flex-col gap-4 pt-4">
                        <button
                            formAction={login}
                            className="bg-[#0D9488] text-white font-black text-xs uppercase tracking-widest py-5 rounded-2xl hover:bg-[#14B8A6] transition-all shadow-xl shadow-teal-500/20 active:scale-95 flex items-center justify-center gap-2"
                        >
                            Establish Link <ArrowRight size={16} />
                        </button>
                        <button
                            formAction={signup}
                            className="text-gray-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
                        >
                            Create New Pilot Profile
                        </button>
                    </div>
                </form>

                <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-center gap-2 text-gray-600">
                    <ShieldCheck size={16} />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Secure Encrypted Session</span>
                </div>
            </motion.div>
        </div>
    )
}