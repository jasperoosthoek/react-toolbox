import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  CustomFormExample,
  ModalFormExample, 
  FlexibleFormExample,
  RendererFormExample,
  MixedFormExample
} from './FormExamples';

function App() {
  return (
    <div className="container py-4">
      <h1 className="mb-4">React Toolbox Examples</h1>
      
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
    </div>
  );
}

export default App;
