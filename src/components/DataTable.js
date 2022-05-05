import { useEffect, useState, forwardRef, useReducer } from 'react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { Table, Col, Row, InputGroup, Form, Button, ButtonGroup, ListGroup } from 'react-bootstrap';

import { CloseButton } from './IconButtons';
import DragAndDropList from './DragAndDropList';

const PaginationButton = props => <Button variant="outline-secondary" size="" {...props} />

export const DataTable = ({
  data: allData,
  columns = null,
  rowsPerPage: rowsPerPageDefault = 10,
  rowsPerPageOptions = [10,25, 50, 100, 'Alles'],
  filterColumn = null,
  orderByDefault,
  orderByDefaultDirection='asc',
  onMove = null,
  moveId = 'id',
  moveIsLoading = false,
  showHeader = true,
  onClickRow = null,
  textOnEmpty = null,
  className,
  ...restProps
}) => {
  if (Object.keys(restProps).length !== 0) console.error('Unrecognised props:', restProps);
  
  const [filterText, setFilterText] = useState('');
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const [orderBy, setOrderBy] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageDefault);
  const [page, setPage] = useState(0);
  let data = allData && (
    Object.values(allData)
      .filter(
        row => filterColumn && filterText
        ? (typeof filterColumn === 'function' ? filterColumn(row) : row[filterColumn]).match(new RegExp(`${filterText}`, 'i'))
        : true)
    );
  const pagesCount = data && parseInt(rowsPerPage) && parseInt((data.length - 1) / parseInt(rowsPerPage)) + 1;
  useEffect(
    () => { if (pagesCount && page >= pagesCount) setPage(pagesCount - 1) },
    [setPage, pagesCount]
  );
  const dragAndDrop = !orderBy && !!onMove;

  if (!data || !columns) return null;

  if (orderBy) {
    if (typeof orderBy.column === 'function') {
      data.sort((r1, r2) => orderBy.column(r1) > orderBy.column(r2) ^ orderBy.order === 'asc' ? -1 : 1);
    } else {
      data.sort((r1, r2) => r1[orderBy.column] > r2[orderBy.column] ^ orderBy.order === 'asc' ? -1 : 1);
    }
  } else if (orderByDefault) {
    const directionInt = orderByDefaultDirection === 'asc' ? 1 : -1;
    if (typeof orderByDefault === 'function') {
      data.sort((r1, r2) => orderByDefault(r1) > orderByDefault(r2) ? directionInt : -directionInt);
    } else {
      data.sort((r1, r2) => r1[orderByDefault] > r2[orderByDefault] ? directionInt : -directionInt);
    }
  }
  if (pagesCount) {
    data = data.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  }

  // {...{ ...typeof onClickRow === 'function' ? { onClick: () => onClickRow(row)} : {}}}>
  const Component = forwardRef(({ row }, ref) =>
    <tr ref={ref} {...{ ...typeof onClickRow === 'function' ? { onClick: () => onClickRow(row)} : {}}}>
      {columns.map(({ selector, className }, index) =>
        <td key={index} className={className}>
          {selector(row)}
        </td>
      )}
    </tr>
  );
  
  return <div className={className}>
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
              placeholder="Zoeken"
              onChange={e => setFilterText(e.target.value)}
            />
            <CloseButton
              variant="outline-secondary"
              size=""
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
              Aantal rijen
            </Form.Label>
            <Form.Select
              name="table-pagination-options"
              value={rowsPerPage}
              as="select"
              placeholder="Selecteer"
              onChange={e => setRowsPerPage(e.target.value)}
            >
              {rowsPerPageOptions.map((option, index) => (
                <option key={index}>
                  {option}
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
              onClick={() => setPage(pagesCount - 1)}
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
      <tbody style={dragAndDrop ? { cursor: 'move' } : null}>
        {data.length === 0 &&
          <tr>
            <td colSpan={columns.length}>
              <center style={{ margin: '15px' }}>
                <i>{textOnEmpty || 'Geen informatie om weer te geven.'}</i>
              </center>
            </td>
          </tr>
        }
        {dragAndDrop
          ? <DragAndDropList
              component={Component}
              propsArray={(data && data 
                .map(row => ({
                  row,
                  // The line below fixes a nasty bug: Drag and drop won't work the first time and
                  // the mouse cursor only selects text
                  onClick: () => {},
                }))) || []
              }
              onDrop={(index, targetIndex, reset ) => {
                const item = data[index];
                const target = data[targetIndex];
                if (item[moveId] === target[moveId] || moveIsLoading) {
                  return;
                }
                onMove({ item, target, reset });
              }}
              onComponentDidMount={forceUpdate}
            />
          : data.map((row, index) => <Component row={row} key={index} />)
        }
      </tbody>
    </Table>
  </div>
}