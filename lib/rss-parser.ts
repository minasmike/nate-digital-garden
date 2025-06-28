import Parser from 'rss-parser';
import { SubstackPost } from '@/types';

const parser = new Parser({
  customFields: {
    item: [
      ['content:encoded', 'contentEncoded'],
      ['description', 'description'],
    ]
  }
});

// Nate's Newsletter Substack RSS URL
const SUBSTACK_RSS_URL = process.env.SUBSTACK_RSS_URL || 'https://natesnewsletter.substack.com/feed';

export async function fetchSubstackPosts(): Promise<SubstackPost[]> {
  try {
    const feed = await parser.parseURL(SUBSTACK_RSS_URL);
    
    return feed.items.map((item, index) => {
      // Clean HTML content for excerpt
      const cleanContent = item.contentEncoded || item.content || item.description || '';
      const textContent = cleanContent.replace(/<[^>]*>/g, '').trim();
      const excerpt = textContent.substring(0, 200) + (textContent.length > 200 ? '...' : '');
      
      return {
        id: item.guid || item.link || `post-${index}`,
        title: item.title || 'Untitled',
        content: cleanContent,
        excerpt,
        link: item.link || '',
        pubDate: item.pubDate || new Date().toISOString(),
        author: item.creator || feed.title || 'Nate',
        categories: item.categories || [],
        contentSnippet: item.contentSnippet,
        isoDate: item.isoDate,
      };
    });
  } catch (error) {
    console.error('Error fetching Substack posts:', error);
    return [];
  }
}

export async function getPostById(id: string): Promise<SubstackPost | null> {
  const posts = await fetchSubstackPosts();
  return posts.find(post => post.id === id) || null;
}
