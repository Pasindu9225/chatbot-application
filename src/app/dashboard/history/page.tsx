'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'
import { ExternalLink, Calendar, History, Search } from 'lucide-react'

export default function HistoryPage() {
    const [posts, setPosts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchPosts = async () => {
            const { data } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false })
            if (data) setPosts(data)
            setLoading(false)
        }
        fetchPosts()
    }, [supabase])

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 lg:p-12 relative overflow-hidden font-sans">
            {/* Background Glows to match landing theme */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0D9488]/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header Section */}
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-widest mb-4"
                        >
                            <History size={14} /> Mission Logs
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none uppercase">
                            POST <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2DD4BF] to-emerald-500">HISTORY.</span>
                        </h1>
                    </div>

                    {/* Search Bar Placeholder for futuristic feel */}
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500/20 to-purple-500/20 rounded-xl blur opacity-25 group-focus-within:opacity-100 transition duration-500" />
                        <div className="relative flex items-center bg-white/[0.03] border border-white/10 px-4 py-2 rounded-xl focus-within:border-teal-500/50 transition-all">
                            <Search size={18} className="text-gray-500 mr-2" />
                            <input
                                type="text"
                                placeholder="Filter logs..."
                                className="bg-transparent outline-none text-sm font-medium text-white placeholder:text-gray-600 w-48"
                            />
                        </div>
                    </div>
                </header>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
                    </div>
                ) : posts.length === 0 ? (
                    <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-20 text-center">
                        <p className="text-gray-500 font-bold uppercase tracking-widest">No transmissions recorded yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post, idx) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ y: -8 }}
                                className="group bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl flex flex-col hover:bg-white/[0.04] transition-all"
                            >
                                {post.image_url && (
                                    <div className="relative h-56 overflow-hidden">
                                        <img
                                            src={post.image_url}
                                            alt="Transmission Content"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent opacity-60" />
                                    </div>
                                )}

                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 text-teal-400 text-[10px] mb-4 uppercase font-black tracking-[0.2em]">
                                        <Calendar size={14} />
                                        {new Date(post.created_at).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </div>
                                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-4 mb-8 flex-1 font-medium italic">
                                        "{post.caption}"
                                    </p>

                                    <a
                                        href={`https://facebook.com/${post.fb_post_id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-4 bg-white/[0.05] border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest text-center flex items-center justify-center gap-2 hover:bg-[#1877F2] hover:border-[#1877F2] transition-all"
                                    >
                                        Inspect Transmission <ExternalLink size={14} />
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <footer className="py-12 text-center text-gray-700 text-[9px] font-black uppercase tracking-[0.4em]">
                Secure Log Database • PagePilot v1.0
            </footer>
        </div>
    )
}