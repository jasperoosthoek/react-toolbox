import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { FiCopy, FiCheck } from 'react-icons/fi';

// Global state for syntax highlighter (singleton pattern within this module)
let globalSyntaxHighlighter: any = null;
let globalSyntaxStyle: any = null;
let isLoaded = false;
let isLoading = false;
let loadingPromise: Promise<void> | null = null;

// Load syntax highlighter once globally
const loadSyntaxHighlighter = () => {
  if (isLoaded || isLoading) {
    return loadingPromise || Promise.resolve();
  }

  if (typeof window === 'undefined') {
    return Promise.resolve(); // Skip in SSR
  }

  isLoading = true;
  loadingPromise = (async () => {
    try {
      const [{ Prism }, { tomorrow }] = await Promise.all([
        import('react-syntax-highlighter'),
        import('react-syntax-highlighter/dist/esm/styles/prism')
      ]);
      globalSyntaxHighlighter = Prism;
      globalSyntaxStyle = tomorrow;
      isLoaded = true;
      console.log('✅ Syntax highlighter loaded');
    } catch (error) {
      console.error('Failed to load syntax highlighter:', error);
    } finally {
      isLoading = false;
    }
  })();

  return loadingPromise;
};

interface CodeBlockProps {
  children: string;
  language?: string;
  showCopy?: boolean;
  maxHeight?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ 
  children, 
  language = 'typescript',
  showCopy = true,
  maxHeight = '400px'
}) => {
  const [copied, setCopied] = useState(false);
  const [highlighterReady, setHighlighterReady] = useState(isLoaded);

  useEffect(() => {
    // Start loading syntax highlighter when first CodeBlock mounts
    loadSyntaxHighlighter().then(() => {
      setHighlighterReady(true);
    });
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  const fallbackStyle = {
    borderRadius: '6px',
    fontSize: '14px',
    maxHeight: maxHeight,
    overflow: 'auto',
    margin: 0,
    border: '1px solid #e9ecef',
    paddingRight: '60px',
    backgroundColor: '#2d2d2d',
    color: '#f8f8f2',
    padding: '1rem',
    fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
    whiteSpace: 'pre-wrap' as const,
    wordWrap: 'break-word' as const,
    lineHeight: '1.5',
  };

  const SyntaxHighlighter = globalSyntaxHighlighter;
  const syntaxStyle = globalSyntaxStyle;

  return (
    <div className="position-relative">
      {showCopy && (
        <Button
          variant={copied ? 'success' : 'outline-secondary'}
          size="sm"
          className="position-absolute top-0 m-2"
          style={{ zIndex: 10, right: '24px' }}
          onClick={copyToClipboard}
        >
          {copied ? (
            <>
              <FiCheck className="me-1" />
              Copied!
            </>
          ) : (
            <>
              <FiCopy className="me-1" />
              Copy
            </>
          )}
        </Button>
      )}
      
      {highlighterReady && SyntaxHighlighter && syntaxStyle ? (
        <SyntaxHighlighter 
          language={language} 
          style={syntaxStyle}
          customStyle={{
            borderRadius: '6px',
            fontSize: '14px',
            maxHeight: maxHeight,
            overflow: 'auto',
            margin: 0,
            border: '1px solid #e9ecef',
            paddingRight: '60px',
          }}
          showLineNumbers
          wrapLines
          wrapLongLines
        >
          {children}
        </SyntaxHighlighter>
      ) : (
        <pre style={fallbackStyle}>
          <code>{children}</code>
        </pre>
      )}
    </div>
  );
};
