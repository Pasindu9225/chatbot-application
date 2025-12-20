'use client'
import React, { useState, useRef } from 'react';
import { Stage, Layer, Image as KonvaImage, Text, Rect } from 'react-konva';
import useImage from 'use-image';

export default function ImageEditor({ imageUrl }: { imageUrl: string }) {
    const [image] = useImage(imageUrl);
    const [text, setText] = useState('Your Heading Here');
    const stageRef = useRef<any>(null);

    const handleDownload = () => {
        const uri = stageRef.current.toDataURL();
        const link = document.createElement('a');
        link.download = 'pagepilot-post.png';
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex flex-col items-center bg-[#F9F8F3] p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="mb-6 flex gap-4 w-full max-w-2xl">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="flex-1 px-6 py-3 rounded-full border border-gray-200 outline-none focus:ring-2 focus:ring-[#0D9488]"
                    placeholder="Type overlay text..."
                />
                <button
                    onClick={handleDownload}
                    className="bg-[#0D9488] text-white px-8 py-3 rounded-full font-bold hover:bg-[#0b7a6f] transition"
                >
                    Save Final Post
                </button>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-lg border border-white">
                <Stage width={500} height={500} ref={stageRef}>
                    <Layer>
                        {/* The AI Image */}
                        {image && <KonvaImage image={image} width={500} height={500} />}

                        {/* A Subtle Border Overlay */}
                        <Rect width={500} height={500} stroke="#0D9488" strokeWidth={20} listening={false} />

                        {/* The Text Layer */}
                        <Text
                            text={text}
                            fontSize={40}
                            fill="white"
                            x={50}
                            y={400}
                            draggable
                            fontStyle="bold"
                            shadowBlur={10}
                            shadowColor="black"
                        />
                    </Layer>
                </Stage>
            </div>
            <p className="mt-4 text-gray-500 text-sm italic">Tip: You can drag the text around the image!</p>
        </div>
    );
}