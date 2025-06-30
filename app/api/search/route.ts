import { NextRequest, NextResponse } from 'next/server';
import { fetchSubstackPosts } from '@/lib/rss-parser';
import { semanticSearch } from '@/lib/ai-search';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const limit = parseInt(searchParams.get('limit') || '10');

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    );
  }

  try {
    const posts = await fetchSubstackPosts();
    const results = await semanticSearch(query, posts, limit);

    return NextResponse.json({
      query,
      results,
      totalResults: results.length,
      searchTime: Date.now(),
    });
  } catch (error) {
    console.error('Search error:', error);

    return NextResponse.json(
      {
        error: 'Search failed',
        query,
        results: [],
        totalResults: 0,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { query, limit = 10 } = await request.json();

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    );
  }

  try {
    const posts = await fetchSubstackPosts();
    const results = await semanticSearch(query, posts, limit);

    return NextResponse.json({
      query,
      results,
      totalResults: results.length,
      searchTime: Date.now(),
    });
  } catch (error) {
    console.error('Search error:', error);

    return NextResponse.json(
      {
        error: 'Search failed',
        query,
        results: [],
        totalResults: 0,
      },
      { status: 500 }
    );
  }
}
