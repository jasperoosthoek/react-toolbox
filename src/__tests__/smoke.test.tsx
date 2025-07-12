// Import all main exports to ensure they don't throw errors
import * as ReactToolbox from '../index';

describe('React Toolbox Smoke Tests', () => {
  it('should export all main components without errors', () => {
    expect(ReactToolbox).toBeDefined();
    expect(typeof ReactToolbox).toBe('object');
  });

  it('should export expected component keys', () => {
    const exportKeys = Object.keys(ReactToolbox);
    expect(exportKeys.length).toBeGreaterThan(0);
    
    // Check for some expected exports
    expect(exportKeys).toEqual(expect.arrayContaining([
      'ConfirmButton',
      'DeleteConfirmButton',
      'LoadingIndicator', 
      'CheckIndicator',
      'SearchBox',
      'ErrorBoundary',
      'LocalizationProvider'
    ]));
  });

  it('should export components as functions', () => {
    expect(typeof ReactToolbox.ConfirmButton).toBe('function');
    expect(typeof ReactToolbox.DeleteConfirmButton).toBe('function');
    expect(typeof ReactToolbox.LoadingIndicator).toBe('function');
    expect(typeof ReactToolbox.CheckIndicator).toBe('function');
    expect(typeof ReactToolbox.SearchBox).toBe('function');
    expect(typeof ReactToolbox.ErrorBoundary).toBe('function');
    expect(typeof ReactToolbox.LocalizationProvider).toBe('function');
  });
});
