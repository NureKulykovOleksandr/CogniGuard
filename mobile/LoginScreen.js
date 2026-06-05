import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ onLoginSuccess }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      });
      const data = await response.json();
      if (response.ok) {
        try {
          await AsyncStorage.setItem('@auth_token', data.token);
          await AsyncStorage.setItem('@auth_user', JSON.stringify(data.user));
        } catch (e) {
          console.error('Error saving auth data', e);
        }
        onLoginSuccess(data.token); 
      } else {
        Alert.alert('Помилка', data.message || 'Невірні дані');
      }
    } catch (error) {
      Alert.alert('Помилка підключення', 'Не вдалося зв’язатися з сервером');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CogniGuard Mobile</Text>
      <TextInput style={styles.input} placeholder="Логін" value={login} onChangeText={setLogin} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Пароль" value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Увійти</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 5, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});