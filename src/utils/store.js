// Tiny shared persisted store: every screen using the same key stays in sync.
import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const cache = {};
const subs = {};

export function useCollection(key) {
  const [items, setItems] = useState(cache[key] || []);

  useEffect(() => {
    if (!subs[key]) subs[key] = new Set();
    subs[key].add(setItems);
    if (!(key in cache)) {
      AsyncStorage.getItem(key).then((raw) => {
        cache[key] = raw ? JSON.parse(raw) : [];
        subs[key].forEach((fn) => fn(cache[key]));
      });
    }
    return () => subs[key].delete(setItems);
  }, [key]);

  const save = useCallback(async (next) => {
    cache[key] = next;
    subs[key].forEach((fn) => fn(next));
    await AsyncStorage.setItem(key, JSON.stringify(next));
  }, [key]);

  return {
    items,
    add: (item) => save([{ ...item, id: String(Date.now()) }, ...(cache[key] || [])]),
    remove: (id) => save((cache[key] || []).filter((x) => x.id !== id)),
  };
}
