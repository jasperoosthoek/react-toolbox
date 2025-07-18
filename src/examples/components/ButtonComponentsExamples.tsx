// Examples for ConfirmButton, DeleteConfirmButton, and other button components

import React, { useState } from 'react';
import { Card, Alert, Badge, ButtonGroup } from 'react-bootstrap';
import { 
  ConfirmButton, 
  DeleteConfirmButton,
  EditButton,
  SaveButton,
  DeleteButton,
  DownloadButton,
  CreateButton,
  MoveButton,
  SyncButton
} from '../../index';
import { ExampleSection } from './ExampleSection';
import { FixedLoadingIndicator } from './FixedLoadingIndicator';

// Example 1: ConfirmButton with different configurations
const ConfirmButtonExampleComponent = () => {
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleSave = (callback?: () => void) => {
    setSaveLoading(true);
    addResult('Save operation started...');
    
    setTimeout(() => {
      setSaveLoading(false);
      addResult('Save operation completed successfully!');
      if (callback) callback();
    }, 2000);
  };

  const handleDelete = (callback?: () => void) => {
    setDeleteLoading(true);
    addResult('Delete operation started...');
    
    setTimeout(() => {
      setDeleteLoading(false);
      addResult('Delete operation completed!');
      if (callback) callback();
    }, 1500);
  };

  const handleDownload = (callback?: () => void) => {
    setDownloadLoading(true);
    addResult('Download started...');
    
    setTimeout(() => {
      setDownloadLoading(false);
      addResult('Download completed!');
      if (callback) callback();
    }, 3000);
  };

  return (
    <div>
      <Card className="mb-4">
        <Card.Header>
          <h6 className="mb-0">Basic ConfirmButton Usage</h6>
        </Card.Header>
        <Card.Body>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <ConfirmButton
              modalTitle="Confirm Save"
              modalBody="Are you sure you want to save this document? This will overwrite any existing content."
              confirmText="Yes, Save Document"
              cancelText="Cancel"
              onConfirm={handleSave}
              loading={saveLoading}
              buttonComponent={SaveButton}
            />

            <ConfirmButton
              modalTitle="Confirm Delete"
              modalBody="This action cannot be undone. Are you sure you want to delete this item?"
              confirmText="Yes, Delete"
              cancelText="Keep It"
              onConfirm={handleDelete}
              loading={deleteLoading}
              buttonComponent={DeleteButton}
            />

            <ConfirmButton
              modalTitle="Start Download"
              modalBody="This will download a large file. Do you want to continue?"
              confirmText="Start Download"
              cancelText="Cancel"
              onConfirm={handleDownload}
              loading={downloadLoading}
              buttonComponent={DownloadButton}
            />
          </div>

          {results.length > 0 && (
            <Alert variant="info">
              <Alert.Heading>Action Results</Alert.Heading>
              <ul className="mb-0">
                {results.map((result, index) => (
                  <li key={index}>{result}</li>
                ))}
              </ul>
            </Alert>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export const ConfirmButtonExample = () => {
  const code = `import React, { useState } from 'react';
import { ConfirmButton, SaveButton, DeleteButton, DownloadButton } from '@jasperoosthoek/react-toolbox';

const MyComponent = () => {
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleSave = (callback) => {
    setSaveLoading(true);
    
    // Perform save operation
    setTimeout(() => {
      setSaveLoading(false);
      console.log('Save completed!');
      if (callback) callback(); // Close modal
    }, 2000);
  };

  const handleDelete = (callback) => {
    setDeleteLoading(true);
    
    // Perform delete operation
    setTimeout(() => {
      setDeleteLoading(false);
      console.log('Delete completed!');
      if (callback) callback(); // Close modal
    }, 1500);
  };

  return (
    <div>
      <ConfirmButton
        modalTitle="Confirm Save"
        modalBody="Are you sure you want to save this document? This will overwrite any existing content."
        confirmText="Yes, Save Document"
        cancelText="Cancel"
        onConfirm={handleSave}
        loading={saveLoading}
        buttonComponent={SaveButton}
      />

      <ConfirmButton
        modalTitle="Confirm Delete"
        modalBody="This action cannot be undone. Are you sure you want to delete this item?"
        confirmText="Yes, Delete"
        cancelText="Keep It"
        onConfirm={handleDelete}
        loading={deleteLoading}
        buttonComponent={DeleteButton}
      />
    </div>
  );
};`;

  return (
    <ExampleSection
      title="ConfirmButton Examples"
      description="ConfirmButton provides a confirmation modal before executing actions. Perfect for operations that need user confirmation."
      code={code}
      features={['Modal Confirmation', 'Custom Messages', 'Loading States', 'Any Button Component']}
      notes={[
        'Use onConfirm callback to handle the confirmed action',
        'The callback parameter closes the modal when called',
        'Loading states are automatically handled',
        'Works with any button component via buttonComponent prop'
      ]}
    >
      <ConfirmButtonExampleComponent />
    </ExampleSection>
  );
};

// Example 2: DeleteConfirmButton
const DeleteConfirmButtonExampleComponent = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Document 1', type: 'file' },
    { id: 2, name: 'Project Folder', type: 'folder' },
    { id: 3, name: 'Image.jpg', type: 'file' },
    { id: 4, name: 'Backup Data', type: 'folder' },
  ]);
  const [loadingStates, setLoadingStates] = useState<{[key: number]: boolean}>({});
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = (itemId: number) => {
    setLoadingStates(prev => ({ ...prev, [itemId]: true }));
    setIsDeleting(true);
    
    setTimeout(() => {
      setItems(items.filter(item => item.id !== itemId));
      setLoadingStates(prev => ({ ...prev, [itemId]: false }));
      setIsDeleting(false);
    }, 1500);
  };

  return (
    <div>
      <FixedLoadingIndicator 
        show={isDeleting}
        message="Deleting item..."
        variant="warning"
      />
      
      <Card className="mb-4">
        <Card.Header>
          <h6 className="mb-0">Delete Items</h6>
        </Card.Header>
        <Card.Body>
          <div className="list-group">
            {items.map(item => (
              <div key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{item.name}</strong>
                  <Badge bg={item.type === 'folder' ? 'primary' : 'secondary'} className="ms-2">
                    {item.type}
                  </Badge>
                </div>
                <DeleteConfirmButton
                  onDelete={() => handleDelete(item.id)}
                  loading={loadingStates[item.id]}
                  size="sm"
                />
              </div>
            ))}
            {items.length === 0 && (
              <div className="text-center text-muted py-3">
                All items have been deleted. Refresh to reset.
              </div>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export const DeleteConfirmButtonExample = () => {
  const code = `import React, { useState } from 'react';
import { DeleteConfirmButton } from '@jasperoosthoek/react-toolbox';
import { Badge } from 'react-bootstrap';
import { FixedLoadingIndicator } from './FixedLoadingIndicator';

const ItemList = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Document 1', type: 'file' },
    { id: 2, name: 'Project Folder', type: 'folder' },
    { id: 3, name: 'Image.jpg', type: 'file' },
  ]);
  const [loadingStates, setLoadingStates] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = (itemId) => {
    setLoadingStates(prev => ({ ...prev, [itemId]: true }));
    setIsDeleting(true);
    
    // Perform delete operation
    setTimeout(() => {
      setItems(items.filter(item => item.id !== itemId));
      setLoadingStates(prev => ({ ...prev, [itemId]: false }));
      setIsDeleting(false);
    }, 1500);
  };

  return (
    <div>
      <FixedLoadingIndicator 
        show={isDeleting}
        message="Deleting item..."
        variant="warning"
      />
      
      <div className="list-group">
        {items.map(item => (
          <div key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{item.name}</strong>
              <Badge bg={item.type === 'folder' ? 'primary' : 'secondary'} className="ms-2">
                {item.type}
              </Badge>
            </div>
            <DeleteConfirmButton
              onDelete={() => handleDelete(item.id)}
              loading={loadingStates[item.id]}
              size="sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
};`;

  return (
    <ExampleSection
      title="DeleteConfirmButton"
      description="Specialized confirmation button for delete operations with built-in styling and messaging"
      code={code}
      features={['Delete Confirmation', 'Built-in Modal', 'Loading States', 'Visual Indicators', 'Danger Styling']}
      notes={[
        'Specifically designed for delete operations',
        'Built-in "Are you sure?" confirmation modal',
        'Automatically styled with danger variant',
        'Fixed position indicator shows global delete progress',
        'Perfect for item lists and data tables'
      ]}
    >
      <DeleteConfirmButtonExampleComponent />
    </ExampleSection>
  );
};

// Example 3: Advanced ConfirmButton patterns
const AdvancedConfirmButtonExampleComponent = () => {
  const [operations, setOperations] = useState<{[key: string]: { loading: boolean; result?: string }}>({});

  const createOperation = (key: string) => ({
    start: () => setOperations(prev => ({ ...prev, [key]: { loading: true } })),
    complete: (result: string) => setOperations(prev => ({ 
      ...prev, 
      [key]: { loading: false, result } 
    })),
    reset: () => setOperations(prev => ({ ...prev, [key]: { loading: false } }))
  });

  const moveOperation = createOperation('move');
  const syncOperation = createOperation('sync');
  const createOperation1 = createOperation('create');

  const handleMove = (callback?: () => void) => {
    moveOperation.start();
    setTimeout(() => {
      moveOperation.complete('Items moved successfully!');
      if (callback) callback();
    }, 2000);
  };

  const handleSync = (callback?: () => void) => {
    syncOperation.start();
    setTimeout(() => {
      syncOperation.complete('Sync completed - 15 items updated');
      if (callback) callback();
    }, 3000);
  };

  const handleCreate = (callback?: () => void) => {
    createOperation1.start();
    setTimeout(() => {
      createOperation1.complete('New project created successfully!');
      if (callback) callback();
    }, 1500);
  };

  return (
    <div>
      <Card className="mb-4">
        <Card.Header>
          <h6 className="mb-0">Complex Operations</h6>
        </Card.Header>
        <Card.Body>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <ConfirmButton
              modalTitle="Move Items"
              modalBody={
                <div>
                  <p>You are about to move 5 items to the archive folder.</p>
                  <Alert variant="warning" className="mb-0">
                    <small>This operation will take a few moments to complete.</small>
                  </Alert>
                </div>
              }
              confirmText="Move Items"
              cancelText="Cancel"
              onConfirm={handleMove}
              loading={operations.move?.loading}
              buttonComponent={MoveButton}
            />

            <ConfirmButton
              modalTitle="Sync Data"
              modalBody={
                <div>
                  <p>This will sync all your data with the remote server.</p>
                  <ul>
                    <li>Upload local changes</li>
                    <li>Download remote updates</li>
                    <li>Resolve any conflicts</li>
                  </ul>
                  <Alert variant="info" className="mb-0">
                    <small>Make sure you have a stable internet connection.</small>
                  </Alert>
                </div>
              }
              confirmText="Start Sync"
              cancelText="Not Now"
              onConfirm={handleSync}
              loading={operations.sync?.loading}
              buttonComponent={SyncButton}
            />

            <ConfirmButton
              modalTitle="Create New Project"
              modalBody="This will create a new project with default settings. You can modify these settings later."
              confirmText="Create Project"
              cancelText="Cancel"
              onConfirm={handleCreate}
              loading={operations.create?.loading}
              buttonComponent={CreateButton}
            />
          </div>

          <div className="mt-3">
            {Object.entries(operations).map(([key, op]) => (
              op.result && (
                <Alert key={key} variant="success" className="mb-2">
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {op.result}
                  <button 
                    className="btn-close float-end" 
                    onClick={() => setOperations(prev => ({ ...prev, [key]: { loading: false } }))}
                  />
                </Alert>
              )
            ))}
          </div>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header>
          <h6 className="mb-0">Button Combinations</h6>
        </Card.Header>
        <Card.Body>
          <p>ConfirmButton works well in button groups and toolbars:</p>
          <ButtonGroup>
            <EditButton />
            <ConfirmButton
              modalTitle="Save Changes"
              modalBody="Save all pending changes?"
              confirmText="Save"
              cancelText="Cancel"
              onConfirm={handleMove}
              loading={operations.move?.loading}
              buttonComponent={SaveButton}
            />
            <DeleteConfirmButton onDelete={() => console.log('Delete confirmed')} />
          </ButtonGroup>
        </Card.Body>
      </Card>
    </div>
  );
};

export const AdvancedConfirmButtonExample = () => {
  const code = `import React, { useState } from 'react';
import { Alert, ButtonGroup } from 'react-bootstrap';
import { 
  ConfirmButton, DeleteConfirmButton, EditButton, SaveButton,
  MoveButton, SyncButton, CreateButton 
} from '@jasperoosthoek/react-toolbox';

const AdvancedOperations = () => {
  const [operations, setOperations] = useState({});

  const handleMove = (callback) => {
    setOperations(prev => ({ ...prev, move: { loading: true } }));
    
    // Simulate move operation
    setTimeout(() => {
      setOperations(prev => ({ 
        ...prev, 
        move: { loading: false, result: 'Items moved successfully!' } 
      }));
      if (callback) callback();
    }, 2000);
  };

  const handleSync = (callback) => {
    setOperations(prev => ({ ...prev, sync: { loading: true } }));
    
    // Simulate sync operation
    setTimeout(() => {
      setOperations(prev => ({ 
        ...prev, 
        sync: { loading: false, result: 'Sync completed!' } 
      }));
      if (callback) callback();
    }, 3000);
  };

  return (
    <div>
      {/* Complex modal with custom content */}
      <ConfirmButton
        modalTitle="Move Items"
        modalBody={
          <div>
            <p>You are about to move 5 items to the archive folder.</p>
            <Alert variant="warning" className="mb-0">
              <small>This operation will take a few moments to complete.</small>
            </Alert>
          </div>
        }
        confirmText="Move Items"
        cancelText="Cancel"
        onConfirm={handleMove}
        loading={operations.move?.loading}
        buttonComponent={MoveButton}
      />
      
      {/* Sync with detailed instructions */}
      <ConfirmButton
        modalTitle="Sync Data"
        modalBody={
          <div>
            <p>This will sync all your data with the remote server.</p>
            <ul>
              <li>Upload local changes</li>
              <li>Download remote updates</li>
              <li>Resolve any conflicts</li>
            </ul>
            <Alert variant="info" className="mb-0">
              <small>Make sure you have a stable internet connection.</small>
            </Alert>
          </div>
        }
        confirmText="Start Sync"
        cancelText="Not Now"
        onConfirm={handleSync}
        loading={operations.sync?.loading}
        buttonComponent={SyncButton}
      />
      
      {/* Button groups */}
      <ButtonGroup>
        <EditButton />
        <ConfirmButton
          modalTitle="Save Changes"
          modalBody="Save all pending changes?"
          confirmText="Save"
          cancelText="Cancel"
          onConfirm={handleSave}
          buttonComponent={SaveButton}
        />
        <DeleteConfirmButton onDelete={handleDelete} />
      </ButtonGroup>
    </div>
  );
};`;

  return (
    <ExampleSection
      title="Advanced ConfirmButton Patterns"
      description="Complex confirmation scenarios with custom modal content, multiple operations, and button combinations"
      code={code}
      features={['Custom Modal Content', 'JSX in modalBody', 'Button Groups', 'Complex Operations']}
      notes={[
        'modalBody can accept JSX elements for complex content',
        'Perfect for operations with detailed instructions',
        'Works seamlessly with ButtonGroups and toolbars',
        'Can include alerts, lists, and formatted content in modals'
      ]}
    >
      <AdvancedConfirmButtonExampleComponent />
    </ExampleSection>
  );
};
