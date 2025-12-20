'use client'
import { useEffect, useState } from 'react'
import {
    LayoutDashboard,
    MessageSquare,
    Image as ImageIcon,
    Settings,
    History,
    PlaneTakeoff,
    Zap,
    ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'
import LogoutButton from './LogoutButton'

export default function Sidebar() {
    const pathname = usePathname()
    const [profile, setProfile] = useState<any>(null)
    const supabase = createClient()

    // Fetch live token balance for the "Fuel Gauge"
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

        // Optional: Realtime subscription to token changes
        const channel = supabase
            .channel('profile_changes')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, payload => {
                setProfile(payload.new)
            })
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [supabase])

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
        { name: 'AI Chat', icon: MessageSquare, href: '/dashboard/chat' },
        { name: 'Playground', icon: ImageIcon, href: '/dashboard/playground' },
        { name: 'Post History', icon: History, href: '/dashboard/history' },
        { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
    ]

    // Calculate fuel percentage for the visual bar (assuming 100 is the free cap)
    const fuelPercentage = profile ? Math.min((profile.tokens_balance / 100) * 100, 100) : 0

    return (
        <aside className="w-64 bg-[#020617] border-r border-white/5 flex flex-col h-screen sticky top-0 z-50 overflow-hidden">
            {/* Logo Section */}
            <div className="p-8 flex items-center gap-3 text-[#2DD4BF]">
                <div className="p-2 bg-teal-500/10 rounded-xl">
                    <PlaneTakeoff size={24} strokeWidth={2.5} />
                </div>
                <span className="text-xl font-black tracking-tighter uppercase">PagePilot</span>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="relative group block"
                        >
                            <div className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 font-bold text-[10px] uppercase tracking-widest ${isActive
                                    ? 'bg-[#0D9488] text-white shadow-lg shadow-teal-500/20'
                                    : 'text-gray-500 hover:bg-white/5 hover:text-[#2DD4BF]'
                                }`}>
                                <div className="flex items-center gap-3">
                                    <item.icon size={18} />
                                    {item.name}
                                </div>
                                {isActive && <ChevronRight size={14} className="opacity-50" />}
                            </div>

                            {/* Hover Indicator Line */}
                            {!isActive && (
                                <motion.div
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-teal-500 rounded-r-full group-hover:h-6 transition-all"
                                />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Token-Based SaaS Fuel Gauge */}
            <div className="px-6 mb-6">
                <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-5 backdrop-blur-md relative overflow-hidden">
                    {/* Subtle background pulse if low on tokens */}
                    {profile?.tokens_balance < 10 && (
                        <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
                    )}

                    <div className="flex justify-between items-center mb-3">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">System Fuel</span>
                        <Zap size={12} className={profile?.tokens_balance < 10 ? "text-red-500" : "text-teal-400"} />
                    </div>

                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${fuelPercentage}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full rounded-full ${profile?.tokens_balance < 10
                                    ? 'bg-gradient-to-r from-red-500 to-orange-500'
                                    : 'bg-gradient-to-r from-[#0D9488] to-emerald-500'
                                }`}
                        />
                    </div>

                    <div className="mt-4 flex flex-col gap-1">
                        <p className="text-[11px] font-black text-white uppercase tracking-tight">
                            {profile?.tokens_balance ?? '0'} <span className="text-gray-500">Tokens Left</span>
                        </p>
                        <Link href="/dashboard/settings" className="text-[9px] font-bold text-teal-500 hover:text-teal-400 uppercase tracking-widest transition-colors">
                            Refuel System →
                        </Link>
                    </div>
                </div>
            </div>

            {/* Logout Footer */}
            <div className="p-4 border-t border-white/5 bg-black/20">
                <LogoutButton />
            </div>
        </aside>
    )
}