import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    RefreshControl
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation, route }) => {
    const [user, setUser] = React.useState(null);
    const [balance, setBalance] = React.useState(0);
    const [recentExpenses, setRecentExpenses] = React.useState([]);
    const [refreshing, setRefreshing] = React.useState(false);

    React.useEffect(() => {
        loadUserData();
    }, []);

    // Recargar datos cuando vuelve a esta pantalla
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadUserData();
        });
        return unsubscribe;
    }, [navigation]);

    const loadUserData = async () => {
        try {
            const userStr = await AsyncStorage.getItem('user');
            if (userStr) {
                setUser(JSON.parse(userStr));
            }

            const token = await AsyncStorage.getItem('token');
            if (token) {
                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/expenses`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (data.success) {
                    const expenses = data.data.expenses || [];
                    const total = expenses.reduce((sum, e) => sum + parseFloat(e.value), 0);
                    setBalance(total);
                    setRecentExpenses(expenses.slice(0, 3));
                }
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadUserData();
        setRefreshing(false);
    };

    const handleLogout = () => {
        Alert.alert(
            'Cerrar Sesión',
            '¿Estás seguro?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Sí',
                    style: 'destructive',
                    onPress: async () => {
                        await AsyncStorage.removeItem('token');
                        await AsyncStorage.removeItem('user');
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }]
                        });
                    }
                }
            ]
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <View>
                        <Text style={styles.greeting}>Hola, {user?.name || 'Usuario'}</Text>
                        <Text style={styles.subtitle}>Resumen de tu actividad</Text>
                    </View>
                    <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                        <Text style={styles.logoutBtnText}>↩</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />
                }
            >
                <View style={styles.balanceCard}>
                    <Text style={styles.balanceLabel}>Balance Total</Text>
                    <Text style={styles.balanceAmount}>${balance.toFixed(2)}</Text>
                    <Text style={styles.balanceHint}>Tus gastos registrados</Text>
                </View>

                <View style={styles.quickActions}>
                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => navigation.navigate('Agregar')}
                    >
                        <View style={styles.actionIcon}>
                            <Text style={styles.actionIconText}>+</Text>
                        </View>
                        <Text style={styles.actionText}>Agregar Gasto</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => navigation.navigate('Resumen')}
                    >
                        <View style={[styles.actionIcon, { backgroundColor: '#FEF3C7' }]}>
                            <Text style={[styles.actionIconText, { color: '#F59E0B' }]}>▤</Text>
                        </View>
                        <Text style={styles.actionText}>Ver Resumen</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Gastos Recientes</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Resumen')}>
                            <Text style={styles.seeAll}>Ver todo</Text>
                        </TouchableOpacity>
                    </View>

                    {recentExpenses.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyIcon}>📋</Text>
                            <Text style={styles.emptyText}>No hay gastos registrados</Text>
                        </View>
                    ) : (
                        recentExpenses.map((expense) => (
                            <View key={expense.id} style={styles.expenseItem}>
                                <View style={styles.expenseLeft}>
                                    <View style={styles.expenseDot} />
                                    <View>
                                        <Text style={styles.expenseName}>{expense.name}</Text>
                                        <Text style={styles.expenseDate}>{formatDate(expense.created_at)}</Text>
                                    </View>
                                </View>
                                <Text style={styles.expenseValue}>-${parseFloat(expense.value).toFixed(2)}</Text>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFF6FF'
    },
    header: {
        backgroundColor: '#2563EB',
        paddingTop: 60,
        paddingBottom: 24,
        paddingHorizontal: 20
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    greeting: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff'
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2
    },
    logoutBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    logoutBtnText: {
        fontSize: 18,
        color: '#fff'
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20
    },
    balanceCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        marginBottom: 20
    },
    balanceLabel: {
        fontSize: 14,
        color: '#64748B'
    },
    balanceAmount: {
        fontSize: 42,
        fontWeight: '700',
        color: '#1E293B',
        marginTop: 4
    },
    balanceHint: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 4
    },
    quickActions: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24
    },
    actionBtn: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center'
    },
    actionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#DBEAFE',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8
    },
    actionIconText: {
        fontSize: 22,
        fontWeight: '700',
        color: '#2563EB'
    },
    actionText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151'
    },
    section: {
        marginBottom: 24
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1E293B'
    },
    seeAll: {
        fontSize: 14,
        color: '#2563EB',
        fontWeight: '500'
    },
    emptyState: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 32,
        alignItems: 'center'
    },
    emptyIcon: {
        fontSize: 40,
        marginBottom: 8
    },
    emptyText: {
        fontSize: 14,
        color: '#64748B'
    },
    expenseItem: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8
    },
    expenseLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    expenseDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#2563EB',
        marginRight: 12
    },
    expenseName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1E293B'
    },
    expenseDate: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 2
    },
    expenseValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#EF4444'
    }
});

export default HomeScreen;