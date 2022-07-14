import { Badge } from 'react-bootstrap';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';

export const CheckIndicator = ({ checked, className }) => (
  <h5 className={className}>
    <Badge bg={checked ? 'success' : 'danger'}>
      {checked ? <AiOutlineCheck /> : <AiOutlineClose />}
    </Badge>
  </h5>
);
