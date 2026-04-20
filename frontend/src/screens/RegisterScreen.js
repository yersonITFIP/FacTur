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

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Completa todos los campos');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden');
            return;
        }

        setLoading(true);
        try {
            const response = await authService.register(name, email, password);

            if (response.success) {
                await AsyncStorage.setItem('token', response.data.token);
                await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

                Alert.alert('¡Listo!', 'Cuenta creada exitosamente', [
                    {
                        text: 'OK',
                        onPress: () => {
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Main' }]
                            });
                        }
                    }
                ]);
            } else {
                Alert.alert('Error', response.message || 'Error al registrar');
            }
        } catch (error) {
            Alert.alert('Error', error.message || 'No se pudo crear la cuenta');
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
                                    <Ionicons name="person-add" size={36} color="#2563EB" />
                                </View>
                                <View style={styles.logoBadge}>
                                    <Ionicons name="checkmark" size={16} color="#fff" />
                                </View>
                            </View>
                        </View>
                        <Text style={styles.appName}>Crear Cuenta</Text>
                        <Text style={styles.appTagline}>Únete a FacTur hoy</Text>

                        <View style={styles.benefitsRow}>
                            <View style={styles.benefitItem}>
                                <Ionicons name="shield-checkmark" size={16} color="rgba(255,255,255,0.9)" />
                                <Text style={styles.benefitText}>Seguro</Text>
                            </View>
                            <View style={styles.benefitItem}>
                                <Ionicons name="star" size={16} color="rgba(255,255,255,0.9)" />
                                <Text style={styles.benefitText}>Gratis</Text>
                            </View>
                            <View style={styles.benefitItem}>
                                <Ionicons name="checkmark-circle" size={16} color="rgba(255,255,255,0.9)" />
                                <Text style={styles.benefitText}>Fácil</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.formBox}>
                        <View style={styles.inputWrapper}>
                            <View style={styles.inputIcon}>
                                <Ionicons name="person-outline" size={20} color="#2563EB" />
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Nombre completo"
                                placeholderTextColor="#9CA3AF"
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words"
                            />
                        </View>

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
                                placeholder="Contraseña (mín. 6)"
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

                        <View style={styles.inputWrapper}>
                            <View style={styles.inputIcon}>
                                <Ionicons name="shield-checkmark-outline" size={20} color="#2563EB" />
                            </View>
                            <TextInput
                                style={[styles.input, styles.inputWithIcon]}
                                placeholder="Confirmar contraseña"
                                placeholderTextColor="#9CA3AF"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirm}
                            />
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowConfirm(!showConfirm)}
                            >
                                <Ionicons
                                    name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                                    size={20}
                                    color="#6B7280"
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[styles.registerButton, loading && styles.registerButtonDisabled]}
                            onPress={handleRegister}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <Text style={styles.registerButtonText}>Crear Cuenta</Text>
                                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                                </>
                            )}
                        </TouchableOpacity>

                        <View style={styles.terms}>
                            <Ionicons name="document-text-outline" size={14} color="#9CA3AF" />
                            <Text style={styles.termsText}>
                                Al registrarte aceptas nuestros términos y condiciones
                            </Text>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>¿Ya tienes cuenta?</Text>
                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="log-in-outline" size={18} color="#2563EB" />
                            <Text style={styles.loginLink}> Iniciar sesión</Text>
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
    backButton: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 44,
        marginBottom: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4
    },
    headerSection: {
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 24
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
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#10B981',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#fff'
    },
    appName: {
        fontSize: 30,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: -0.5
    },
    appTagline: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.9)',
        marginTop: 4
    },
    benefitsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 24,
        paddingVertical: 10,
        paddingHorizontal: 18
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
    },
    benefitText: {
        fontSize: 13,
        color: '#fff',
        fontWeight: '500'
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
        marginTop: 36
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
    registerButton: {
        backgroundColor: '#2563EB',
        borderRadius: 14,
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginTop: 4,
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4
    },
    registerButtonDisabled: {
        backgroundColor: '#93C5FD',
        shadowOpacity: 0
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600'
    },
    terms: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: 18
    },
    termsText: {
        fontSize: 12,
        color: '#9CA3AF',
        textAlign: 'center'
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
    loginButton: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    loginLink: {
        fontSize: 15,
        color: '#fff',
        fontWeight: '600'
    }
});

export default RegisterScreen;