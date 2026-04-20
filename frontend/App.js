import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import ErrorBoundary from './src/components/ErrorBoundary';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
    return (
        <ErrorBoundary>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" />
                <AppNavigator />
            </SafeAreaView>
        </ErrorBoundary>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFF6FF'
    }
});
