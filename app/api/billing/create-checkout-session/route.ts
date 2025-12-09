import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/session';
import { createCheckoutSession } from '@/lib/billing';

const checkoutSchema = z.object({
  plan: z.enum(['starter', 'growth', 'agency']),
});

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    const body = await request.json();
    const result = checkoutSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { plan } = result.data;

    const session = await createCheckoutSession(user.id, user.email, plan);

    return NextResponse.json({
      sessionId: session.sessionId,
      url: session.url,
    });
  } catch (error: any) {
    console.error('Create checkout session error:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
