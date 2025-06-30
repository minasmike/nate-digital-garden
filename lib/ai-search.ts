import axios from 'axios';
import { SubstackPost, SearchResult, EmbeddingData } from '@/types';
import { loadEmbeddingsCache, saveEmbeddingsCache } from './embeddings-cache';

// Use Hugging Face Inference API for embeddings
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HF_EMBEDDING_MODEL = 'sentence-transformers/all-MiniLM-L6-v2'; // You can change to another model if desired

// Simple in-memory storage for embeddings (in production, use a vector database)
const embeddingsCache: EmbeddingData[] = loadEmbeddingsCache();

export async function generateEmbedding(text: string): Promise<number[]> {
  if (!HUGGINGFACE_API_KEY) {
    console.error('Hugging Face API key not set.');
    return [];
  }
  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/feature-extraction/${HF_EMBEDDING_MODEL}`,
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 20000,
      }
    );
    // The API returns [ [ ...embedding ] ]
    if (Array.isArray(response.data) && Array.isArray(response.data[0])) {
      return response.data[0];
    }
    return [];
  } catch (error) {
    console.error('Error generating embedding from Hugging Face:', error);
    return [];
  }
}

export async function createPostEmbeddings(posts: SubstackPost[]): Promise<void> {
  const newEmbeddings: EmbeddingData[] = [];

  for (const post of posts) {
    // Skip if already processed
    if (embeddingsCache.some(e => e.postId === post.id)) continue;

    try {
      // Create embeddings for title, excerpt, and content chunks
      const titleEmbedding = await generateEmbedding(post.title);
      const excerptEmbedding = await generateEmbedding(post.excerpt);

      newEmbeddings.push(
        {
          postId: post.id,
          embedding: titleEmbedding,
          text: post.title,
          section: 'title',
        },
        {
          postId: post.id,
          embedding: excerptEmbedding,
          text: post.excerpt,
          section: 'excerpt',
        }
      );

      // Split content into chunks for better search
      const contentChunks = chunkText(post.content, 500);
      for (const chunk of contentChunks) {
        const chunkEmbedding = await generateEmbedding(chunk);
        newEmbeddings.push({
          postId: post.id,
          embedding: chunkEmbedding,
          text: chunk,
          section: 'content',
        });
      }
    } catch (error) {
      console.error(`Error creating embeddings for post ${post.id}:`, error);
    }
  }

  if (newEmbeddings.length > 0) {
    embeddingsCache.push(...newEmbeddings);
    saveEmbeddingsCache(embeddingsCache);
  }
}

export async function semanticSearch(query: string, posts: SubstackPost[], limit: number = 10): Promise<SearchResult[]> {
  // Remove OpenAI check, always use semantic search if Hugging Face key is set
  if (!HUGGINGFACE_API_KEY) {
    // Fallback to simple text search
    return simpleTextSearch(query, posts, limit);
  }

  try {
    // Ensure embeddings are created
    await createPostEmbeddings(posts);

    // Generate query embedding
    const queryEmbedding = await generateEmbedding(query);
    if (queryEmbedding.length === 0) {
      return simpleTextSearch(query, posts, limit);
    }

    // Calculate similarities
    const similarities = embeddingsCache.map(embedding => ({
      ...embedding,
      similarity: cosineSimilarity(queryEmbedding, embedding.embedding),
    }));

    // Group by post and get best score for each
    const postScores = new Map<string, { score: number; sections: string[] }>();

    similarities.forEach(sim => {
      const existing = postScores.get(sim.postId);
      if (!existing || sim.similarity > existing.score) {
        postScores.set(sim.postId, {
          score: sim.similarity,
          sections: existing ? [...existing.sections, sim.text] : [sim.text],
        });
      }
    });

    // Convert to SearchResult format
    const results: SearchResult[] = [];
    for (const [postId, { score, sections }] of postScores.entries()) {
      const post = posts.find(p => p.id === postId);
      // Lower threshold to 0.3 for more inclusive results
      if (post && score > 0.3) {
        results.push({
          post,
          score,
          relevantSections: sections.slice(0, 3), // Top 3 relevant sections
        });
      }
    }

    // If no results above threshold, return top N regardless of score
    let finalResults = results.sort((a, b) => b.score - a.score).slice(0, limit);
    if (finalResults.length === 0) {
      // Get top N posts by similarity, even if below threshold
      const fallbackResults: SearchResult[] = Array.from(postScores.entries())
        .map(([postId, { score, sections }]) => {
          const post = posts.find(p => p.id === postId);
          return post ? {
            post,
            score,
            relevantSections: sections.slice(0, 3),
          } : null;
        })
        .filter(Boolean)
        .sort((a, b) => b!.score - a!.score)
        .slice(0, limit) as SearchResult[];
      finalResults = fallbackResults;
    }

    // If still no results, or all scores are very low, merge with keyword fallback
    if (finalResults.length === 0 || finalResults.every(r => r.score < 0.15)) {
      const keywordResults = simpleTextSearch(query, posts, limit);
      // Merge, avoiding duplicates
      const seen = new Set(finalResults.map(r => r.post.id));
      for (const k of keywordResults) {
        if (!seen.has(k.post.id)) finalResults.push(k);
      }
      finalResults = finalResults.slice(0, limit);
    }

    return finalResults
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

  } catch (error) {
    console.error('Error in semantic search:', error);
    return simpleTextSearch(query, posts, limit);
  }
}

function simpleTextSearch(query: string, posts: SubstackPost[], limit: number): SearchResult[] {
  const queryLower = query.toLowerCase();

  return posts
    .map(post => {
      const titleMatch = post.title.toLowerCase().includes(queryLower);
      const contentMatch = post.content.toLowerCase().includes(queryLower);
      const excerptMatch = post.excerpt.toLowerCase().includes(queryLower);

      let score = 0;
      if (titleMatch) score += 1;
      if (excerptMatch) score += 0.7;
      if (contentMatch) score += 0.5;

      return { post, score, relevantSections: [] };
    })
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

function chunkText(text: string, chunkSize: number): string[] {
  const words = text.split(' ');
  const chunks: string[] = [];

  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(' '));
  }

  return chunks;
}
