import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/session';
import { optimizeContentForGEO, estimateTokens } from '@/lib/ai';
import { checkPlanLimit, logUsage } from '@/lib/planLimits';
import { rateLimit, getRateLimitHeaders } from '@/lib/rateLimit';
import dbConnect from '@/lib/db';
import Content from '@/models/Content';
import Optimization from '@/models/Optimization';
import Website from '@/models/Website';

const optimizeSchema = z.object({
  text: z.string().optional(),
  url: z.string().url().optional(),
  intent: z.string().optional(),
  targetAudience: z.string().optional(),
  contentType: z.enum(['blog', 'product', 'service', 'landing']).optional(),
  websiteId: z.string().optional(),
}).refine((data) => data.text || data.url, {
  message: 'Either text or url must be provided',
});

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const user = await requireAuth();

    // Rate limiting
    const rateLimitResult = rateLimit(`geo_${user.id}`, 10, 60 * 1000);
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
    const result = optimizeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { text, url, intent, targetAudience, contentType, websiteId } = result.data;

    // Check plan limits
    const limitCheck = await checkPlanLimit(
      user.id,
      user.subscriptionPlan as any,
      'contentOptimizations'
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

    // If URL is provided, we would fetch content here
    // For now, we'll just use the text or a placeholder
    let contentToOptimize = text || '';
    if (url && !text) {
      // In a real implementation, we would fetch the content from the URL
      contentToOptimize = `Content from ${url} (URL fetching not implemented in this demo)`;
    }

    if (!contentToOptimize) {
      return NextResponse.json(
        { error: 'No content to optimize' },
        { status: 400 }
      );
    }

    // Optimize content using AI
    const optimization = await optimizeContentForGEO({
      text: contentToOptimize,
      intent,
      targetAudience,
    });

    // Save content and optimization to database
    let contentDoc = null;
    let optimizationDoc = null;

    if (websiteId) {
      // Verify website belongs to user
      const website = await Website.findOne({
        _id: websiteId,
        userId: user.id,
      });

      if (website) {
        contentDoc = await Content.create({
          websiteId,
          url,
          rawText: contentToOptimize,
          contentType: contentType || 'blog',
        });

        optimizationDoc = await Optimization.create({
          contentId: contentDoc._id.toString(),
          optimizedText: optimization.optimizedText,
          entities: optimization.entities,
          citations: [],
          suggestedFAQs: optimization.suggestedFAQs,
          suggestedHeadings: optimization.suggestedHeadings,
          modelUsed: 'openai',
        });
      }
    }

    // Log usage
    const tokenCost = estimateTokens(contentToOptimize + optimization.optimizedText);
    await logUsage(user.id, 'geo_optimize', tokenCost);

    return NextResponse.json({
      optimizedText: optimization.optimizedText,
      entities: optimization.entities,
      suggestedFAQs: optimization.suggestedFAQs,
      suggestedHeadings: optimization.suggestedHeadings,
      originalLength: contentToOptimize.length,
      optimizedLength: optimization.optimizedText.length,
      contentId: contentDoc?._id.toString(),
      optimizationId: optimizationDoc?._id.toString(),
      usage: {
        current: limitCheck.current + 1,
        limit: limitCheck.limit,
      },
    });
  } catch (error: any) {
    console.error('GEO optimize error:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to optimize content' },
      { status: 500 }
    );
  }
}
