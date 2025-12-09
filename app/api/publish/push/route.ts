import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/session';
import dbConnect from '@/lib/db';
import Website from '@/models/Website';
import Content from '@/models/Content';
import Optimization from '@/models/Optimization';

const publishSchema = z.object({
  websiteId: z.string(),
  contentId: z.string(),
  target: z.enum(['wordpress', 'webhook']),
  webhookUrl: z.string().url().optional(),
  publishOptions: z.object({
    title: z.string().optional(),
    status: z.enum(['draft', 'publish']).optional(),
  }).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const user = await requireAuth();

    // Parse and validate body
    const body = await request.json();
    const result = publishSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { websiteId, contentId, target, webhookUrl, publishOptions } = result.data;

    await dbConnect();

    // Verify website belongs to user
    const website = await Website.findOne({
      _id: websiteId,
      userId: user.id,
    });

    if (!website) {
      return NextResponse.json(
        { error: 'Website not found or unauthorized' },
        { status: 404 }
      );
    }

    // Get content and optimization
    const content = await Content.findById(contentId);
    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    const optimization = await Optimization.findOne({ contentId });

    const publishContent = optimization?.optimizedText || content.rawText;
    const title = publishOptions?.title || `Optimized Content - ${new Date().toISOString()}`;

    if (target === 'wordpress') {
      // WordPress publishing
      const wpApiUrl = website.cmsConfig?.apiUrl;
      const wpApiKey = website.cmsConfig?.apiKey;

      if (!wpApiUrl || !wpApiKey) {
        return NextResponse.json(
          { error: 'WordPress configuration missing. Please configure API URL and credentials in settings.' },
          { status: 400 }
        );
      }

      // Prepare WordPress post data
      const wpPostData = {
        title,
        content: publishContent,
        status: publishOptions?.status || 'draft',
      };

      // In a real implementation, we would make the actual API call
      // For now, return a structured response
      return NextResponse.json({
        success: true,
        message: `Content prepared for WordPress publishing to ${wpApiUrl}`,
        publishedUrl: `${wpApiUrl}/posts/(to-be-created)`,
        payload: wpPostData,
        note: 'In production, this would make an actual POST request to WordPress REST API',
      });

    } else if (target === 'webhook') {
      // Webhook publishing
      if (!webhookUrl) {
        return NextResponse.json(
          { error: 'Webhook URL is required for webhook target' },
          { status: 400 }
        );
      }

      const webhookPayload = {
        title,
        content: publishContent,
        contentType: content.contentType,
        url: content.url,
        timestamp: new Date().toISOString(),
      };

      try {
        // Make actual webhook call
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookPayload),
        });

        if (!response.ok) {
          throw new Error(`Webhook returned status ${response.status}`);
        }

        return NextResponse.json({
          success: true,
          message: 'Content published to webhook successfully',
          publishedUrl: webhookUrl,
        });
      } catch (webhookError: any) {
        console.error('Webhook error:', webhookError);
        return NextResponse.json(
          { 
            success: false,
            error: 'Failed to publish to webhook',
            details: webhookError.message,
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Invalid target' },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('Publish error:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to publish content' },
      { status: 500 }
    );
  }
}
