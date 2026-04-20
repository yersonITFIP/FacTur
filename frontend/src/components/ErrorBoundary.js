import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.log('ERROR:', error);
        console.log('ERROR INFO:', errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.container}>
                    <Text style={styles.title}>Algo salió mal</Text>
                    <Text style={styles.error}>{this.state.error?.toString()}</Text>
                    <Button
                        title="Reiniciar"
                        onPress={() => this.setState({ hasError: false })}
                    />
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#e74c3c',
        marginBottom: 10
    },
    error: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
        marginBottom: 20
    }
});

export default ErrorBoundary;
