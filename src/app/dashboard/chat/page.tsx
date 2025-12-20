'use client'
import { useState, useEffect, useRef } from 'react'
import { generateSocialPost } from '@/app/actions/ai-actions'
import { postToFacebook } from '@/app/actions/fb-actions' // Import the FB action
import { Send, Image as ImageIcon, Loader2, User, Bot, Facebook, CheckCircle } from 'lucide-react'

export default function ChatPage() {
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string, imageUrl?: string | null }[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [publishingId, setPublishingId] = useState<number | null>(null) // Track which message is being published
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, loading])

    const handleSend = async () => {
        if (!input.trim() || loading) return

        const userMsg = input
        setInput('')
        setMessages(prev => [...prev, { role: 'user', content: userMsg }])
        setLoading(true)

        try {
            const result = await generateSocialPost(userMsg, 'default-session')

            if (result.success) {
                setMessages(prev => [...prev, {
                    role: 'ai',
                    content: result.text || '',
                    imageUrl: result.imageUrl
                }])
            } else {
                setMessages(prev => [...prev, { role: 'ai', content: "Notice: " + result.error }])
            }
        } catch (err) {
            setMessages(prev => [...prev, { role: 'ai', content: "Something went wrong. Please check your connection." }])
        } finally {
            setLoading(false)
        }
    }

    // New Function to handle Facebook Publishing
    const handlePublish = async (index: number, content: string, imageUrl?: string | null) => {
        setPublishingId(index)
        try {
            const result = await postToFacebook(imageUrl || null, content)
            if (result.success) {
                alert("Successfully published to Facebook!")
            } else {
                alert("Facebook Error: " + result.error)
            }
        } catch (err) {
            alert("An unexpected error occurred while publishing.")
        } finally {
            setPublishingId(null)
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] bg-[#F9F8F3] rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden m-4">

            {/* Messages Feed */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                        <div className="bg-white p-6 rounded-full shadow-sm text-[#0D9488]">
                            <Bot size={48} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">Hello, I'm PagePilot.</h2>
                            <p className="text-gray-500 mt-2 max-w-sm mx-auto text-lg">
                                Tell me about your brand or describe a post idea you want to publish to Facebook.
                            </p>
                        </div>
                    </div>
                )}

                {messages.map((m, i) => (
                    <div key={i} className={`flex items-start gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`p-2 rounded-full ${m.role === 'user' ? 'bg-[#0D9488] text-white' : 'bg-white text-[#0D9488] border border-gray-100'}`}>
                            {m.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                        </div>

                        <div className={`max-w-[80%] p-6 rounded-[2rem] shadow-sm ${m.role === 'user'
                            ? 'bg-[#0D9488] text-white rounded-tr-none'
                            : 'bg-white text-gray-800 rounded-tl-none border border-gray-50'
                            }`}>
                            <p className="text-lg leading-relaxed whitespace-pre-wrap">{m.content}</p>

                            {m.imageUrl && (
                                <div className="mt-6 rounded-2xl overflow-hidden border-4 border-[#F9F8F3] shadow-lg group relative">
                                    <img src={m.imageUrl} alt="AI Generated Content" className="w-full h-auto" />
                                    <a
                                        href={`/dashboard/playground?img=${encodeURIComponent(m.imageUrl)}`}
                                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold gap-2"
                                    >
                                        <ImageIcon size={20} /> Edit in Playground
                                    </a>
                                </div>
                            )}

                            {/* Added Publish Button for AI responses */}
                            {m.role === 'ai' && (
                                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                                    <button
                                        onClick={() => handlePublish(i, m.content, m.imageUrl)}
                                        disabled={publishingId === i}
                                        className="flex items-center gap-2 bg-[#1877F2] text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-[#1464cc] transition disabled:opacity-50"
                                    >
                                        {publishingId === i ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            <Facebook size={16} />
                                        )}
                                        {publishingId === i ? 'Publishing...' : 'Publish to Facebook'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start items-center gap-4">
                        <div className="p-2 rounded-full bg-white text-[#0D9488] border border-gray-100">
                            <Bot size={20} />
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] rounded-tl-none border border-gray-50 flex items-center gap-3 text-gray-500 italic">
                            <Loader2 className="animate-spin text-[#0D9488]" size={20} />
                            Crafting your social strategy...
                        </div>
                    </div>
                )}
            </div>

            {/* Input Bar */}
            <div className="p-6 lg:p-8 bg-white/50 backdrop-blur-sm border-t border-gray-100">
                <div className="flex gap-4 max-w-5xl mx-auto items-center bg-white p-2 pl-6 rounded-full shadow-lg border border-gray-100 focus-within:ring-2 focus-within:ring-[#0D9488]/20 transition-all">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your post idea here..."
                        className="flex-1 bg-transparent py-4 text-lg outline-none text-gray-700 placeholder:text-gray-400"
                        disabled={loading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="bg-[#0D9488] text-white p-5 rounded-full hover:bg-[#0b7a6f] hover:scale-105 active:scale-95 transition-all shadow-md disabled:opacity-30 disabled:hover:scale-100"
                    >
                        <Send size={24} />
                    </button>
                </div>
                <p className="text-center text-xs text-gray-400 mt-4 tracking-wide uppercase">
                    Powered by Gemini AI • PagePilot v1.0
                </p>
            </div>
        </div>
    )
}