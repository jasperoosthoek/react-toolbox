import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from 'react-bootstrap';
import { FiCopy, FiCheck } from 'react-icons/fi';

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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  return (
    <div className="position-relative">
      {showCopy && (
        <Button
          variant={copied ? 'success' : 'outline-secondary'}
          size="sm"
          className="position-absolute top-0 end-0 m-2"
          style={{ zIndex: 10 }}
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
      
      <SyntaxHighlighter 
        language={language} 
        style={tomorrow}
        customStyle={{
          borderRadius: '6px',
          fontSize: '14px',
          maxHeight: maxHeight,
          overflow: 'auto',
          margin: 0,
          border: '1px solid #e9ecef',
        }}
        showLineNumbers
        wrapLines
        wrapLongLines
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
};
