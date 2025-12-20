'use client'
import { useState } from 'react'
import { generateSocialPost } from '@/app/actions/ai-actions'
import { Send, Image as ImageIcon } from 'lucide-react'

export default function ChatPage() {
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string, imageUrl?: string }[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSend = async () => {
        if (!input.trim()) return
        const userMsg = input
        setInput('')
        setMessages(prev => [...prev, { role: 'user', content: userMsg }])
        setLoading(true)

        const result = await generateSocialPost(userMsg, 'default-session') // Replace with real session ID

        if (result.success) {
            setMessages(prev => [...prev, {
                role: 'ai',
                content: result.text || '',
                imageUrl: result.imageUrl
            }])
        }
        setLoading(false)
    }

    return (
        <div className="flex flex-col h-full bg-[#F9F8F3] rounded-3xl overflow-hidden shadow-sm">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${m.role === 'user' ? 'bg-[#0D9488] text-white' : 'bg-white text-gray-800'}`}>
                            <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                            {m.imageUrl && (
                                <div className="mt-4 rounded-xl overflow-hidden border border-gray-100">
                                    <img src={m.imageUrl} alt="AI Generated" className="w-full h-auto object-cover" />
                                    <button className="w-full bg-white/10 backdrop-blur-md py-2 text-xs font-semibold hover:bg-white/20 transition flex items-center justify-center gap-2">
                                        <ImageIcon size={14} /> Edit in Playground
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {loading && <div className="text-[#0D9488] animate-pulse font-medium">PagePilot is thinking...</div>}
            </div>

            <div className="p-6 bg-white border-t border-gray-100">
                <div className="flex gap-4 max-w-4xl mx-auto">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Tell PagePilot your post idea..."
                        className="flex-1 bg-gray-50 px-6 py-4 rounded-full outline-none focus:ring-2 focus:ring-[#0D9488] transition"
                    />
                    <button onClick={handleSend} disabled={loading} className="bg-[#0D9488] text-white p-4 rounded-full hover:bg-[#0b7a6f] transition shadow-lg disabled:opacity-50">
                        <Send size={24} />
                    </button>
                </div>
            </div>
        </div>
    )
}