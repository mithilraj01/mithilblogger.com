import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/session';
import { scanCompetitor, estimateTokens } from '@/lib/ai';
import { checkPlanLimit, logUsage } from '@/lib/planLimits';
import { rateLimit, getRateLimitHeaders } from '@/lib/rateLimit';

const scanSchema = z.object({
  competitorUrl: z.string().url('Invalid URL'),
  content: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const user = await requireAuth();

    // Rate limiting
    const rateLimitResult = rateLimit(`competitor_${user.id}`, 5, 60 * 1000);
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
    const result = scanSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { competitorUrl, content } = result.data;

    // Check plan limits
    const limitCheck = await checkPlanLimit(
      user.id,
      user.subscriptionPlan as any,
      'competitorScans'
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

    // In a real implementation, if content is not provided,
    // we would fetch the page content from the URL
    let contentToAnalyze = content;
    if (!contentToAnalyze) {
      contentToAnalyze = `Analyzing competitor URL: ${competitorUrl}. (URL content fetching not implemented in this demo. Please provide content directly.)`;
    }

    // Scan competitor using AI
    const analysis = await scanCompetitor({
      url: competitorUrl,
      content: contentToAnalyze,
    });

    // Log usage
    const tokenCost = estimateTokens(contentToAnalyze + analysis.improvedVersion);
    await logUsage(user.id, 'competitor_scan', tokenCost);

    return NextResponse.json({
      entities: analysis.entities,
      summary: analysis.summary,
      improvedVersion: analysis.improvedVersion,
      keywords: analysis.keywords,
      usage: {
        current: limitCheck.current + 1,
        limit: limitCheck.limit,
      },
    });
  } catch (error: any) {
    console.error('Competitor scan error:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to scan competitor' },
      { status: 500 }
    );
  }
}
