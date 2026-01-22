// Comprehensive showcase of all IconButtons with various states and configurations

import React, { useState } from 'react';
import { ButtonGroup, Card, Row, Col, Form, Badge } from 'react-bootstrap';
import { 
  // Import all icon buttons
  CheckButton, CopyButton, PasteButton, CloseButton, CogButton, CreateButton, 
  CreateFolderButton, CreateSubFolderButton, CreateFileButton, DeleteButton, 
  DownButton, DownloadButton, EditButton, FlagButton, HideButton, LinkButton, 
  ListButton, MenuButton, MoveButton, NotesButton, PencilButton, PlayButton, 
  SaveButton, SearchButton, ShowButton, SortButton, SortUpButton, SortDownButton, 
  StopButton, SyncButton, UnCheckButton, UnlockButton, UpButton, UploadButton, 
  QuestionnaireButton, DropdownButton, ResetButton,
  // Additional components
  IconButton, makeIconButton, UploadTextButton
} from '../../src/index';

// Import some additional icons for custom button examples
import { AiOutlineHeart, AiOutlineStar, AiOutlineBell } from 'react-icons/ai';
import { FiSettings, FiUser, FiMail } from 'react-icons/fi';
// Import ExampleSection
import { ExampleSection } from './ExampleSection';

// Example 1: All Available IconButtons
const AllIconButtonsExampleComponent = () => {
  const [loadingStates, setLoadingStates] = useState<{[key: string]: boolean}>({});

  const toggleLoading = (buttonName: string) => {
    setLoadingStates(prev => ({
      ...prev,
      [buttonName]: !prev[buttonName]
    }));
  };

  const ButtonSection = ({ title, buttons }: { 
    title: string; 
    buttons: Array<{ name: string; component: React.ComponentType<any> }> 
  }) => (
    <Card className="mb-4">
      <Card.Header>
        <h6 className="mb-0">{title}</h6>
      </Card.Header>
      <Card.Body>
        <div className="d-flex flex-wrap gap-2">
          {buttons.map(({ name, component: ButtonComponent }) => (
            <div key={name} className="d-flex flex-column align-items-center">
              <ButtonComponent
                loading={loadingStates[name]}
                onClick={() => toggleLoading(name)}
                title={`${name} - Click to toggle loading`}
              />
              <small className="text-muted mt-1">{name}</small>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );

  const actionButtons = [
    { name: 'CheckButton', component: CheckButton },
    { name: 'CloseButton', component: CloseButton },
    { name: 'SaveButton', component: SaveButton },
    { name: 'EditButton', component: EditButton },
    { name: 'DeleteButton', component: DeleteButton },
    { name: 'CopyButton', component: CopyButton },
    { name: 'PasteButton', component: PasteButton },
    { name: 'UnCheckButton', component: UnCheckButton },
  ];

  const createButtons = [
    { name: 'CreateButton', component: CreateButton },
    { name: 'CreateFolderButton', component: CreateFolderButton },
    { name: 'CreateSubFolderButton', component: CreateSubFolderButton },
    { name: 'CreateFileButton', component: CreateFileButton },
  ];

  const navigationButtons = [
    { name: 'UpButton', component: UpButton },
    { name: 'DownButton', component: DownButton },
    { name: 'PlayButton', component: PlayButton },
    { name: 'StopButton', component: StopButton },
    { name: 'MoveButton', component: MoveButton },
    { name: 'SyncButton', component: SyncButton },
  ];

  const utilityButtons = [
    { name: 'SearchButton', component: SearchButton },
    { name: 'DownloadButton', component: DownloadButton },
    { name: 'UploadButton', component: UploadButton },
    { name: 'LinkButton', component: LinkButton },
    { name: 'FlagButton', component: FlagButton },
    { name: 'NotesButton', component: NotesButton },
    { name: 'PencilButton', component: PencilButton },
    { name: 'ListButton', component: ListButton },
    { name: 'MenuButton', component: MenuButton },
    { name: 'CogButton', component: CogButton },
    { name: 'UnlockButton', component: UnlockButton },
    { name: 'ShowButton', component: ShowButton },
    { name: 'HideButton', component: HideButton },
    { name: 'QuestionnaireButton', component: QuestionnaireButton },
    { name: 'DropdownButton', component: DropdownButton },
    { name: 'ResetButton', component: ResetButton },
  ];

  const sortButtons = [
    { name: 'SortButton', component: SortButton },
    { name: 'SortUpButton', component: SortUpButton },
    { name: 'SortDownButton', component: SortDownButton },
  ];

  return (
    <div>
      <p>Click any button to toggle its loading state. All buttons support loading, different sizes, and variants.</p>
      
      <ButtonSection title="Action Buttons" buttons={actionButtons} />
      <ButtonSection title="Create Buttons" buttons={createButtons} />
      <ButtonSection title="Navigation Buttons" buttons={navigationButtons} />
      <ButtonSection title="Utility Buttons" buttons={utilityButtons} />
      <ButtonSection title="Sort Buttons" buttons={sortButtons} />
    </div>
  );
};

export const AllIconButtonsExample = () => {
  const code = `import React, { useState } from 'react';
import { Card, ButtonGroup } from 'react-bootstrap';
import { 
  CheckButton, SaveButton, EditButton, DeleteButton, 
  CreateButton, DownloadButton, UploadButton, 
  SearchButton, SortButton, SyncButton 
} from '@jasperoosthoek/react-toolbox';

const MyComponent = () => {
  const [loading, setLoading] = useState<boolean>(false);
  
  const handleAction = () => {
    setLoading(true);
    // Your action logic here
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div>
      {/* Basic usage */}
      <SaveButton onClick={handleAction} loading={loading} />
      <EditButton variant="outline-primary" />
      <DeleteButton variant="outline-danger" size="sm" />
      
      {/* With custom props */}
      <CreateButton 
        variant="success" 
        disabled={loading}
        title="Create new item"
      />
      
      {/* With text */}
      <DownloadButton variant="primary">
        Download File
      </DownloadButton>
      
      {/* In button groups */}
      <ButtonGroup>
        <CheckButton />
        <EditButton />
        <DeleteButton />
      </ButtonGroup>
    </div>
  );
};

export default MyComponent;`;

  return (
    <ExampleSection
      title="All Available IconButtons"
      description="Comprehensive collection of pre-built IconButtons with loading states, variants, and sizes"
      code={code}
      features={['30+ Pre-built Icons', 'Loading States', 'All Bootstrap Variants', 'Customizable']} 
      notes={[
        'All buttons support loading, disabled, and custom styling',
        'Import only the buttons you need to optimize bundle size',
        'Each button includes appropriate accessibility attributes',
        'Compatible with all react-bootstrap Button props'
      ]}
    >
      <AllIconButtonsExampleComponent />
    </ExampleSection>
  );
};

// Example 2: Button sizes and variants
const ButtonSizesAndVariantsExampleComponent = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const toggleLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div>
      <Card className="mb-4">
        <Card.Header>
          <h6 className="mb-0">Sizes</h6>
        </Card.Header>
        <Card.Body>
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex flex-column align-items-center">
              <EditButton size="sm" />
              <small className="text-muted">Small</small>
            </div>
            <div className="d-flex flex-column align-items-center">
              <EditButton />
              <small className="text-muted">Default</small>
            </div>
            <div className="d-flex flex-column align-items-center">
              <EditButton size="lg" />
              <small className="text-muted">Large</small>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header>
          <h6 className="mb-0">Variants</h6>
        </Card.Header>
        <Card.Body>
          <div className="d-flex flex-wrap gap-2">
            <SaveButton variant="primary" />
            <SaveButton variant="secondary" />
            <SaveButton variant="success" />
            <SaveButton variant="danger" />
            <SaveButton variant="warning" />
            <SaveButton variant="info" />
            <SaveButton variant="light" />
            <SaveButton variant="dark" />
            <SaveButton variant="outline-primary" />
            <SaveButton variant="outline-secondary" />
          </div>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header>
          <h6 className="mb-0">States</h6>
        </Card.Header>
        <Card.Body>
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex flex-column align-items-center">
              <CheckButton />
              <small className="text-muted">Normal</small>
            </div>
            <div className="d-flex flex-column align-items-center">
              <CheckButton loading={loading} onClick={toggleLoading} />
              <small className="text-muted">Loading</small>
            </div>
            <div className="d-flex flex-column align-items-center">
              <CheckButton disabled />
              <small className="text-muted">Disabled</small>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export const ButtonSizesAndVariantsExample = () => {
  const code = `import React, { useState } from 'react';
import { SaveButton, EditButton, CheckButton } from '@jasperoosthoek/react-toolbox';

const ButtonStatesExample = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleAction = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div>
      {/* Different sizes */}
      <EditButton size="sm" />
      <EditButton /> {/* default size */}
      <EditButton size="lg" />
      
      {/* Different variants */}
      <SaveButton variant="primary" />
      <SaveButton variant="secondary" />
      <SaveButton variant="success" />
      <SaveButton variant="danger" />
      <SaveButton variant="outline-primary" />
      
      {/* Different states */}
      <CheckButton />
      <CheckButton loading={loading} onClick={handleAction} />
      <CheckButton disabled />
    </div>
  );
};

export default ButtonStatesExample;`;

  return (
    <ExampleSection
      title="Button Sizes and Variants"
      description="IconButtons support all react-bootstrap Button props including size, variant, and disabled states"
      code={code}
      features={['Multiple Sizes', 'Bootstrap Variants', 'Loading States', 'Disabled States']}
      notes={[
        'All IconButtons inherit react-bootstrap Button props',
        'Loading state automatically disables the button',
        'Variants follow Bootstrap color scheme',
        'Sizes: sm, default, lg available'
      ]}
    >
      <ButtonSizesAndVariantsExampleComponent />
    </ExampleSection>
  );
};

// Example 3: Custom IconButtons
const CustomIconButtonsExampleComponent = () => {
  const [favoriteLoading, setFavoriteLoading] = useState<boolean>(false);
  const [notificationLoading, setNotificationLoading] = useState<boolean>(false);

  // Create custom buttons using makeIconButton
  const HeartButton = makeIconButton(AiOutlineHeart);
  const StarButton = makeIconButton(AiOutlineStar);
  const BellButton = makeIconButton(AiOutlineBell);
  const SettingsButton = makeIconButton(FiSettings);
  const UserButton = makeIconButton(FiUser);
  const MailButton = makeIconButton(FiMail);

  const handleFavorite = () => {
    setFavoriteLoading(true);
    setTimeout(() => setFavoriteLoading(false), 1500);
  };

  const handleNotification = () => {
    setNotificationLoading(true);
    setTimeout(() => setNotificationLoading(false), 1500);
  };

  return (
    <div>
      <Card className="mb-4">
        <Card.Header>
          <h6 className="mb-0">Custom Buttons</h6>
        </Card.Header>
        <Card.Body>
          <div className="d-flex flex-wrap gap-2">
            <HeartButton 
              variant="outline-danger" 
              loading={favoriteLoading}
              onClick={handleFavorite}
              title="Add to favorites"
            />
            <StarButton variant="outline-warning" title="Rate this item" />
            <BellButton 
              variant="outline-info"
              loading={notificationLoading}
              onClick={handleNotification}
              title="Toggle notifications"
            />
            <SettingsButton variant="outline-secondary" title="Settings" />
            <UserButton variant="outline-primary" title="User profile" />
            <MailButton variant="outline-success" title="Send email" />
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export const CustomIconButtonsExample = () => {
  const code = `import React, { useState } from 'react';
import { makeIconButton } from '@jasperoosthoek/react-toolbox';
import { AiOutlineHeart, AiOutlineStar, AiOutlineBell } from 'react-icons/ai';
import { FiSettings, FiUser, FiMail } from 'react-icons/fi';

const MyCustomButtons = () => {
  const [favoriteLoading, setFavoriteLoading] = useState<boolean>(false);
  const [notificationLoading, setNotificationLoading] = useState<boolean>(false);
  
  // Create custom buttons using makeIconButton
  const HeartButton = makeIconButton(AiOutlineHeart);
  const StarButton = makeIconButton(AiOutlineStar);
  const BellButton = makeIconButton(AiOutlineBell);
  const SettingsButton = makeIconButton(FiSettings);
  const UserButton = makeIconButton(FiUser);
  const MailButton = makeIconButton(FiMail);

  const handleFavorite = () => {
    setFavoriteLoading(true);
    // Your favorite logic here
    setTimeout(() => setFavoriteLoading(false), 1500);
  };

  const handleNotification = () => {
    setNotificationLoading(true);
    // Your notification logic here
    setTimeout(() => setNotificationLoading(false), 1500);
  };

  return (
    <div>
      <HeartButton 
        variant="outline-danger" 
        loading={favoriteLoading}
        onClick={handleFavorite}
        title="Add to favorites"
      />
      <StarButton 
        variant="outline-warning" 
        title="Rate this item"
      />
      <BellButton 
        variant="outline-info"
        loading={notificationLoading}
        onClick={handleNotification}
        title="Toggle notifications"
      />
      <SettingsButton 
        variant="outline-secondary" 
        title="Settings"
      />
      <UserButton 
        variant="outline-primary" 
        title="User profile"
      />
      <MailButton 
        variant="outline-success" 
        title="Send email"
      />
    </div>
  );
};

export default MyCustomButtons;`;

  return (
    <ExampleSection
      title="Custom IconButtons"
      description="Use makeIconButton to create custom buttons with any react-icons icon"
      code={code}
      features={['Any React Icon', 'makeIconButton Helper', 'Full Customization', 'Loading Support']}
      notes={[
        'Use makeIconButton with any icon from react-icons',
        'Custom buttons inherit all IconButton functionality',
        'Supports loading states, variants, and sizes',
        'Perfect for brand-specific or unique icons'
      ]}
    >
      <CustomIconButtonsExampleComponent />
    </ExampleSection>
  );
};

// Example 4: IconButton with text
const IconButtonWithTextExampleComponent = () => {
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const handleSave = () => {
    setSaveLoading(true);
    setTimeout(() => setSaveLoading(false), 2000);
  };

  const handleDelete = () => {
    setDeleteLoading(true);
    setTimeout(() => setDeleteLoading(false), 2000);
  };

  return (
    <div>
      <Card className="mb-4">
        <Card.Header>
          <h6 className="mb-0">Buttons with Text</h6>
        </Card.Header>
        <Card.Body>
          <div className="d-flex flex-wrap gap-2">
            <SaveButton 
              variant="primary" 
              loading={saveLoading}
              onClick={handleSave}
            >
              Save Document
            </SaveButton>
            <EditButton variant="outline-secondary">
              Edit Profile
            </EditButton>
            <DeleteButton 
              variant="outline-danger"
              loading={deleteLoading}
              onClick={handleDelete}
            >
              Delete Item
            </DeleteButton>
            <DownloadButton variant="outline-success">
              Download File
            </DownloadButton>
            <UploadButton variant="outline-info">
              Upload Image
            </UploadButton>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export const IconButtonWithTextExample = () => {
  const code = `import React, { useState } from 'react';
import { 
  SaveButton, EditButton, DeleteButton, 
  DownloadButton, UploadButton 
} from '@jasperoosthoek/react-toolbox';

const ButtonsWithText = () => {
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const handleSave = () => {
    setSaveLoading(true);
    // Your save logic here
    setTimeout(() => setSaveLoading(false), 2000);
  };

  const handleDelete = () => {
    setDeleteLoading(true);
    // Your delete logic here
    setTimeout(() => setDeleteLoading(false), 2000);
  };

  return (
    <div>
      <SaveButton 
        variant="primary" 
        loading={saveLoading}
        onClick={handleSave}
      >
        Save Document
      </SaveButton>
      
      <EditButton variant="outline-secondary">
        Edit Profile
      </EditButton>
      
      <DeleteButton 
        variant="outline-danger"
        loading={deleteLoading}
        onClick={handleDelete}
      >
        Delete Item
      </DeleteButton>
      
      <DownloadButton variant="outline-success">
        Download File
      </DownloadButton>
      
      <UploadButton variant="outline-info">
        Upload Image
      </UploadButton>
    </div>
  );
};

export default ButtonsWithText;`;

  return (
    <ExampleSection
      title="IconButtons with Text"
      description="IconButtons can include text alongside icons by passing children to the component"
      code={code}
      features={['Text + Icon', 'Loading States', 'Flexible Layout', 'Accessibility']}
      notes={[
        'Add text by passing children to IconButton components',
        'Text appears alongside the icon automatically',
        'Loading states work with both icon and text',
        'Maintains proper accessibility with both icon and text'
      ]}
    >
      <IconButtonWithTextExampleComponent />
    </ExampleSection>
  );
};

// Example 5: ButtonGroups and Toolbars
const ButtonGroupsExampleComponent = () => {
  const [activeSort, setActiveSort] = useState<'none' | 'asc' | 'desc'>('none');

  const handleSort = (direction: 'asc' | 'desc') => {
    setActiveSort(direction);
  };

  const resetSort = () => {
    setActiveSort('none');
  };

  return (
    <div>
      <Card className="mb-4">
        <Card.Header>
          <h6 className="mb-0">Editor Toolbar</h6>
        </Card.Header>
        <Card.Body>
          <ButtonGroup className="mb-3">
            <SaveButton title="Save" />
            <EditButton title="Edit" />
            <CopyButton title="Copy" />
            <PasteButton title="Paste" />
            <DeleteButton title="Delete" />
          </ButtonGroup>
          
          <ButtonGroup className="mb-3">
            <CreateButton title="Create" />
            <CreateFolderButton title="Create Folder" />
            <CreateFileButton title="Create File" />
          </ButtonGroup>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header>
          <h6 className="mb-0">Sort Controls</h6>
        </Card.Header>
        <Card.Body>
          <div className="d-flex align-items-center gap-3">
            <span>Sort:</span>
            <ButtonGroup>
              <SortButton 
                variant={activeSort === 'none' ? 'primary' : 'outline-primary'}
                onClick={resetSort}
                title="No sorting"
              />
              <SortUpButton 
                variant={activeSort === 'asc' ? 'primary' : 'outline-primary'}
                onClick={() => handleSort('asc')}
                title="Sort ascending"
              />
              <SortDownButton 
                variant={activeSort === 'desc' ? 'primary' : 'outline-primary'}
                onClick={() => handleSort('desc')}
                title="Sort descending"
              />
            </ButtonGroup>
            <Badge bg="info">
              Active: {activeSort === 'none' ? 'No sorting' : activeSort === 'asc' ? 'Ascending' : 'Descending'}
            </Badge>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export const ButtonGroupsExample = () => {
  const code = `import React, { useState } from 'react';
import { ButtonGroup, Badge } from 'react-bootstrap';
import { 
  SaveButton, EditButton, CopyButton, PasteButton, DeleteButton,
  CreateButton, CreateFolderButton, CreateFileButton,
  SortButton, SortUpButton, SortDownButton 
} from '@jasperoosthoek/react-toolbox';

const ToolbarExample = () => {
  const [activeSort, setActiveSort] = useState<'none' | 'asc' | 'desc'>('none');

  const handleSort = (direction: 'asc' | 'desc') => {
    setActiveSort(direction);
  };

  const resetSort = () => {
    setActiveSort('none');
  };

  return (
    <div>
      {/* Editor Toolbar */}
      <ButtonGroup className="mb-3">
        <SaveButton title="Save" />
        <EditButton title="Edit" />
        <CopyButton title="Copy" />
        <PasteButton title="Paste" />
        <DeleteButton title="Delete" />
      </ButtonGroup>
      
      {/* Create Actions */}
      <ButtonGroup className="mb-3">
        <CreateButton title="Create" />
        <CreateFolderButton title="Create Folder" />
        <CreateFileButton title="Create File" />
      </ButtonGroup>
      
      {/* Sort Controls */}
      <div className="d-flex align-items-center gap-3">
        <span>Sort:</span>
        <ButtonGroup>
          <SortButton 
            variant={activeSort === 'none' ? 'primary' : 'outline-primary'}
            onClick={resetSort}
            title="No sorting"
          />
          <SortUpButton 
            variant={activeSort === 'asc' ? 'primary' : 'outline-primary'}
            onClick={() => handleSort('asc')}
            title="Sort ascending"
          />
          <SortDownButton 
            variant={activeSort === 'desc' ? 'primary' : 'outline-primary'}
            onClick={() => handleSort('desc')}
            title="Sort descending"
          />
        </ButtonGroup>
        <Badge bg="info">
          Active: {activeSort === 'none' ? 'No sorting' : activeSort}
        </Badge>
      </div>
    </div>
  );
};

export default ToolbarExample;`;

  return (
    <ExampleSection
      title="IconButtons in ButtonGroups"
      description="IconButtons work seamlessly with react-bootstrap ButtonGroups and toolbars"
      code={code}
      features={['ButtonGroup Compatible', 'Toolbar Creation', 'Toggle States', 'Grouped Actions']}
      notes={[
        'IconButtons integrate perfectly with ButtonGroups',
        'Great for creating toolbars and action groups',
        'Supports toggle states and active indicators',
        'Maintains spacing and alignment automatically'
      ]}
    >
      <ButtonGroupsExampleComponent />
    </ExampleSection>
  );
};

// Example 6: UploadTextButton
const UploadTextButtonExampleComponent = () => {
  const [fileContent, setFileContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);

  const handleFileLoad = (result: string | ArrayBuffer | null) => {
    if (typeof result === 'string') {
      setFileContent(result);
      setFileName('Uploaded file');
      setUploadLoading(false);
    }
  };

  const handleFileSelect = () => {
    setUploadLoading(true);
    setFileContent('');
    setFileName('');
  };

  const handleError = (error: any) => {
    console.error('File upload error:', error);
    setUploadLoading(false);
    alert('Error uploading file: ' + error.message);
  };

  return (
    <div>
      <Card className="mb-4">
        <Card.Header>
          <h6 className="mb-0">File Upload</h6>
        </Card.Header>
        <Card.Body>
          <div className="mb-3">
            <UploadTextButton
              accept=".txt,.md,.json,.csv"
              onLoadFile={handleFileLoad}
              onError={handleError}
              variant="outline-primary"
              loading={uploadLoading}
              onClick={handleFileSelect}
            >
              Upload Text File
            </UploadTextButton>
          </div>
          
          {fileContent && (
            <div>
              <h6>File Content:</h6>
              <pre className="bg-light p-3 rounded" style={{ maxHeight: '200px', overflow: 'auto' }}>
                {fileContent}
              </pre>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export const UploadTextButtonExample = () => {
  const code = `import React, { useState } from 'react';
import { UploadTextButton } from '@jasperoosthoek/react-toolbox';

const FileUploadExample = () => {
  const [fileContent, setFileContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);

  const handleFileLoad = (result: string | ArrayBuffer | null) => {
    if (typeof result === 'string') {
      setFileContent(result);
      setFileName('Uploaded file');
      setUploadLoading(false);
    }
  };

  const handleFileSelect = () => {
    setUploadLoading(true);
    setFileContent('');
    setFileName('');
  };

  const handleError = (error: any) => {
    console.error('File upload error:', error);
    setUploadLoading(false);
    alert('Error uploading file: ' + error.message);
  };

  return (
    <div>
      <UploadTextButton
        accept=".txt,.md,.json,.csv"
        onLoadFile={handleFileLoad}
        onError={handleError}
        variant="outline-primary"
        loading={uploadLoading}
        onClick={handleFileSelect}
      >
        Upload Text File
      </UploadTextButton>
      
      {fileContent && (
        <div className="mt-3">
          <h6>File Content:</h6>
          <pre 
            className="bg-light p-3 rounded" 
            style={{ maxHeight: '200px', overflow: 'auto' }}
          >
            {fileContent}
          </pre>
        </div>
      )}
    </div>
  );
};

export default FileUploadExample;`;

  return (
    <ExampleSection
      title="UploadTextButton"
      description="Special button component for uploading and reading text files with built-in file handling"
      code={code}
      features={['File Upload', 'Text Reading', 'Error Handling', 'Loading States']}
      notes={[
        'Automatically reads file content and returns as string',
        'Supports multiple file types via accept prop',
        'Built-in error handling for file operations',
        'Loading states during file processing'
      ]}
    >
      <UploadTextButtonExampleComponent />
    </ExampleSection>
  );
};
