import React, { useState, useContext, ReactNode } from 'react';

import { useLocalization } from '../../localization/LocalizationContext';
import {
    FormFields,
    IncludeData,
    InitialState,
    OnSave,
    Validate,
    ModalTitle,
    Width,
		FormModal,
    
} from './FormModal';
import { FormValue } from './FormFields';
import { ButtonProps, CreateButton, EditButton } from '../buttons/IconButtons';

export type ShowCreateModal = (show?: boolean) => void;
export type ShowEditModal<T, K> = (state: { [key in keyof T]: FormValue } & K) => void;

export type FormCreateModalButton = ButtonProps;
export const FormCreateModalButton = ({ onClick, ...props }: ButtonProps) => {
  const { showCreateModal, hasProvider } = useFormModal();

  return (
    <CreateButton
      {...props}
      onClick={(e) => {
        // A onClick function was given to CreateButton
        if (onClick) onClick(e);
        // CreateButton is inside a CreateEditButtonProvider which can handle
        // showCreateModal. Without the provider, showCreateModal will log an error
        if (hasProvider) showCreateModal();
      }}
    />
  )
}
export interface FormEditModalButtonProps<T, K> extends ButtonProps {
  state: { [key in keyof T]: FormValue } & K;
}
export const FormEditModalButton = ({ state, onClick, ... props }: FormEditModalButtonProps<T, K>) => {
  const { showEditModal, hasProvider } = useFormModal();

  return (
    <EditButton
      {...props}
      onClick={(e) => {
        // A onClick function was given to CreateButton
        if (onClick) onClick(e);
        // CreateButton is inside a CreateEditButtonProvider which can handle
        // showEditModal. Without the provider, showEditModal will log an error
        if (hasProvider) showEditModal(state);
      }}
    />
  )
}

type FormModalContextType<T, K> = {
	showCreateModal: ShowCreateModal;
	showEditModal: ShowEditModal<T, K>;
  hasProvider: boolean;
}

type T = any;
type K = any;
const defaultErrorState: FormModalContextType<T, K> = {
  showCreateModal: () => {
		console.error('The showCreateModal function should only be used in a child of the FormModalProvider component.');
	},
  showEditModal: (state: { [key in keyof T]: FormValue } & K) => {
		console.error('The showEditModal function should only be used in a child of the FormModalProvider component.');
	},
  hasProvider: false,
};
export const FormModalContext = React.createContext(defaultErrorState);

export const useFormModal = () => useContext(FormModalContext);


export type FormModalProviderProps<
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
export const FormModalProvider: React.FC<FormModalProviderProps<T, K>> = ({
	createModalTitle,
	editModalTitle,
	formFields,
  initialState,
	loading,
	onCreate,
	onUpdate,
  onSave,
  dialogClassName,
	children,
}) => {
  const [createModalActive, showCreateModal] = useState(false);
  const [instanceInEditModal, showEditModal] = useState<({ [key in keyof T]: FormValue } & K) | null>(null);
  const { strings } = useLocalization();
  return (
    <FormModalContext.Provider
      value={{
				showCreateModal: (show?: boolean) =>
					showCreateModal(typeof show === 'undefined' ? true : show),
				showEditModal,
        hasProvider: true,
			}}>
      {children}
			
      {createModalActive && (onCreate || onSave) && (
				<FormModal
					modalTitle={createModalTitle || strings.getString('modal_create')}
					onHide={() => showCreateModal(false)}
					initialState={initialState}
					formFields={formFields}
					loading={loading}
          // @ts-ignore Ignore as Typescript does not recognize that this is allowed
					onSave={onCreate || onSave}
          dialogClassName={dialogClassName}
				/>
			)}
      {instanceInEditModal && (onUpdate || onSave) && (
        <FormModal
          show={!!instanceInEditModal}
          modalTitle={editModalTitle || strings.getString('modal_edit')}
          onHide={() => showEditModal(null)}
          initialState={instanceInEditModal}
          formFields={formFields}
          loading={loading}
          // @ts-ignore
          onSave={onUpdate || onSave}
          dialogClassName={dialogClassName}
        />
      )}
    </FormModalContext.Provider>
  );
};
