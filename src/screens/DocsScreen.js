import React from 'react';
import CollectionScreen from '../components/CollectionScreen';
import { Card, Strong, Muted } from '../components/ui';
import { daysBetween, today, isDate } from '../utils/calc';
import { colors } from '../theme';

const fields = [
  { key: 'name', label: 'Document (e.g. Insurance, PUC, RC)' },
  { key: 'expiry', label: 'Expiry date (YYYY-MM-DD)' },
];

const validate = (v) => {
  if (!v.name.trim()) return 'Give the document a name.';
  if (!isDate(v.expiry)) return 'Enter the expiry as YYYY-MM-DD.';
  return null;
};

export default function DocsScreen() {
  return (
    <CollectionScreen
      title="Documents" storeKey="docs" fields={fields} validate={validate}
      empty="No documents added. Add your insurance and PUC expiry dates."
      toItem={(v) => ({ name: v.name.trim(), expiry: v.expiry })}
      renderItem={(item) => {
        const left = daysBetween(today(), item.expiry);
        const color = left < 0 ? colors.bad : left <= 30 ? colors.accent : colors.ok;
        return (
          <Card style={{ borderLeftWidth: 4, borderLeftColor: color }}>
            <Strong>{item.name}</Strong>
            <Muted>{left < 0 ? `Expired ${-left} days ago` : `Expires in ${left} days`} ({item.expiry})</Muted>
          </Card>
        );
      }}
    />
  );
}
