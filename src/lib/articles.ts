import { Article } from '@/types/article';

const STORAGE_KEY = 'newspaper_articles';

// Sample articles for demo
const sampleArticles: Article[] = [
  {
    id: '1',
    title: 'The Dawn of Artificial General Intelligence: A New Era Begins',
    summary: 'Leading researchers announce breakthrough in machine learning that could reshape humanity\'s future. The implications span from healthcare to climate science.',
    content: `<p>In a development that has sent shockwaves through the scientific community, researchers at leading institutions have announced what they believe to be a fundamental breakthrough in artificial intelligence.</p>
    <p>The new system, developed over five years of intensive research, demonstrates capabilities that were previously thought to be decades away. Unlike narrow AI systems that excel at specific tasks, this new architecture shows remarkable flexibility and generalization.</p>
    <h2>A Paradigm Shift</h2>
    <p>"We're witnessing something unprecedented," said Dr. Elena Rodriguez, lead researcher on the project. "The system isn't just processing information—it's understanding context, making connections, and reasoning in ways that mirror human cognition."</p>
    <p>The implications of this breakthrough extend far beyond the laboratory. From drug discovery to climate modeling, the potential applications are vast and transformative.</p>`,
    category: 'Technology',
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop',
    author: 'Sarah Mitchell',
    readingTime: 8,
    publishedAt: '2024-01-26T08:00:00Z',
    isPublished: true,
    isFeatured: true,
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-01-26T08:00:00Z',
  },
  {
    id: '2',
    title: 'Global Climate Summit Reaches Historic Agreement',
    summary: 'World leaders commit to unprecedented carbon reduction targets, marking a turning point in international climate policy.',
    content: `<p>In a marathon negotiation session that extended well past midnight, representatives from 195 nations reached a landmark agreement on climate action.</p>
    <p>The accord, hailed as the most ambitious climate agreement in history, commits signatories to net-zero emissions by 2045—five years earlier than previous targets.</p>`,
    category: 'World',
    coverImage: 'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=800&h=600&fit=crop',
    author: 'James Chen',
    readingTime: 6,
    publishedAt: '2024-01-25T14:00:00Z',
    isPublished: true,
    isFeatured: false,
    createdAt: '2024-01-25T09:00:00Z',
    updatedAt: '2024-01-25T14:00:00Z',
  },
  {
    id: '3',
    title: 'The Renaissance of Classical Music in Digital Age',
    summary: 'How streaming platforms and social media are introducing classical masterpieces to a new generation of listeners.',
    content: `<p>Classical music is experiencing an unexpected renaissance, driven by the very technology many predicted would be its demise.</p>
    <p>Streaming platforms report a 45% increase in classical music consumption among listeners under 30, with viral moments on social media introducing timeless compositions to millions.</p>`,
    category: 'Culture',
    coverImage: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&h=600&fit=crop',
    author: 'Maria Santos',
    readingTime: 5,
    publishedAt: '2024-01-24T16:00:00Z',
    isPublished: true,
    isFeatured: false,
    createdAt: '2024-01-24T12:00:00Z',
    updatedAt: '2024-01-24T16:00:00Z',
  },
  {
    id: '4',
    title: 'Markets Rally as Central Banks Signal Policy Shift',
    summary: 'Global equities surge following coordinated statements from major central banks suggesting an end to aggressive rate hikes.',
    content: `<p>Stock markets around the world posted their strongest gains in months after central bankers signaled a potential pivot in monetary policy.</p>
    <p>The Federal Reserve, European Central Bank, and Bank of England all hinted at a more dovish stance in their latest communications.</p>`,
    category: 'Business',
    coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop',
    author: 'Robert Williams',
    readingTime: 4,
    publishedAt: '2024-01-24T09:00:00Z',
    isPublished: true,
    isFeatured: false,
    createdAt: '2024-01-24T07:00:00Z',
    updatedAt: '2024-01-24T09:00:00Z',
  },
  {
    id: '5',
    title: 'Breakthrough in Quantum Computing Promises Revolution',
    summary: 'Scientists achieve quantum coherence at room temperature, removing a major barrier to practical quantum computers.',
    content: `<p>A team of physicists has achieved what many thought impossible: maintaining quantum coherence at room temperature for extended periods.</p>
    <p>This breakthrough could accelerate the development of practical quantum computers by years, if not decades.</p>`,
    category: 'Science',
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop',
    author: 'Dr. Alan Cooper',
    readingTime: 7,
    publishedAt: '2024-01-23T11:00:00Z',
    isPublished: true,
    isFeatured: false,
    createdAt: '2024-01-23T08:00:00Z',
    updatedAt: '2024-01-23T11:00:00Z',
  },
  {
    id: '6',
    title: 'The Future of Urban Mobility Takes Flight',
    summary: 'Electric air taxis begin commercial trials in major metropolitan areas, promising to transform city transportation.',
    content: `<p>The long-promised era of urban air mobility is finally arriving. Several companies have launched commercial trials of electric vertical takeoff and landing (eVTOL) aircraft.</p>
    <p>These quiet, emission-free vehicles could revolutionize how we move through congested cities.</p>`,
    category: 'Technology',
    coverImage: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=600&fit=crop',
    author: 'Lisa Park',
    readingTime: 5,
    publishedAt: '2024-01-22T15:00:00Z',
    isPublished: true,
    isFeatured: false,
    createdAt: '2024-01-22T10:00:00Z',
    updatedAt: '2024-01-22T15:00:00Z',
  },
  {
    id: '7',
    title: 'Opinion: Why Privacy Must Remain a Fundamental Right',
    summary: 'In an age of unprecedented surveillance, protecting personal privacy is more crucial than ever for democracy.',
    content: `<p>As technology advances and data collection becomes ever more pervasive, we face a critical crossroads in the history of civil liberties.</p>
    <p>The decisions we make now about privacy will shape the future of democracy for generations to come.</p>`,
    category: 'Opinion',
    coverImage: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&h=600&fit=crop',
    author: 'Emma Richardson',
    readingTime: 6,
    publishedAt: '2024-01-21T10:00:00Z',
    isPublished: true,
    isFeatured: false,
    createdAt: '2024-01-21T08:00:00Z',
    updatedAt: '2024-01-21T10:00:00Z',
  },
  {
    id: '8',
    title: 'Historic Championship Final Draws Record Viewership',
    summary: 'The thrilling conclusion to the season attracted over 200 million viewers worldwide, setting new records.',
    content: `<p>In what many are calling the greatest championship final in the sport's history, fans around the world watched as two legendary teams battled for supremacy.</p>
    <p>The match delivered drama, controversy, and moments of brilliance that will be replayed for decades.</p>`,
    category: 'Sports',
    coverImage: 'https://images.unsplash.com/photo-1461896836934- voices-for-africa?w=800&h=600&fit=crop',
    author: 'Marcus Johnson',
    readingTime: 4,
    publishedAt: '2024-01-20T22:00:00Z',
    isPublished: true,
    isFeatured: false,
    createdAt: '2024-01-20T20:00:00Z',
    updatedAt: '2024-01-20T22:00:00Z',
  },
];

