import React, { useContext, ReactElement } from 'react';

import { LocalizationContext } from '../../localization/LocalizationContext';
import { ButtonProps, DeleteButton } from './IconButtons';
import ConfirmButton from './ConfirmButton';

export interface DeleteConfirmButtonProps extends ButtonProps {
  modalTitle?: ReactElement | string;
  modalBody?: ReactElement | string;
  confirmText?: ReactElement | string;
  onDelete: () => void;
}

const DeleteConfirmButton = ({
  modalTitle,
  modalBody,
  confirmText,
  onDelete,
  ...props
}: DeleteConfirmButtonProps) => {
  const { strings } = useContext(LocalizationContext);
  return (
    <ConfirmButton
      {...props}
      modalTitle={modalTitle || strings.getString('delete') }
      modalBody={modalBody || strings.getString('are_you_sure')}
      confirmText={confirmText || strings.getString('delete')}
      onConfirm={onDelete}
      buttonComponent={DeleteButton}
    />
  );
}

export default DeleteConfirmButton;
