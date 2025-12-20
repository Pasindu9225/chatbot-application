import { LayoutDashboard, MessageSquare, Image as ImageIcon, Settings, LogOut } from 'lucide-react'
import LogoutButton from './LogoutButton'

export default function Sidebar() {
    return (
        <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
            <div className="p-8">
                <h2 className="text-2xl font-bold text-[#0D9488] tracking-tight">PagePilot</h2>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {[
                    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
                    { name: 'AI Chat', icon: MessageSquare, href: '/dashboard/chat' },
                    { name: 'Playground', icon: ImageIcon, href: '/dashboard/playground' },
                    { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
                ].map((item) => (
                    <a key={item.name} href={item.href} className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-[#F9F8F3] hover:text-[#0D9488] rounded-2xl transition-all duration-200 font-medium">
                        <item.icon size={20} />
                        {item.name}
                    </a>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-50">
                <LogoutButton />
            </div>
        </aside>
    )
}