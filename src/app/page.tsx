'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useSpring, useMotionValue } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'
import {
  PlaneTakeoff, Sparkles, Image as ImageIcon, Shield,
  Loader2, ArrowRight, MessageSquare, Zap, Share2, MousePointer2
} from 'lucide-react'

export default function LandingPage() {
  const [user, setUser] = useState<any>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const supabase = createClient()

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 40, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 40, damping: 30 })
  const secondX = useSpring(mouseX, { stiffness: 20, damping: 40 })
  const secondY = useSpring(mouseY, { stiffness: 20, damping: 40 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      mouseX.set(e.clientX - centerX)
      mouseY.set(e.clientY - centerY)
    }
    window.addEventListener('mousemove', handleMouseMove)

    // IMPROVED: Handle both authenticated and guest states
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.log("Guest Session active")
      } finally {
        setCheckingAuth(false)
      }
    }
    getUser()

    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [supabase, mouseX, mouseY])

  if (checkingAuth) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <Loader2 className="animate-spin text-[#0D9488]" size={32} />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-[#0D9488]/30 font-sans overflow-x-hidden relative">

      {/* --- Interactive Background --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div style={{ x: springX, y: springY }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#0D9488]/10 blur-[100px] rounded-full" />
        <motion.div style={{ x: secondX, y: secondY }} className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] bg-purple-600/10 blur-[80px] rounded-full" />
      </div>

      <div className="relative z-10">
        <nav className="flex justify-between items-center px-6 py-4 max-w-6xl mx-auto border-b border-white/5 backdrop-blur-md sticky top-0">
          <div className="flex items-center gap-2 text-[#2DD4BF]">
            <PlaneTakeoff size={24} strokeWidth={2.5} />
            <span className="text-lg font-black tracking-tighter uppercase">PagePilot</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/dashboard" className="bg-[#0D9488] px-5 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-all hover:bg-[#14B8A6]">Dashboard <ArrowRight size={14} /></Link>
            ) : (
              <>
                <Link href="/login" className="text-xs font-bold text-gray-400 hover:text-white transition-all">Sign In</Link>
                <Link href="/login" className="bg-white text-black px-5 py-2 rounded-full text-xs font-bold hover:scale-105 transition-all">Get Started</Link>
              </>
            )}
          </div>
        </nav>

        <section className="pt-20 pb-16 px-4 text-center max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/20 bg-teal-500/5 text-teal-400 text-[9px] font-black uppercase tracking-[0.2em] mb-8">
              <Sparkles size={10} /> AI Social Pilot
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter leading-[1.1]">
              Own Your Feed <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2DD4BF] to-emerald-500">With Pure AI.</span>
            </h1>
            <p className="text-gray-400 text-base mb-10 max-w-xl mx-auto leading-relaxed font-medium">
              Generate, design, and publish high-converting content to Facebook in seconds.
            </p>
            <Link href={user ? "/dashboard/chat" : "/login"} className="bg-[#0D9488] text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-xl shadow-teal-500/30 inline-flex items-center gap-2 hover:scale-105 transition-all">
              {user ? "Open AI Agent" : "Start For Free"} <MessageSquare size={18} />
            </Link>
          </motion.div>
        </section>

        {/* Pricing & Features remain visible to all visitors */}
        <section className="py-16 px-6 border-t border-white/5 bg-white/[0.01]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-black uppercase tracking-widest">How it Works</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Brainstorm", icon: Zap, color: "text-teal-400", bg: "bg-teal-500/10", desc: "AI handles strategy and captions via Gemini 1.5." },
                { title: "Polish", icon: MousePointer2, color: "text-purple-400", bg: "bg-purple-500/10", desc: "Add text and branding in the Design Playground." },
                { title: "Launch", icon: Share2, color: "text-blue-400", bg: "bg-blue-500/10", desc: "Direct publishing to Facebook via secure bridge." }
              ].map((step, i) => (
                <motion.div key={i} whileHover={{ y: -5 }} className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-xl">
                  <div className={`w-10 h-10 ${step.bg} rounded-xl flex items-center justify-center ${step.color} mb-6`}><step.icon size={20} /></div>
                  <h3 className="text-lg font-black mb-3 uppercase tracking-tight">{step.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed font-medium">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-6 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black uppercase tracking-widest mb-4">Choose Your Fuel</h2>
            <p className="text-gray-500 font-medium">Scale your social presence with precision.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Free Pilot", price: "$0", tokens: "50", border: "border-white/5" },
              { name: "Pro Navigator", price: "$29", tokens: "500", border: "border-teal-500/40 shadow-xl shadow-teal-500/10" },
              { name: "Elite Captain", price: "$99", tokens: "Unlimited", border: "border-purple-500/30" }
            ].map((plan, i) => (
              <motion.div key={i} whileHover={{ y: -5 }} className={`p-8 rounded-[2.5rem] bg-white/[0.02] border ${plan.border} backdrop-blur-xl flex flex-col`}>
                <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                <div className="text-3xl font-black mb-6">{plan.price}<span className="text-xs text-gray-500 font-medium">/mo</span></div>
                <ul className="space-y-3 mb-10 flex-1 text-xs text-gray-400 font-medium">
                  <li className="flex items-center gap-2"><Zap size={14} className="text-teal-400" /> {plan.tokens} Monthly Tokens</li>
                  <li className="flex items-center gap-2"><Zap size={14} className="text-teal-400" /> AI Caption Engine</li>
                  <li className="flex items-center gap-2"><Zap size={14} className="text-teal-400" /> Facebook Bridge</li>
                  <li className="flex items-center gap-2"><Zap size={14} className="text-teal-400" /> Priority Support</li>
                </ul>
                <Link href="/login" className="w-full py-3.5 rounded-xl bg-white/5 border border-white/10 font-bold text-xs hover:bg-[#0D9488] hover:border-[#0D9488] transition-all text-center">
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        <footer className="py-12 border-t border-white/5 text-center text-gray-700 text-[9px] font-black uppercase tracking-[0.4em]">
          PagePilot System • 2025
        </footer>
      </div>
    </div>
  )
}