import '@testing-library/jest-dom';
import 'fake-indexeddb/auto';

// Ensure structuredClone is available in jsdom environment for fake-indexeddb
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone =
    typeof structuredClone !== 'undefined'
      ? structuredClone
      : (val: unknown) => JSON.parse(JSON.stringify(val));
}
