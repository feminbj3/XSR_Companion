import React from 'react';
import CollectionScreen from '../components/CollectionScreen';
import { Card, Strong, Muted } from '../components/ui';
import { useCollection } from '../utils/store';
import { currentOdo, serviceStatus, today, isDate, num } from '../utils/calc';
import { colors } from '../theme';

const fields = [
  { key: 'name', label: 'What was serviced (e.g. Engine oil)' },
  { key: 'lastKm', label: 'Odometer when done (km)', keyboard: 'numeric' },
  { key: 'lastDate', label: 'Date done (YYYY-MM-DD)', initial: today() },
  { key: 'intervalKm', label: 'Repeat every (km), optional', keyboard: 'numeric' },
  { key: 'intervalDays', label: 'Repeat every (days), optional', keyboard: 'numeric' },
];

const validate = (v) => {
  if (!v.name.trim()) return 'Give the service a name.';
  if (!(num(v.lastKm) >= 0)) return 'Enter the odometer reading.';
  if (!isDate(v.lastDate)) return 'Enter the date as YYYY-MM-DD.';
  if (!(num(v.intervalKm) > 0) && !(num(v.intervalDays) > 0)) return 'Set a km or day interval so I can remind you.';
  return null;
};

export default function ServiceScreen() {
  const fuel = useCollection('fuel').items;
  return (
    <CollectionScreen
      title="Service" storeKey="service" fields={fields} validate={validate}
      empty="No services logged. Add your last oil change to get reminders."
      toItem={(v) => ({ name: v.name.trim(), lastKm: num(v.lastKm), lastDate: v.lastDate,
        intervalKm: num(v.intervalKm) || null, intervalDays: num(v.intervalDays) || null })}
      renderItem={(item, items) => {
        const st = serviceStatus(item, currentOdo(fuel, items));
        const color = st.due ? colors.bad : st.soon ? colors.accent : colors.ok;
        return (
          <Card style={{ borderLeftWidth: 4, borderLeftColor: color }}>
            <Strong>{item.name}</Strong>
            <Muted>Last done {item.lastDate} at {item.lastKm} km</Muted>
            {st.kmLeft != null && <Muted>{st.kmLeft > 0 ? `${st.kmLeft} km left` : `${-st.kmLeft} km overdue`}</Muted>}
            {st.daysLeft != null && <Muted>{st.daysLeft > 0 ? `${st.daysLeft} days left` : `${-st.daysLeft} days overdue`}</Muted>}
          </Card>
        );
      }}
    />
  );
}
