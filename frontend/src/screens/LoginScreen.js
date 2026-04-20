import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../services/authService';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Completa todos los campos');
            return;
        }

        setLoading(true);
        try {
            const response = await authService.login(email, password);

            if (response.success) {
                await AsyncStorage.setItem('token', response.data.token);
                await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Main' }]
                });
            } else {
                Alert.alert('Error', response.message || 'Error al iniciar sesión');
            }
        } catch (error) {
            Alert.alert('Error', error.message || 'Credenciales inválidas');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                <View style={styles.headerSection}>
                    <View style={styles.logoContainer}>
                        <View style={styles.logoCard}>
                            <View style={styles.logoMain}>
                                <Ionicons name="receipt-outline" size={40} color="#2563EB" />
                            </View>
                            <View style={styles.logoBadge}>
                                <Ionicons name="wallet-outline" size={20} color="#fff" />
                            </View>
                        </View>
                    </View>
                    <Text style={styles.appName}>FacTur</Text>
                    <Text style={styles.appTagline}>Control total de tus gastos</Text>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Ionicons name="cloud-done-outline" size={18} color="rgba(255,255,255,0.9)" />
                            <Text style={styles.statText}>Seguro</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Ionicons name="phone-portrait-outline" size={18} color="rgba(255,255,255,0.9)" />
                            <Text style={styles.statText}>Rápido</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Ionicons name="analytics-outline" size={18} color="rgba(255,255,255,0.9)" />
                            <Text style={styles.statText}>Analítico</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.formBox}>
                    <Text style={styles.formTitle}>Iniciar Sesión</Text>

                    <View style={styles.inputWrapper}>
                        <View style={styles.inputIcon}>
                            <Ionicons name="mail-outline" size={20} color="#2563EB" />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Correo electrónico"
                            placeholderTextColor="#9CA3AF"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <View style={styles.inputIcon}>
                            <Ionicons name="lock-closed-outline" size={20} color="#2563EB" />
                        </View>
                        <TextInput
                            style={[styles.input, styles.inputWithIcon]}
                            placeholder="Contraseña"
                            placeholderTextColor="#9CA3AF"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity
                            style={styles.eyeButton}
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Ionicons
                                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                size={20}
                                color="#6B7280"
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.forgotButton}
                        onPress={() => Alert.alert('Info', 'Recuperación de contraseña')}
                    >
                        <Ionicons name="help-circle-outline" size={16} color="#2563EB" />
                        <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Text style={styles.loginButtonText}>Entrar</Text>
                                <Ionicons name="arrow-forward" size={20} color="#fff" />
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>¿No tienes cuenta?</Text>
                    <TouchableOpacity
                        style={styles.registerButton}
                        onPress={() => navigation.navigate('Register')}
                    >
                        <Ionicons name="person-add-outline" size={18} color="#2563EB" />
                        <Text style={styles.registerLink}> Crear cuenta</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2563EB'
    },
    keyboardView: {
        flex: 1
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingBottom: 100
    },
    headerSection: {
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 30
    },
    logoContainer: {
        marginBottom: 14
    },
    logoCard: {
        width: 95,
        height: 95,
        borderRadius: 26,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10
    },
    logoMain: {
        width: 64,
        height: 64,
        borderRadius: 18,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center'
    },
    logoBadge: {
        position: 'absolute',
        bottom: -6,
        right: -6,
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#10B981',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#fff'
    },
    appName: {
        fontSize: 34,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: -0.5
    },
    appTagline: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.9)',
        marginTop: 4
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 22,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 24,
        paddingVertical: 10,
        paddingHorizontal: 18
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
    },
    statText: {
        fontSize: 13,
        color: '#fff',
        fontWeight: '500'
    },
    statDivider: {
        width: 1,
        height: 14,
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginHorizontal: 14
    },
    formBox: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 6,
        marginTop: 40
    },
    formTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 20,
        textAlign: 'center'
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        marginBottom: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2
    },
    inputIcon: {
        width: 50,
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: '#E2E8F0'
    },
    input: {
        flex: 1,
        height: 52,
        paddingHorizontal: 14,
        fontSize: 16,
        color: '#1E293B'
    },
    inputWithIcon: {
        paddingRight: 50
    },
    eyeButton: {
        position: 'absolute',
        right: 14,
        top: 16
    },
    forgotButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        alignSelf: 'flex-end',
        marginBottom: 18,
        marginTop: 2
    },
    forgotText: {
        fontSize: 14,
        color: '#2563EB',
        fontWeight: '500'
    },
    loginButton: {
        backgroundColor: '#2563EB',
        borderRadius: 14,
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4
    },
    loginButtonDisabled: {
        backgroundColor: '#93C5FD',
        shadowOpacity: 0
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600'
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 28,
        marginBottom: 36
    },
    footerText: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.8)'
    },
    registerButton: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    registerLink: {
        fontSize: 15,
        color: '#fff',
        fontWeight: '600'
    }
});

export default LoginScreen;