import React, { ReactElement } from 'react';
import { FormControlProps, FormCheckProps } from 'react-bootstrap';

export type FormValue = boolean | string | string[] | number | number[];

// export type FormOnChange = <T extends { [key: string]: FormValue }>(value: FormValue, formData: T) => Partial<T>;
export type FormOnChange = (
  ((value: FormValue, formData?: any) => any)
);

export type FormComponentProps = {
  keyName?: string;
  pristine?: boolean;
  isInvalid?: boolean;
  value: FormValue;
  state?: any;
  setState?: (newState: any) => void;
  onChange?: FormOnChange;
  initialState?: any;
  initialValue?: any;
  label?: ReactElement | string;
}

export type FormType = {
  state: any;
  setState: (obj: any) => void;
  initialState: any;
  initialValue: any;
  keyName: string;
  pristine: boolean;
}

export interface FormInputProps extends Omit<FormControlProps, 'onChange'>, FormType {
  onChange: (value: FormValue) => void;
  controlId?: string;
  label?: ReactElement;
  onEnter?: () => void;
  rows?: number;
}



export type DisabledProps = {
  list: any[];
  value: string | number;
  state: any;
  initialState: any;
  initialValue: any;
}



