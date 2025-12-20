'use client'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Loader2, Palette, Sparkles, ArrowLeft } from 'lucide-react'

// Dynamic import for the Konva engine to prevent SSR issues
const ImageEditor = dynamic(() => import('@/components/ImageEditor'), {
    ssr: false,
    loading: () => (
        <div className="flex flex-col items-center justify-center h-[500px] bg-white/[0.02] border border-white/10 rounded-[2.5rem] backdrop-blur-xl">
            <Loader2 className="animate-spin text-[#0D9488] mb-4" size={32} />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Initializing Design Engine...</p>
        </div>
    )
})

export default function PlaygroundPage() {
    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 lg:p-10 relative overflow-hidden font-sans">
            {/* Background Aesthetic Orbs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0D9488]/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto">
                {/* Header Section */}
                <header className="mb-12 flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/20 bg-teal-500/5 text-teal-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
                    >
                        <Palette size={12} /> Design Lab
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none mb-4 uppercase">
                        VISUAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2DD4BF] to-emerald-500">PLAYGROUND.</span>
                    </h1>
                    <p className="text-gray-500 text-sm font-medium max-w-md">
                        Fine-tune your AI-generated assets with professional-grade overlays and branding.
                    </p>
                </header>

                {/* Content Area with Suspense for URL parameter handling */}
                <Suspense fallback={
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="animate-spin text-[#0D9488]" size={32} />
                    </div>
                }>
                    <PlaygroundContent />
                </Suspense>
            </div>
        </div>
    )
}

function PlaygroundContent() {
    const searchParams = useSearchParams()
    const imageUrl = searchParams.get('img')

    if (!imageUrl) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/[0.02] p-16 rounded-[3rem] text-center border border-white/5 backdrop-blur-xl flex flex-col items-center gap-8"
            >
                <div className="p-6 bg-white/5 rounded-3xl text-gray-600">
                    <Sparkles size={48} strokeWidth={1} />
                </div>
                <div className="space-y-2">
                    <p className="text-gray-400 text-xl font-bold tracking-tight">No asset detected in the Design Lab.</p>
                    <p className="text-gray-600 text-sm font-medium">Generate a visual via the AI Agent to begin customization.</p>
                </div>
                <Link
                    href="/dashboard/chat"
                    className="flex items-center gap-2 bg-[#0D9488] text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#14B8A6] transition-all shadow-lg shadow-teal-500/20"
                >
                    <ArrowLeft size={16} /> Return to Agent
                </Link>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
        >
            <ImageEditor imageUrl={imageUrl} />
        </motion.div>
    )
}