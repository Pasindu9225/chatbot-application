"use server";

import { model } from "@/lib/gemini";
import { createClient } from "@/utils/supabase/server";

export async function generateSocialPost(prompt: string, sessionId: string) {
    const supabase = await createClient();

    try {
        // 1. Get the current user session
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Unauthorized");

        // 2. Prepare the System Prompt for Gemini
        const systemPrompt = `Act as a professional Facebook Social Media Manager. 
    Based on the following request, generate a catchy caption and a high-quality visual.
    Request: ${prompt}`;

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;

        let textContent = "";
        let base64Image = "";

        // 3. Safely extract Text and Image using Optional Chaining
        const parts = response.candidates?.[0]?.content?.parts;

        if (parts) {
            for (const part of parts) {
                if ("text" in part && part.text) {
                    textContent = part.text;
                } else if ("inlineData" in part && part.inlineData) {
                    base64Image = part.inlineData.data;
                }
            }
        }

        let finalImageUrl = "";

        // 4. If an image was generated, upload it to Supabase Storage
        if (base64Image) {
            const fileName = `${user.id}/${Date.now()}.png`;
            const imageBuffer = Buffer.from(base64Image, 'base64');

            const { data: uploadData, error: uploadError } = await supabase
                .storage
                .from('generated-images')
                .upload(fileName, imageBuffer, {
                    contentType: 'image/png',
                    upsert: true
                });

            if (uploadError) throw uploadError;

            // Get the Public URL
            const { data: { publicUrl } } = supabase.storage.from('generated-images').getPublicUrl(fileName);
            finalImageUrl = publicUrl;
        }

        // 5. Save the AI response to the chat_messages table
        const { data: message, error: dbError } = await supabase
            .from("chat_messages")
            .insert({
                session_id: sessionId,
                sender: "ai",
                content: textContent,
                image_url: finalImageUrl,
            })
            .select()
            .single();

        if (dbError) throw dbError;

        return {
            success: true,
            text: textContent,
            imageUrl: finalImageUrl,
            messageId: message.id
        };

    } catch (error: any) {
        console.error("AI Action Error:", error.message);
        return { success: false, error: error.message };
    }
}