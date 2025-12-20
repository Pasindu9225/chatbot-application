import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27.acacia' as any,
})

export async function POST(req: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { priceId, tokens, isSubscription } = await req.json()

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: user.email, // Pre-fill email for better UX
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            // Use 'subscription' for monthly plans, 'payment' for top-ups
            mode: isSubscription ? 'subscription' : 'payment',
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?canceled=true`,
            metadata: {
                userId: user.id,
                // Stripe metadata MUST be strings
                tokensToAdd: tokens.toString(),
            },
        })

        return NextResponse.json({ url: session.url })
    } catch (err: any) {
        console.error('Stripe Error:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}