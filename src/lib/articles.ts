import { Article } from '@/types/article';

const STORAGE_KEY = 'newspaper_articles';

// Sample articles for demo
const sampleArticles: Article[] = [
  {
    id: '1',
    title: "L'aube de l'intelligence artificielle générale : une nouvelle ère commence",
    summary: "Des chercheurs de premier plan annoncent une percée dans l'apprentissage automatique qui pourrait remodeler l'avenir de l'humanité. Les implications s'étendent de la santé aux sciences climatiques.",
    content: `<p>Dans un développement qui a provoqué une onde de choc au sein de la communauté scientifique, des chercheurs d'institutions de premier plan ont annoncé ce qu'ils considèrent comme une percée fondamentale dans l'intelligence artificielle.</p>
    <p>Le nouveau système, développé au cours de cinq années de recherche intensive, démontre des capacités que l'on pensait auparavant être à des décennies. Contrairement aux systèmes d'IA spécialisés qui excellent dans des tâches spécifiques, cette nouvelle architecture fait preuve d'une flexibilité et d'une généralisation remarquables.</p>
    <h2>Un changement de paradigme</h2>
    <p>"Nous sommes témoins de quelque chose de sans précédent", a déclaré le Dr Elena Rodriguez, chercheuse principale du projet. "Le système ne se contente pas de traiter l'information, il comprend le contexte, établit des connexions et raisonne d'une manière qui reflète la cognition humaine."</p>
    <p>Les implications de cette percée s'étendent bien au-delà du laboratoire. De la découverte de médicaments à la modélisation climatique, les applications potentielles sont vastes et transformatrices.</p>`,
    category: 'Technologie',
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop',
    author: 'Sarah Mitchell',
    readingTime: 8,
    views: Math.floor(Math.random() * 10000),
    publishedAt: '2024-01-26T08:00:00Z',
    isPublished: true,
    isFeatured: true,
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-01-26T08:00:00Z',
  },
  {
    id: '2',
    title: 'Le sommet mondial sur le climat parvient à un accord historique',
    summary: 'Les dirigeants mondiaux s\'engagent sur des objectifs de réduction de carbone sans précédent, marquant un tournant dans la politique climatique internationale.',
    content: `<p>Dans une séance de négociation marathon qui s'est prolongée bien après minuit, les représentants de 195 nations sont parvenus à un accord historique sur l'action climatique.</p>
    <p>L'accord, salué comme l'engagement climatique le plus ambitieux de l'histoire, engage les signataires à atteindre des émissions nettes nulles d'ici 2045, soit cinq ans plus tôt que les objectifs précédents.</p>`,
    category: 'Monde',
    coverImage: 'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=800&h=600&fit=crop',
    author: 'Elena Rodriguez',
    readingTime: 6,
    views: Math.floor(Math.random() * 8000),
    publishedAt: '2024-01-25T14:30:00Z',
    isPublished: true,
    isFeatured: false,
    createdAt: '2024-01-25T09:00:00Z',
    updatedAt: '2024-01-25T14:00:00Z',
  },
  {
    id: '3',
    title: 'La renaissance de la musique classique à l\'ère numérique',
    summary: 'Comment les plateformes de streaming et les réseaux sociaux font découvrir les chefs-d\'œuvre classiques à une nouvelle génération d\'auditeurs.',
    content: `<p>La musique classique connaît une renaissance inattendue, portée par la technologie même que beaucoup prédisaient comme sa perte.</p>
    <p>Les plateformes de streaming signalent une augmentation de 45 % de la consommation de musique classique chez les auditeurs de moins de 30 ans, les moments viraux sur les réseaux sociaux faisant découvrir des compositions intemporelles à des millions de personnes.</p>`,
    category: 'Culture',
    coverImage: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&h=600&fit=crop',
    author: 'Sophie Martin',
    readingTime: 10,
    views: Math.floor(Math.random() * 9000),
    publishedAt: '2024-01-20T10:00:00Z',
    isPublished: true,
    isFeatured: false,
    createdAt: '2024-01-24T12:00:00Z',
    updatedAt: '2024-01-24T16:00:00Z',
  },
  {
    id: '4',
    title: 'Les marchés rebondissent suite au signalement d\'un changement de politique des banques centrales',
    summary: 'Les actions mondiales progressent suite aux déclarations coordonnées des principales banques centrales suggérant la fin des hausses de taux agressives.',
    content: `<p>Les marchés boursiers du monde entier ont enregistré leurs gains les plus importants depuis des mois après que les banquiers centraux ont signalé un pivot potentiel dans la politique monétaire.</p>
    <p>La Réserve fédérale, la Banque centrale européenne et la Banque d'Angleterre ont toutes laissé entendre une position plus souple dans leurs dernières communications.</p>`,
    category: 'Économie',
    coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop',
    author: 'Robert Williams',
    readingTime: 4,
    views: Math.floor(Math.random() * 7500),
    publishedAt: '2024-01-24T09:00:00Z',
    isPublished: true,
    isFeatured: false,
    createdAt: '2024-01-24T07:00:00Z',
    updatedAt: '2024-01-24T09:00:00Z',
  },
  {
    id: '5',
    title: 'Une percée dans l\'informatique quantique promet une révolution',
    summary: 'Des scientifiques parviennent à une cohérence quantique à température ambiante, levant un obstacle majeur pour les ordinateurs quantiques pratiques.',
    content: `<p>Une équipe de physiciens a réussi ce que beaucoup pensaient impossible : maintenir une cohérence quantique à température ambiante pendant des périodes prolongées.</p>
    <p>Cette percée pourrait accélérer le développement d'ordinateurs quantiques pratiques de plusieurs années, voire de plusieurs décennies.</p>`,
    category: 'Sciences',
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop',
    author: 'Dr. Alan Cooper',
    readingTime: 7,
    views: Math.floor(Math.random() * 9500),
    publishedAt: '2024-01-23T11:00:00Z',
    isPublished: true,
    isFeatured: false,
    createdAt: '2024-01-23T08:00:00Z',
    updatedAt: '2024-01-23T11:00:00Z',
  },
  {
    id: '6',
    title: 'L\'avenir de la mobilité urbaine prend son envol',
    summary: 'Les taxis aériens électriques commencent des essais commerciaux dans les grandes zones métropolitaines, promettant de transformer le transport urbain.',
    content: `<p>L'ère tant promise de la mobilité aérienne urbaine arrive enfin. Plusieurs entreprises ont lancé des essais commerciaux d'aéronefs électriques à décollage et atterrissage verticaux (eVTOL).</p>
    <p>Ces véhicules silencieux et sans émissions pourraient révolutionner notre façon de nous déplacer dans les villes encombrées.</p>`,
    category: 'Technologie',
    coverImage: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=600&fit=crop',
    author: 'Aisha Roberts',
    readingTime: 7,
    views: Math.floor(Math.random() * 6000),
    publishedAt: '2024-01-22T16:45:00Z',
    isPublished: true,
    isFeatured: false,
    createdAt: '2024-01-22T10:00:00Z',
    updatedAt: '2024-01-22T15:00:00Z',
  },
  {
    id: '7',
    title: 'Opinion : Pourquoi la vie privée doit rester un droit fondamental',
    summary: 'À l\'ère d\'une surveillance sans précédent, la protection de la vie privée est plus cruciale que jamais pour la démocratie.',
    content: `<p>Alors que la technologie progresse et que la collecte de données devient de plus en plus omniprésente, nous nous trouvons à un carrefour critique dans l'histoire des libertés civiles.</p>
    <p>Les décisions que nous prenons maintenant concernant la vie privée façonneront l'avenir de la démocratie pour les générations à venir.</p>`,
    category: 'Opinion',
    coverImage: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&h=600&fit=crop',
    author: 'Emma Richardson',
    readingTime: 6,
    views: Math.floor(Math.random() * 5000),
    publishedAt: '2024-01-21T10:00:00Z',
    isPublished: true,
    isFeatured: false,
    createdAt: '2024-01-21T08:00:00Z',
    updatedAt: '2024-01-21T10:00:00Z',
  },
  {
    id: '8',
    title: 'Une finale de championnat historique attire une audience record',
    summary: 'La conclusion passionnante de la saison a attiré plus de 200 millions de téléspectateurs dans le monde, établissant de nouveaux records.',
    content: `<p>Dans ce que beaucoup appellent la plus grande finale de championnat de l'histoire du sport, les fans du monde entier ont regardé deux équipes légendaires se battre pour la suprématie.</p>
    <p>Le match a offert du drame, de la controverse et des moments de génie qui seront rejoués pendant des décennies.</p>`,
    category: 'Sports',
    coverImage: 'https://images.unsplash.com/photo-1461896836934- voices-for-africa?w=800&h=600&fit=crop',
    author: 'Marcus Thorne',
    readingTime: 15,
    views: Math.floor(Math.random() * 12000),
    publishedAt: '2024-01-23T11:00:00Z',
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
      const articles: Article[] = JSON.parse(stored);
      // Ensure all articles have a views field (for legacy data)
      return articles.map(article => ({
        ...article,
        views: article.views ?? 0
      }));
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
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    month: 'short',
    day: 'numeric',
  });
};

export const incrementViews = (articleId: string) => {
  const articles = getArticles();
  const index = articles.findIndex((a) => a.id === articleId);
  if (index !== -1) {
    articles[index].views = (articles[index].views || 0) + 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  }
};
