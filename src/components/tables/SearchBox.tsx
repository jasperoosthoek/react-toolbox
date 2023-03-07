import React, { ChangeEvent } from 'react';
import { InputGroup, Form, FormControlProps } from 'react-bootstrap';

import { useLocalization } from '../../localization/LocalizationContext';
import { UnCheckButton, SearchButton } from '../buttons/IconButtons';

export type SearchBoxProps = {
  className?: string;
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  onSearch?: () => void;
}
export const SearchBox = ({ className='', value, onChange, onClear, onSearch }: SearchBoxProps) => {
  const { strings } = useLocalization();

  return (<>
    <InputGroup {...className ? { className } : {}}>
      <Form.Control
        value={value}
        placeholder={strings.getString('search')}
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
    </InputGroup></>
  )
}
