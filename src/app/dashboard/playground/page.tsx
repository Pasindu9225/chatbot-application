'use client'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'

// We load the Editor dynamically because 'react-konva' needs the 'window' object
const ImageEditor = dynamic(() => import('@/components/ImageEditor'), {
    ssr: false,
    loading: () => (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl">
            <Loader2 className="animate-spin text-[#0D9488] mb-4" />
            <p className="text-gray-500">Loading Canvas Engine...</p>
        </div>
    )
})

export default function PlaygroundPage() {
    return (
        <div className="p-8 max-w-6xl mx-auto">
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-bold text-gray-800">Design Studio</h1>
                <p className="text-gray-500 mt-2">Customize your AI content before publishing</p>
            </header>

            <Suspense fallback={<div>Loading...</div>}>
                <PlaygroundContent />
            </Suspense>
        </div>
    )
}

function PlaygroundContent() {
    const searchParams = useSearchParams()
    const imageUrl = searchParams.get('img')

    if (!imageUrl) {
        return (
            <div className="bg-white p-12 rounded-[2.5rem] text-center border border-dashed border-gray-300">
                <p className="text-gray-400 text-lg">No image selected. Start a chat to generate an image first.</p>
                <a href="/dashboard/chat" className="mt-4 inline-block text-[#0D9488] font-bold hover:underline">Go to Chat</a>
            </div>
        )
    }

    return <ImageEditor imageUrl={imageUrl} />
}