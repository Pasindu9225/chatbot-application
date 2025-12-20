'use client'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function SettingsPage() {
    const [pageId, setPageId] = useState('')
    const [token, setToken] = useState('')
    const supabase = createClient()

    const saveConfig = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { error } = await supabase
            .from('profiles')
            .update({ fb_page_id: pageId, fb_access_token: token })
            .eq('id', user.id)

        if (!error) alert('Configuration Saved Successfully!')
    }

    return (
        <div className="max-w-2xl mx-auto p-10 bg-white rounded-3xl shadow-sm border border-gray-50">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Connect Facebook</h1>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Facebook Page ID</label>
                    <input
                        type="text"
                        value={pageId}
                        onChange={(e) => setPageId(e.target.value)}
                        className="w-full px-6 py-4 rounded-2xl bg-[#F9F8F3] border-none outline-none focus:ring-2 focus:ring-[#0D9488]"
                        placeholder="123456789..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Page Access Token</label>
                    <textarea
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        rows={4}
                        className="w-full px-6 py-4 rounded-2xl bg-[#F9F8F3] border-none outline-none focus:ring-2 focus:ring-[#0D9488]"
                        placeholder="EAA..."
                    />
                </div>

                <button
                    onClick={saveConfig}
                    className="w-full bg-[#0D9488] text-white py-4 rounded-full font-bold shadow-lg hover:scale-[1.02] transition-transform"
                >
                    Verify & Save Bridge
                </button>
            </div>
        </div>
    )
}