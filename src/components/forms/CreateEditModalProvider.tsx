import React, { useState, useEffect, useContext, ReactNode } from 'react';

import { useLocalization } from '../../localization/LocalizationContext';
import {
    FormFields,
    IncludeData,
    InitialState,
    OnSave,
    Validate,
    ModalTitle,
    Width,
		CreateEditModal,
    
} from './CreateEditModal';
import { FormValue } from './FormFields';
import { ButtonProps, CreateButton, EditButton } from '../buttons/IconButtons';
const out_of_context_error = 'The useError hook should only be used in a child of the CreateEditModalProvider component.';

export type ShowCreateModal = (show?: boolean) => void;
export type ShowEditModal<T, K> = (state: { [key in keyof T]: FormValue } & K) => void;

export type ShowCreateModalButton = ButtonProps;
export const ShowCreateModalButton = (props: ButtonProps) => {
  const { showCreateModal } = useCreateEditModal();

  return (
    <CreateButton
      {...props}
      onClick={() => showCreateModal()}
    />
  )
}
export interface ShowEditModalButtonProps<T, K> extends ButtonProps {
  state: { [key in keyof T]: FormValue } & K;
}
export const ShowEditModalButton = ({ state, ... props }: ShowEditModalButtonProps<T, K>) => {
  const { showEditModal } = useCreateEditModal();

  return (
    <EditButton
      {...props}
      onClick={() => showEditModal(state)}
    />
  )
}

type CreateEditModalContextType<T, K> = {
	showCreateModal: ShowCreateModal;
	showEditModal: ShowEditModal<T, K>;
}

type T = any;
type K = any;
const defaultErrorState: CreateEditModalContextType<T, K> = {
  showCreateModal: () => {
		console.error(out_of_context_error)
	},
  showEditModal:  (state: { [key in keyof T]: FormValue } & K) => {
		console.error(out_of_context_error)
	},
};
export const CreateEditModalContext = React.createContext(defaultErrorState);

export const useCreateEditModal = () => useContext(CreateEditModalContext);


export type CreateEditModalProviderProps<
  T extends FormFields,
  K extends IncludeData<T>
> = {
  initialState: InitialState<T> | K;
  includeData?: K;
  formFields: T;
  onSave?: OnSave<T, K>;
  onCreate?: OnSave<T, K>;
  onUpdate?: OnSave<T, K>;
  validate?: Validate;
  createModalTitle?: ModalTitle;
  editModalTitle?: ModalTitle;
  loading?: boolean;
  dialogClassName?: string;
  width?: Width;
  children: ReactNode;
}
export const CreateEditModalProvider: React.FC<CreateEditModalProviderProps<T, K>> = ({
	createModalTitle,
	editModalTitle,
	formFields,
  initialState,
	loading,
	onCreate,
	onUpdate,
  onSave,
	children,
}) => {
  const [createModalActive, showCreateModal] = useState(false);
  const [instanceInEditModal, showEditModal] = useState<({ [key in keyof T]: FormValue } & K) | null>(null);
  const { strings } = useLocalization();

  return (
    <CreateEditModalContext.Provider
      value={{
				showCreateModal: (show?: boolean) =>
					showCreateModal(typeof show === 'undefined' ? true : show),
				showEditModal,
			}}>
      {children}

			
      {createModalActive && (onCreate || onSave) && (
				<CreateEditModal
					modalTitle={createModalTitle || strings.getString('modal_create')}
					onHide={() => showCreateModal(false)}
					initialState={initialState}
					formFields={formFields}
					loading={loading}
          // @ts-ignore Ignore as Typescript does not recognize that this is allowed
					onSave={onCreate || onSave}
				/>
			)}
      {instanceInEditModal && (onUpdate || onSave) && (
        <CreateEditModal
          show={!!instanceInEditModal}
          modalTitle={editModalTitle || strings.getString('modal_edit')}
          onHide={() => showEditModal(null)}
          initialState={instanceInEditModal}
          formFields={formFields}
          loading={loading}
          // @ts-ignore
          onSave={onUpdate || onSave}
        />
      )}
    </CreateEditModalContext.Provider>
  );
};
