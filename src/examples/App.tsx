import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Tab, Container } from 'react-bootstrap';
import { LocalizationProvider } from '../localization/LocalizationContext';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

// Form Examples
import {
  CustomFormExample,
  ModalFormExample, 
  FlexibleFormExample,
  RendererFormExample,
  MixedFormExample
} from './components/FormExamples';

// DataTable Examples
import {
  BasicDataTableExample,
  PaginatedDataTableExample,
  EditableDataTableExample,
  DragDropDataTableExample,
  CustomRendererDataTableExample,
  IntegratedFormDataTableExample,
} from './components/DataTableExamples';

// IconButton Examples
import {
  AllIconButtonsExample,
  ButtonSizesAndVariantsExample,
  CustomIconButtonsExample,
  IconButtonWithTextExample,
  ButtonGroupsExample,
  UploadTextButtonExample,
} from './components/IconButtonsExamples';

// Button Component Examples
import {
  ConfirmButtonExample,
  DeleteConfirmButtonExample,
  AdvancedConfirmButtonExample,
} from './components/ButtonComponentsExamples';

// Localization Examples
import {
  BasicLocalizationExample,
  CustomLocalizationExample,
  FormLocalizationExample,
  DataTableLocalizationExample,
  LanguageSwitcherExample,
  LocalizationReferenceExample,
  customStrings,
} from './components/LocalizationExamples';


export const DndWrapper = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      {children}
    </DndProvider>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState('datatable');

  return (
    <DndWrapper>
      <LocalizationProvider lang="en" localization={customStrings}>
        <Container fluid className="py-4">
          <div className="mb-4">
            <h1>React Toolbox Examples</h1>
            <p className="text-muted">
              Comprehensive examples showcasing all components and features. Each example includes working code and demonstrates real-world usage patterns.
            </p>
          </div>

          <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'datatable')}>
            <Nav variant="tabs" className="mb-4">
              <Nav.Item>
                <Nav.Link eventKey="datatable">DataTable</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="forms">Forms</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="iconbuttons">IconButtons</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="confirmbuttons">Confirm Buttons</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="localization">Localization</Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="datatable">
                <div className="row">
                  <div className="col-12 mb-5">
                    <div className="card">
                      <div className="card-body">
                        <BasicDataTableExample />
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-12 mb-5">
                    <div className="card">
                      <div className="card-body">
                        <PaginatedDataTableExample />
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-12 mb-5">
                    <div className="card">
                      <div className="card-body">
                        <EditableDataTableExample />
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-12 mb-5">
                    <div className="card">
                      <div className="card-body">
                        <DragDropDataTableExample />
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-12 mb-5">
                    <div className="card">
                      <div className="card-body">
                        <CustomRendererDataTableExample />
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-12 mb-5">
                    <div className="card">
                      <div className="card-body">
                        <IntegratedFormDataTableExample />
                      </div>
                    </div>
                  </div>
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="forms">
                <div className="row">
                  <div className="col-12 mb-5">
                    <div className="card">
                      <div className="card-body">
                        <CustomFormExample />
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-12 mb-5">
                    <div className="card">
                      <div className="card-body">
                        <ModalFormExample />
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-12 mb-5">
                    <div className="card">
                      <div className="card-body">
                        <FlexibleFormExample />
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-12 mb-5">
                    <div className="card">
                      <div className="card-body">
                        <RendererFormExample />
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-12 mb-5">
                    <div className="card">
                      <div className="card-body">
                        <MixedFormExample />
                      </div>
                    </div>
                  </div>
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="iconbuttons">
                <div className="row">
                  <div className="col-12 mb-5">
                    <div className="card">
                      <div className="card-body">
                        <AllIconButtonsExample />
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-12 mb-5">
                    <div className="card">
                      <div className="card-body">
                        <ButtonSizesAndVariantsExample />
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-12 mb-5">
                    <div className="card">
                      <div className="card-body">
                        <CustomIconButtonsExample />
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-12 mb-5">
                    <div className="card">
                      <div className="card-body">
                        <IconButtonWithTextExample />
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-12 mb-5">
                    <div className="card">
                      <div className="card-body">
                        <ButtonGroupsExample />
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-12 mb-5">
                    <div className="card">
                      <div className="card-body">
                        <UploadTextButtonExample />
                      </div>
                    </div>
                  </div>
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="confirmbuttons">
                <div className="row">
                  <div className="col-12 mb-5">
                    <div className="card">
                      <div className="card-body">
                        <ConfirmButtonExample />
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-12 mb-5">
                    <div className="card">
                      <div className="card-body">
                        <DeleteConfirmButtonExample />
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-12 mb-5">
                    <div className="card">
                      <div className="card-body">
                        <AdvancedConfirmButtonExample />
                      </div>
                    </div>
                  </div>
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="localization">
                <div className="row">
                  <div className="col-12 mb-5">
                    <div className="card">
                      <div className="card-body">
                        <BasicLocalizationExample />
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-12 mb-5">
                    <div className="card">
                      <div className="card-body">
                        <CustomLocalizationExample />
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-12 mb-5">
                    <div className="card">
                      <div className="card-body">
                        <FormLocalizationExample />
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-12 mb-5">
                    <div className="card">
                      <div className="card-body">
                        <DataTableLocalizationExample />
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-12 mb-5">
                    <div className="card">
                      <div className="card-body">
                        <LanguageSwitcherExample />
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-12 mb-5">
                    <div className="card">
                      <div className="card-body">
                        <LocalizationReferenceExample />
                      </div>
                    </div>
                  </div>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Container>
      </LocalizationProvider>
    </DndWrapper>
  );
}

export default App;
