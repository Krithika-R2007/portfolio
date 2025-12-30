/**
 * Jest Test Setup
 * Sets up the testing environment for cursor system tests
 */

// Mock requestAnimationFrame and cancelAnimationFrame
global.requestAnimationFrame = jest.fn((callback) => {
  setTimeout(callback, 16);
  return 1;
});

global.cancelAnimationFrame = jest.fn();

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock navigator properties
Object.defineProperty(navigator, 'maxTouchPoints', {
  writable: true,
  value: 0
});

Object.defineProperty(navigator, 'msMaxTouchPoints', {
  writable: true,
  value: 0
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Clean up DOM after each test
afterEach(() => {
  document.body.innerHTML = '';
  document.head.innerHTML = '';
});