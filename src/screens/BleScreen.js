import React from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { Screen, Card, Btn, Strong, Muted } from '../components/ui';
import { useBle } from '../ble/useBle';
import { colors } from '../theme';

const looksLikeBike = (n) => /yam|xsr|yzf|mt-|r15|fz/i.test(n);

export default function BleScreen() {
  const ble = useBle();
  const list = Object.values(ble.devices).sort((a, b) => b.rssi - a.rssi);

  return (
    <Screen title="Bluetooth">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Muted style={{ marginBottom: 12 }}>
          Before scanning: ignition on, and fully close the Yamaha app. The bike usually talks to one phone at a time.
        </Muted>

        {!ble.device ? (
          <>
            <Btn label={ble.scanning ? 'Scanning…' : 'Scan for devices'} onPress={ble.scan} />
            <View style={{ height: 12 }} />
            {list.map((d) => (
              <Pressable key={d.id} onPress={() => ble.connect(d.id)}>
                <Card style={looksLikeBike(d.name) ? { borderColor: colors.accent } : null}>
                  <Strong>{d.name}</Strong>
                  <Muted>{d.id} · signal {d.rssi} dBm</Muted>
                </Card>
              </Pressable>
            ))}
          </>
        ) : (
          <>
            <Card>
              <Strong>{ble.device.name || ble.device.id}</Strong>
              <Muted>Connected · read-only mode</Muted>
              <View style={{ height: 8 }} />
              <Btn ghost label="Disconnect" onPress={ble.disconnect} />
            </Card>
            {ble.services.map((s) => (
              <Card key={s.uuid}>
                <Strong>Service</Strong>
                <Muted>{s.uuid}</Muted>
                {s.chars.map((c) => (
                  <View key={c.uuid} style={{ marginTop: 10 }}>
                    <Muted>{c.uuid}</Muted>
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                      {c.read && <Btn ghost label="Read" onPress={() => ble.read(s.uuid, c.uuid)} />}
                      {c.notify && <Btn ghost label="Listen" onPress={() => ble.listen(s.uuid, c.uuid)} />}
                    </View>
                  </View>
                ))}
              </Card>
            ))}
          </>
        )}

        <Strong style={{ marginTop: 16, marginBottom: 8 }}>Log</Strong>
        <Card>
          {ble.log.length === 0
            ? <Muted>Nothing yet. Scan to begin.</Muted>
            : ble.log.slice(-40).map((l, i) => (
                <Text key={i} style={{ color: colors.text, fontFamily: 'monospace', fontSize: 11 }}>{l}</Text>
              ))}
        </Card>
        <Btn ghost label="Share log" onPress={ble.shareLog} />
        <View style={{ height: 40 }} />
      </ScrollView>
    </Screen>
  );
}
