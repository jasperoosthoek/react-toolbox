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
} from 'react-icons/ai';
import { FiCopy } from 'react-icons/fi';
import { FaTimes, FaSort, FaSortUp, FaSortDown, FaRegFlag } from 'react-icons/fa';
import { CgTrash, CgNotes, CgSpinner } from 'react-icons/cg';
import { BsArrowsMove, BsPencil } from 'react-icons/bs';
import { BiRightArrow, BiSquare } from 'react-icons/bi';
import { HiOutlineCog, HiOutlineLink } from 'react-icons/hi';
import { VscMenu } from 'react-icons/vsc';

import { SmallSpinner } from './LoadingIndicator';
import { LocalizationContext } from '../localization/LocalizationContext';

export const ButtonBase = ({ onClick, loading, icon: Icon, children, size, ...props }) => (
  <Button
    variant='light'
    size='sm'
    onClick={e => {
      e.stopPropagation();
      e.preventDefault();
      onClick(e);
    }}
    {...props}
  >
    {loading ? <CgSpinner style={{ animation: 'spinner-border .75s linear infinite' }}/> : Icon && <Icon size={size}/>}
    {children && <>&nbsp;</>}
    {children}
  </Button>
);

export const MoveButton = props => <ButtonBase {...props} icon={BsArrowsMove} />;
export const UpButton = props => <ButtonBase {...props} icon={AiFillCaretUp} />;
export const DownButton = props => <ButtonBase {...props} icon={AiFillCaretDown} />;
export const CreateButton = props => <ButtonBase {...props} icon={AiOutlinePlus} />;
export const CreateFolderButton = props => <ButtonBase {...props} icon={AiOutlineFolderAdd} />;
export const CreateSubFolderButton = props => <ButtonBase {...props} icon={AiOutlineArrowRight} />;
export const CreateFileButton = props => <ButtonBase {...props} icon={AiOutlineFileAdd} />;
export const UploadButton = props => <ButtonBase {...props} icon={AiOutlineUpload} />;
export const DownloadButton = props => <ButtonBase {...props} icon={AiOutlineDownload} />;
export const UnlockButton = props => <ButtonBase {...props} icon={AiOutlineUnlock} />;
export const PlayButton = props => <ButtonBase {...props} icon={BiRightArrow} />;
export const StopButton = props => <ButtonBase {...props} icon={BiSquare} />;
export const CheckButton = props => <ButtonBase {...props} icon={AiOutlineCheck} />;
export const CloseButton = props => <ButtonBase {...props} icon={FaTimes} />;
export const SortButton = props => <ButtonBase {...props} icon={FaSort} />;
export const SortUpButton = props => <ButtonBase {...props} icon={FaSortUp} />;
export const SortDownButton = props => <ButtonBase {...props} icon={FaSortDown} />;
export const MenuButton = props => <ButtonBase {...props} icon={VscMenu} />;
export const CogButton = props => <ButtonBase {...props} icon={HiOutlineCog} />;
export const FlagButton = props => <ButtonBase {...props} icon={FaRegFlag} />;
export const NotesButton = props => <ButtonBase {...props} icon={CgNotes} />;
export const PencilButton = props => <ButtonBase {...props} icon={BsPencil} />;
export const LinkButton = props => <ButtonBase {...props} icon={HiOutlineLink} />;

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

export const EditButton = props => <ButtonBase {...props} icon={AiFillEdit} />;
export const DeleteButton = props => <ButtonBase {...props} icon={CgTrash} />;
export const CopyButton = props => <ButtonBase {...props} icon={FiCopy} />;

export const ConfirmButton = ({ modalTitle, modalBody, confirmText, onConfirm, loading, button: ButtonComponent, ...props }) => {
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
          {modalBody}
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
      modalBody={modalBody || strings.are_you_sure}
      confirmText={confirmText || strings.delete}
      onConfirm={onDelete}
      button={DeleteButton}
    />
  );
}
