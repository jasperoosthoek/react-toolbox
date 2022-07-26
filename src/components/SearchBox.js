import React from 'react';
import { InputGroup, Form } from 'react-bootstrap';

import { useLocalization } from '../localization/LocalizationContext';
import { UnCheckButton, SearchButton } from './IconButtons';

export const SearchBox = ({ className='', value, onChange, onClear, onSearch }) => {
  const { strings } = useLocalization();

  return (<>
    <InputGroup className={className}>
      <Form.Control
        value={value}
        placeholder={strings.search}
        onChange={evt => onChange(evt.target.value)}
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
