import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import {
  NumericalEditableCell,
  EditCellProvider,
  NumericalEditableCellProps,
} from '../src/components/tables/NumericalEditableCell';

const renderCell = (props: Partial<NumericalEditableCellProps> = {}) => {
  const onSave = props.onSave || jest.fn();
  const utils = render(
    <EditCellProvider>
      <NumericalEditableCell row={1} col="a" value={5} onSave={onSave} {...props} />
    </EditCellProvider>
  );
  return { ...utils, onSave };
};

const openCell = (text = '5') => {
  fireEvent.click(screen.getByText(text));
  return screen.getByRole('spinbutton') as HTMLInputElement;
};

describe('NumericalEditableCell', () => {
  it('shows the value, or displayValue when given', () => {
    renderCell({ displayValue: '5 hours' });
    expect(screen.getByText('5 hours')).toBeInTheDocument();
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
  });

  it('opens an input with the current value on click', () => {
    renderCell();
    const input = openCell();
    expect(input.value).toBe('5');
  });

  it('saves on Enter and closes the input', async () => {
    const { onSave } = renderCell();
    const input = openCell();
    fireEvent.change(input, { target: { value: '7.5' } });
    await act(async () => {
      fireEvent.keyDown(input, { key: 'Enter' });
    });
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith(7.5);
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
  });

  it('rounds to whole numbers when integer is set', async () => {
    const { onSave } = renderCell({ integer: true });
    const input = openCell();
    fireEvent.change(input, { target: { value: '7.5' } });
    await act(async () => {
      fireEvent.keyDown(input, { key: 'Enter' });
    });
    expect(onSave).toHaveBeenCalledWith(7);
  });

  it('saves null for an empty input', async () => {
    const { onSave } = renderCell();
    const input = openCell();
    fireEvent.change(input, { target: { value: '' } });
    await act(async () => {
      fireEvent.blur(input);
    });
    expect(onSave).toHaveBeenCalledWith(null);
  });

  it('saves only once when Enter is followed by blur', async () => {
    const { onSave } = renderCell();
    const input = openCell();
    await act(async () => {
      fireEvent.keyDown(input, { key: 'Enter' });
      fireEvent.blur(input);
    });
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('cancels on Escape without saving', async () => {
    const { onSave } = renderCell();
    const input = openCell();
    fireEvent.change(input, { target: { value: '9' } });
    await act(async () => {
      fireEvent.keyDown(input, { key: 'Escape' });
      fireEvent.blur(input);
    });
    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('does not reset the typed value when clicking inside the input', () => {
    renderCell();
    const input = openCell();
    fireEvent.change(input, { target: { value: '9' } });
    fireEvent.click(input);
    expect(input.value).toBe('9');
  });

  it('does not open an input when inputDisabled is set', () => {
    renderCell({ inputDisabled: true });
    fireEvent.click(screen.getByText('5'));
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
  });

  it('only edits one cell at a time', () => {
    render(
      <EditCellProvider>
        <NumericalEditableCell row={1} col="a" value={1} onSave={jest.fn()} />
        <NumericalEditableCell row={2} col="a" value={2} onSave={jest.fn()} />
      </EditCellProvider>
    );
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('2'));
    const inputs = screen.getAllByRole('spinbutton') as HTMLInputElement[];
    expect(inputs).toHaveLength(1);
    expect(inputs[0].value).toBe('2');
  });

  it('keeps a newly opened cell open when a slow save of another cell finishes', async () => {
    let resolveSave: () => void = () => {};
    const slowSave = jest.fn(() => new Promise<void>((resolve) => { resolveSave = resolve; }));
    render(
      <EditCellProvider>
        <NumericalEditableCell row={1} col="a" value={1} onSave={slowSave} />
        <NumericalEditableCell row={2} col="a" value={2} onSave={jest.fn()} />
      </EditCellProvider>
    );
    fireEvent.click(screen.getByText('1'));
    fireEvent.blur(screen.getByRole('spinbutton'));
    fireEvent.click(screen.getByText('2'));
    await act(async () => resolveSave());
    expect((screen.getByRole('spinbutton') as HTMLInputElement).value).toBe('2');
  });

  it('extra menu options can change the value before saving', async () => {
    const { onSave } = renderCell({
      extraMenuOptions: [
        { label: 'Double', onClick: (value, { setValue }) => setValue(String(Number(value) * 2)) },
      ],
    });
    const input = openCell();
    fireEvent.focus(input);
    fireEvent.mouseDown(screen.getByText('Double'));
    expect(input.value).toBe('10');
    await act(async () => {
      fireEvent.keyDown(input, { key: 'Enter' });
    });
    expect(onSave).toHaveBeenCalledWith(10);
  });

  it('throws when used outside an EditCellProvider', () => {
    expect(() =>
      render(<NumericalEditableCell row={1} col="a" value={5} onSave={jest.fn()} />)
    ).toThrow('useEditCell must be used inside an EditCellProvider');
  });
});
