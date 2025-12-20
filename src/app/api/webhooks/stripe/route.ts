import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27.acacia' as any,
})

// Use the Service Role Key so the webhook can bypass RLS to add tokens
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
    const body = await req.text()
    const signature = (await headers()).get('Stripe-Signature') as string

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (err: any) {
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    // Handle the successful payment event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session

        const userId = session.metadata?.userId
        const tokensToAdd = parseInt(session.metadata?.tokensToAdd || '0')

        if (userId && tokensToAdd > 0) {
            // Update Supabase: Add the purchased tokens to the user's balance
            const { error } = await supabaseAdmin
                .rpc('increment_tokens', {
                    user_id: userId,
                    amount: tokensToAdd
                })

            if (error) console.error('Supabase Update Error:', error)
        }
    }

    return NextResponse.json({ received: true })
}