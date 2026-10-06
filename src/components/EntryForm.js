import React, { useState } from 'react';
import { Text, Switch, View } from 'react-native';
import { Card, Btn, Field, Muted } from './ui';
import { colors } from '../theme';

// fields: [{ key, label, keyboard?, initial?, type?: 'switch' }]
// validate(values) -> error string or null. Nothing is saved unless it passes.
export default function EntryForm({ fields, validate, onSubmit }) {
  const init = Object.fromEntries(fields.map((f) => [f.key, f.initial ?? (f.type === 'switch' ? false : '')]));
  const [v, setV] = useState(init);
  const [err, setErr] = useState(null);

  const submit = () => {
    const e = validate(v);
    if (e) return setErr(e);
    setErr(null);
    onSubmit(v);
  };

  return (
    <Card>
      {fields.map((f) => f.type === 'switch' ? (
        <View key={f.key} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
          <Muted>{f.label}</Muted>
          <Switch value={v[f.key]} onValueChange={(x) => setV({ ...v, [f.key]: x })} trackColor={{ true: colors.accent }} />
        </View>
      ) : (
        <Field key={f.key} label={f.label} value={String(v[f.key])} keyboardType={f.keyboard || 'default'}
          onChangeText={(x) => setV({ ...v, [f.key]: x })} />
      ))}
      {err && <Text style={{ color: colors.bad, marginBottom: 12 }}>{err}</Text>}
      <Btn label="Save entry" onPress={submit} />
    </Card>
  );
}
