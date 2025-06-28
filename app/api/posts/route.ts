import { NextResponse } from 'next/server';
import { fetchSubstackPosts } from '@/lib/rss-parser';

export async function GET() {
  try {
    const posts = await fetchSubstackPosts();
    
    return NextResponse.json({
      posts,
      lastUpdated: new Date().toISOString(),
      count: posts.length,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch posts',
        posts: [],
        lastUpdated: new Date().toISOString(),
        count: 0,
      },
      { status: 500 }
    );
  }
}

// Enable ISR with revalidation every hour
export const revalidate = 3600;
