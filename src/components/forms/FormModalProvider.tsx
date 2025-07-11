import React, { useState, useContext, ReactNode } from 'react';
import { useLocalization } from '../../localization/LocalizationContext';
import { FormProvider, FormFields, InitialState, OnSubmit, Validate } from './FormProvider';
import { FormModal, ModalTitle, Width } from './FormModal';
import { FormValue } from './FormFields';
import { ButtonProps, CreateButton, EditButton } from '../buttons/IconButtons';

export type ShowCreateModal = (show?: boolean) => void;
export type ShowEditModal<T extends FormFields> = (state: InitialState<T> | null) => void;

export type FormCreateModalButton = ButtonProps;
export const FormCreateModalButton = ({ onClick, ...props }: ButtonProps) => {
  const { showCreateModal, hasProvider } = useFormModal();

  return (
    <CreateButton
      {...props}
      onClick={(e) => {
        // A onClick function was given to CreateButton
        if (onClick) onClick(e);
        // CreateButton is inside a FormModalProvider which can handle
        // showCreateModal. Without the provider, showCreateModal will log an error
        if (hasProvider) showCreateModal();
      }}
    />
  )
}

export interface FormEditModalButtonProps<T extends FormFields> extends ButtonProps {
  state: InitialState<T>;
}

export const FormEditModalButton = <T extends FormFields>({ state, onClick, ...props }: FormEditModalButtonProps<T>) => {
  const { showEditModal, hasProvider } = useFormModal<T>();

  return (
    <EditButton
      {...props}
      onClick={(e) => {
        // A onClick function was given to EditButton
        if (onClick) onClick(e);
        // EditButton is inside a FormModalProvider which can handle
        // showEditModal. Without the provider, showEditModal will log an error
        if (hasProvider) showEditModal(state);
      }}
    />
  )
}

type FormModalContextType<T extends FormFields> = {
  showCreateModal: ShowCreateModal;
  showEditModal: ShowEditModal<T>;
  hasProvider: boolean;
}

const defaultErrorState: FormModalContextType<any> = {
  showCreateModal: () => {
    console.error('The showCreateModal function should only be used in a child of the FormModalProvider component.');
  },
  showEditModal: () => {
    console.error('The showEditModal function should only be used in a child of the FormModalProvider component.');
  },
  hasProvider: false,
};

export const FormModalContext = React.createContext(defaultErrorState);

export const useFormModal = <T extends FormFields>() => useContext(FormModalContext) as FormModalContextType<T>;

export type FormModalProviderProps<T extends FormFields> = {
  formFields: T;
  initialState?: InitialState<T>;
  onSave?: OnSubmit<T>;
  onCreate?: OnSubmit<T>;
  onUpdate?: OnSubmit<T>;
  validate?: Validate;
  createModalTitle?: ModalTitle;
  editModalTitle?: ModalTitle;
  loading?: boolean;
  dialogClassName?: string;
  width?: Width;
  children: ReactNode;
}

export const FormModalProvider = <T extends FormFields>({
  createModalTitle,
  editModalTitle,
  formFields,
  initialState = {} as InitialState<T>,
  validate,
  loading = false,
  onCreate,
  onUpdate,
  onSave,
  dialogClassName,
  width,
  children,
}: FormModalProviderProps<T>) => {
  const [createModalActive, setCreateModalActive] = useState(false);
  const [editModalState, setEditModalState] = useState<InitialState<T> | null>(null);
  const { strings } = useLocalization();

  const handleCreateSubmit: OnSubmit<T> = (state, callback) => {
    const submitHandler = onCreate || onSave;
    if (submitHandler) {
      submitHandler(state, () => {
        setCreateModalActive(false);
        if (callback) callback();
      });
    }
  };

  const handleEditSubmit: OnSubmit<T> = (state, callback) => {
    const submitHandler = onUpdate || onSave;
    if (submitHandler) {
      submitHandler(state, () => {
        setEditModalState(null);
        if (callback) callback();
      });
    }
  };

  return (
    <FormModalContext.Provider
      value={{
        showCreateModal: (show?: boolean) =>
          setCreateModalActive(typeof show === 'undefined' ? true : show),
        showEditModal: (state: InitialState<T> | null) => setEditModalState(state),
        hasProvider: true,
      }}
    >
      {children}
      
      {createModalActive && (onCreate || onSave) && (
        <FormProvider
          formFields={formFields}
          initialState={initialState}
          onSubmit={handleCreateSubmit}
          validate={validate}
          loading={loading}
          resetTrigger={createModalActive}
        >
          <FormModal
            modalTitle={createModalTitle || strings.getString('modal_create')}
            onHide={() => setCreateModalActive(false)}
            dialogClassName={dialogClassName}
            width={width}
          />
        </FormProvider>
      )}
      
      {editModalState && (onUpdate || onSave) && (
        <FormProvider
          formFields={formFields}
          initialState={editModalState}
          onSubmit={handleEditSubmit}
          validate={validate}
          loading={loading}
          resetTrigger={editModalState}
        >
          <FormModal
            show={!!editModalState}
            modalTitle={editModalTitle || strings.getString('modal_edit')}
            onHide={() => setEditModalState(null)}
            dialogClassName={dialogClassName}
            width={width}
          />
        </FormProvider>
      )}
    </FormModalContext.Provider>
  );
};
