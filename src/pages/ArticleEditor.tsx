import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Image as ImageIcon,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Save,
  Eye,
  ArrowLeft,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import {
  saveArticle,
  updateArticle,
  getArticleById,
  calculateReadingTime,
} from '@/lib/articles';
import { CATEGORIES, Article } from '@/types/article';
import { useToast } from '@/hooks/use-toast';

const ArticleEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [coverImage, setCoverImage] = useState('');
  const [author, setAuthor] = useState('Editorial Staff');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id) {
      const article = getArticleById(id);
      if (article) {
        setTitle(article.title);
        setSummary(article.summary);
        setContent(article.content);
        setCategory(article.category);
        setCoverImage(article.coverImage);
        setAuthor(article.author);
        setIsFeatured(article.isFeatured);
      }
    }
  }, [id]);

  const handleSave = useCallback(
    async (publish: boolean) => {
      if (!title.trim()) {
        toast({
          title: 'Error',
          description: 'Please enter a title',
          variant: 'destructive',
        });
        return;
      }

      if (!content.trim()) {
        toast({
          title: 'Error',
          description: 'Please enter some content',
          variant: 'destructive',
        });
        return;
      }

      setIsSaving(true);

      try {
        const articleData = {
          title,
          summary,
          content,
          category,
          coverImage:
            coverImage ||
            'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&h=600&fit=crop',
          author,
          readingTime: calculateReadingTime(content),
          publishedAt: publish ? new Date().toISOString() : '',
          isPublished: publish,
          isFeatured,
        };

        if (isEditing && id) {
          updateArticle(id, articleData);
          toast({
            title: 'Success',
            description: `Article ${publish ? 'published' : 'saved as draft'}`,
          });
        } else {
          saveArticle(articleData);
          toast({
            title: 'Success',
            description: `Article ${publish ? 'published' : 'saved as draft'}`,
          });
        }

        navigate('/secret-editor-access');
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to save article',
          variant: 'destructive',
        });
      } finally {
        setIsSaving(false);
      }
    },
    [title, summary, content, category, coverImage, author, isFeatured, isEditing, id, navigate, toast]
  );

  const insertFormatting = (tag: string, wrapper?: string) => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let newText = '';
    if (wrapper) {
      newText = `<${tag}>${selectedText}</${tag}>`;
    } else if (tag === 'ul' || tag === 'ol') {
      newText = `<${tag}>\n  <li>${selectedText || 'List item'}</li>\n</${tag}>`;
    } else if (tag === 'blockquote') {
      newText = `<blockquote>${selectedText || 'Quote'}</blockquote>`;
    } else if (tag === 'h1' || tag === 'h2') {
      newText = `<${tag}>${selectedText || 'Heading'}</${tag}>`;
    } else if (tag === 'img') {
      const url = prompt('Enter image URL:');
      if (url) {
        newText = `<img src="${url}" alt="${selectedText || 'Image'}" />`;
      } else {
        return;
      }
    } else if (tag === 'a') {
      const url = prompt('Enter link URL:');
      if (url) {
        newText = `<a href="${url}">${selectedText || 'Link text'}</a>`;
      } else {
        return;
      }
    } else {
      newText = `<${tag}>${selectedText}</${tag}>`;
    }

    const newContent = content.substring(0, start) + newText + content.substring(end);
    setContent(newContent);
  };

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/secret-editor-access')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => handleSave(false)}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors disabled:opacity-50"
            >
              <Save size={18} />
              Save Draft
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50"
            >
              <Eye size={18} />
              Publish
            </button>
          </div>
        </div>

        {/* Editor Form */}
        <div className="space-y-6">
          {/* Title */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article title..."
              className="w-full text-4xl font-serif font-bold bg-transparent border-0 outline-none placeholder:text-muted-foreground/50"
            />
          </div>

          {/* Summary */}
          <div>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Write a brief summary..."
              rows={2}
              className="w-full text-lg bg-transparent border-0 outline-none resize-none placeholder:text-muted-foreground/50 text-muted-foreground"
            />
          </div>

          {/* Meta Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Author
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Cover Image URL
              </label>
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="featured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 rounded border-input"
            />
            <label htmlFor="featured" className="text-sm text-muted-foreground">
              Feature this article on the homepage
            </label>
          </div>

          {/* Cover Preview */}
          {coverImage && (
            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
              <img
                src={coverImage}
                alt="Cover preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&h=600&fit=crop';
                }}
              />
            </div>
          )}

          {/* Content Editor */}
          <div>
            {/* Toolbar */}
            <div className="editor-toolbar">
              <button
                type="button"
                onClick={() => insertFormatting('strong')}
                className="editor-btn"
                title="Bold"
              >
                <Bold size={18} />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('em')}
                className="editor-btn"
                title="Italic"
              >
                <Italic size={18} />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('u')}
                className="editor-btn"
                title="Underline"
              >
                <Underline size={18} />
              </button>
              <div className="w-px h-6 bg-border mx-1" />
              <button
                type="button"
                onClick={() => insertFormatting('h1')}
                className="editor-btn"
                title="Heading 1"
              >
                <Heading1 size={18} />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('h2')}
                className="editor-btn"
                title="Heading 2"
              >
                <Heading2 size={18} />
              </button>
              <div className="w-px h-6 bg-border mx-1" />
              <button
                type="button"
                onClick={() => insertFormatting('ul')}
                className="editor-btn"
                title="Bullet List"
              >
                <List size={18} />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('ol')}
                className="editor-btn"
                title="Numbered List"
              >
                <ListOrdered size={18} />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('blockquote')}
                className="editor-btn"
                title="Quote"
              >
                <Quote size={18} />
              </button>
              <div className="w-px h-6 bg-border mx-1" />
              <button
                type="button"
                onClick={() => insertFormatting('a')}
                className="editor-btn"
                title="Link"
              >
                <LinkIcon size={18} />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('img')}
                className="editor-btn"
                title="Image"
              >
                <ImageIcon size={18} />
              </button>
            </div>

            {/* Content Area */}
            <textarea
              id="content-editor"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article content here... You can use HTML tags for formatting."
              className="editor-content w-full min-h-[400px] font-mono text-sm resize-y rounded-t-none"
            />
          </div>

          {/* Preview */}
          {content && (
            <div className="mt-8 p-8 bg-card rounded-lg border border-border">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">
                Content Preview
              </h3>
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          )}
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default ArticleEditor;
