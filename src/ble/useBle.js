import { useRef, useState, useCallback } from 'react';
import { PermissionsAndroid, Platform, Share } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { b64ToHex } from './hex';

const manager = new BleManager();

async function ensurePermissions() {
  if (Platform.OS !== 'android') return true;
  const p = PermissionsAndroid.PERMISSIONS;
  const res = await PermissionsAndroid.requestMultiple([
    p.BLUETOOTH_SCAN, p.BLUETOOTH_CONNECT, p.ACCESS_FINE_LOCATION,
  ].filter(Boolean));
  return Object.values(res).every((r) => r === 'granted');
}

// Read-only BLE helper: scan, connect, discover, read, subscribe. No writes, by design.
export function useBle() {
  const [devices, setDevices] = useState({});
  const [scanning, setScanning] = useState(false);
  const [device, setDevice] = useState(null);
  const [services, setServices] = useState([]);
  const [log, setLog] = useState([]);
  const subs = useRef({});

  const note = useCallback((msg) => {
    const t = new Date().toTimeString().slice(0, 8);
    setLog((l) => [...l.slice(-199), `${t} ${msg}`]);
  }, []);

  const scan = useCallback(async () => {
    if (!(await ensurePermissions())) return note('Bluetooth permissions were denied.');
    setDevices({});
    setScanning(true);
    note('Scanning for 12 seconds…');
    manager.startDeviceScan(null, { allowDuplicates: false }, (err, d) => {
      if (err) { note(`Scan error: ${err.message}`); setScanning(false); return; }
      setDevices((prev) => ({
        ...prev,
        [d.id]: { id: d.id, name: d.name || d.localName || 'Unnamed', rssi: d.rssi },
      }));
    });
    setTimeout(() => { manager.stopDeviceScan(); setScanning(false); }, 12000);
  }, [note]);

  const connect = useCallback(async (id) => {
    try {
      manager.stopDeviceScan();
      setScanning(false);
      note(`Connecting to ${id}…`);
      const d = await manager.connectToDevice(id, { timeout: 15000 });
      await d.discoverAllServicesAndCharacteristics();
      const list = [];
      for (const s of await d.services()) {
        const chars = await s.characteristics();
        list.push({
          uuid: s.uuid,
          chars: chars.map((c) => ({
            uuid: c.uuid, read: c.isReadable, notify: c.isNotifiable || c.isIndicatable,
          })),
        });
      }
      setDevice(d);
      setServices(list);
      note(`Connected. Found ${list.length} services.`);
      d.onDisconnected(() => { note('Disconnected.'); setDevice(null); });
    } catch (e) {
      note(`Connect failed: ${e.message}`);
    }
  }, [note]);

  const read = useCallback(async (svc, chr) => {
    try {
      const c = await device.readCharacteristicForService(svc, chr);
      note(`READ ${chr.slice(0, 8)}: ${b64ToHex(c.value)}`);
    } catch (e) { note(`Read failed ${chr.slice(0, 8)}: ${e.message}`); }
  }, [device, note]);

  const listen = useCallback((svc, chr) => {
    if (subs.current[chr]) return note('Already listening to that one.');
    subs.current[chr] = device.monitorCharacteristicForService(svc, chr, (err, c) => {
      if (err) return note(`Notify error ${chr.slice(0, 8)}: ${err.message}`);
      note(`NOTIFY ${chr.slice(0, 8)}: ${b64ToHex(c.value)}`);
    });
    note(`Listening to ${chr.slice(0, 8)}…`);
  }, [device, note]);

  const disconnect = useCallback(async () => {
    Object.values(subs.current).forEach((s) => s.remove());
    subs.current = {};
    if (device) await device.cancelConnection().catch(() => {});
    setDevice(null); setServices([]);
  }, [device]);

  const shareLog = () => Share.share({ message: log.join('\n') });

  return { devices, scanning, device, services, log, scan, connect, read, listen, disconnect, shareLog };
}
