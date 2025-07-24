import React, {
  useEffect,
  useState,
  forwardRef,
  useReducer,
  ReactElement,
  ReactNode,
  ChangeEvent,
  useMemo,
  Ref,
} from 'react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import {
  Table,
  Col,
  Row,
  InputGroup,
  Form,
  Button,
  ButtonProps,
  ButtonGroup,
  Dropdown,
} from 'react-bootstrap';

import { CloseButton } from '../buttons/IconButtons';
import { DragAndDropList, DragAndDropListComponent, DragAndDropListComponentProps } from './DragAndDropList';
import { useLocalization } from '../../localization/LocalizationContext';
import { useFormModal } from '../forms/FormModalProvider';

const PaginationButton = (props: ButtonProps) => (
  <Button variant='outline-secondary' size='sm' {...props} />
)

export type OrderByColumn<R> = string | ((row: R) => string | number);

export type OptionsDropdown = {
  onSelect: (key: string | null) => void;
  selected: string | null;
  options: {
    [key: string]: ReactNode | string | number;
  }
}

export type DataTableColumn<R> = {
  name: ReactNode | string | number;
  orderBy?: OrderByColumn<R>;
  optionsDropdown?: OptionsDropdown;
  search?: string | ((row: R) => string | number);
  className?: string;
  value?: number | string | ((row: R)  => number);
  formatSum?: ((value: number) => ReactElement | string | number) | ReactElement | string | number;
  selector: number | string | ((row: R) => ReactElement | string | number | null | (ReactElement | string | number | null)[]);
  onClick?: OnClickRow<R>;
}

export type RowsPerPageOptions = number[] | [...number[], null];

export type OrderByDirection = 'asc' | 'desc';

export type OnMoveProps<R> = {
  item: R;
  target: R;
  reset: () => void;
}

export type OnMove<R> = ({ item, target, reset }: OnMoveProps<R>) => void;

export type OnClickRow<R> = (row: R) => void;

export type DataTableHeader = {
  search?: boolean;
  numberOfRows?: boolean;
  pagination?: boolean;
  customHeader?: ReactElement | string;
};

export type DataTableProps<D extends any[]> = {
  data: D;
  columns: DataTableColumn<D[number]>[];
  rowsPerPage?: number | null;
  rowsPerPageOptions?: RowsPerPageOptions;
  orderByDefault?: ((row: D[number]) => number) | string | null;
  orderByDefaultDirection?: OrderByDirection;
  onMove?: OnMove<D[number]>;
  moveId?: string;
  moveIsLoading?: boolean;
  showHeader?: boolean | DataTableHeader;
  onClickRow?: OnClickRow<D[number]>;
  showEditModalOnClickRow?: boolean;
  textOnEmpty?: ReactElement | string;
  className?: string;
  rowClassName?: string | ((row: D[number]) => string);
  style?: any;
  showSum?: boolean;
}

