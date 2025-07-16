import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  children: string;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ children, language = 'typescript' }) => {
  return (
    <SyntaxHighlighter 
      language={language} 
      style={tomorrow}
      customStyle={{
        borderRadius: '6px',
        fontSize: '14px',
      }}
    >
      {children}
    </SyntaxHighlighter>
  );
};
