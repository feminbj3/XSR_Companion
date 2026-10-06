import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './src/screens/HomeScreen';
import FuelScreen from './src/screens/FuelScreen';
import ServiceScreen from './src/screens/ServiceScreen';
import DocsScreen from './src/screens/DocsScreen';
import { colors } from './src/theme';

const Tab = createBottomTabNavigator();
const icons = { Home: 'speedometer', Fuel: 'water', Service: 'construct', Documents: 'document-text' };
const theme = { ...DarkTheme, colors: { ...DarkTheme.colors, background: colors.bg, card: colors.panel, border: colors.line } };

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={theme}>
        <StatusBar style="light" />
        <Tab.Navigator screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.muted,
          tabBarIcon: ({ color, size }) => <Ionicons name={icons[route.name]} size={size} color={color} />,
        })}>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Fuel" component={FuelScreen} />
          <Tab.Screen name="Service" component={ServiceScreen} />
          <Tab.Screen name="Documents" component={DocsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
