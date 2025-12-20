"use server";

import { createClient } from "@/utils/supabase/server";

export async function postToFacebook(imageUrl: string, caption: string) {
    const supabase = await createClient();

    try {
        // 1. Get the user's saved Facebook credentials
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Please log in first.");

        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("fb_page_id, fb_access_token")
            .eq("id", user.id)
            .single();

        if (profileError || !profile?.fb_access_token) {
            throw new Error("Facebook not configured. Go to Settings.");
        }

        // 2. Call the Facebook Graph API
        // We use the /photos endpoint to post an image with a caption
        const fbUrl = `https://graph.facebook.com/v21.0/${profile.fb_page_id}/photos`;

        const response = await fetch(fbUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                url: imageUrl,
                caption: caption,
                access_token: profile.fb_access_token,
            }),
        });

        const result = await response.json();

        if (result.error) {
            throw new Error(result.error.message);
        }

        // 3. Log the successful post in your database
        await supabase.from("posts").insert({
            user_id: user.id,
            caption: caption,
            image_path: imageUrl,
            status: 'published',
            fb_post_id: result.id,
            published_at: new Date().toISOString()
        });

        return { success: true, postId: result.id };

    } catch (error: any) {
        console.error("Facebook Posting Error:", error.message);
        return { success: false, error: error.message };
    }
}