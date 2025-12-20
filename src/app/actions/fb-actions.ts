"use server";

import { createClient } from "@/utils/supabase/server";

export async function postToFacebook(imageUrl: string | null, caption: string) {
    const supabase = await createClient();

    try {
        // 1. Get the current logged-in user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Unauthorized");

        // 2. Fetch Facebook credentials from the 'profiles' table
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("fb_page_id, fb_access_token")
            .eq("id", user.id)
            .single();

        if (profileError || !profile?.fb_access_token || !profile?.fb_page_id) {
            throw new Error("Facebook credentials missing. Please check Settings.");
        }

        // 3. Determine the endpoint
        const endpoint = imageUrl
            ? `https://graph.facebook.com/v21.0/${profile.fb_page_id}/photos`
            : `https://graph.facebook.com/v21.0/${profile.fb_page_id}/feed`;

        const body: any = {
            access_token: profile.fb_access_token,
            message: caption,
        };

        if (imageUrl) {
            body.url = imageUrl;
        }

        // 4. Call the Facebook Graph API
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const result = await response.json();

        if (result.error) {
            throw new Error(result.error.message);
        }

        const fbPostId = result.id || result.post_id;

        // 5. NEW: Log the successful post in our database
        // This allows the History page to display your past work
        await supabase.from("posts").insert({
            user_id: user.id,
            caption: caption,
            image_url: imageUrl,
            fb_post_id: fbPostId
        });

        return { success: true, fbPostId };

    } catch (error: any) {
        console.error("Facebook API Error:", error.message);
        return { success: false, error: error.message };
    }
}