import fs from 'fs';
import path from 'path';
import { EmbeddingData } from '@/types';

const EMBEDDINGS_CACHE_PATH = path.resolve(process.cwd(), 'embeddings-cache.json');

export function loadEmbeddingsCache(): EmbeddingData[] {
  try {
    if (fs.existsSync(EMBEDDINGS_CACHE_PATH)) {
      const raw = fs.readFileSync(EMBEDDINGS_CACHE_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load embeddings cache:', e);
  }
  return [];
}

export function saveEmbeddingsCache(cache: EmbeddingData[]) {
  try {
    fs.writeFileSync(EMBEDDINGS_CACHE_PATH, JSON.stringify(cache, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to save embeddings cache:', e);
  }
}
