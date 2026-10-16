import React, {
  useState,
  useCallback,
  useMemo,
  createContext,
  useContext,
  useRef,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
  ComponentType,
  CSSProperties,
  ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { Form } from 'react-bootstrap';

type CellKey = string | number;

type EditCellState = {
  row: CellKey;
  col: CellKey;
  value: string;
};

export type EditCellContextType = {
  editCell: EditCellState | null;
  startEditCell: (row: CellKey, col: CellKey, value: string) => void;
  stopEditCell: (row?: CellKey, col?: CellKey) => void;
  updateValue: (value: string) => void;
};

const EditCellContext = createContext<EditCellContextType | undefined>(undefined);

/**
 * Keeps track of the single cell being edited. Wrap a table (or any group of
 * NumericalEditableCell components) so only one cell can be edited at a time.
 */
export const EditCellProvider = ({ children }: { children: ReactNode }) => {
  const [editCell, setEditCell] = useState<EditCellState | null>(null);

  const startEditCell = useCallback(
    (row: CellKey, col: CellKey, value: string) => setEditCell({ row, col, value }),
    [],
  );

  // When row & col are given, only stop editing if that cell is still the active one.
  // This prevents an async save of cell A from closing cell B that was opened in the meantime.
  const stopEditCell = useCallback(
    (row?: CellKey, col?: CellKey) =>
      setEditCell((prev) =>
        row === undefined || (prev?.row === row && prev?.col === col) ? null : prev
      ),
    [],
  );

  const updateValue = useCallback(
    (value: string) => setEditCell((prev) => (prev ? { ...prev, value } : prev)),
    [],
  );

  const value = useMemo(
    () => ({ editCell, startEditCell, stopEditCell, updateValue }),
    [editCell, startEditCell, stopEditCell, updateValue],
  );

  return (
    <EditCellContext.Provider value={value}>
      {children}
    </EditCellContext.Provider>
  );
};

export const useEditCell = () => {
  const ctx = useContext(EditCellContext);
  if (!ctx) throw new Error('useEditCell must be used inside an EditCellProvider');
  return ctx;
};

export type ExtraMenuOption = {
  label: ReactNode;
  title?: string;
  onClick: (currentValue: string, helpers: { setValue: (value: string) => void }) => void;
};

export type NumericalEditableCellProps = {
  row: CellKey;
  col: CellKey;
  value: number | null;
  displayValue?: ReactNode;
  onSave: (value: number | null) => void | Promise<void>;
  className?: string;
  inputClassName?: string;
  inputStyle?: CSSProperties;
  component?: string | ComponentType<any>;
  inputDisabled?: boolean;
  title?: string | null;
  placeholder?: string;
  // Round input to whole numbers (parseInt) instead of allowing decimals (parseFloat)
  integer?: boolean;
  step?: number | string;
  min?: number;
  max?: number;
  extraMenuOptions?: ExtraMenuOption[];
};

const parseValue = (value: string, integer: boolean) => {
  if (value.trim() === '') return null;
  const parsed = integer ? parseInt(value, 10) : parseFloat(value);
  return isNaN(parsed) ? null : parsed;
};

/**
 * Click-to-edit numerical cell. Saves on Enter or blur, cancels on Escape.
 * Optionally shows a menu below the input with extra actions (e.g. "copy from
 * previous week") that can modify the value before it is saved.
 */
export const NumericalEditableCell = ({
  row,
  col,
  value,
  displayValue,
  onSave,
  className,
  inputClassName,
  inputStyle,
  title,
  component,
  inputDisabled,
  placeholder,
  integer = false,
  step,
  min,
  max,
  extraMenuOptions,
}: NumericalEditableCellProps) => {
  const { editCell, startEditCell, stopEditCell, updateValue } = useEditCell();
  const Component = component || 'span';

  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  // Guards against saving twice (Enter followed by blur) or saving after Escape
  const finishedRef = useRef(false);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const isEditCell = editCell?.row === row && editCell?.col === col;
  const showMenu = isEditCell && isFocused && !!extraMenuOptions?.length;

  useEffect(() => {
    if (isEditCell) finishedRef.current = false;
  }, [isEditCell]);

  // Keep the menu attached to the input while scrolling or resizing
  useEffect(() => {
    if (!showMenu) {
      setMenuPosition(null);
      return;
    }
    const updatePosition = () => {
      if (!inputRef.current) return;
      const rect = inputRef.current.getBoundingClientRect();
      setMenuPosition({ top: rect.bottom, left: rect.left, width: rect.width });
    };
    updatePosition();

    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [showMenu]);

  const save = async () => {
    if (finishedRef.current || !editCell) return;
    finishedRef.current = true;
    try {
      await onSave(parseValue(editCell.value, integer));
    } finally {
      stopEditCell(row, col);
    }
  };

  const cancel = () => {
    finishedRef.current = true;
    stopEditCell(row, col);
  };

  const cellClassName = `text-nowrap ${className || ''}`.trim();

  if (inputDisabled) {
    return (
      <Component className={cellClassName} title={title || undefined}>
        {displayValue ?? value}
      </Component>
    );
  }

  return (
    <Component
      className={cellClassName}
      onClick={() => {
        // Clicks inside the input bubble up to here; don't reset the value being typed
        if (!isEditCell) startEditCell(row, col, value !== null ? value.toString() : '');
      }}
      title={title || undefined}
    >
      {isEditCell ? (
        <div className="d-inline-block">
          <Form.Control
            autoFocus
            style={{ width: '100px', ...inputStyle }}
            autoComplete="off"
            value={editCell.value}
            type="number"
            step={step ?? (integer ? 1 : 'any')}
            min={min}
            max={max}
            className={inputClassName}
            placeholder={placeholder}
            ref={inputRef}
            onFocus={() => setIsFocused(true)}
            onChange={(e: ChangeEvent<HTMLInputElement>) => updateValue(e.target.value)}
            onBlur={() => {
              setIsFocused(false);
              save();
            }}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                save();
              } else if (e.key === 'Escape') {
                e.preventDefault();
                cancel();
              }
            }}
          />

          {showMenu && menuPosition &&
            createPortal(
              <div
                className="border rounded bg-white shadow-sm"
                style={{
                  position: 'fixed',
                  top: menuPosition.top,
                  left: menuPosition.left,
                  width: menuPosition.width,
                  zIndex: 2000,
                }}
              >
                {extraMenuOptions!.map((option, index) => (
                  <button
                    type="button"
                    title={option.title}
                    key={index}
                    className="btn btn-light w-100 text-start rounded-0"
                    onMouseDown={(e) => {
                      // Prevent the input from blurring, which would save and close the cell
                      e.preventDefault();
                      option.onClick(editCell.value, { setValue: updateValue });
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>,
              document.body
            )}
        </div>
      ) : (
        displayValue ?? value
      )}
    </Component>
  );
};

export default NumericalEditableCell;
