"use server";

import { textModel, imageModel } from "@/lib/gemini";
import { createClient } from "@/utils/supabase/server";

export async function generateSocialPost(prompt: string, sessionId: string) {
    const supabase = await createClient();

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Unauthorized");

        // 1. Check Token Balance
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("tokens_balance")
            .eq("id", user.id)
            .single();

        if (profileError || !profile || profile.tokens_balance < 1) {
            throw new Error("Insufficient tokens. Please upgrade your plan.");
        }

        // 2. Generate Text (Costs 1 Token)
        const textResult = await textModel.generateContent(`Act as a professional Facebook Social Media Manager. Write a catchy caption for: ${prompt}`);
        const textContent = textResult.response.text();

        // Deduct 1 token for text
        await supabase.rpc('deduct_tokens', { user_id: user.id, amount: 1 });

        let finalImageUrl = "";

        // 3. Try Image Generation (Costs 5 extra tokens if successful)
        if (profile.tokens_balance >= 6) { // 1 for text + 5 for image
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

                        // Deduct 5 additional tokens for the image
                        await supabase.rpc('deduct_tokens', { user_id: user.id, amount: 5 });

                        // Log token spend
                        await supabase.from("token_logs").insert({
                            user_id: user.id,
                            amount: -5,
                            action_type: 'image_generation'
                        });
                    }
                }
            } catch (imageErr) {
                console.log("Image generation failed or not permitted, skipping image deduction.");
            }
        }

        // 4. Save Message and Log Text Deduction
        await supabase.from("chat_messages").insert({
            session_id: sessionId,
            sender: "ai",
            content: textContent,
            image_url: finalImageUrl || null,
        });

        await supabase.from("token_logs").insert({
            user_id: user.id,
            amount: -1,
            action_type: 'text_generation'
        });

        return {
            success: true,
            text: textContent,
            imageUrl: finalImageUrl || null
        };

    } catch (error: any) {
        console.error("AI Action Error:", error.message);
        return { success: false, error: error.message || "Failed to generate content." };
    }
}