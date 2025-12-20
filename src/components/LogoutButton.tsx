'use client'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
    const supabase = createClient()
    const router = useRouter()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <button onClick={handleSignOut} className="text-red-500 font-medium hover:text-red-700 transition">
            Sign Out
        </button>
    )
}