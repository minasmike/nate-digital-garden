# 🌱 Nate's Digital Garden

A Next.js 15 (App Router) site that automatically curates Nate's Substack content with AI enhancements. Designed to solve the "scattered content" problem with minimal maintenance.

## ✨ Key Features

### 📡 Substack Auto-Sync
- Fetches Nate's latest essays via RSS feed and displays them in a clean, searchable archive
- **Tech**: `rss-parser`, Next.js ISR (Incremental Static Regeneration)

### 🔍 AI-Powered Search
- Semantic search across all posts using OpenAI embeddings
- Fallback to simple text search when AI is unavailable
- **Tech**: OpenAI API (`text-embedding-ada-002`), vector similarity

### 🎨 Dark/Light Mode
- Toggleable theme matching Nate's brand
- **Tech**: `next-themes`, Tailwind CSS

### ⚡ Zero-Click Maintenance
- Posts auto-update when Nate publishes on Substack
- **Tech**: Vercel ISR (Incremental Static Regeneration)

### 🤖 Bonus AI Tools (Optional)
- Auto-summarize posts with Claude 3 API
- "Tweet this" button with automation possibilities

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- OpenAI API key (optional, for AI search)
- Substack RSS URL

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nate-digital-garden
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   # Required
   SUBSTACK_RSS_URL=https://your-substack.substack.com/feed
   NEXT_PUBLIC_SUBSTACK_URL=https://your-substack.substack.com
   
   # Optional (for AI search)
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Optional (for future features)
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## 🏗️ Project Structure

```
nate-digital-garden/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── posts/         # Substack RSS fetching
│   │   └── search/        # AI search endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── header.tsx         # Navigation header
│   ├── footer.tsx         # Site footer
│   ├── post-card.tsx      # Post display component
│   ├── search.tsx         # Search interface
│   ├── theme-provider.tsx # Theme context
│   └── theme-toggle.tsx   # Dark/light toggle
├── lib/                   # Utility libraries
│   ├── rss-parser.ts      # Substack RSS handling
│   ├── ai-search.ts       # OpenAI embeddings & search
│   └── utils.ts           # Helper functions
├── types/                 # TypeScript definitions
│   └── index.ts           # Shared interfaces
└── public/               # Static assets
```

## 🔧 Configuration

### Substack Setup
1. Replace `SUBSTACK_RSS_URL` with your actual Substack RSS feed
2. Update `NEXT_PUBLIC_SUBSTACK_URL` with your Substack homepage
3. The app will automatically fetch and display your posts

### AI Search Setup (Optional)
1. Get an OpenAI API key from [OpenAI Platform](https://platform.openai.com)
2. Add `OPENAI_API_KEY` to your `.env.local`
3. The app will automatically use semantic search when available
4. Falls back to simple text search without the API key

### Deployment

#### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy! The app will auto-update with ISR

#### Other Platforms
- **Netlify**: Works with some configuration
- **Railway**: Full compatibility
- **Self-hosted**: Any Node.js hosting with ISR support

## 📊 Performance Features

- **ISR**: Posts update every hour automatically
- **Client-side caching**: Search results cached locally
- **Optimistic UI**: Immediate feedback on interactions
- **Responsive design**: Works on all device sizes
- **Fast loading**: Optimized images and fonts

## 🎯 Customization

### Branding
- Edit `components/header.tsx` to update site title and navigation
- Modify `app/layout.tsx` for meta tags and SEO
- Update `components/footer.tsx` for footer content

### Styling
- All styles use Tailwind CSS
- Dark/light mode configured in `app/globals.css`
- Custom animations and utilities included

### Search Behavior
- Adjust search threshold in `lib/ai-search.ts` (line 109)
- Modify text search scoring in `components/search.tsx`
- Add custom search filters as needed

## 🔮 Future Enhancements

- [ ] **Post Summarization**: Auto-generate AI summaries
- [ ] **Related Posts**: ML-powered content recommendations  
- [ ] **Social Sharing**: One-click Twitter/LinkedIn sharing
- [ ] **Newsletter Integration**: Email signup with ConvertKit
- [ ] **Analytics**: View tracking and popular posts
- [ ] **Comments**: Discussion system integration
- [ ] **Full-text Search**: Enhanced search with Algolia
- [ ] **RSS Output**: Generate custom RSS feeds

## 🛠️ Development

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript checks
```

### Adding Features

1. **New API Routes**: Add to `app/api/`
2. **New Components**: Add to `components/`
3. **New Pages**: Add to `app/`
4. **Utilities**: Add to `lib/`

### Testing

The project includes:
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting (recommended)

## 📄 License

MIT License - feel free to use this for your own digital garden!

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 💡 Support

If you find this useful:
- ⭐ Star the repository
- 🐛 Report bugs via GitHub Issues
- 💬 Share feedback and suggestions
- 🔗 Share with others building digital gardens

---

**Built with ❤️ using Next.js, OpenAI, and modern web technologies.**
