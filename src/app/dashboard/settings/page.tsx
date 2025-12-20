'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'
import { Save, Facebook, CheckCircle2, ShieldCheck, Key, Cpu, Loader2 } from 'lucide-react'

export default function SettingsPage() {
    const [pageId, setPageId] = useState('')
    const [token, setToken] = useState('')
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success'>('idle')
    const supabase = createClient()

    useEffect(() => {
        const loadSettings = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('fb_page_id, fb_access_token')
                    .eq('id', user.id)
                    .single()

                if (data) {
                    setPageId(data.fb_page_id || '')
                    setToken(data.fb_access_token || '')
                }
            }
        }
        loadSettings()
    }, [supabase])

    const saveConfig = async () => {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { error } = await supabase
            .from('profiles')
            .update({
                fb_page_id: pageId,
                fb_access_token: token,
                updated_at: new Date().toISOString()
            })
            .eq('id', user.id)

        if (!error) {
            setStatus('success')
            setTimeout(() => setStatus('idle'), 3000)
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 lg:p-12 relative overflow-hidden font-sans">
            {/* Background Aesthetic Orbs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0D9488]/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto">
                <header className="mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-widest mb-4"
                    >
                        <Cpu size={14} /> System Configuration
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none uppercase">
                        BRIDGE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2DD4BF] to-emerald-500">SETTINGS.</span>
                    </h1>
                </header>

                <div className="grid grid-cols-1 gap-8">
                    {/* Main Config Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] backdrop-blur-xl overflow-hidden"
                    >
                        <div className="bg-gradient-to-r from-teal-500/10 to-transparent p-8 border-b border-white/5 flex items-center gap-4">
                            <div className="p-3 bg-[#1877F2]/10 rounded-2xl text-[#1877F2]">
                                <Facebook size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black uppercase tracking-tight">Facebook API Node</h2>
                                <p className="text-gray-500 text-xs font-medium uppercase tracking-widest">v21.0 Connection</p>
                            </div>
                        </div>

                        <div className="p-8 lg:p-10 space-y-10">
                            {/* Input: Page ID */}
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                                    <Key size={12} className="text-teal-500" /> Target Page Identifier
                                </label>
                                <input
                                    type="text"
                                    value={pageId}
                                    onChange={(e) => setPageId(e.target.value)}
                                    className="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 outline-none focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/5 transition-all text-white font-mono"
                                    placeholder="e.g. 1029384756"
                                />
                            </div>

                            {/* Input: Access Token */}
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                                    <ShieldCheck size={12} className="text-purple-500" /> Secure Access Token
                                </label>
                                <textarea
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    rows={4}
                                    className="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 outline-none focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/5 transition-all text-gray-300 font-mono text-xs leading-relaxed"
                                    placeholder="EAA..."
                                />
                            </div>

                            <button
                                onClick={saveConfig}
                                disabled={loading}
                                className={`group relative w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all overflow-hidden ${status === 'success'
                                        ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                                        : 'bg-[#0D9488] text-white hover:bg-[#14B8A6] shadow-xl shadow-teal-500/10'
                                    }`}
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : status === 'success' ? (
                                    <><CheckCircle2 size={20} /> Link Established</>
                                ) : (
                                    <><Save size={18} /> Sync Configuration</>
                                )}
                            </button>
                        </div>
                    </motion.div>

                    {/* Security Notice */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="p-6 rounded-[2rem] bg-teal-500/5 border border-teal-500/10 flex gap-4 items-start"
                    >
                        <div className="bg-teal-500/10 p-2.5 rounded-xl text-teal-400">
                            <ShieldCheck size={20} />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-black uppercase tracking-tighter text-teal-400">Encrypted Storage Active</h4>
                            <p className="text-gray-500 text-xs leading-relaxed font-medium">
                                Your access tokens are stored within a private vault. PagePilot utilizes these credentials strictly for authorized transmissions.
                            </p>
                        </div>
                    </motion.div>
                </div>

                <footer className="py-12 text-center text-gray-700 text-[9px] font-black uppercase tracking-[0.4em]">
                    Settings Console • PagePilot v1.0
                </footer>
            </div>
        </div>
    )
}