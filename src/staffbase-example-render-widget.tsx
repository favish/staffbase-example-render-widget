import React, { ReactElement, useEffect, useState, useRef } from "react";
import { BlockAttributes } from "@staffbase/widget-sdk";
import { fetchArticles } from "@/services/apiService";
import type { ArticleData } from "@/types/ArticleData";
import ArticleModal from "./components/ArticleModal";
import "./staffbase-example-render-widget.css";
import "./components/ArticleModal.css";
import { renderWidgets } from "./widgetService";

/**
 * Props interface for the widget
 * @interface StaffbaseExampleRenderWidgetProps
 */
export interface StaffbaseExampleRenderWidgetProps extends BlockAttributes {
  channel: string;
  contentLanguage: string;
}

/**
 * Props for the ArticleList component
 * @interface ArticleListProps
 */
interface ArticleListProps {
  articles: ArticleData[];
  contentLanguage: string;
  selectedArticleId: string | null;
  onArticleClick: (article: ArticleData) => void;
}

/**
 * Props for the ArticleContent component
 * @interface ArticleContentProps
 */
interface ArticleContentProps {
  article: ArticleData;
  contentLanguage: string;
  onOpenModal: () => void;
}

/**
 * Component to display the article content
 * @param {ArticleContentProps} props - The component props
 * @returns {ReactElement} The article content component
 */
const ArticleContent: React.FC<ArticleContentProps> = ({
  article,
  contentLanguage,
  onOpenModal
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isRendering, setIsRendering] = useState(false);
  const content = article.contents[contentLanguage] || article.contents[Object.keys(article.contents)[0]];

  const handleRenderWidgets = async () => {
    if (!contentRef.current) return;

    setIsRendering(true);
    try {
      await renderWidgets(contentRef);
    } catch (error) {
      console.error('Error rendering widgets:', error);
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <div className="article-content" ref={contentRef}>
      <div className="article-actions">
        <button
          className="render-widgets-button"
          onClick={handleRenderWidgets}
          disabled={isRendering}
        >
          {isRendering ? 'Rendering...' : 'Force Render Widgets'}
        </button>
        <button
          className="open-modal-button"
          onClick={onOpenModal}
        >
          Open in Modal
        </button>
      </div>
      <div className="article-header">
        <h3>{content.title}</h3>
        <p className="article-teaser">{content.teaser}</p>
      </div>
      <div
        className="article-body"
        dangerouslySetInnerHTML={{ __html: content.content }}
      />
    </div>
  );
};

/**
 * Component to display the list of articles
 * @param {ArticleListProps} props - The component props
 * @returns {ReactElement} The article list component
 */
const ArticleList: React.FC<ArticleListProps> = ({
  articles,
  contentLanguage,
  selectedArticleId,
  onArticleClick,
}) => (
  <div className="articles-list">
    {articles.map(article => {
      const content = article.contents[contentLanguage] ||
                    article.contents[Object.keys(article.contents)[0]];
      const isSelected = selectedArticleId === article.id;

      return (
        <div
          key={article.id}
          className={`article-item ${isSelected ? 'selected' : ''}`}
          onClick={() => onArticleClick(article)}
        >
          <h3>{content.title}</h3>
          <p>{content.teaser}</p>
          <div className="article-meta">
            <div className="meta-left">
              {article.published && (
                <span>Published: {new Date(article.published).toLocaleDateString()}</span>
              )}
            </div>
            <div className="meta-right">
              <span className="acknowledgement-status">
                {article.acknowledgements?.isAcknowledged ? '✓ Acknowledged' : '○ Not Acknowledged'}
              </span>
            </div>
          </div>
        </div>
      );
    })}
    {articles.length === 0 && (
      <div className="no-articles">
        No articles found
      </div>
    )}
  </div>
);

/**
 * Main widget component
 * @param {StaffbaseExampleRenderWidgetProps} props - The component props
 * @returns {ReactElement} The main widget component
 */
export const StaffbaseExampleRenderWidget = ({
  channel,
  contentLanguage,
}: StaffbaseExampleRenderWidgetProps): ReactElement => {
  // State declarations
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAcknowledged, setShowAcknowledged] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<ArticleData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Channel ID with fallback
  const CHANNEL_ID = channel || "679a3e8122f1d760e63ef502";

  /**
   * Loads and processes articles from the API
   */
  const loadArticles = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const fetchedArticles = await fetchArticles(CHANNEL_ID);
      const sortedArticles = sortArticlesByDate(fetchedArticles);
      const filteredArticles = filterArticlesByAcknowledgement(sortedArticles, showAcknowledged);

      setArticles(filteredArticles);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching articles';
      console.error('Error loading articles:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sorts articles by published date
   * @param {ArticleData[]} articles - Articles to sort
   * @returns {ArticleData[]} Sorted articles
   */
  const sortArticlesByDate = (articles: ArticleData[]): ArticleData[] => {
    return articles.sort((a, b) => {
      const dateA = a.published ? new Date(a.published).getTime() : 0;
      const dateB = b.published ? new Date(b.published).getTime() : 0;
      return dateB - dateA;
    });
  };

  /**
   * Filters articles based on acknowledgement status
   * @param {ArticleData[]} articles - Articles to filter
   * @param {boolean} showAcknowledged - Whether to show acknowledged articles
   * @returns {ArticleData[]} Filtered articles
   */
  const filterArticlesByAcknowledgement = (
    articles: ArticleData[],
    showAcknowledged: boolean
  ): ArticleData[] => {
    return articles.filter((article) =>
      showAcknowledged ? article.acknowledgements?.isAcknowledged : !article.acknowledgements?.isAcknowledged
    );
  };

  // Load articles on mount and when filters change
  useEffect(() => {
    loadArticles();
  }, [showAcknowledged, CHANNEL_ID]);

  /**
   * Handles article selection
   * @param {ArticleData} article - The selected article
   */
  const handleArticleClick = (article: ArticleData): void => {
    setSelectedArticle(selectedArticle?.id === article.id ? null : article);
  };

  if (loading) return <div>Loading articles...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="articles-widget">
      <div className="articles-widget-header">
        <h2>Articles ({articles.length})</h2>
        <div className="toggle-container">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={showAcknowledged}
              onChange={() => setShowAcknowledged(!showAcknowledged)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">
            {showAcknowledged ? 'Show Acknowledged' : 'Show Unacknowledged'}
          </span>
        </div>
      </div>

      <div className="articles-container">
        <ArticleList
          articles={articles}
          contentLanguage={contentLanguage}
          selectedArticleId={selectedArticle?.id || null}
          onArticleClick={handleArticleClick}
        />

        <div className="article-content-container">
          {selectedArticle && (
            <ArticleContent
              article={selectedArticle}
              contentLanguage={contentLanguage}
              onOpenModal={() => setIsModalOpen(true)}
            />
          )}
        </div>
      </div>

      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          contentLanguage={contentLanguage}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

