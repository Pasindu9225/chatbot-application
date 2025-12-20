'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'
import {
    MessageSquare,
    Settings,
    Zap,
    ArrowUpRight,
    LayoutDashboard,
    Sparkles,
    ArrowRight // Added this missing import
} from 'lucide-react'

export default function DashboardPage() {
    const [profile, setProfile] = useState<any>(null)
    const supabase = createClient()

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('tokens_balance, plan_type')
                    .eq('id', user.id)
                    .single()
                setProfile(data)
            }
        }
        fetchProfile()
    }, [supabase])

    return (
        <main className="min-h-screen bg-[#020617] text-white p-6 lg:p-12 relative overflow-hidden">
            {/* Background Glows to match Landing Page */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0D9488]/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto">
                {/* Header Section */}
                <header className="mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-widest mb-4"
                    >
                        <LayoutDashboard size={14} /> System Overview
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none mb-4 uppercase">
                        WELCOME TO <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2DD4BF] to-emerald-500">PAGEPILOT.</span>
                    </h1>
                    <p className="text-gray-500 text-lg font-medium">
                        Your AI-powered social cockpit is ready for departure.
                    </p>
                </header>

                {/* Token Status Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-xl flex flex-col md:flex-row justify-between items-center gap-6"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-teal-500/10 rounded-2xl flex items-center justify-center text-teal-400">
                            <Zap size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Available Fuel</p>
                            <h2 className="text-2xl font-black">{profile?.tokens_balance ?? '...'} <span className="text-sm font-medium text-gray-400">Tokens Left</span></h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            Plan: {profile?.plan_type ?? 'Loading...'}
                        </span>
                        <Link href="/dashboard/settings" className="text-teal-400 text-sm font-bold flex items-center gap-1 hover:underline decoration-2 underline-offset-4">
                            Upgrade Plan <ArrowUpRight size={16} />
                        </Link>
                    </div>
                </motion.div>

                {/* Action Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* AI Chat Card */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="group p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-xl hover:bg-white/[0.04] transition-all relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-teal-500/10 transition-colors pointer-events-none">
                            <MessageSquare size={120} strokeWidth={1} />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-teal-500/10 rounded-2xl flex items-center justify-center text-teal-400 mb-6">
                                <Sparkles size={24} />
                            </div>
                            <h3 className="text-2xl font-black mb-3 uppercase tracking-tighter">Start a Mission</h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-8 font-medium max-w-[240px]">
                                Initiate a conversation with Gemini to brainstorm and generate high-impact posts.
                            </p>
                            <Link href="/dashboard/chat" className="inline-flex items-center gap-2 bg-[#0D9488] text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-xl shadow-teal-500/20 hover:bg-[#14B8A6] transition-all">
                                Open AI Agent <ArrowRight size={18} />
                            </Link>
                        </div>
                    </motion.div>

                    {/* Settings/Account Card */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="group p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-xl hover:bg-white/[0.04] transition-all relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-purple-500/10 transition-colors pointer-events-none">
                            <Settings size={120} strokeWidth={1} />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 mb-6">
                                <Settings size={24} />
                            </div>
                            <h3 className="text-2xl font-black mb-3 uppercase tracking-tighter">Bridge Settings</h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-8 font-medium max-w-[240px]">
                                Manage your Facebook Page connections and security credentials.
                            </p>
                            <Link href="/dashboard/settings" className="inline-flex items-center gap-2 border border-white/10 bg-white/5 text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-white/10 transition-all">
                                Check Status <ArrowRight size={18} />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    )
}