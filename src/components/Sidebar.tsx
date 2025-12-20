'use client'
import { LayoutDashboard, MessageSquare, Image as ImageIcon, Settings, History } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoutButton from './LogoutButton'

export default function Sidebar() {
    const pathname = usePathname()

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
        { name: 'AI Chat', icon: MessageSquare, href: '/dashboard/chat' },
        { name: 'Playground', icon: ImageIcon, href: '/dashboard/playground' },
        { name: 'Post History', icon: History, href: '/dashboard/history' }, // Added this
        { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
    ]

    return (
        <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
            <div className="p-8">
                <h2 className="text-2xl font-bold text-[#0D9488] tracking-tight">PagePilot</h2>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 font-medium ${isActive
                                    ? 'bg-[#F9F8F3] text-[#0D9488]'
                                    : 'text-gray-600 hover:bg-[#F9F8F3] hover:text-[#0D9488]'
                                }`}
                        >
                            <item.icon size={20} />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-gray-50">
                <LogoutButton />
            </div>
        </aside>
    )
}