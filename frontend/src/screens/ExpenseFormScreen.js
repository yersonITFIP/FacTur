import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import expenseService from '../services/expenseService';

const ExpenseFormScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'El nombre es obligatorio');
            return;
        }

        if (!value || isNaN(parseFloat(value)) || parseFloat(value) <= 0) {
            Alert.alert('Error', 'Ingresa un valor numérico válido');
            return;
        }

        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');

            const response = await expenseService.createExpense(token, {
                name: name.trim(),
                description: description.trim(),
                value: parseFloat(value)
            });

            if (response.success) {
                Alert.alert('Éxito', 'Gasto registrado correctamente', [
                    {
                        text: 'OK',
                        onPress: () => {
                            setName('');
                            setDescription('');
                            setValue('');
                            // Ir al tab Home para ver el balance actualizado
                            navigation.navigate('Home');
                        }
                    }
                ]);
            } else {
                Alert.alert('Error', response.message || 'Error al guardar');
            }
        } catch (error) {
            Alert.alert('Error', error.message || 'No se pudo guardar el gasto');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Nuevo Gasto</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={styles.formCard}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nombre del gasto *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: Compra de materiales"
                            placeholderTextColor="#94A3B8"
                            value={name}
                            onChangeText={setName}
                            maxLength={255}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Descripción</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Descripción opcional"
                            placeholderTextColor="#94A3B8"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={3}
                            maxLength={500}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Valor ($) *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="0.00"
                            placeholderTextColor="#94A3B8"
                            value={value}
                            onChangeText={setValue}
                            keyboardType="decimal-pad"
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
                        onPress={handleSave}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <View style={styles.saveBtnContent}>
                                <Text style={styles.saveBtnText}>Guardar Gasto</Text>
                                <Text style={styles.saveBtnIcon}>+</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.helpCard}>
                    <Text style={styles.helpTitle}>Tips</Text>
                    <Text style={styles.helpText}>- Usa nombres descriptivos</Text>
                    <Text style={styles.helpText}>- Agrega descripción para más detalle</Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 100
    },
    formCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24
    },
    inputGroup: {
        marginBottom: 16
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 6
    },
    input: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 10,
        padding: 14,
        fontSize: 16,
        color: '#1E293B'
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top'
    },
    saveBtn: {
        backgroundColor: '#2563EB',
        borderRadius: 10,
        padding: 16,
        alignItems: 'center',
        marginTop: 8
    },
    saveBtnDisabled: {
        backgroundColor: '#93C5FD'
    },
    saveBtnContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    saveBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    },
    saveBtnIcon: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700'
    },
    helpCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginTop: 20
    },
    helpTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 8
    },
    helpText: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 4
    }
});

export default ExpenseFormScreen;