export const getArticles = (): Article[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize with sample articles
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleArticles));
    return sampleArticles;
  } catch {
    return sampleArticles;
  }
};

export const getPublishedArticles = (): Article[] => {
  return getArticles().filter(article => article.isPublished);
};

export const getFeaturedArticle = (): Article | undefined => {
  return getPublishedArticles().find(article => article.isFeatured);
};

export const getArticleById = (id: string): Article | undefined => {
  return getArticles().find(article => article.id === id);
};

export const getArticlesByCategory = (category: string): Article[] => {
  return getPublishedArticles().filter(
    article => article.category.toLowerCase() === category.toLowerCase()
  );
};

export const saveArticle = (article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Article => {
  const articles = getArticles();
  const now = new Date().toISOString();
  
  const newArticle: Article = {
    ...article,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  
  articles.unshift(newArticle);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  
  return newArticle;
};

export const updateArticle = (id: string, updates: Partial<Article>): Article | undefined => {
  const articles = getArticles();
  const index = articles.findIndex(a => a.id === id);
  
  if (index === -1) return undefined;
  
  const updated = {
    ...articles[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  articles[index] = updated;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  
  return updated;
};

export const deleteArticle = (id: string): boolean => {
  const articles = getArticles();
  const filtered = articles.filter(a => a.id !== id);
  
  if (filtered.length === articles.length) return false;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
};

export const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};
