import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/session';
import { evaluateVisibility, estimateTokens } from '@/lib/ai';
import { checkPlanLimit, logUsage } from '@/lib/planLimits';
import { rateLimit, getRateLimitHeaders } from '@/lib/rateLimit';
import dbConnect from '@/lib/db';
import Content from '@/models/Content';
import VisibilityScore from '@/models/VisibilityScore';

const testSchema = z.object({
  contentId: z.string().optional(),
  text: z.string().optional(),
}).refine((data) => data.contentId || data.text, {
  message: 'Either contentId or text must be provided',
});

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const user = await requireAuth();

    // Rate limiting
    const rateLimitResult = rateLimit(`score_${user.id}`, 10, 60 * 1000);
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
    const result = testSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { contentId, text } = result.data;

    // Check plan limits
    const limitCheck = await checkPlanLimit(
      user.id,
      user.subscriptionPlan as any,
      'visibilityScores'
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

    await dbConnect();

    let contentText = text || '';
    let contentDoc = null;

    // If contentId is provided, fetch the content
    if (contentId) {
      contentDoc = await Content.findById(contentId);
      if (!contentDoc) {
        return NextResponse.json(
          { error: 'Content not found' },
          { status: 404 }
        );
      }
      contentText = contentDoc.rawText;
    }

    if (!contentText) {
      return NextResponse.json(
        { error: 'No content to evaluate' },
        { status: 400 }
      );
    }

    // Evaluate visibility using AI
    const evaluation = await evaluateVisibility({
      content: contentText,
    });

    // Save visibility score if we have a contentId
    let scoreDoc = null;
    if (contentId) {
      scoreDoc = await VisibilityScore.create({
        contentId,
        chatgptScore: evaluation.chatgptScore,
        geminiScore: evaluation.geminiScore,
        rankingProbability: evaluation.rankingProbability,
      });
    }

    // Log usage
    const tokenCost = estimateTokens(contentText);
    await logUsage(user.id, 'visibility_score', tokenCost);

    return NextResponse.json({
      contentId: contentId || undefined,
      chatgptScore: evaluation.chatgptScore,
      geminiScore: evaluation.geminiScore,
      rankingProbability: evaluation.rankingProbability,
      insights: evaluation.insights,
      scoreId: scoreDoc?._id.toString(),
      usage: {
        current: limitCheck.current + 1,
        limit: limitCheck.limit,
      },
    });
  } catch (error: any) {
    console.error('Visibility score error:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to evaluate visibility' },
      { status: 500 }
    );
  }
}
