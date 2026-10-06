import React from 'react';
import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, space, radius } from '../theme';

export const Screen = ({ title, right, children }) => (
  <SafeAreaView style={s.screen} edges={['top']}>
    <View style={s.head}>
      <Text style={s.title}>{title}</Text>
      {right}
    </View>
    {children}
  </SafeAreaView>
);

export const Card = ({ children, style }) => <View style={[s.card, style]}>{children}</View>;

export const Btn = ({ label, onPress, ghost }) => (
  <Pressable onPress={onPress} style={[s.btn, ghost && s.ghost]}>
    <Text style={[s.btnText, ghost && { color: colors.accent }]}>{label}</Text>
  </Pressable>
);

export const Stat = ({ label, value, unit }) => (
  <View style={s.stat}>
    <Text style={s.statVal}>{value}<Text style={s.unit}>{value === '—' ? '' : unit}</Text></Text>
    <Text style={s.muted}>{label}</Text>
  </View>
);

export const Empty = ({ text }) => <Text style={[s.muted, { textAlign: 'center', marginTop: space.l }]}>{text}</Text>;

export const Field = ({ label, ...props }) => (
  <View style={{ marginBottom: space.m }}>
    <Text style={s.muted}>{label}</Text>
    <TextInput placeholderTextColor={colors.muted} style={s.input} {...props} />
  </View>
);

export const Muted = ({ children, style }) => <Text style={[s.muted, style]}>{children}</Text>;
export const Strong = ({ children, style }) => <Text style={[s.strong, style]}>{children}</Text>;

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: space.m },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: space.m },
  title: { color: colors.text, fontSize: 28, fontWeight: '700' },
  card: { backgroundColor: colors.panel, borderRadius: radius.m, padding: space.m, marginBottom: space.s, borderWidth: 1, borderColor: colors.line },
  btn: { backgroundColor: colors.accent, paddingVertical: 10, paddingHorizontal: 16, borderRadius: radius.s, alignItems: 'center' },
  ghost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.accent },
  btnText: { color: '#1A1205', fontWeight: '700' },
  stat: { flex: 1, backgroundColor: colors.panel, borderRadius: radius.m, padding: space.m, borderWidth: 1, borderColor: colors.line },
  statVal: { color: colors.accent, fontSize: 26, fontWeight: '700' },
  unit: { color: colors.muted, fontSize: 14, fontWeight: '400' },
  muted: { color: colors.muted, fontSize: 13 },
  strong: { color: colors.text, fontSize: 16, fontWeight: '600' },
  input: { color: colors.text, borderBottomWidth: 1, borderBottomColor: colors.line, paddingVertical: 6, fontSize: 16 },
});
