import React, { useState, useContext, MouseEvent, ReactElement } from 'react';
import { Button, Modal } from 'react-bootstrap';

import { SmallSpinner } from '../indicators/LoadingIndicator';
import { LocalizationContext } from '../../localization/LocalizationContext';
import { ButtonProps } from './IconButtons';

export interface ConfirmButtonProps extends ButtonProps {
  modalTitle: ReactElement | string;
  modalBody?: ReactElement | string;
  confirmText?: ReactElement | string;
  cancelText?: ReactElement | string;
  closeUsingCallback?: boolean;
  onConfirm: (closeModal: () => void) => void;
  buttonComponent: typeof Button,
}

const ConfirmButton = ({
  modalTitle,
  modalBody,
  confirmText,
  cancelText,
  onConfirm,
  buttonComponent: ButtonComponent,
  loading,
  closeUsingCallback,
  ...props
}: ConfirmButtonProps) => {
  const [modalActive, setModalActive] = useState(false);
  const { strings } = useContext(LocalizationContext);

  return <>
    <ButtonComponent
      {...props}
      onClick={() => setModalActive(true)}
    />
    {modalActive &&
      <Modal
        show
        onHide={() => setModalActive(false)}
        onClick={(e: MouseEvent) => e.stopPropagation()}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {modalBody || strings.getString('are_you_sure')}
        </Modal.Body>

        <Modal.Footer>
          {loading && <SmallSpinner />}
          <Button
            variant="secondary"
            onClick={() => setModalActive(false)}
          >
            {cancelText || strings.getString('cancel')}  
          </Button>
          <Button
            variant="primary"
            onClick={async () => {
              await onConfirm(() => setModalActive(false));
              if (!closeUsingCallback) setModalActive(false);
            }}
          >
            {confirmText || strings.getString('ok')}
          </Button>
        </Modal.Footer>
      </Modal>
    }
  </>;
};

export default ConfirmButton;