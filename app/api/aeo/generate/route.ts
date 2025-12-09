import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/session';
import { generateAEOAnswers, estimateTokens } from '@/lib/ai';
import { checkPlanLimit, logUsage } from '@/lib/planLimits';
import { rateLimit, getRateLimitHeaders } from '@/lib/rateLimit';

const generateSchema = z.object({
  query: z.string().min(3, 'Query must be at least 3 characters'),
  industry: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const user = await requireAuth();

    // Rate limiting
    const rateLimitResult = rateLimit(`aeo_${user.id}`, 10, 60 * 1000);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult),
        }
      );
    }

    // Parse and validate body
    const body = await request.json();
    const result = generateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { query, industry } = result.data;

    // Check plan limits
    const limitCheck = await checkPlanLimit(
      user.id,
      user.subscriptionPlan as any,
      'aiRequests'
    );

    if (!limitCheck.allowed) {
      return NextResponse.json(
        {
          error: limitCheck.message,
          current: limitCheck.current,
          limit: limitCheck.limit,
        },
        { status: 403 }
      );
    }

    // Generate AEO answers using AI
    const answers = await generateAEOAnswers({
      query,
      industry,
    });

    // Log usage
    const tokenCost = estimateTokens(
      query + answers.directAnswer + answers.longAnswer + answers.voiceAnswer
    );
    await logUsage(user.id, 'aeo_generate', tokenCost);

    return NextResponse.json({
      directAnswer: answers.directAnswer,
      longAnswer: answers.longAnswer,
      voiceAnswer: answers.voiceAnswer,
      faq: answers.faq,
      usage: {
        current: limitCheck.current + 1,
        limit: limitCheck.limit,
      },
    });
  } catch (error: any) {
    console.error('AEO generate error:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate AEO answers' },
      { status: 500 }
    );
  }
}
