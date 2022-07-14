import React, { useState, useRef, useContext } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
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
} from 'react-icons/ai';
import { FiCopy } from 'react-icons/fi';
import { FaTimes, FaSort, FaSortUp, FaSortDown, FaRegFlag, FaSyncAlt } from 'react-icons/fa';
import { CgTrash, CgNotes, CgSpinner } from 'react-icons/cg';
import { BsArrowsMove, BsPencil } from 'react-icons/bs';
import { BiRightArrow, BiSquare } from 'react-icons/bi';
import { HiOutlineCog, HiOutlineLink } from 'react-icons/hi';
import { VscMenu } from 'react-icons/vsc';
import { RiQuestionnaireLine } from 'react-icons/ri';

import { SmallSpinner } from './LoadingIndicator';
import { LocalizationContext } from '../localization/LocalizationContext';

export const ButtonBase = ({
  onClick,
  loading,
  icon: Icon,
  spin,
  children,
  buttonSize='sm',
  size,
  className,
  ...restProps
}) => (
  <Button
    variant='light'
    size={buttonSize}
    className={`icon-button ${className || ''}`}
    onClick={e => {
      e.stopPropagation();
      e.preventDefault();
      onClick(e);
    }}
    {...restProps}
  >
    {loading 
      ? <CgSpinner style={{ animation: 'spinner-border .75s linear infinite' }}/>
      : Icon && <Icon size={size}/>
    }
    {children && <>&nbsp;</>}
    {children}
  </Button>
);

export const CheckButton = props => <ButtonBase {...props} icon={AiOutlineCheck} />;
export const CopyButton = props => <ButtonBase {...props} icon={FiCopy} />;
export const CloseButton = props => <ButtonBase {...props} icon={FaTimes} />;
export const CogButton = props => <ButtonBase {...props} icon={HiOutlineCog} />;
export const CreateButton = props => <ButtonBase {...props} icon={AiOutlinePlus} />;
export const CreateFolderButton = props => <ButtonBase {...props} icon={AiOutlineFolderAdd} />;
export const CreateSubFolderButton = props => <ButtonBase {...props} icon={AiOutlineArrowRight} />;
export const CreateFileButton = props => <ButtonBase {...props} icon={AiOutlineFileAdd} />;
export const DeleteButton = props => <ButtonBase {...props} icon={CgTrash} />;
export const DownButton = props => <ButtonBase {...props} icon={AiFillCaretDown} />;
export const DownloadButton = props => <ButtonBase {...props} icon={AiOutlineDownload} />;
export const EditButton = props => <ButtonBase {...props} icon={AiFillEdit} />;
export const FlagButton = props => <ButtonBase {...props} icon={FaRegFlag} />;
export const LinkButton = props => <ButtonBase {...props} icon={HiOutlineLink} />;
export const MenuButton = props => <ButtonBase {...props} icon={VscMenu} />;
export const MoveButton = props => <ButtonBase {...props} icon={BsArrowsMove} />;
export const NotesButton = props => <ButtonBase {...props} icon={CgNotes} />;
export const PencilButton = props => <ButtonBase {...props} icon={BsPencil} />;
export const PlayButton = props => <ButtonBase {...props} icon={BiRightArrow} />;
export const SortButton = props => <ButtonBase {...props} icon={FaSort} />;
export const SortUpButton = props => <ButtonBase {...props} icon={FaSortUp} />;
export const SortDownButton = props => <ButtonBase {...props} icon={FaSortDown} />;
export const StopButton = props => <ButtonBase {...props} icon={BiSquare} />;
export const SyncButton = props => <ButtonBase {...props} icon={FaSyncAlt} />;
export const UnCheckButton = props => <ButtonBase {...props} icon={AiOutlineClose} />;
export const UnlockButton = props => <ButtonBase {...props} icon={AiOutlineUnlock} />;
export const UpButton = props => <ButtonBase {...props} icon={AiFillCaretUp} />;
export const UploadButton = props => <ButtonBase {...props} icon={AiOutlineUpload} />;
export const QuestionnaireButton = props => <ButtonBase {...props} icon={RiQuestionnaireLine} />;

export const UploadTextButton = ({ accept, onLoad, ...restProps }) => {
  const inputFile = useRef(null);

  return <>
    <UploadButton
      {...restProps}
      onClick={() => inputFile.current.click()}
    />
    <Form.File
      type="file"
      accept={accept}
      ref={inputFile}
      style={{display: 'none'}}
      onChange={(e) => {
        e.preventDefault();
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = e => {
          onLoad(e.target.result);
          inputFile.current.value = null;
        };

        if (file) {
          reader.readAsText(file);
        }
      }}
    />
  </>;
}
export const ConfirmButton = ({
  modalTitle,
  modalBody,
  confirmText,
  onConfirm,
  loading,
  buttonComponent: ButtonComponent,
  ...props
}) => {
  const [modalActive, setModalActive] = useState(false);
  const { strings } = useContext(LocalizationContext);

  return <>
    <ButtonComponent
      {...props}
      onClick={e => setModalActive(true)}
    />
    {modalActive &&
      <Modal
        show
        onHide={() => setModalActive(false)}
        onClick={e => e.stopPropagation()}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {modalBody || strings.are_you_sure}
        </Modal.Body>

        <Modal.Footer>
          {loading && <SmallSpinner />}
          <Button
            variant="secondary"
            onClick={() => setModalActive(false)}
          >
            {strings.cancel}  
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onConfirm();
              setModalActive(false);
            }}
          >
            {confirmText || strings.ok}
          </Button>
        </Modal.Footer>
      </Modal>
    }
  </>;
};

export const DeleteConfirmButton = ({
  modalTitle,
  modalBody,
  confirmText,
  onDelete,
  loading,
  ...props
}) => {
  const { strings } = useContext(LocalizationContext);
  
  return (
    <ConfirmButton
      {...props}
      modalTitle={modalTitle || strings.delete }
      modalBody={modalBody}
      confirmText={confirmText || strings.delete}
      onConfirm={onDelete}
      buttonComponent={DeleteButton}
    />
  );
}
