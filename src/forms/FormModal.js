import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';

import { SmallSpinner } from '../components/LoadingIndicator';
import { FormFactory } from './FormFactory';
import { useLocalization } from '../localization/LocalizationContext';

export const CreateEditModal = ({
  show,
  onSave,
  onHide,
  modalTitle,
  dialogClassName='',
  width,
  loading,
  ...restProps
}) => {
  const { strings } = useLocalization();
  
  return (
    <Modal
      show={show}
      onHide={onHide}
      onClick={e => e.stopPropagation()}
      centered
      dialogClassName={`${dialogClassName} ${width ? `mw-100 w-${width}` : ''}`}
    >
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <FormFactory
          {...restProps}
          onSubmit={formData => onSave(formData, onHide)}
        />
      </Modal.Body>

      <Modal.Footer>
        {loading && <SmallSpinner />}
        <Button
          variant="secondary"
          onClick={onHide}
        >
          {strings.close}
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
        >
          {strings.save}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
CreateEditModal.propTypes = {
  onSave: PropTypes.func.isRequired,
  includeData: PropTypes.object.isRequired,
  initialState: PropTypes.object,
  formFields: PropTypes.object.isRequired,
  show: PropTypes.bool,
  loading: PropTypes.bool,
  modalTitle: PropTypes.node.isRequired,
  validate: PropTypes.func,
}
CreateEditModal.defaultProps = {
  show: true,
  loading: false,
  includeData: {},
  validate: null,
  initialState: null,
}
