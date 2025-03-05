import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ArticleData } from '../types/ArticleData';
import { renderWidgets } from '../widgetService';

/**
 * Props for the ArticleModal component
 * @interface ArticleModalProps
 */
interface ArticleModalProps {
  article: ArticleData;
  contentLanguage: string;
  onClose: () => void;
  isOpen: boolean;
}

/**
 * Modal component that renders article content in a portal
 * @param {ArticleModalProps} props - The component props
 * @returns {React.ReactPortal | null} The modal portal or null if closed
 */
const ArticleModal: React.FC<ArticleModalProps> = ({ article, contentLanguage, onClose, isOpen }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isRendering, setIsRendering] = useState(false);
  const content = article.contents[contentLanguage] || article.contents[Object.keys(article.contents)[0]];

  useEffect(() => {
    // Handle escape key press
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleRenderWidgets = async () => {
    if (!modalRef.current) return;

    setIsRendering(true);
    try {
      await renderWidgets(modalRef);
    } catch (error) {
      console.error('Error rendering widgets:', error);
    } finally {
      setIsRendering(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-actions">
          <button
            className="render-widgets-button"
            onClick={handleRenderWidgets}
            disabled={isRendering}
          >
            {isRendering ? 'Rendering...' : 'Force Render Widgets'}
          </button>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-header">
          <h2>{content.title}</h2>
          <p className="modal-teaser">{content.teaser}</p>
        </div>
        <div
          className="modal-body"
          dangerouslySetInnerHTML={{ __html: content.content }}
        />
      </div>
    </div>,
    document.body
  );
};

export default ArticleModal; 