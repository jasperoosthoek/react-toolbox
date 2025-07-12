// Mock for date-fns
module.exports = {
  format: jest.fn((date, formatStr) => 'mocked-date'),
  parseISO: jest.fn((dateStr) => new Date(dateStr)),
  isValid: jest.fn(() => true),
  addDays: jest.fn((date, amount) => date),
  subDays: jest.fn((date, amount) => date),
  startOfDay: jest.fn((date) => date),
  endOfDay: jest.fn((date) => date),
};
