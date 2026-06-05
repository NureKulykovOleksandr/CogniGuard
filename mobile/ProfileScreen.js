import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ token, onBack }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`http://localhost:3000/api/users/${token}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        await AsyncStorage.setItem('@auth_user', JSON.stringify(data)); // Оновлюємо кеш
      } else {
        throw new Error('Network error');
      }
    } catch (error) {
      console.warn('Помилка завантаження профілю, використовуємо кеш:', error);
      try {
        const cachedUser = await AsyncStorage.getItem('@auth_user');
        if (cachedUser) {
          setProfile(JSON.parse(cachedUser));
        }
      } catch (e) {
        console.error('Помилка читання кешу:', e);
      }
    } finally {
      setLoading(false);
    }
  };

  const translateRole = (role) => {
    switch (role) {
      case 'soldier': return 'Солдат';
      case 'commander': return 'Командир';
      case 'medic': return 'Медик';
      case 'admin': return 'Адміністратор';
      default: return role;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Профіль користувача</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : profile ? (
        <View style={styles.profileCard}>
          <Text style={styles.label}>ПІБ:</Text>
          <Text style={styles.value}>{profile.full_name}</Text>

          <Text style={styles.label}>Логін:</Text>
          <Text style={styles.value}>{profile.login}</Text>

          <Text style={styles.label}>Звання:</Text>
          <Text style={styles.value}>{profile.rank}</Text>

          <Text style={styles.label}>Роль:</Text>
          <Text style={styles.value}>{translateRole(profile.role)}</Text>

          {profile.unit_id && (
            <>
              <Text style={styles.label}>Підрозділ (ID):</Text>
              <Text style={styles.value}>{profile.unit_id}</Text>
            </>
          )}

          {profile.created_at && (
            <>
              <Text style={styles.label}>Дата реєстрації:</Text>
              <Text style={styles.value}>{new Date(profile.created_at).toLocaleDateString()}</Text>
            </>
          )}
        </View>
      ) : (
        <Text style={styles.errorText}>Не вдалося завантажити дані профілю.</Text>
      )}

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>Назад</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5', marginTop: 40 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  loader: { flex: 1, justifyContent: 'center' },
  profileCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginTop: 10,
  },
  value: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  errorText: { textAlign: 'center', fontSize: 16, color: '#FF3B30', marginTop: 50 },
  backButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 30,
  },
  backButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
