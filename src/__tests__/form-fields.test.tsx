import React from 'react';
import { FormValue, FormOnChange, FormComponentProps, FormType, FormInputProps, DisabledProps } from '../components/forms/FormFields';

describe('FormFields Types and Interfaces', () => {
  describe('FormValue Type', () => {
    it('should accept boolean values', () => {
      const value: FormValue = true;
      expect(typeof value).toBe('boolean');
    });

    it('should accept string values', () => {
      const value: FormValue = 'test string';
      expect(typeof value).toBe('string');
    });

    it('should accept string array values', () => {
      const value: FormValue = ['test', 'array'];
      expect(Array.isArray(value)).toBe(true);
      expect(typeof value[0]).toBe('string');
    });

    it('should accept number values', () => {
      const value: FormValue = 42;
      expect(typeof value).toBe('number');
    });

    it('should accept number array values', () => {
      const value: FormValue = [1, 2, 3];
      expect(Array.isArray(value)).toBe(true);
      expect(typeof value[0]).toBe('number');
    });
  });

  describe('FormOnChange Type', () => {
    it('should accept function that takes value and formData', () => {
      const onChange: FormOnChange = (value: FormValue, formData?: any) => {
        expect(value).toBeDefined();
        return { updated: true };
      };

      const result = onChange('test', { existing: 'data' });
      expect(result).toEqual({ updated: true });
    });

    it('should handle function without formData parameter', () => {
      const onChange: FormOnChange = (value: FormValue) => {
        return { value };
      };

      const result = onChange('test');
      expect(result).toEqual({ value: 'test' });
    });
  });

  describe('FormComponentProps Interface', () => {
    it('should create valid FormComponentProps object', () => {
      const props: FormComponentProps = {
        keyName: 'testKey',
        pristine: true,
        isInvalid: false,
        value: 'test value',
        state: { test: 'state' },
        setState: jest.fn(),
        onChange: jest.fn(),
        initialState: { initial: 'state' },
        initialValue: 'initial',
        label: 'Test Label'
      };

      expect(props.keyName).toBe('testKey');
      expect(props.pristine).toBe(true);
      expect(props.isInvalid).toBe(false);
      expect(props.value).toBe('test value');
      expect(props.label).toBe('Test Label');
    });

    it('should work with minimal required props', () => {
      const props: FormComponentProps = {
        value: 'test'
      };

      expect(props.value).toBe('test');
      expect(props.keyName).toBeUndefined();
      expect(props.pristine).toBeUndefined();
    });

    it('should handle React element label', () => {
      const labelElement = React.createElement('span', {}, 'React Label');
      const props: FormComponentProps = {
        value: 'test',
        label: labelElement
      };

      expect(props.label).toBe(labelElement);
    });
  });

  describe('FormType Interface', () => {
    it('should create valid FormType object', () => {
      const mockSetState = jest.fn();
      const formType: FormType = {
        state: { field1: 'value1' },
        setState: mockSetState,
        initialState: { field1: '' },
        initialValue: '',
        keyName: 'field1',
        pristine: false
      };

      expect(formType.state).toEqual({ field1: 'value1' });
      expect(formType.setState).toBe(mockSetState);
      expect(formType.initialState).toEqual({ field1: '' });
      expect(formType.initialValue).toBe('');
      expect(formType.keyName).toBe('field1');
      expect(formType.pristine).toBe(false);
    });

    it('should handle setState function calls', () => {
      const mockSetState = jest.fn();
      const formType: FormType = {
        state: { field1: 'value1' },
        setState: mockSetState,
        initialState: { field1: '' },
        initialValue: '',
        keyName: 'field1',
        pristine: true
      };

      formType.setState({ field1: 'new value' });
      expect(mockSetState).toHaveBeenCalledWith({ field1: 'new value' });
    });
  });

  describe('FormInputProps Interface', () => {
    it('should create valid FormInputProps object', () => {
      const mockOnChange = jest.fn();
      const mockSetState = jest.fn();
      const mockOnEnter = jest.fn();

      const props: FormInputProps = {
        state: { field1: 'value1' },
        setState: mockSetState,
        initialState: { field1: '' },
        initialValue: '',
        keyName: 'field1',
        pristine: true,
        onChange: mockOnChange,
        controlId: 'test-control',
        label: React.createElement('label', {}, 'Test Label'),
        onEnter: mockOnEnter,
        rows: 5
      };

      expect(props.state).toEqual({ field1: 'value1' });
      expect(props.setState).toBe(mockSetState);
      expect(props.onChange).toBe(mockOnChange);
      expect(props.controlId).toBe('test-control');
      expect(props.onEnter).toBe(mockOnEnter);
      expect(props.rows).toBe(5);
    });

    it('should handle onChange function calls', () => {
      const mockOnChange = jest.fn();
      const mockSetState = jest.fn();

      const props: FormInputProps = {
        state: { field1: 'value1' },
        setState: mockSetState,
        initialState: { field1: '' },
        initialValue: '',
        keyName: 'field1',
        pristine: true,
        onChange: mockOnChange
      };

      props.onChange('new value');
      expect(mockOnChange).toHaveBeenCalledWith('new value');
    });

    it('should handle onEnter function calls', () => {
      const mockOnEnter = jest.fn();
      const mockSetState = jest.fn();

      const props: FormInputProps = {
        state: { field1: 'value1' },
        setState: mockSetState,
        initialState: { field1: '' },
        initialValue: '',
        keyName: 'field1',
        pristine: true,
        onChange: jest.fn(),
        onEnter: mockOnEnter
      };

      if (props.onEnter) {
        props.onEnter();
      }
      expect(mockOnEnter).toHaveBeenCalled();
    });
  });

  describe('DisabledProps Interface', () => {
    it('should create valid DisabledProps object', () => {
      const props: DisabledProps = {
        list: [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }],
        value: 'test-value',
        state: { current: 'state' },
        initialState: { initial: 'state' },
        initialValue: 'initial-value'
      };

      expect(props.list).toHaveLength(2);
      expect(props.list[0]).toEqual({ id: 1, name: 'Item 1' });
      expect(props.value).toBe('test-value');
      expect(props.state).toEqual({ current: 'state' });
      expect(props.initialState).toEqual({ initial: 'state' });
      expect(props.initialValue).toBe('initial-value');
    });

    it('should handle different value types', () => {
      const stringProps: DisabledProps = {
        list: [],
        value: 'string-value',
        state: {},
        initialState: {},
        initialValue: 'initial'
      };

      const numberProps: DisabledProps = {
        list: [],
        value: 42,
        state: {},
        initialState: {},
        initialValue: 'initial'
      };

      expect(typeof stringProps.value).toBe('string');
      expect(typeof numberProps.value).toBe('number');
    });

    it('should handle empty and populated lists', () => {
      const emptyListProps: DisabledProps = {
        list: [],
        value: 'test',
        state: {},
        initialState: {},
        initialValue: 'initial'
      };

      const populatedListProps: DisabledProps = {
        list: [1, 2, 3, 4, 5],
        value: 'test',
        state: {},
        initialState: {},
        initialValue: 'initial'
      };

      expect(emptyListProps.list).toHaveLength(0);
      expect(populatedListProps.list).toHaveLength(5);
    });
  });

  describe('Type Compatibility', () => {
    it('should allow FormValue in FormComponentProps', () => {
      const stringValue: FormValue = 'string';
      const numberValue: FormValue = 42;
      const booleanValue: FormValue = true;
      const arrayValue: FormValue = ['a', 'b'];

      const props1: FormComponentProps = { value: stringValue };
      const props2: FormComponentProps = { value: numberValue };
      const props3: FormComponentProps = { value: booleanValue };
      const props4: FormComponentProps = { value: arrayValue };

      expect(props1.value).toBe('string');
      expect(props2.value).toBe(42);
      expect(props3.value).toBe(true);
      expect(props4.value).toEqual(['a', 'b']);
    });

    it('should allow FormOnChange in FormComponentProps', () => {
      const onChange: FormOnChange = (value) => ({ newValue: value });
      const props: FormComponentProps = {
        value: 'test',
        onChange
      };

      expect(props.onChange).toBe(onChange);
      if (props.onChange) {
        const result = props.onChange('new value');
        expect(result).toEqual({ newValue: 'new value' });
      }
    });
  });
});
