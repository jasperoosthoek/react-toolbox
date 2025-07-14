import React, { useState, useContext, ReactNode } from 'react';
import { useLocalization } from '../../localization/LocalizationContext';
import { FormProvider, FormFields, InitialState, OnSubmit, Validate } from './FormProvider';
import { FormModal, ModalTitle, Width } from './FormModal';
import { FormValue } from './FormFields';
import { ButtonProps, CreateButton, EditButton } from '../buttons/IconButtons';

// Add the IncludeData type from master version
export type IncludeData<T extends FormFields> = {
  [key in Exclude<string, keyof T>]: any;
}

export type ShowCreateModal = (show?: boolean) => void;
export type ShowEditModal<T, K> = (state: ({ [key in keyof T]: FormValue } & K) | null) => void;

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
  showEditModal: (state: ({ [key in keyof T]: FormValue } & K) | null) => {
    console.error('The showEditModal function should only be used in a child of the FormModalProvider component.');
  },
  hasProvider: false,
};

export const FormModalContext = React.createContext(defaultErrorState);

export const useFormModal = () => useContext(FormModalContext);

export type FormCreateModalButton = ButtonProps;
export const FormCreateModalButton = ({ onClick, ...props }: ButtonProps) => {
  const context = useContext(FormModalContext);
  
  return (
    <CreateButton
      {...props}
      onClick={(e) => {
        // A onClick function was given to CreateButton
        if (onClick) onClick(e);
        
        // Check if we have a provider context
        if (!context || !context.hasProvider) {
          console.error('The showCreateModal function should only be used in a child of the FormModalProvider component.');
          return;
        }
        
        // CreateButton is inside a FormModalProvider which can handle showCreateModal
        context.showCreateModal();
      }}
    />
  )
}

export interface FormEditModalButtonProps<T, K> extends ButtonProps {
  state: { [key in keyof T]: FormValue } & K;
}

export const FormEditModalButton = ({ state, onClick, ...props }: FormEditModalButtonProps<T, K>) => {
  const context = useContext(FormModalContext);
  
  return (
    <EditButton
      {...props}
      onClick={(e) => {
        // A onClick function was given to EditButton
        if (onClick) onClick(e);
        
        // Check if we have a provider context
        if (!context || !context.hasProvider) {
          console.error('The showEditModal function should only be used in a child of the FormModalProvider component.');
          return;
        }
        
        // EditButton is inside a FormModalProvider which can handle showEditModal
        context.showEditModal(state);
      }}
    />
  )
}

export type FormModalProviderProps<
  T extends FormFields,
  K extends IncludeData<T>
> = {
  formFields: T;
  initialState?: InitialState<T> | K;
  includeData?: K;
  onSave?: any;
  onCreate?: any;
  onUpdate?: any;
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
  includeData,
  validate,
  loading = false,
  onCreate,
  onUpdate,
  onSave,
  dialogClassName,
  width,
  children,
}) => {
  const [createModalActive, setCreateModalActive] = useState(false);
  const [editModalState, setEditModalState] = useState<({ [key in keyof T]: FormValue } & K) | null>(null);
  const { strings } = useLocalization();
  
  // Provide default values
  const safeIncludeData = (includeData || {}) as K;

  const handleCreateSubmit: OnSubmit<T> = (state, callback) => {
    // Priority: onCreate > onSave fallback
    const submitHandler = onCreate || onSave;
    if (submitHandler) {
      // Merge form state with includeData
      submitHandler(
        {
          ...state,
          ...safeIncludeData,
        } as { [key in keyof T]: FormValue } & K,
        () => {
          setCreateModalActive(false);
          if (callback) callback();
        }
      );
    } else {
      // No handler provided, just close modal
      setCreateModalActive(false);
      if (callback) callback();
    }
  };

  const handleEditSubmit: OnSubmit<T> = (state, callback) => {
    // Priority: onUpdate > onSave fallback
    const submitHandler = onUpdate || onSave;
    if (submitHandler) {
      // Merge form state with includeData
      submitHandler(
        {
          ...state,
          ...safeIncludeData,
        } as { [key in keyof T]: FormValue } & K,
        () => {
          setEditModalState(null);
          if (callback) callback();
        }
      );
    } else {
      // No handler provided, just close modal
      setEditModalState(null);
      if (callback) callback();
    }
  };

  // Convert entity state to form initial state
  const getFormInitialState = (entityState: ({ [key in keyof T]: FormValue } & K) | null): InitialState<T> => {
    if (!entityState) {
      return initialState as InitialState<T>;
    }
    return entityState as unknown as InitialState<T>;
  };

  return (
    <FormModalContext.Provider
      value={{
        showCreateModal: (show?: boolean) =>
          setCreateModalActive(typeof show === 'undefined' ? true : show),
        showEditModal: (state: ({ [key in keyof T]: FormValue } & K) | null) => setEditModalState(state),
        hasProvider: true,
      }}
    >
      {children}
      
      {createModalActive && (onCreate || onSave) && (
        <FormProvider
          formFields={formFields}
          initialState={(initialState || {}) as InitialState<T>}
          onSubmit={handleCreateSubmit}
          validate={validate}
          loading={loading}
          resetTrigger={createModalActive}
        >
          <FormModal
            show={createModalActive}
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
          initialState={getFormInitialState(editModalState)}
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
