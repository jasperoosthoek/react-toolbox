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
} from '../index';

// Import some additional icons for custom button examples
import { AiOutlineHeart, AiOutlineStar, AiOutlineBell } from 'react-icons/ai';
import { FiSettings, FiUser, FiMail } from 'react-icons/fi';

// Example 1: All Available IconButtons
export const AllIconButtonsExample = () => {
  const [loadingStates, setLoadingStates] = useState<{[key: string]: boolean}>({});

  const toggleLoading = (buttonName: string) => {
    setLoadingStates(prev => ({
      ...prev,
      [buttonName]: !prev[buttonName]
    }));
  };

  const ButtonSection = ({ title, buttons }: { title: string; buttons: Array<{ name: string; component: React.ComponentType<any> }> }) => (
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
      <h4>All Available IconButtons</h4>
      <p>Click any button to toggle its loading state. All buttons support loading, different sizes, and variants.</p>
      
      <ButtonSection title="Action Buttons" buttons={actionButtons} />
      <ButtonSection title="Create Buttons" buttons={createButtons} />
      <ButtonSection title="Navigation Buttons" buttons={navigationButtons} />
      <ButtonSection title="Utility Buttons" buttons={utilityButtons} />
      <ButtonSection title="Sort Buttons" buttons={sortButtons} />
    </div>
  );
};

// Example 2: Button sizes and variants
export const ButtonSizesAndVariantsExample = () => {
  const [loading, setLoading] = useState(false);

  const toggleLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div>
      <h4>Button Sizes and Variants</h4>
      <p>IconButtons support all react-bootstrap Button props including size, variant, and disabled states.</p>
      
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

// Example 3: Custom IconButtons
export const CustomIconButtonsExample = () => {
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);

  // Create custom buttons using makeIconButton
  const HeartButton = makeIconButton(AiOutlineHeart);
  const StarButton = makeIconButton(AiOutlineStar);
  const BellButton = makeIconButton(AiOutlineBell);
  const SettingsButton = makeIconButton(FiSettings);
  const UserButton = makeIconButton(FiUser);
  const MailButton = makeIconButton(FiMail);

  return (
    <div>
      <h4>Custom IconButtons</h4>
      <p>Use <code>makeIconButton</code> to create custom buttons with any react-icons icon.</p>
      
      <Card className="mb-4">
        <Card.Header>
          <h6 className="mb-0">Custom Buttons</h6>
        </Card.Header>
        <Card.Body>
          <div className="d-flex flex-wrap gap-2">
            <HeartButton 
              variant="outline-danger" 
              loading={favoriteLoading}
              onClick={() => {
                setFavoriteLoading(true);
                setTimeout(() => setFavoriteLoading(false), 1500);
              }}
            />
            <StarButton variant="outline-warning" />
            <BellButton 
              variant="outline-info"
              loading={notificationLoading}
              onClick={() => {
                setNotificationLoading(true);
                setTimeout(() => setNotificationLoading(false), 1500);
              }}
            />
            <SettingsButton variant="outline-secondary" />
            <UserButton variant="outline-primary" />
            <MailButton variant="outline-success" />
          </div>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header>
          <h6 className="mb-0">Code Example</h6>
        </Card.Header>
        <Card.Body>
          <pre><code>{`import { makeIconButton } from '@jasperoosthoek/react-toolbox';
import { AiOutlineHeart } from 'react-icons/ai';

const HeartButton = makeIconButton(AiOutlineHeart);

<HeartButton 
  variant="outline-danger" 
  loading={favoriteLoading}
  onClick={handleFavorite}
/>`}</code></pre>
        </Card.Body>
      </Card>
    </div>
  );
};

// Example 4: IconButton with text
export const IconButtonWithTextExample = () => {
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
      <h4>IconButtons with Text</h4>
      <p>IconButtons can include text alongside icons by passing children to the component.</p>
      
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

// Example 5: ButtonGroups and Toolbars
export const ButtonGroupsExample = () => {
  const [activeSort, setActiveSort] = useState<'none' | 'asc' | 'desc'>('none');

  const handleSort = (direction: 'asc' | 'desc') => {
    setActiveSort(direction);
  };

  return (
    <div>
      <h4>IconButtons in ButtonGroups</h4>
      <p>IconButtons work seamlessly with react-bootstrap ButtonGroups and toolbars.</p>
      
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
                onClick={() => setActiveSort('none')}
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

// Example 6: UploadTextButton
export const UploadTextButtonExample = () => {
  const [fileContent, setFileContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');

  const handleFileLoad = (result: string | ArrayBuffer) => {
    if (typeof result === 'string') {
      setFileContent(result);
      setFileName('Uploaded file');
    }
  };

  return (
    <div>
      <h4>UploadTextButton</h4>
      <p>Special button component for uploading and reading text files.</p>
      
      <Card className="mb-4">
        <Card.Header>
          <h6 className="mb-0">File Upload</h6>
        </Card.Header>
        <Card.Body>
          <div className="mb-3">
            <UploadTextButton
              accept=".txt,.md,.json"
              onLoadFile={handleFileLoad}
              variant="outline-primary"
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

      <Card className="mb-4">
        <Card.Header>
          <h6 className="mb-0">Code Example</h6>
        </Card.Header>
        <Card.Body>
          <pre><code>{`import { UploadTextButton } from '@jasperoosthoek/react-toolbox';

<UploadTextButton
  accept=".txt,.md,.json"
  onLoadFile={(result) => {
    if (typeof result === 'string') {
      setFileContent(result);
    }
  }}
  variant="outline-primary"
>
  Upload Text File
</UploadTextButton>`}</code></pre>
        </Card.Body>
      </Card>
    </div>
  );
};


