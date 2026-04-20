import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import ExpenseFormScreen from '../screens/ExpenseFormScreen';
import SummaryScreen from '../screens/SummaryScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabIcon({ label, focused }) {
    const icons = {
        Home: '⌂',
        Agregar: '+',
        Resumen: '▤'
    };
    return (
        <View style={[styles.tabIconContainer, focused && styles.tabIconFocused]}>
            <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>
                {icons[label] || '•'}
            </Text>
        </View>
    );
}

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarShowLabel: false,
                tabBarIcon: ({ focused }) => (
                    <TabIcon label={route.name} focused={focused} />
                )
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Agregar" component={ExpenseFormScreen} />
            <Tab.Screen name="Resumen" component={SummaryScreen} />
        </Tab.Navigator>
    );
}

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Register"
                    component={RegisterScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Main"
                    component={MainTabs}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        height: 70,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        paddingHorizontal: 50,
        overflow: 'hidden'
    },
    tabIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 56,
        height: 56,
        borderRadius: 16
    },
    tabIconFocused: {
        backgroundColor: '#DBEAFE',
        width: 56,
        height: 56,
        borderRadius: 16
    },
    tabIcon: {
        fontSize: 28,
        color: '#94A3B8'
    },
    tabIconActive: {
        color: '#2563EB'
    }
});

export default AppNavigator;