export const DataTable = <D extends any[]>({
  data: allData,
  columns,
  rowsPerPage: rowsPerPageDefault = 10,
  rowsPerPageOptions = [10, 25, 50, 100, null],
  orderByDefault,
  orderByDefaultDirection='asc',
  onMove,
  moveId = 'id',
  moveIsLoading,
  showHeader = true,
  onClickRow,
  showEditModalOnClickRow,
  textOnEmpty,
  className,
  rowClassName,
  style,
  showSum,
  ...restProps
}: DataTableProps<D>) => {
  const { showEditModal, hasProvider } = useFormModal();
  type R = D[number];

  if (Object.keys(restProps).length !== 0) console.error('Unrecognised props:', restProps);
  
  const [filterText, setFilterText] = useState('');
  const [orderBy, setOrderBy] = useState<{ order: OrderByDirection; column: OrderByColumn<R> } | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageDefault);
  const [page, setPage] = useState(0);
  
  let data = allData && (
    Object.values(allData).filter(row => {
      if (!filterText) return true;

      const regex = new RegExp(filterText, 'i');

      for (const { search } of columns) {
        if (!search) continue;

        let value: any = '';

        if (typeof search === 'function') {
          value = search(row);
        } else if (row[search] !== undefined) {
          value = row[search];
        }

        if (value && regex.test(String(value))) {
          return true; // early return on first match
        }
      }

      return false;
    })
  );

  const pagesCount = (data && rowsPerPage && Math.ceil(data.length / rowsPerPage));
  useEffect(
    () => { if (pagesCount && page >= pagesCount) setPage(pagesCount - 1) },
    [setPage, pagesCount, page]
  );
  const { strings } = useLocalization();
  const dragAndDrop = !orderBy && !!onMove;

  if (!data || !columns) return null;

  if (orderBy) {
    const { column } = orderBy;
    if (typeof column === 'function') {
      data.sort((r1: R, r2: R) => (column(r1) > column(r2)) !== (orderBy.order === 'asc') ? -1 : 1);
    } else {
      data.sort((r1: R, r2: R) => (r1[column] > r2[column]) !== (orderBy.order === 'asc') ? -1 : 1);
    }
  } else if (orderByDefault) {
    const directionInt = orderByDefaultDirection === 'asc' ? 1 : -1;
    if (typeof orderByDefault === 'function') {
      data.sort((r1: R, r2: R) => orderByDefault(r1) > orderByDefault(r2) ? directionInt : -directionInt);
    } else {
      data.sort((r1: R, r2: R) => r1[orderByDefault] > r2[orderByDefault] ? directionInt : -directionInt);
    }
  }
  if (pagesCount) {
    data = data.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  }
  
  type ComponentProps<R> = { row: R } & DragAndDropListComponentProps;

  const Component = forwardRef<HTMLTableRowElement, ComponentProps<R>>(
    ({ row }, ref) => (
    <tr
      ref={ref}
      {
        ...typeof rowClassName === 'string'
        ? { className: rowClassName }
        : typeof rowClassName === 'function'
        ? { className: rowClassName(row) }
        : {}
      }
      {...{ ...(typeof onClickRow === 'function' || showEditModal)
        ? { onClick: () => {
            if (onClickRow) onClickRow(row);
            if (hasProvider && showEditModalOnClickRow) showEditModal(row);
          } }
        : {}
      }}
    >
      {columns.map(({ selector, className, onClick }, index) =>
        <td
        	key={index}
          className={className}
          {...(typeof onClick === 'function')
            ? { onClick: () => {
                if (onClick) onClick(row);
              } }
            : {}
          }
        >
          {typeof selector === 'function' ? selector(row) : row[selector]}
        </td>
      )}
    </tr>
  ));

  const sums = useMemo(() => columns.map(({ value }) => (
    value && data.reduce((sum, row) => (
      sum + (typeof value === 'function' ? value(row) : row[value])
    ), 0)
  )), [columns, data])
  
  if (!Component) return null;

  const customHeader = showHeader && (showHeader as DataTableHeader).customHeader;
  const sm = customHeader ? 4 : 6; 
  const lg = customHeader ? 3 : 4;
  
  return (
    <div style={style} className={className}>
      {(showHeader) &&
        <Row className="mb-4">
          {(showHeader === true || showHeader.search) && (
            <Col
              xs={12}
              lg={lg}
              className="d-flex flex-col justify-content-end align-items-end"
            >
              <InputGroup>
                <Form.Control
                  type="text"
                  name="table-filter"
                  value={filterText}
                  placeholder={strings.getString('search')}
                  onChange={e => setFilterText(e.target.value)}
                />
                <CloseButton
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => setFilterText('')}
                />
              </InputGroup>
            </Col>
          )}
          {(showHeader === true || showHeader.numberOfRows) && (
            <Col
              xs={12}
              sm={sm}
              lg={lg}
              className="d-flex flex-col justify-content-lg-center align-items-center justify-content-sm-start mb-2 mb-sm-0"
            >
              <Form.Group>
                <Form.Label>
                  {strings.getString('number_of_rows')}
                </Form.Label>
                <Form.Select
                  name="table-pagination-options"
                  value={rowsPerPage === null ? 'everything' : `${rowsPerPage}`}
                  as="select"
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setRowsPerPage(e.target.value === 'everything' ? null : parseInt(e.target.value))
                  }
                >
                  {rowsPerPageOptions.map((option, index) => (
                    <option key={index} value={option === null ? 'everything' : option}>
                      {option === null ? strings.getString('everything') : option}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          )}
          {(showHeader === true || showHeader.pagination) && (
            <Col
              xs={12}
              sm={sm}
              lg={lg}
              className="d-flex flex-col justify-content-end align-items-end"
            >
              <ButtonGroup>
                <PaginationButton
                  disabled={!pagesCount || page === 0}
                  onClick={() => setPage(0)}
                >
                  {'<<'}
                </PaginationButton>
                <PaginationButton
                  disabled={!pagesCount || page === 0}
                  onClick={() => setPage(page - 1)}
                >
                  {'<'}
                </PaginationButton>
                <PaginationButton>{pagesCount ? page + 1 : 1}</PaginationButton>
                <PaginationButton
                  disabled={!pagesCount || page >= pagesCount - 1}
                  onClick={() => setPage(page + 1)}
                >
                  {'>'}
                </PaginationButton>
                <PaginationButton
                  disabled={!pagesCount || page >= pagesCount - 1}
                  onClick={() => setPage(typeof pagesCount === 'number' ? pagesCount - 1 : 0)}
                >
                  {'>>'}
                </PaginationButton>
              </ButtonGroup>
            </Col>
          )}
          
          {customHeader && (
            <Col
              xs={12}
              sm={sm}
              lg={lg}
              className="d-flex flex-col justify-content-end align-items-end"
            >          
              {customHeader}
            </Col>
          )}
        </Row>
      }

      <Table
        striped={data.length !== 0}
        bordered
        hover
        responsive
      >
        <thead>
          <tr>
            {columns.map(({ name, orderBy: orderByColumn, optionsDropdown, className }, index) =>
              optionsDropdown
              ? (
                <th
                  key={index}
                  className={className}
                  style={{ cursor: 'pointer' }}
                >
                  <Dropdown>
                    <Dropdown.Toggle as="span">
                      {optionsDropdown.selected
                        ? optionsDropdown.options[optionsDropdown.selected]
                        : name
                      }
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {Object.entries(optionsDropdown.options)
                        .map(([key, text]) => 
                          <Dropdown.Item
                            eventKey={key}
                            key={key}
                            onClick={() => optionsDropdown.onSelect(
                              optionsDropdown.selected !== key ? key : null
                            )}
                            active={key === optionsDropdown.selected}
                          >
                            {text === null ? strings.getString('everything') : text}
                          </Dropdown.Item>
                        )
                      }
                    </Dropdown.Menu>
                  </Dropdown>
                </th>
              ) : orderByColumn 
                ? (
                    !orderBy || orderBy.column !== orderByColumn
                    ? <th
                        key={index}
                        className={className}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setOrderBy({ order: 'asc', column: orderByColumn })}
                      >
                        {name}
                        <FaSort />
                      </th>
                    : orderBy.order === 'asc'
                    ? <th
                        key={index}
                        className={className}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setOrderBy({ order: 'desc', column: orderByColumn })}
                      >
                        {name}
                        <FaSortUp />
                      </th>
                    : <th
                        key={index}
                        className={className}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setOrderBy(null)}
                      >
                        {name}
                        <FaSortDown />
                      </th>
                  )
                : <th key={index} className={className}>
                    {name}
                  </th>
            )}
          </tr>
        </thead>
        <tbody {...dragAndDrop ? { style: { cursor: 'move' } } : {}}>
          {data.length === 0 &&
            <tr>
              <td
                colSpan={columns.length}
                style={{ textAlign: 'center', margin: '15px' }}
              >
                <i>{textOnEmpty || strings.getString('no_information_to_display')}</i>
              </td>
            </tr>
          }
          {dragAndDrop
            ? <DragAndDropList
                component={Component as DragAndDropListComponent}
                propsArray={(data && data 
                  .map(row => ({
                    row,
                    // The line below fixes a nasty bug: Drag and drop won't work the first time and
                    // the mouse cursor only selects text
                    onClick: () => {},
                  }))) || []
                }
                onDrop={(index: number, targetIndex: number, reset: () => void ) => {
                  const item = data[index];
                  const target = data[targetIndex];
                  if (item[moveId] === target[moveId] || moveIsLoading) {
                    return;
                  }
                  onMove({ item, target, reset });
                }}
              />
            : data.map((row, index) => <Component row={row} key={index} />)
          }
        </tbody>
        {showSum && (
          <tfoot>
            <tr>
              {columns.map(({ value, formatSum }, index) =>
                <td
                  key={index}
                >
                  {value 
                    ? (typeof formatSum === 'function'
                        ? formatSum(sums[index])
                        : sums[index]
                      )
                    : formatSum}
                </td>
              )}
            </tr>
          </tfoot>
        )}
      </Table>
    </div>
  )
}