import React from 'react';
import { View } from 'react-native';
import CollectionScreen from '../components/CollectionScreen';
import { Card, Stat, Strong, Muted } from '../components/ui';
import { withMileage, avgMileage, today, isDate, num } from '../utils/calc';

const fields = [
  { key: 'date', label: 'Date (YYYY-MM-DD)', initial: today() },
  { key: 'odo', label: 'Odometer (km)', keyboard: 'numeric' },
  { key: 'litres', label: 'Litres filled', keyboard: 'decimal-pad' },
  { key: 'cost', label: 'Total paid (₹)', keyboard: 'decimal-pad' },
  { key: 'full', label: 'Filled to full tank', type: 'switch', initial: true },
];

const validate = (v, items) => {
  if (!isDate(v.date)) return 'Enter the date as YYYY-MM-DD.';
  if (!(num(v.odo) > 0)) return 'Enter the odometer reading.';
  if (!(num(v.litres) > 0)) return 'Litres must be more than 0.';
  if (!(num(v.cost) > 0)) return 'Enter the amount you paid.';
  const top = Math.max(0, ...items.map((i) => i.odo));
  if (num(v.odo) < top) return `Odometer can’t be lower than your last entry (${top} km).`;
  return null;
};

export default function FuelScreen() {
  return (
    <CollectionScreen
      title="Fuel" storeKey="fuel" fields={fields} validate={validate}
      empty="No fill-ups yet. Add one to start tracking mileage."
      toItem={(v) => ({ date: v.date, odo: num(v.odo), litres: num(v.litres), cost: num(v.cost), full: v.full })}
      header={(items) => {
        const avg = avgMileage(withMileage(items));
        return (
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
            <Stat label="Average mileage" value={avg ? avg.toFixed(1) : '—'} unit=" km/l" />
            <Stat label="Fill-ups" value={String(items.length)} />
          </View>
        );
      }}
      renderItem={(item, items) => {
        const row = withMileage(items).find((r) => r.id === item.id);
        return (
          <Card>
            <Strong>{item.litres} L · ₹{item.cost}</Strong>
            <Muted>{item.date} · {item.odo} km · {item.full ? 'full tank' : 'partial fill'}</Muted>
            {row?.kmpl && <Muted>{row.kmpl.toFixed(1)} km/l over {row.km} km</Muted>}
          </Card>
        );
      }}
    />
  );
}
