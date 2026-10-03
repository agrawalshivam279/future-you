import '@testing-library/jest-dom';
import 'fake-indexeddb/auto';
import fetch, { Headers, Request, Response } from 'node-fetch';

// Ensure structuredClone is available in jsdom environment for fake-indexeddb
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone =
    typeof structuredClone !== 'undefined'
      ? structuredClone
      : (val: unknown) => JSON.parse(JSON.stringify(val));
}

// Polyfill fetch and Web APIs for Jest jsdom environment
if (typeof global.fetch === 'undefined') {
  // @ts-expect-error - node-fetch types slightly differ from DOM fetch
  global.fetch = fetch;
  // @ts-expect-error - node-fetch types slightly differ from DOM fetch
  global.Headers = Headers;
  // @ts-expect-error - node-fetch types slightly differ from DOM fetch
  global.Request = Request;
  // @ts-expect-error - node-fetch types slightly differ from DOM fetch
  global.Response = Response;
}

if (typeof window !== 'undefined') {
  // @ts-expect-error - node-fetch types slightly differ from DOM fetch
  window.fetch = fetch;
  // @ts-expect-error - node-fetch types slightly differ from DOM fetch
  window.Headers = Headers;
  // @ts-expect-error - node-fetch types slightly differ from DOM fetch
  window.Request = Request;
  // @ts-expect-error - node-fetch types slightly differ from DOM fetch
  window.Response = Response;
}
