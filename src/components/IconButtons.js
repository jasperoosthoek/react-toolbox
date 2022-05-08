import React, { useState, useRef, useContext } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import {
    AiFillCaretDown,
    AiFillCaretUp,
    AiFillEdit,
    AiOutlinePlus,
    AiOutlineUpload,
    AiOutlineFileAdd,
    AiOutlineFolderAdd,
    AiOutlineArrowRight,
} from 'react-icons/ai';
import { FiCopy } from "react-icons/fi";
import { FaTimes } from "react-icons/fa";
import { CgTrash } from 'react-icons/cg';
import { BsArrowsMove } from 'react-icons/bs';

import { SmallSpinner } from './LoadingIndicator';
import { LocalizationContext } from '../localization/LocalizationContext';


const ButtonBase = ({ onClick, ...props }) => (
    <Button
        variant="light"
        size="sm"
        onClick={e => {
            e.stopPropagation();
            e.preventDefault();
            onClick(e);
        }}
        {...props}
    />
);

export const MoveButton = props => <ButtonBase {...props}><BsArrowsMove /></ButtonBase>;
export const UpButton = props => <ButtonBase {...props}><AiFillCaretUp /></ButtonBase>;
export const DownButton = props => <ButtonBase {...props}><AiFillCaretDown /></ButtonBase>;
export const CreateButton = props => <ButtonBase {...props}><AiOutlinePlus /></ButtonBase>;
export const CreateFolderButton = props => <ButtonBase {...props}><AiOutlineFolderAdd /></ButtonBase>;
export const CreateSubFolderButton = props => <ButtonBase {...props}><AiOutlineArrowRight /><AiOutlineFolderAdd /></ButtonBase>;
export const CreateFileButton = props => <ButtonBase {...props}><AiOutlineFileAdd /></ButtonBase>;
export const UploadButton = props => <ButtonBase {...props}><AiOutlineUpload /></ButtonBase>;
export const CloseButton = props => <ButtonBase {...props}><FaTimes /></ButtonBase>;


export const EditButton = props => <ButtonBase {...props}><AiFillEdit /></ButtonBase>;
export const DeleteButton = props => <ButtonBase {...props}><CgTrash /></ButtonBase>;
export const CopyButton = props => <ButtonBase {...props}><FiCopy /></ButtonBase>;

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
export const DeleteConfirmButton = ({ modalTitle, modalBody, onDelete, loading, ...props }) => {
  const { strings } = useContext(LocalizationContext);
  const [modalActive, setModalActive] = useState(false);

    return <>
    <DeleteButton
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
          <Modal.Title>{modalTitle || strings.delete}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {modalBody || strings.are_you_sure }
        </Modal.Body>

        <Modal.Footer>
          {loading && <SmallSpinner />}
          <Button
            variant="secondary"
            onClick={() => setModalActive(false)}
          >
            Cancel
            </Button>
          <Button
            variant="primary"
            onClick={() => {
              onDelete();
              setModalActive(false);
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    }
  </>;
};