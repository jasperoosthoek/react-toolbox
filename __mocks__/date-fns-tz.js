// Mock for date-fns-tz
module.exports = {
  zonedTimeToUtc: jest.fn((date, timezone) => date),
  utcToZonedTime: jest.fn((date, timezone) => date),
  format: jest.fn((date, formatStr, options) => 'mocked-date'),
};
