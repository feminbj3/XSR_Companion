import React, { useState } from 'react';
import { FlatList, Alert, Pressable } from 'react-native';
import { Screen, Btn, Empty } from './ui';
import EntryForm from './EntryForm';
import { useCollection } from '../utils/store';

// One reusable screen: list + add form + long-press to delete.
export default function CollectionScreen({ title, storeKey, fields, validate, toItem, renderItem, header, empty }) {
  const { items, add, remove } = useCollection(storeKey);
  const [open, setOpen] = useState(false);

  const confirmDelete = (item) =>
    Alert.alert('Delete this entry?', 'This can’t be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => remove(item.id) },
    ]);

  return (
    <Screen title={title} right={<Btn ghost label={open ? 'Close' : 'Add'} onPress={() => setOpen(!open)} />}>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={<>
          {open && <EntryForm fields={fields} validate={(v) => validate(v, items)}
            onSubmit={(v) => { add(toItem(v)); setOpen(false); }} />}
          {header?.(items)}
        </>}
        ListEmptyComponent={<Empty text={empty} />}
        renderItem={({ item }) => (
          <Pressable onLongPress={() => confirmDelete(item)}>{renderItem(item, items)}</Pressable>
        )}
      />
    </Screen>
  );
}
