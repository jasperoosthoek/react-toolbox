import React, { ReactElement } from 'react';
import { FormControlProps, FormCheckProps } from 'react-bootstrap';

export type FormValue =
  | boolean
  | string
  | number
  | (string | number)[]                       // For arrays of primitives
  | Record<string, string | number | null>    // For FormDateRange and similar
  | object[]                                  // For FormFile and similar
  | null;

// export type FormOnChange = <T extends { [key: string]: FormValue }>(value: FormValue, formData: T) => Partial<T>;
export type FormOnChange = (
  ((value: FormValue, formData?: any) => any)
);

export type FormComponentProps = {
  name: string;
  label?: ReactElement | string;
  placeholder?: string;
  required?: boolean;
}

export type DisabledProps = {
  list: any[];
  value: string | number;
  state: any;
  initialState: any;
  initialValue: any;
}