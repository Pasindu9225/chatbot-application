'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Save, Facebook, CheckCircle2 } from 'lucide-react'

export default function SettingsPage() {
    const [pageId, setPageId] = useState('')
    const [token, setToken] = useState('')
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success'>('idle')
    const supabase = createClient()

    // Load existing settings when the page opens
    useEffect(() => {
        const loadSettings = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('fb_page_id, fb_access_token')
                    .eq('id', user.id)
                    .single()

                if (data) {
                    setPageId(data.fb_page_id || '')
                    setToken(data.fb_access_token || '')
                }
            }
        }
        loadSettings()
    }, [supabase])

    const saveConfig = async () => {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { error } = await supabase
            .from('profiles')
            .update({
                fb_page_id: pageId,
                fb_access_token: token,
                updated_at: new Date().toISOString()
            })
            .eq('id', user.id)

        if (!error) {
            setStatus('success')
            setTimeout(() => setStatus('idle'), 3000)
        }
        setLoading(false)
    }

    return (
        <div className="max-w-3xl mx-auto py-12 px-6">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-[#0D9488] p-10 text-white">
                    <div className="flex items-center gap-4 mb-4">
                        <Facebook size={32} />
                        <h1 className="text-3xl font-bold">Facebook Bridge</h1>
                    </div>
                    <p className="text-teal-50 opacity-90">Connect your PagePilot agent to your Facebook Page via the Graph API.</p>
                </div>

                <div className="p-10 space-y-8">
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Facebook Page ID</label>
                        <input
                            type="text"
                            value={pageId}
                            onChange={(e) => setPageId(e.target.value)}
                            className="w-full px-6 py-4 rounded-2xl bg-[#F9F8F3] border-none outline-none focus:ring-2 focus:ring-[#0D9488] transition-all text-lg"
                            placeholder="e.g. 1029384756"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Page Access Token</label>
                        <textarea
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            rows={4}
                            className="w-full px-6 py-4 rounded-2xl bg-[#F9F8F3] border-none outline-none focus:ring-2 focus:ring-[#0D9488] transition-all text-lg font-mono text-sm"
                            placeholder="EAA..."
                        />
                    </div>

                    <button
                        onClick={saveConfig}
                        disabled={loading}
                        className={`w-full py-5 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg ${status === 'success' ? 'bg-green-500 text-white' : 'bg-[#0D9488] text-white hover:bg-[#0b7a6f]'
                            }`}
                    >
                        {loading ? 'Saving...' : status === 'success' ? <><CheckCircle2 /> Configuration Saved</> : <><Save size={20} /> Update Bridge Settings</>}
                    </button>
                </div>
            </div>

            <div className="mt-8 p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4 items-start">
                <div className="bg-amber-100 p-2 rounded-lg text-amber-700">💡</div>
                <p className="text-amber-800 text-sm leading-relaxed">
                    <strong>Security Note:</strong> Your access token is stored securely in your private Supabase profile. Never share this token with anyone. PagePilot uses it only to publish the posts you approve.
                </p>
            </div>
        </div>
    )
}