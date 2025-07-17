import React, { useState } from 'react';
import { Card, Nav, Button, Collapse } from 'react-bootstrap';
import { CodeBlock } from './CodeBlock';
import { FiCode, FiEye, FiEyeOff } from 'react-icons/fi';

interface ExampleSectionProps {
  title: string;
  description: string;
  code: string;
  children: React.ReactNode;
  language?: string;
  height?: string;
  notes?: string[];
  features?: string[];
}

export const ExampleSection: React.FC<ExampleSectionProps> = ({
  title,
  description,
  code,
  children,
  language = 'typescript',
  height = 'auto',
  notes = [],
  features = []
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [showCode, setShowCode] = useState(false);

  return (
    <Card className="mb-5 shadow-sm">
      <Card.Header className="bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-1">{title}</h4>
            <p className="text-muted mb-0 small">{description}</p>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setShowCode(!showCode)}
              className="d-md-none"
            >
              {showCode ? <FiEyeOff /> : <FiCode />}
              {showCode ? ' Hide Code' : ' Show Code'}
            </Button>
          </div>
        </div>

        {/* Features badges */}
        {features.length > 0 && (
          <div className="mt-2">
            {features.map((feature, index) => (
              <span key={index} className="badge bg-primary me-1 small">
                {feature}
              </span>
            ))}
          </div>
        )}
      </Card.Header>

      <Card.Body>
        {/* Tabs for larger screens */}
        <div className="d-none d-md-block">
          <Nav variant="tabs" className="mb-3">
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'preview'} 
                onClick={() => setActiveTab('preview')}
                style={{ cursor: 'pointer' }}
              >
                <FiEye className="me-1" /> Live Preview
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'code'} 
                onClick={() => setActiveTab('code')}
                style={{ cursor: 'pointer' }}
              >
                <FiCode className="me-1" /> Source Code
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {activeTab === 'preview' && (
            <div style={{ minHeight: height }}>
              {children}
            </div>
          )}

          {activeTab === 'code' && (
            <CodeBlock language={language}>
              {code}
            </CodeBlock>
          )}
        </div>

        {/* Mobile: show/hide code */}
        <div className="d-md-none">
          <div style={{ minHeight: height }} className="mb-3">
            {children}
          </div>
          
          <Collapse in={showCode}>
            <div>
              <CodeBlock language={language}>
                {code}
              </CodeBlock>
            </div>
          </Collapse>
        </div>

        {/* Additional notes */}
        {notes.length > 0 && (
          <div className="mt-3 p-3 bg-light rounded">
            <h6 className="text-muted mb-2">💡 Notes:</h6>
            <ul className="mb-0 small">
              {notes.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};
