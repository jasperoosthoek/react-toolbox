import React from 'react';
import { Badge } from 'react-bootstrap';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';

export type CheckIndicatorProps = {
  checked: boolean;
  className?: string; 
}

export const CheckIndicator = ({ checked, className }: CheckIndicatorProps) => (
  <h5 {...className ? { className } : {}}>
    <Badge bg={checked ? 'success' : 'danger'}>
      {checked ? <AiOutlineCheck /> : <AiOutlineClose />}
    </Badge>
  </h5>
);
