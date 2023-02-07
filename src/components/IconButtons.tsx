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
import { BsArrowsMove, BsPencil } from 'react-icons/bs';
import { BiRightArrow, BiSquare, BiHide, BiShow } from 'react-icons/bi';
import { HiOutlineCog, HiOutlineLink } from 'react-icons/hi';
import { VscMenu } from 'react-icons/vsc';
import { RiQuestionnaireLine } from 'react-icons/ri';

import { SmallSpinner } from './LoadingIndicator';
import { LocalizationContext } from '../localization/LocalizationContext';

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

export const CheckButton = (props: ButtonProps) => <ButtonBase {...props} icon={AiOutlineCheck} />;
export const CopyButton = (props: ButtonProps) => <ButtonBase {...props} icon={FiCopy} />;
export const CloseButton = (props: ButtonProps) => <ButtonBase {...props} icon={FaTimes} />;
export const CogButton = (props: ButtonProps) => <ButtonBase {...props} icon={HiOutlineCog} />;
export const CreateButton = (props: ButtonProps) => <ButtonBase {...props} icon={AiOutlinePlus} />;
export const CreateFolderButton = (props: ButtonProps) => <ButtonBase {...props} icon={AiOutlineFolderAdd} />;
export const CreateSubFolderButton = (props: ButtonProps) => <ButtonBase {...props} icon={AiOutlineArrowRight} />;
export const CreateFileButton = (props: ButtonProps) => <ButtonBase {...props} icon={AiOutlineFileAdd} />;
export const DeleteButton = (props: ButtonProps) => <ButtonBase {...props} icon={CgTrash} />;
export const DownButton = (props: ButtonProps) => <ButtonBase {...props} icon={AiFillCaretDown} />;
export const DownloadButton = (props: ButtonProps) => <ButtonBase {...props} icon={AiOutlineDownload} />;
export const EditButton = (props: ButtonProps) => <ButtonBase {...props} icon={AiFillEdit} />;
export const FlagButton = (props: ButtonProps) => <ButtonBase {...props} icon={FaRegFlag} />;
export const HideButton = (props: ButtonProps) => <ButtonBase {...props} icon={BiHide} />;
export const LinkButton = (props: ButtonProps) => <ButtonBase {...props} icon={HiOutlineLink} />;
export const MenuButton = (props: ButtonProps) => <ButtonBase {...props} icon={VscMenu} />;
export const MoveButton = (props: ButtonProps) => <ButtonBase {...props} icon={BsArrowsMove} />;
export const NotesButton = (props: ButtonProps) => <ButtonBase {...props} icon={CgNotes} />;
export const PencilButton = (props: ButtonProps) => <ButtonBase {...props} icon={BsPencil} />;
export const PlayButton = (props: ButtonProps) => <ButtonBase {...props} icon={BiRightArrow} />;
export const SearchButton = (props: ButtonProps) => <ButtonBase {...props} icon={AiOutlineSearch} />;
export const ShowButton = (props: ButtonProps) => <ButtonBase {...props} icon={BiShow} />;
export const SortButton = (props: ButtonProps) => <ButtonBase {...props} icon={FaSort} />;
export const SortUpButton = (props: ButtonProps) => <ButtonBase {...props} icon={FaSortUp} />;
export const SortDownButton = (props: ButtonProps) => <ButtonBase {...props} icon={FaSortDown} />;
export const StopButton = (props: ButtonProps) => <ButtonBase {...props} icon={BiSquare} />;
export const SyncButton = (props: ButtonProps) => <ButtonBase {...props} icon={FaSyncAlt} />;
export const UnCheckButton = (props: ButtonProps) => <ButtonBase {...props} icon={AiOutlineClose} />;
export const UnlockButton = (props: ButtonProps) => <ButtonBase {...props} icon={AiOutlineUnlock} />;
export const UpButton = (props: ButtonProps) => <ButtonBase {...props} icon={AiFillCaretUp} />;
export const UploadButton = (props: ButtonProps) => <ButtonBase {...props} icon={AiOutlineUpload} />;
export const QuestionnaireButton = (props: ButtonProps) => <ButtonBase {...props} icon={RiQuestionnaireLine} />;

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
