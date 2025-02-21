import React, { ChangeEvent, ReactNode } from 'react';
import { InputGroup, Form, FormControlProps } from 'react-bootstrap';

import { useLocalization } from '../../localization/LocalizationContext';
import { UnCheckButton, SearchButton } from '../buttons/IconButtons';

export type SearchBoxProps = {
  className?: string;
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  onSearch?: () => void;
  label?: ReactNode | string | number;
  placeholder?: string | false;
}
export const SearchBox = ({
  className='',
  value,
  onChange,
  onClear,
  onSearch,
  label,
  placeholder, 
}: SearchBoxProps) => {
  const { strings } = useLocalization();

  return (
    <Form.Group>
      {label && <Form.Label>{label}</Form.Label>}
      
      <InputGroup {...className ? { className } : {}}>
        <Form.Control
          value={value}
          placeholder={
            placeholder
              ? placeholder
              : placeholder !== false && strings.getString('search')
          }
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        />
        {onClear &&
          <UnCheckButton
            variant="outline-secondary"
            onClick={() => onClear()}
          />
        }
        {onSearch &&
          <SearchButton
            variant="outline-secondary"
            onClick={() => onSearch()}
          />
        }
      </InputGroup>
    </Form.Group>
  )
}
