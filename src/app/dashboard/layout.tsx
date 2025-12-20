import Sidebar from '@/components/Sidebar'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        /* FIXED: 
           1. Changed h-screen to fix height to the viewport.
           2. Changed bg to #020617 to match your futuristic theme.
           3. Added overflow-hidden to the parent to prevent double scrollbars.
        */
        <div className="flex h-screen bg-[#020617] overflow-hidden font-sans">
            <Sidebar />

            <main className="flex-1 relative overflow-y-auto">
                {/* This container ensures that the background colors 
                   and orbs from your sub-pages stay contained.
                */}
                <div className="min-h-full w-full">
                    {children}
                </div>
            </main>
        </div>
    )
}