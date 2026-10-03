import { createIndexedDBStorage } from '../indexed-db';

describe('createIndexedDBStorage', () => {
  beforeEach(async () => {
    // Clear test database if open
    const storage = createIndexedDBStorage('test-db', 'test-store');
    await storage.removeItem('test-key');
  });

  it('sets, gets, and removes values in IndexedDB', async () => {
    const storage = createIndexedDBStorage('test-db', 'test-store');

    // Initial get should be null
    const initial = await storage.getItem('key-1');
    expect(initial).toBeNull();

    // Set value
    await storage.setItem('key-1', JSON.stringify({ message: 'hello' }));

    // Get value
    const retrieved = await storage.getItem('key-1');
    expect(retrieved).not.toBeNull();
    expect(JSON.parse(retrieved!)).toEqual({ message: 'hello' });

    // Remove value
    await storage.removeItem('key-1');
    const afterDelete = await storage.getItem('key-1');
    expect(afterDelete).toBeNull();
  });

  it('handles multiple keys independently', async () => {
    const storage = createIndexedDBStorage('test-db-multi', 'test-store');

    await storage.setItem('a', 'alpha');
    await storage.setItem('b', 'beta');

    expect(await storage.getItem('a')).toBe('alpha');
    expect(await storage.getItem('b')).toBe('beta');

    await storage.removeItem('a');
    expect(await storage.getItem('a')).toBeNull();
    expect(await storage.getItem('b')).toBe('beta');
  });
});
