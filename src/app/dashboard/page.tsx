// src/app/dashboard/page.tsx
import Link from 'next/link'

export default function DashboardPage() {
    return (
        <main className="flex-1 p-10">
            <header className="mb-12">
                <h1 className="text-5xl font-bold text-[#1F2937] tracking-tight">
                    Welcome to <span className="text-[#0D9488]">PagePilot</span>.
                </h1>
                <p className="text-gray-500 mt-4 text-xl">
                    Your social media is ready for takeoff. What are we posting today?
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Quick Action Card */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition">
                    <h3 className="text-2xl font-bold mb-4">Start a Chat</h3>
                    <p className="text-gray-600 mb-6">Brainstorm post ideas with your AI agent.</p>
                    <Link href="/dashboard/chat" className="inline-block bg-[#0D9488] text-white px-8 py-3 rounded-full font-bold">
                        Open Agent
                    </Link>
                </div>

                {/* Status Card */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition">
                    <h3 className="text-2xl font-bold mb-4">Account Status</h3>
                    <p className="text-gray-600 mb-6">Ensure your Facebook Bridge is connected.</p>
                    <a href="/dashboard/settings" className="inline-block border-2 border-[#0D9488] text-[#0D9488] px-8 py-3 rounded-full font-bold">
                        Check Settings
                    </a>
                </div>
            </div>
        </main>
    )
}