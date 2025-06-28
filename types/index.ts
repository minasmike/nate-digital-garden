export interface SubstackPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  link: string;
  pubDate: string;
  author: string;
  categories?: string[];
  contentSnippet?: string;
  isoDate?: string;
}

export interface SearchResult {
  post: SubstackPost;
  score: number;
  relevantSections?: string[];
}

export interface EmbeddingData {
  postId: string;
  embedding: number[];
  text: string;
  section: 'title' | 'content' | 'excerpt';
}

export interface Theme {
  isDark: boolean;
  toggle: () => void;
}
