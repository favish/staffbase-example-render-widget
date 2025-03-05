import React, { ReactElement, useEffect, useState, useRef, RefObject } from "react";
import { BlockAttributes } from "@staffbase/widget-sdk";
import { renderWidgets } from "./widgetService";
import { fetchArticles } from "@/services/apiService";
import type ArticleData from "@/types/ArticleData";
import "./staffbase-example-render-widget.css";

// Define the API URL with error handling
const getApiUrl = (): string => {
  const apiUrl = process.env.REACT_APP_API_URL;
  if (!apiUrl) {
    throw new Error('REACT_APP_API_URL is not defined in .env file');
  }
  return apiUrl;
};

/**
 * Widget Props Interface
 */
export interface StaffbaseExampleRenderWidgetProps extends BlockAttributes {
  channel: string;
  contentLanguage: string;
}

/**
 * Article Content Component
 */
const ArticleContent: React.FC<{ article: ArticleData; contentLanguage: string }> = ({ article, contentLanguage }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isRendering, setIsRendering] = useState(false);
  const content = article.contents[contentLanguage] || article.contents[Object.keys(article.contents)[0]];

  const handleRenderWidgets = async () => {
    if (!contentRef.current) return;

    setIsRendering(true);
    try {
      await renderWidgets(contentRef as RefObject<HTMLDivElement>);
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

export const StaffbaseExampleRenderWidget = ({ channel, contentLanguage }: StaffbaseExampleRenderWidgetProps): ReactElement => {
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAcknowledged, setShowAcknowledged] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<ArticleData | null>(null);

  // Use the channel prop directly, fallback to default if not provided
  const CHANNEL_ID = channel || "679a3e8122f1d760e63ef502";

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check API URL configuration first
        try {
          getApiUrl();
        } catch {
          throw new Error('Configuration Error: REACT_APP_API_URL is not defined in .env file. Please set up your environment variables correctly.');
        }

        const fetchedArticles = await fetchArticles(CHANNEL_ID);

        // Sort articles by published date (newest first)
        const sortedArticles = fetchedArticles.sort((a: ArticleData, b: ArticleData) => {
          const dateA = a.published ? new Date(a.published).getTime() : 0;
          const dateB = b.published ? new Date(b.published).getTime() : 0;
          return dateB - dateA;
        });

        // Filter based on showAcknowledged state
        const filteredArticles = sortedArticles.filter((article: ArticleData) =>
          showAcknowledged ? article.acknowledgements?.isAcknowledged : !article.acknowledgements?.isAcknowledged
        );

        setArticles(filteredArticles);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching articles';
        console.error('Error loading articles:', err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, [showAcknowledged, CHANNEL_ID]);

  // Handle toggle change
  const handleToggleChange = () => {
    setShowAcknowledged(!showAcknowledged);
    setSelectedArticle(null); // Clear selected article when toggling
  };

  // Handle article selection
  const handleArticleClick = (article: ArticleData) => {
    setSelectedArticle(selectedArticle?.id === article.id ? null : article);
  };

  if (loading) {
    return <div>Loading articles...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="articles-widget">
      <div className="articles-widget-header">
        <h2>Articles ({articles.length})</h2>
        <div className="toggle-container">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={showAcknowledged}
              onChange={handleToggleChange}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">
            {showAcknowledged ? 'Show Acknowledged' : 'Show Unacknowledged'}
          </span>
        </div>
      </div>
      <div className="articles-container">
        <div className="articles-list">
          {articles.map(article => {
            const content = article.contents[contentLanguage] ||
                          article.contents[Object.keys(article.contents)[0]];
            const isSelected = selectedArticle?.id === article.id;

            return (
              <div
                key={article.id}
                className={`article-item ${isSelected ? 'selected' : ''}`}
                onClick={() => handleArticleClick(article)}
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
              No {showAcknowledged ? 'acknowledged' : 'unacknowledged'} articles found
            </div>
          )}
        </div>
        <div className="article-content-container">
          {selectedArticle && (
            <ArticleContent
              article={selectedArticle}
              contentLanguage={contentLanguage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

