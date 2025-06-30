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

// Define a type for RSS items with custom fields
interface RSSItem {
  guid?: string;
  link?: string;
  title?: string;
  content?: string;
  contentEncoded?: string;
  description?: string;
  pubDate?: string;
  creator?: string;
  categories?: string[];
  contentSnippet?: string;
  isoDate?: string;
  enclosure?: { url?: string };
  'media:content'?: { $?: { url?: string } };
  'itunes:image'?: { href?: string };
  'media:thumbnail'?: { url?: string };
}

export async function fetchSubstackPosts(): Promise<SubstackPost[]> {
  try {
    const feed = await parser.parseURL(SUBSTACK_RSS_URL);

    return feed.items.map((item: RSSItem, index: number) => {
      const contentEncoded = item.contentEncoded;
      const description = item.description;
      const cleanContent = contentEncoded || item.content || description || '';
      const textContent = cleanContent.replace(/<[^>]*>/g, '').trim();
      const excerpt = textContent.substring(0, 200) + (textContent.length > 200 ? '...' : '');

      // Try to extract image from enclosure, media:content, or first <img> in content
      let image = '';
      // If enclosure is an image or video, use it
      if (item.enclosure && item.enclosure.url && /\.(jpg|jpeg|png|gif|webp|mp4|webm|ogg)$/i.test(item.enclosure.url)) {
        image = item.enclosure.url;
      } else if (item['media:content']?.$?.url) {
        image = item['media:content'].$.url;
      } else {
        // Try to extract first <img src="..."> from content
        const imgMatch = cleanContent.match(/<img[^>]+src=["']([^"'>]+)["']/i);
        if (imgMatch && imgMatch[1]) {
          image = imgMatch[1];
        }
      }
      // If enclosure is an mp3 and no image found, try itunes:image or media:thumbnail
      if ((!image || image === '') && item.enclosure && item.enclosure.url && /\.mp3$/i.test(item.enclosure.url)) {
        if (item['itunes:image']?.href) {
          image = item['itunes:image'].href;
        } else if (item['media:thumbnail']?.url) {
          image = item['media:thumbnail'].url;
        }
      }
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
        image, // Add image field
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

export async function getAllPosts(): Promise<SubstackPost[]> {
  return await fetchSubstackPosts();
}
