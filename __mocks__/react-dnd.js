// Mock for react-dnd
module.exports = {
  useDrag: jest.fn(() => [{}, jest.fn(), jest.fn()]),
  useDrop: jest.fn(() => [{}, jest.fn()]),
  DndProvider: ({ children }) => children,
  useDragLayer: jest.fn(() => ({})),
};
