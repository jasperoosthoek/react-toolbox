import React, { useRef,  ChangeEvent } from 'react';
import { Button, ButtonProps as ReactBootstrapButtonProps, Form } from 'react-bootstrap';
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
  AiOutlineSave,
} from 'react-icons/ai';
import { IconType } from 'react-icons';
import { FiCopy } from 'react-icons/fi';
import { FaTimes, FaSort, FaSortUp, FaSortDown, FaRegFlag, FaSyncAlt } from 'react-icons/fa';
import { CgTrash, CgNotes, CgSpinner } from 'react-icons/cg';
import { BsArrowsMove, BsCardList, BsPencil } from 'react-icons/bs';
import { BiRightArrow, BiSquare, BiHide, BiShow } from 'react-icons/bi';
import { HiOutlineCog, HiOutlineLink } from 'react-icons/hi';
import { VscMenu } from 'react-icons/vsc';
import { RiQuestionnaireLine, RiDropdownList } from 'react-icons/ri';
import { LuClipboardPaste } from "react-icons/lu";
import { RiResetLeftLine } from "react-icons/ri";

export interface ButtonProps extends ReactBootstrapButtonProps {
  loading?: boolean,
  iconSize?: string,
}

export interface IconButtonProps extends ButtonProps {
  icon: IconType;
}

export const IconButton = ({
  onClick,
  loading,
  icon: Icon,
  iconSize,
  children,
  size = 'sm',
  className,
  ...restProps
}: IconButtonProps ) => (
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
    {loading && <CgSpinner style={{ animation: 'spinner-border .75s linear infinite' }} />}
    {!loading && Icon && typeof Icon === "function" && <Icon size={iconSize} />}
    
    {children && <>&nbsp;</>}
    {children}
  </Button>
);

export const makeIconButton = (icon: IconType) => (props: ButtonProps) => <IconButton {...props} icon={icon} />;
export const CheckButton = makeIconButton(AiOutlineCheck);
export const CopyButton = makeIconButton(FiCopy);
export const PasteButton = makeIconButton(LuClipboardPaste);
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
export const SaveButton = makeIconButton(AiOutlineSave);
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
export const DropdownButton = makeIconButton(RiDropdownList);
export const ResetButton = makeIconButton(RiResetLeftLine);

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
