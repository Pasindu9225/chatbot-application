'use client'
import React, { useState, useRef } from 'react';
import { Stage, Layer, Image as KonvaImage, Text, Rect } from 'react-konva';
import useImage from 'use-image';
import { Download, Type, Save } from 'lucide-react';

export default function ImageEditor({ imageUrl }: { imageUrl: string }) {
    const [image] = useImage(imageUrl, 'anonymous');
    const [text, setText] = useState('Brand New Offer!');
    const stageRef = useRef<any>(null);

    const handleDownload = () => {
        const uri = stageRef.current.toDataURL();
        const link = document.createElement('a');
        link.download = 'pagepilot-production.png';
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Sidebar Controls */}
            <div className="lg:col-span-1 space-y-6 bg-white/[0.03] p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-xl">
                <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Type size={14} className="text-teal-400" /> Typography Overlay
                    </label>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-[#0D9488] transition-all"
                        placeholder="Enter heading..."
                    />
                </div>

                <button
                    onClick={handleDownload}
                    className="w-full bg-[#0D9488] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#14B8A6] transition-all shadow-xl shadow-teal-500/20"
                >
                    <Save size={18} /> Export Production Build
                </button>

                <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest font-bold">
                    Tip: Drag text on canvas to reposition
                </p>
            </div>

            {/* Canvas Area */}
            <div className="lg:col-span-2 flex justify-center bg-black/40 p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
                <div className="shadow-[0_0_50px_rgba(0,0,0,0.5)] border-[12px] border-white/5 rounded-lg overflow-hidden">
                    <Stage width={500} height={500} ref={stageRef}>
                        <Layer>
                            {image && <KonvaImage image={image} width={500} height={500} />}

                            {/* Neon Teal Border Overlay */}
                            <Rect width={500} height={500} stroke="#0D9488" strokeWidth={15} listening={false} />

                            <Text
                                text={text}
                                fontSize={38}
                                fill="white"
                                x={40}
                                y={420}
                                draggable
                                fontStyle="bold"
                                fontFamily="sans-serif"
                                shadowBlur={15}
                                shadowColor="black"
                                shadowOpacity={0.8}
                            />
                        </Layer>
                    </Stage>
                </div>
            </div>
        </div>
    );
}