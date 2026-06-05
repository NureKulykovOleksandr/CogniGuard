import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './LoginScreen';
import TestScreen from './TestScreen';
import NBackTestScreen from './NBackTestScreen';
import HistoryScreen from './HistoryScreen';
import ProfileScreen from './ProfileScreen';


export default function App() {
  const [token, setToken] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isNBackTesting, setIsNBackTesting] = useState(false);
  const [isViewingHistory, setIsViewingHistory] = useState(false);
  const [isViewingProfile, setIsViewingProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkLoginState();
  }, []);

  const checkLoginState = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('@auth_token');
      if (storedToken) {
        setToken(storedToken);
      }
    } catch (e) {
      console.error('Помилка завантаження токена:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {

      syncOfflineTests();
    }
  }, [token]);

  const syncOfflineTests = async () => {
    try {
      const existing = await AsyncStorage.getItem('@offline_tests');
      if (existing) {
        const offlineTests = JSON.parse(existing);
        if (offlineTests.length > 0) {
          let syncedCount = 0;
          const remainingTests = [];

          for (const test of offlineTests) {
            try {
              const response = await fetch('http://localhost:3000/api/tests', {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(test),
              });
              if (response.ok) {
                syncedCount++;
              } else {
                remainingTests.push(test);
              }
            } catch (err) {
              remainingTests.push(test);
            }
          }

          if (syncedCount > 0) {
            Alert.alert('Синхронізація', `Синхронізовано ${syncedCount} збережених офлайн тестів.`);
          }
          await AsyncStorage.setItem('@offline_tests', JSON.stringify(remainingTests));
        }
      }
    } catch (e) {
      console.error('Помилка синхронізації:', e);
    }
  };

  const handleLogout = async () => {
    setToken(null);
    try {
      await AsyncStorage.removeItem('@auth_token');
      await AsyncStorage.removeItem('@auth_user');
    } catch (e) {
      console.error('Помилка видалення даних:', e);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!token) {
    return <LoginScreen onLoginSuccess={(userToken) => setToken(userToken)} />;
  }

  if (isTesting) {
    return <TestScreen token={token} onBack={() => setIsTesting(false)} />;
  }

  if (isNBackTesting) {
    return <NBackTestScreen token={token} onBack={() => setIsNBackTesting(false)} />;
  }

  if (isViewingHistory) {
    return <HistoryScreen token={token} onBack={() => setIsViewingHistory(false)} />;
  }

  if (isViewingProfile) {
    return <ProfileScreen token={token} onBack={() => setIsViewingProfile(false)} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Вітаємо у системі CogniGuard!</Text>
      <TouchableOpacity style={styles.button} onPress={() => setIsTesting(true)}>
        <Text style={styles.buttonText}>Розпочати когнітивний тест (PVT)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.nbackButton]} onPress={() => setIsNBackTesting(true)}>
        <Text style={styles.buttonText}>Розпочати тест (N-back)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.historyButton]} onPress={() => setIsViewingHistory(true)}>
        <Text style={styles.buttonText}>Переглянути історію</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.profileButton]} onPress={() => setIsViewingProfile(true)}>
        <Text style={styles.buttonText}>Мій профіль</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.logout]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Вийти</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  welcome: { fontSize: 20, marginBottom: 40, fontWeight: '500' },
  button: { backgroundColor: '#4CD964', padding: 15, borderRadius: 5, width: '100%', alignItems: 'center', marginBottom: 15 },
  historyButton: { backgroundColor: '#007AFF' },
  profileButton: { backgroundColor: '#5856D6' },
  nbackButton: { backgroundColor: '#FF9500' },
  logout: { backgroundColor: '#FF3B30' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});