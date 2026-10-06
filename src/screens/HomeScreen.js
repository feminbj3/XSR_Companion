import React from 'react';
import { ScrollView, View } from 'react-native';
import { Screen, Card, Stat, Strong, Muted } from '../components/ui';
import { useCollection } from '../utils/store';
import { withMileage, avgMileage, currentOdo, serviceStatus, daysBetween, today } from '../utils/calc';
import { colors } from '../theme';

export default function HomeScreen() {
  const fuel = useCollection('fuel').items;
  const service = useCollection('service').items;
  const docs = useCollection('docs').items;

  const odo = currentOdo(fuel, service);
  const avg = avgMileage(withMileage(fuel));
  const spend = fuel.reduce((s, f) => s + f.cost, 0);

  const alerts = [
    ...service.map((s) => ({ s, st: serviceStatus(s, odo) }))
      .filter((x) => x.st.due || x.st.soon)
      .map((x) => ({ text: `${x.s.name} ${x.st.due ? 'is overdue' : 'is due soon'}`, bad: x.st.due })),
    ...docs.map((d) => ({ d, left: daysBetween(today(), d.expiry) }))
      .filter((x) => x.left <= 30)
      .map((x) => ({ text: x.left < 0 ? `${x.d.name} has expired` : `${x.d.name} expires in ${x.left} days`, bad: x.left < 0 })),
  ];

  return (
    <Screen title="XSR 155">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
          <Stat label="Odometer" value={odo != null ? String(odo) : '—'} unit=" km" />
          <Stat label="Average mileage" value={avg ? avg.toFixed(1) : '—'} unit=" km/l" />
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
          <Stat label="Fuel spend" value={fuel.length ? `₹${Math.round(spend)}` : '—'} />
          <Stat label="Fill-ups logged" value={String(fuel.length)} />
        </View>
        <Strong style={{ marginBottom: 8 }}>Needs attention</Strong>
        {alerts.length === 0 ? (
          <Muted>Nothing due. Alerts appear here once you log services and documents.</Muted>
        ) : alerts.map((a, i) => (
          <Card key={i} style={{ borderLeftWidth: 4, borderLeftColor: a.bad ? colors.bad : colors.accent }}>
            <Strong>{a.text}</Strong>
          </Card>
        ))}
      </ScrollView>
    </Screen>
  );
}
