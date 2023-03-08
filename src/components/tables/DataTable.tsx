import React, { useEffect, useState, forwardRef, useReducer, ReactElement, ChangeEvent, Ref } from 'react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { Table, Col, Row, InputGroup, Form, Button, ButtonProps, ButtonGroup } from 'react-bootstrap';

import { CloseButton } from '../buttons/IconButtons';
import { DragAndDropList, DragAndDropListComponent, DragAndDropListComponentProps } from './DragAndDropList';
import { useLocalization } from '../../localization/LocalizationContext';

const PaginationButton = (props: ButtonProps) => (
  <Button variant='outline-secondary' size='sm' {...props} />
)

export type OrderByColumn = ((row: any) => string) | string;

export type DataTableColumn = {
  name: string;
  orderBy?: OrderByColumn;
  className?: string;
  selector: number | string | ((row: any) => ReactElement);
}

export type RowsPerPageOptions = number[] | [...number[], null];

export type OrderByDirection = 'asc' | 'desc';

export type OnMoveProps = {
  item: any;
  target: number;
  reset: () => void;
}

export type OnMove = ({ item, target, reset }: OnMoveProps) => void;

export type OnClickRow = (row: any) => ReactElement;

export type DataTableProps<D extends any[]> = {
  data: D;
  columns: DataTableColumn[];
  rowsPerPage?: number | null;
  rowsPerPageOptions?: RowsPerPageOptions;
  filterColumn?: ((row: D[number]) => boolean) | string;
  orderByDefault?: ((row: D[number]) => number) |string | null;
  orderByDefaultDirection?: OrderByDirection;
  onMove?: OnMove;
  moveId?: string;
  moveIsLoading?: boolean;
  showHeader?: boolean;
  onClickRow?: OnClickRow;
  textOnEmpty?: ReactElement;
  className?: string;
  rowClassName?: string | ((row: D[number]) => string);
  style?: any;
}

export const DataTable = <D extends any[]>({
  data: allData,
  columns,
  rowsPerPage: rowsPerPageDefault = 10,
  rowsPerPageOptions = [10,25, 50, 100, null],
  filterColumn,
  orderByDefault,
  orderByDefaultDirection='asc',
  onMove,
  moveId = 'id',
  moveIsLoading,
  showHeader = true,
  onClickRow,
  textOnEmpty,
  className,
  rowClassName,
  style,
  ...restProps
}: DataTableProps<D>) => {
  type R = D[number];

  if (Object.keys(restProps).length !== 0) console.error('Unrecognised props:', restProps);
  
  const [filterText, setFilterText] = useState('');
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const [orderBy, setOrderBy] = useState<{ order: OrderByDirection; column: OrderByColumn } | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageDefault);
  const [page, setPage] = useState(0);
  let data = allData && (
    Object.values(allData)
      .filter(
        row => filterColumn && filterText
          ? (
              typeof filterColumn === 'function' 
                ? filterColumn(row)
                : row[filterColumn]
            ).match(new RegExp(`${filterText}`, 'i'))
          : true
        )
    );
  const pagesCount = data && rowsPerPage && ((data.length - 1) / rowsPerPage) + 1;
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

  const Component = forwardRef<
    HTMLTableRowElement,
    { row: R } & DragAndDropListComponentProps
  >(({ row }: R, ref: Ref<HTMLTableRowElement> | null) =>
    <tr
      ref={ref}
      {
        ...typeof rowClassName === 'string'
        ? { className: rowClassName }
        : typeof rowClassName === 'function'
        ? { className: rowClassName(row) }
        : {}
      }
      {...{ ...typeof onClickRow === 'function' ? { onClick: () => onClickRow(row)} : {}}}
    >
      {columns.map(({ selector, className }, index) =>
        <td key={index} className={className}>
          {typeof selector === 'function' ? selector(row) : row[selector]}
        </td>
      )}
    </tr>
  );
  
  if (!Component) return null;

  return (
    <div style={style} className={className}>
      {showHeader &&
        <Row className="mb-4">
          <Col
            xs={12}
            lg={4}
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
          <Col
            xs={12}
            sm={6}
            lg={4}
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
                placeholder={strings.getString('select')}
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
          <Col
            xs={12}
            sm={6}
            lg={4}
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
            {columns.map(({ name, orderBy: orderByColumn, className }, index) =>
              orderByColumn 
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
      </Table>
    </div>
  )
}