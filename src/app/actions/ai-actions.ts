"use server";

import { textModel, imageModel } from "@/lib/gemini";
import { createClient } from "@/utils/supabase/server";

export async function generateSocialPost(prompt: string, sessionId: string) {
    const supabase = await createClient();

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Unauthorized");

        // 1. Generate Text (This usually always works)
        const textResult = await textModel.generateContent(`Act as a professional Facebook Social Media Manager. Write a catchy caption for: ${prompt}`);
        const textContent = textResult.response.text();

        let finalImageUrl = "";

        // 2. Try to Generate Image (Wrapped in a separate try/catch so it doesn't crash the text)
        try {
            const imageResult = await imageModel.generateContent(`Generate a high-quality Facebook post image for: ${prompt}`);
            const base64Image = imageResult.response.candidates?.[0]?.content?.parts?.find((p: any) => "inlineData" in p)?.inlineData?.data;

            if (base64Image) {
                const fileName = `${user.id}/${Date.now()}.png`;
                const imageBuffer = Buffer.from(base64Image, 'base64');
                const { data: uploadData } = await supabase.storage.from('generated-images').upload(fileName, imageBuffer);

                if (uploadData) {
                    const { data: { publicUrl } } = supabase.storage.from('generated-images').getPublicUrl(fileName);
                    finalImageUrl = publicUrl;
                }
            }
        } catch (imageErr) {
            console.log("Image generation failed or not permitted, skipping image.");
        }

        // 3. Save to Database
        await supabase.from("chat_messages").insert({
            session_id: sessionId,
            sender: "ai",
            content: textContent,
            image_url: finalImageUrl || null,
        });

        return {
            success: true,
            text: textContent,
            imageUrl: finalImageUrl || null
        };

    } catch (error: any) {
        console.error("AI Action Error:", error.message);
        return { success: false, error: "Failed to generate content. Please try again." };
    }
}