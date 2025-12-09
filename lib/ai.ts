import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize AI clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-dummy-key-for-build',
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy-key-for-build');

// Types for AI functions
interface OptimizeContentParams {
  text: string;
  intent?: string;
  targetAudience?: string;
}

interface GenerateAEOParams {
  query: string;
  industry?: string;
}

interface EvaluateVisibilityParams {
  content: string;
}

interface ScanCompetitorParams {
  url: string;
  content?: string;
}

/**
 * Optimize content for GEO (Generative Engine Optimization)
 */
export async function optimizeContentForGEO(params: OptimizeContentParams) {
  const { text, intent = 'informational', targetAudience = 'general' } = params;

  try {
    const prompt = `You are an expert in GEO (Generative Engine Optimization) and AEO (Answer Engine Optimization).

Optimize the following content to be more discoverable and useful for AI search engines like ChatGPT and Gemini.

Content: ${text}

Intent: ${intent}
Target Audience: ${targetAudience}

Provide:
1. Optimized content that is clear, structured, and AI-friendly
2. Key entities (people, places, concepts) mentioned
3. Suggested FAQ questions and answers (at least 3)
4. Suggested semantic headings (H2/H3 structure)

Return your response in JSON format:
{
  "optimizedText": "...",
  "entities": ["entity1", "entity2", ...],
  "suggestedFAQs": [{"question": "...", "answer": "..."}],
  "suggestedHeadings": ["heading1", "heading2", ...]
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert in GEO and AEO optimization. Always respond with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      optimizedText: result.optimizedText || text,
      entities: result.entities || [],
      suggestedFAQs: result.suggestedFAQs || [],
      suggestedHeadings: result.suggestedHeadings || [],
    };
  } catch (error) {
    console.error('Error optimizing content for GEO:', error);
    throw new Error('Failed to optimize content');
  }
}

/**
 * Generate AEO answers for a query
 */
export async function generateAEOAnswers(params: GenerateAEOParams) {
  const { query, industry = 'general' } = params;

  try {
    const prompt = `You are an expert in creating AEO (Answer Engine Optimization) content.

Generate comprehensive answers for the following query that would be useful for AI assistants:

Query: ${query}
Industry: ${industry}

Provide:
1. Direct Answer (1-2 sentences, concise)
2. Long Answer (comprehensive, 3-4 paragraphs)
3. Voice Answer (natural spoken response, 2-3 sentences)
4. FAQ (3-5 related questions with answers)

Return your response in JSON format:
{
  "directAnswer": "...",
  "longAnswer": "...",
  "voiceAnswer": "...",
  "faq": [{"question": "...", "answer": "..."}]
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert in AEO content creation. Always respond with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      directAnswer: result.directAnswer || '',
      longAnswer: result.longAnswer || '',
      voiceAnswer: result.voiceAnswer || '',
      faq: result.faq || [],
    };
  } catch (error) {
    console.error('Error generating AEO answers:', error);
    throw new Error('Failed to generate AEO answers');
  }
}

/**
 * Evaluate content visibility across AI search engines
 */
export async function evaluateVisibility(params: EvaluateVisibilityParams) {
  const { content } = params;

  try {
    // Get OpenAI evaluation
    const openaiPrompt = `Rate the following content for AI search visibility (0-100):

Content: ${content}

Consider:
- Clarity and structure
- Entity recognition
- Question-answer format
- Semantic richness
- Citation-worthy statements

Return only a JSON object with:
{
  "score": <number 0-100>,
  "insights": ["insight1", "insight2", ...]
}`;

    const openaiResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an AI search visibility expert. Respond with valid JSON only.',
        },
        {
          role: 'user',
          content: openaiPrompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.5,
    });

    const openaiResult = JSON.parse(openaiResponse.choices[0].message.content || '{"score": 50}');

    // Get Gemini evaluation
    let geminiScore = 50;
    let geminiInsights: string[] = [];

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const geminiPrompt = `Rate this content for AI search visibility (0-100). Consider clarity, structure, and usefulness. Respond with JSON: {"score": <number>, "insights": ["..."]}

Content: ${content}`;

      const result = await model.generateContent(geminiPrompt);
      const response = await result.response;
      const text = response.text();
      
      // Try to extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const geminiResult = JSON.parse(jsonMatch[0]);
        geminiScore = geminiResult.score || 50;
        geminiInsights = geminiResult.insights || [];
      }
    } catch (geminiError) {
      console.warn('Gemini evaluation failed, using fallback score:', geminiError);
    }

    // Calculate ranking probability (weighted average)
    const rankingProbability = Math.round((openaiResult.score * 0.6 + geminiScore * 0.4));

    return {
      chatgptScore: openaiResult.score,
      geminiScore,
      rankingProbability,
      insights: [...(openaiResult.insights || []), ...geminiInsights],
    };
  } catch (error) {
    console.error('Error evaluating visibility:', error);
    throw new Error('Failed to evaluate visibility');
  }
}

/**
 * Scan competitor content and generate improved version
 */
export async function scanCompetitor(params: ScanCompetitorParams) {
  const { url, content = '' } = params;

  try {
    const prompt = `Analyze the following competitor content and create an improved, more GEO-optimized version.

${content ? `Content: ${content}` : `URL: ${url} (content to be analyzed)`}

Provide:
1. Key entities and concepts
2. Summary of the content
3. Improved version that is more AI-search friendly
4. Keywords to target

Return your response in JSON format:
{
  "entities": ["entity1", "entity2", ...],
  "summary": "...",
  "improvedVersion": "...",
  "keywords": ["keyword1", "keyword2", ...]
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a competitive analysis and GEO expert. Always respond with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      entities: result.entities || [],
      summary: result.summary || '',
      improvedVersion: result.improvedVersion || '',
      keywords: result.keywords || [],
    };
  } catch (error) {
    console.error('Error scanning competitor:', error);
    throw new Error('Failed to scan competitor');
  }
}

/**
 * Estimate token usage for logging
 */
export function estimateTokens(text: string): number {
  // Rough estimation: ~4 characters per token
  return Math.ceil(text.length / 4);
}
