'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { ExternalLink, Calendar } from 'lucide-react'

export default function HistoryPage() {
    const [posts, setPosts] = useState<any[]>([])
    const supabase = createClient()

    useEffect(() => {
        const fetchPosts = async () => {
            const { data } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false })
            if (data) setPosts(data)
        }
        fetchPosts()
    }, [])

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Post History</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <div key={post.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                        {post.image_url && (
                            <img src={post.image_url} alt="Posted content" className="w-full h-48 object-cover" />
                        )}
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 text-gray-400 text-xs mb-3 uppercase font-bold tracking-widest">
                                <Calendar size={14} />
                                {new Date(post.created_at).toLocaleDateString()}
                            </div>
                            <p className="text-gray-700 line-clamp-3 mb-6 flex-1">{post.caption}</p>

                            <a
                                href={`https://facebook.com/${post.fb_post_id}`}
                                target="_blank"
                                className="w-full py-3 bg-[#F9F8F3] text-[#0D9488] rounded-xl font-bold text-center flex items-center justify-center gap-2 hover:bg-gray-100 transition"
                            >
                                View on Facebook <ExternalLink size={16} />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}