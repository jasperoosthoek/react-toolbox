import React, { useState, useRef, useContext, ChangeEvent, MouseEvent } from 'react';
import { Button, ButtonProps as ReactBootstrapButtonProps, Modal, Form } from 'react-bootstrap';
import {
  AiFillCaretDown,
  AiFillCaretUp,
  AiFillEdit,
  AiOutlinePlus,
  AiOutlineUpload,
  AiOutlineDownload,
  AiOutlineFileAdd,
  AiOutlineFolderAdd,
  AiOutlineArrowRight,
  AiOutlineUnlock,
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineSearch,
} from 'react-icons/ai';
import { IconType } from 'react-icons';
import { FiCopy } from 'react-icons/fi';
import { FaTimes, FaSort, FaSortUp, FaSortDown, FaRegFlag, FaSyncAlt } from 'react-icons/fa';
import { CgTrash, CgNotes, CgSpinner } from 'react-icons/cg';
import { BsArrowsMove, BsCardList, BsPencil } from 'react-icons/bs';
import { BiRightArrow, BiSquare, BiHide, BiShow } from 'react-icons/bi';
import { HiOutlineCog, HiOutlineLink } from 'react-icons/hi';
import { VscMenu } from 'react-icons/vsc';
import { RiQuestionnaireLine } from 'react-icons/ri';

import { SmallSpinner } from '../indicators/LoadingIndicator';
import { LocalizationContext } from '../../localization/LocalizationContext';

export interface ButtonProps extends ReactBootstrapButtonProps {
  loading?: boolean,
  iconSize?: string,
}
export type IconButton = (props: ButtonProps) => typeof Button;

export interface ButtonBaseProps extends ButtonProps {
  icon: IconType;
}

export const ButtonBase = ({
  onClick,
  loading,
  icon: Icon,
  iconSize,
  children,
  size = 'sm',
  className,
  ...restProps
}: ButtonBaseProps) => (
  <Button
    variant='light'
    size={size}
    className={`icon-button ${className || ''}`}
    onClick={e => {
      e.stopPropagation();
      e.preventDefault();
      if (onClick) onClick(e);
    }}
    {...restProps}
  >
    {loading 
      ? <CgSpinner style={{ animation: 'spinner-border .75s linear infinite' }}/>
      : Icon && <Icon size={iconSize}/>
    }
    {children && <>&nbsp;</>}
    {children}
  </Button>
);

export const makeIconButton = (icon: IconType) => (props: ButtonProps) => <ButtonBase {...props} icon={icon} />;
export const CheckButton = makeIconButton(AiOutlineCheck);
export const CopyButton = makeIconButton(FiCopy);
export const CloseButton = makeIconButton(FaTimes);
export const CogButton = makeIconButton(HiOutlineCog);
export const CreateButton = makeIconButton(AiOutlinePlus);
export const CreateFolderButton = makeIconButton(AiOutlineFolderAdd);
export const CreateSubFolderButton = makeIconButton(AiOutlineArrowRight);
export const CreateFileButton = makeIconButton(AiOutlineFileAdd);
export const DeleteButton = makeIconButton(CgTrash);
export const DownButton = makeIconButton(AiFillCaretDown);
export const DownloadButton = makeIconButton(AiOutlineDownload);
export const EditButton = makeIconButton(AiFillEdit);
export const FlagButton = makeIconButton(FaRegFlag);
export const HideButton = makeIconButton(BiHide);
export const LinkButton = makeIconButton(HiOutlineLink);
export const ListButton = makeIconButton(BsCardList);
export const MenuButton = makeIconButton(VscMenu);
export const MoveButton = makeIconButton(BsArrowsMove);
export const NotesButton = makeIconButton(CgNotes);
export const PencilButton = makeIconButton(BsPencil);
export const PlayButton = makeIconButton(BiRightArrow);
export const SearchButton = makeIconButton(AiOutlineSearch);
export const ShowButton = makeIconButton(BiShow);
export const SortButton = makeIconButton(FaSort);
export const SortUpButton = makeIconButton(FaSortUp);
export const SortDownButton = makeIconButton(FaSortDown);
export const StopButton = makeIconButton(BiSquare);
export const SyncButton = makeIconButton(FaSyncAlt);
export const UnCheckButton = makeIconButton(AiOutlineClose);
export const UnlockButton = makeIconButton(AiOutlineUnlock);
export const UpButton = makeIconButton(AiFillCaretUp);
export const UploadButton = makeIconButton(AiOutlineUpload);
export const QuestionnaireButton = makeIconButton(RiQuestionnaireLine);

export interface UploadTextButtonProps extends ButtonProps {
  accept?: string;
  onLoadFile: (result: string | ArrayBuffer) => void;
}
export const UploadTextButton = ({ accept, onLoadFile, ...restProps }: UploadTextButtonProps) => {
  const inputFile = useRef<HTMLInputElement>(null);
  
  return <>
    <UploadButton
      {...restProps}
      onClick={() => inputFile?.current?.click()}
    />
    <Form.Control
      type="file"
      accept={accept}
      ref={inputFile}
      style={{display: 'none'}}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const reader = new FileReader();
        reader.onload = e => {
          if (e?.target?.result) onLoadFile(e.target.result);
          if (inputFile.current) inputFile.current.value = '';
        };
        
        const files = e?.target?.files;
        if (files) {
          reader.readAsText(files[0]);
        }
      }}
    />
  </>;
}

export interface ConfirmButtonProps extends ButtonProps {
  modalTitle: string;
  modalBody: string;
  confirmText: string;
  onConfirm: () => void;
  buttonComponent: typeof Button,
}

export const ConfirmButton = ({
  modalTitle,
  modalBody,
  confirmText,
  onConfirm,
  buttonComponent: ButtonComponent,
  loading,
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
            {strings.getString('cancel')}  
          </Button>
          <Button
            variant="primary"
            onClick={async () => {
              await onConfirm();
              setModalActive(false);
            }}
          >
            {confirmText || strings.getString('ok')}
          </Button>
        </Modal.Footer>
      </Modal>
    }
  </>;
};

export interface DeleteConfirmButtonProps extends ButtonProps {
  modalTitle: string;
  modalBody: string;
  confirmText: string;
  onDelete: () => void;
}
export const DeleteConfirmButton = ({
  modalTitle,
  modalBody,
  confirmText,
  onDelete,
  loading,
  ...props
}: DeleteConfirmButtonProps) => {
  const { strings } = useContext(LocalizationContext);
  
  return (
    <ConfirmButton
      {...props}
      modalTitle={modalTitle || strings.getString('delete') }
      modalBody={modalBody}
      confirmText={confirmText || strings.getString('delete')}
      onConfirm={onDelete}
      buttonComponent={DeleteButton}
    />
  );
}
