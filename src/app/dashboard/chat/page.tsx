'use client'
import { useState, useEffect, useRef } from 'react'
import { generateSocialPost } from '@/app/actions/ai-actions'
import { postToFacebook } from '@/app/actions/fb-actions'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
    Send,
    Image as ImageIcon,
    Loader2,
    User,
    Bot,
    Facebook,
    Sparkles,
    Zap,
    Globe
} from 'lucide-react'

export default function ChatPage() {
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string, imageUrl?: string | null }[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [publishingId, setPublishingId] = useState<number | null>(null)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, loading])

    const handleSend = async () => {
        if (!input.trim() || loading) return

        const userMsg = input
        setInput('')
        setMessages(prev => [...prev, { role: 'user', content: userMsg }])
        setLoading(true)

        try {
            const result = await generateSocialPost(userMsg, 'default-session')
            if (result.success) {
                setMessages(prev => [...prev, {
                    role: 'ai',
                    content: result.text || '',
                    imageUrl: result.imageUrl
                }])
            } else {
                setMessages(prev => [...prev, { role: 'ai', content: "Notice: " + result.error }])
            }
        } catch (err) {
            setMessages(prev => [...prev, { role: 'ai', content: "Something went wrong. Please check your connection." }])
        } finally {
            setLoading(false)
        }
    }

    const handlePublish = async (index: number, content: string, imageUrl?: string | null) => {
        setPublishingId(index)
        try {
            const result = await postToFacebook(imageUrl || null, content)
            if (result.success) {
                alert("Successfully published to Facebook!")
            } else {
                alert("Facebook Error: " + result.error)
            }
        } catch (err) {
            alert("An unexpected error occurred while publishing.")
        } finally {
            setPublishingId(null)
        }
    }

    return (
        /* FIXED: Use h-screen and flex-col to prevent any overflow or white gaps */
        <div className="flex flex-col h-screen bg-[#020617] text-white relative overflow-hidden font-sans">

            {/* Background Aesthetic Orbs */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#0D9488]/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/5 blur-[100px] rounded-full pointer-events-none" />

            {/* Chat Header - Fixed Height */}
            <div className="flex-none px-8 py-6 border-b border-white/5 backdrop-blur-md flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-500/10 rounded-xl text-teal-400">
                        <Bot size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-black tracking-tight uppercase">AI Creative Agent</h2>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">System Online</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-gray-500 text-xs font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Zap size={14} className="text-teal-400" /> Gemini 1.5 Pro</span>
                </div>
            </div>

            {/* Messages Feed - Takes all remaining space */}
            <div
                ref={scrollRef}
                className="flex-grow overflow-y-auto p-6 lg:p-12 space-y-10 relative z-10 scroll-smooth custom-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {/* Custom CSS to hide scrollbar for Chrome/Safari */}
                <style jsx>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>

                {messages.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="h-full flex flex-col items-center justify-center text-center space-y-8"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-teal-500/20 blur-2xl rounded-full" />
                            <div className="relative bg-white/5 p-8 rounded-3xl border border-white/10 text-teal-400">
                                <Sparkles size={48} strokeWidth={1.5} />
                            </div>
                        </div>
                        <div className="max-w-md space-y-4">
                            <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">Ready for Takeoff.</h2>
                            <p className="text-gray-500 font-medium leading-relaxed">
                                Describe your next campaign or post idea. I'll handle the copywriting and visual generation.
                            </p>
                        </div>
                    </motion.div>
                )}

                <AnimatePresence>
                    {messages.map((m, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex items-start gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            <div className={`mt-1 p-2 rounded-xl border ${m.role === 'user' ? 'bg-[#0D9488] border-teal-400/30 text-white' : 'bg-white/5 border-white/10 text-teal-400'}`}>
                                {m.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                            </div>

                            <div className={`group max-w-[75%] p-6 rounded-[2rem] backdrop-blur-xl border transition-all ${m.role === 'user'
                                ? 'bg-teal-500/10 border-teal-500/20 text-white rounded-tr-none'
                                : 'bg-white/[0.03] border-white/5 text-gray-200 rounded-tl-none'
                                }`}>
                                <p className="text-base leading-relaxed whitespace-pre-wrap font-medium tracking-tight">
                                    {m.content}
                                </p>

                                {m.imageUrl && (
                                    <div className="mt-6 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative group/img">
                                        <img src={m.imageUrl} alt="AI Content" className="w-full h-auto transition-transform duration-500 group-hover/img:scale-105" />
                                        <Link
                                            href={`/dashboard/playground?img=${encodeURIComponent(m.imageUrl)}`}
                                            className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-xs font-black uppercase tracking-widest gap-2 backdrop-blur-sm"
                                        >
                                            <ImageIcon size={18} /> Open Design Lab
                                        </Link>
                                    </div>
                                )}

                                {m.role === 'ai' && (
                                    <div className="mt-6 pt-6 border-t border-white/5 flex gap-3">
                                        <button
                                            onClick={() => handlePublish(i, m.content, m.imageUrl)}
                                            disabled={publishingId === i}
                                            className="flex items-center gap-2 bg-[#1877F2] text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#1464cc] transition-all disabled:opacity-30 shadow-lg shadow-blue-500/20 active:scale-95"
                                        >
                                            {publishingId === i ? <Loader2 size={14} className="animate-spin" /> : <Facebook size={14} />}
                                            {publishingId === i ? 'Transmitting...' : 'Post to Facebook'}
                                        </button>
                                        <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors">
                                            <Globe size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {loading && (
                    <div className="flex justify-start items-start gap-4 animate-pulse">
                        <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-teal-400">
                            <Bot size={18} />
                        </div>
                        <div className="bg-white/[0.02] p-6 rounded-[2rem] rounded-tl-none border border-white/5 flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-widest">
                            <Loader2 className="animate-spin text-teal-500" size={16} />
                            Synapsing...
                        </div>
                    </div>
                )}
            </div>

            {/* Futuristic Input Bar - Fixed at Bottom */}
            <div className="flex-none p-8 lg:p-10 bg-[#020617] relative z-20 border-t border-white/5">
                <div className="max-w-4xl mx-auto relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/20 to-purple-500/20 rounded-[2.5rem] blur opacity-25 group-focus-within:opacity-100 transition duration-1000" />
                    <div className="relative flex gap-2 items-center bg-white/[0.02] border border-white/10 p-2 pr-2 pl-6 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl focus-within:border-teal-500/50 transition-all">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Describe your vision..."
                            className="flex-1 bg-transparent py-4 text-sm font-medium outline-none text-white placeholder:text-gray-600 tracking-tight"
                            disabled={loading}
                        />
                        <button
                            onClick={handleSend}
                            disabled={loading || !input.trim()}
                            className="bg-teal-500 text-black p-4 rounded-3xl hover:bg-teal-400 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-teal-500/20 disabled:opacity-10"
                        >
                            <Send size={20} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
                <p className="text-center text-[9px] text-gray-600 mt-6 font-black uppercase tracking-[0.4em]">
                    Neural Link v1.0 • End-to-End Encrypted
                </p>
            </div>
        </div>
    )
}