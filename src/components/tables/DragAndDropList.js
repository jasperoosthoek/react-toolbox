
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { usePrevious, useForceUpdate } from '../../utils/hooks';

const ItemTypes = {
  OBJECT: 'object',
}

const DragAndDropItem = ({ droppedIndex, setDroppedIndex, propsArray, onDrop, reset, index, movedIndex, moveNext, component: Component, componentProps }) => {
  // Drag and drop code was inspired by this example:
  // https://codesandbox.io/s/old-flower-5bigy?file=/src/index.js:70-167
  const ref = useRef(null);
  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.OBJECT,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveNext(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
    drop: (item, monitor) => {
      // Keep record of dropped item
      setDroppedIndex(movedIndex);
      // Signal caller that item was dropped
      onDrop(movedIndex, index, reset);
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.OBJECT,
    item: () => ({ componentProps, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      if (!monitor.didDrop()) reset();
    },
  });
  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return (<>
    <Component
      {...componentProps}
      ref={ref}
      dropped={droppedIndex === movedIndex}
      
      style={{ 
        ...componentProps.style || {},
        cursor: 'move',
        opacity,
      }}
      data-handler-id={handlerId}
    />
    </>
  );
};

export const DragAndDropList = ({ onDrop, propsArray, component }) => {
  const [listMap, setListMap] = useState(null);
  const [droppedIndex, setDroppedIndex] = useState(null);
  const propsArrayPrev = usePrevious(propsArray);
  const reset = useCallback(() => setListMap(propsArray.map((obj, index) => index)), [propsArray]);
  
  const forceUpdate = useForceUpdate();
  useEffect(() => {
    if (JSON.stringify(propsArrayPrev) !== JSON.stringify(propsArray)) {
      reset();
    } else {
      // Some reason the first drag doesn't work anymore and instead of dragging you only selects text when this hook 
      // runs after render. Forcing the component to update again solves this somehow as this hook will not run twice
      forceUpdate();
    }
  }, [propsArrayPrev, propsArray]);

  const moveNext = useCallback(
    (dragIndex, hoverIndex) => {
      setListMap(listMap.map((obj, i) => listMap[
        // Swap two adjacent objects when dragged a single step
        i === dragIndex
        ? hoverIndex
        : i === hoverIndex
        ? dragIndex
        : i
      ]));
    },
    [listMap]
  );

  return (
    listMap && listMap.map((movedIndex, index) =>
      propsArray[movedIndex] &&
        <DragAndDropItem
          key={movedIndex}
          movedIndex={movedIndex}
          index={index}
          moveNext={moveNext}
          onDrop={onDrop}
          reset={() => reset()}
          component={component}
          componentProps={propsArray[movedIndex]}
          droppedIndex={droppedIndex}
          setDroppedIndex={setDroppedIndex}
          propsArray={propsArray}
        />
    )
  );
};
DragAndDropList.propTypes = {
  component: PropTypes.object.isRequired,
  propsArray: PropTypes.array.isRequired,
  onDrop: PropTypes.func.isRequired,
};
