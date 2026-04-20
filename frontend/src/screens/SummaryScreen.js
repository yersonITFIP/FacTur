import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import expenseService from '../services/expenseService';
import { useFocusEffect } from '@react-navigation/native';

const SummaryScreen = ({ navigation }) => {
    const [todayExpenses, setTodayExpenses] = useState([]);
    const [weekExpenses, setWeekExpenses] = useState([]);
    const [todayTotal, setTodayTotal] = useState(0);
    const [weekTotal, setWeekTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState('today');

    const loadExpenses = async () => {
        try {
            const token = await AsyncStorage.getItem('token');

            const [todayResponse, weekResponse] = await Promise.all([
                expenseService.getTodayExpenses(token),
                expenseService.getWeekExpenses(token)
            ]);

            if (todayResponse.success) {
                setTodayExpenses(todayResponse.data.expenses);
                setTodayTotal(todayResponse.data.total);
            }

            if (weekResponse.success) {
                setWeekExpenses(weekResponse.data.expenses);
                setWeekTotal(weekResponse.data.total);
            }
        } catch (error) {
            console.error('Error loading expenses:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadExpenses();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        loadExpenses();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderExpenseItem = ({ item }) => (
        <View style={styles.expenseCard}>
            <View style={styles.expenseLeft}>
                <View style={styles.expenseIcon}>
                    <Text style={styles.expenseIconText}>$</Text>
                </View>
                <View style={styles.expenseInfo}>
                    <Text style={styles.expenseName}>{item.name}</Text>
                    {item.description ? (
                        <Text style={styles.expenseDesc}>{item.description}</Text>
                    ) : null}
                    <Text style={styles.expenseDate}>{formatDate(item.created_at)}</Text>
                </View>
            </View>
            <Text style={styles.expenseValue}>${parseFloat(item.value).toFixed(2)}</Text>
        </View>
    );

    const renderEmptyList = (message) => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyTitle}>Sin gastos</Text>
            <Text style={styles.emptyText}>{message}</Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    const currentExpenses = activeTab === 'today' ? todayExpenses : weekExpenses;
    const currentTotal = activeTab === 'today' ? todayTotal : weekTotal;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Resumen</Text>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'today' && styles.tabActive]}
                    onPress={() => setActiveTab('today')}
                >
                    <Text style={[styles.tabText, activeTab === 'today' && styles.tabTextActive]}>
                        Hoy
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'week' && styles.tabActive]}
                    onPress={() => setActiveTab('week')}
                >
                    <Text style={[styles.tabText, activeTab === 'week' && styles.tabTextActive]}>
                        Semana
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.totalCard}>
                <Text style={styles.totalLabel}>
                    {activeTab === 'today' ? 'Gastos de Hoy' : 'Gastos de la Semana'}
                </Text>
                <Text style={styles.totalValue}>${currentTotal.toFixed(2)}</Text>
            </View>

            <FlatList
                data={currentExpenses}
                renderItem={renderExpenseItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />
                }
                ListEmptyComponent={renderEmptyList(
                    activeTab === 'today'
                        ? 'No hay gastos hoy'
                        : 'No hay gastos esta semana'
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFF6FF'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EFF6FF'
    },
    header: {
        paddingTop: 60,
        paddingBottom: 16,
        paddingHorizontal: 20,
        backgroundColor: '#fff'
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1E293B',
        textAlign: 'center'
    },
    tabContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginTop: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 4
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 8
    },
    tabActive: {
        backgroundColor: '#2563EB'
    },
    tabText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#64748B'
    },
    tabTextActive: {
        color: '#fff'
    },
    totalCard: {
        margin: 20,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    totalLabel: {
        fontSize: 16,
        color: '#64748B'
    },
    totalValue: {
        fontSize: 28,
        fontWeight: '700',
        color: '#EF4444'
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 100
    },
    expenseCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    expenseLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    expenseIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
    },
    expenseIconText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2563EB'
    },
    expenseInfo: {
        flex: 1
    },
    expenseName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E293B'
    },
    expenseDesc: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 2
    },
    expenseDate: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 4
    },
    expenseValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#10B981'
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 60
    },
    emptyIcon: {
        fontSize: 56,
        marginBottom: 16
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 4
    },
    emptyText: {
        fontSize: 14,
        color: '#64748B'
    }
});

export default SummaryScreen;