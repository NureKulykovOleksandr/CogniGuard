import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TestScreen({ token, onBack }) {
  const [gameState, setGameState] = useState('waiting'); // waiting, active, clicked
  const [startTime, setStartTime] = useState(0);
  const [errorsCount, setErrorsCount] = useState(0);

  useEffect(() => {
    // Случайный таймер от 2 до 5 секунд перед сигналом
    const delay = Math.random() * 3000 + 2000;
    const timer = setTimeout(() => {
      setGameState('active');
      setStartTime(Date.now());
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  const handleTap = async () => {
    if (gameState === 'waiting') {
      setErrorsCount(prev => prev + 1);
      Alert.alert('Зарано!', 'Дочекайтеся зеленого сигналу.');
      return;
    }
    if (gameState === 'active') {
      const reactionTime = Date.now() - startTime;
      setGameState('clicked');

      // Отправляем результат на бэкенд
      const testData = {
        user_id: token,
        test_type: 'PVT',
        reaction_time_ms: reactionTime,
        errors_count: errorsCount,
        timestamp: new Date().toISOString()
      };

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch('http://localhost:3000/api/tests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(testData),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          Alert.alert('Тест завершено', `Ваша реакція: ${reactionTime} мс. Дані збережено!`);
        } else {
          throw new Error('Network error');
        }
      } catch (error) {
        try {
          const existing = await AsyncStorage.getItem('@offline_tests');
          const offlineTests = existing ? JSON.parse(existing) : [];
          offlineTests.push(testData);
          await AsyncStorage.setItem('@offline_tests', JSON.stringify(offlineTests));
          Alert.alert('Тест завершено', `Ваша реакція: ${reactionTime} мс. Збережено локально (офлайн).`);
        } catch (e) {
          Alert.alert('Помилка відправки', 'Результат не збережено на сервері та локально.');
        }
      }
      onBack();
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: gameState === 'active' ? '#4CD964' : '#FF3B30' }]}
      onPress={handleTap}
      activeOpacity={1}
    >
      <Text style={styles.text}>
        {gameState === 'active' ? 'ТИСНИ СЮДИ!' : 'ЗАЧЕКАЙТЕ ЗЕЛЕНОГО СИГНАЛУ...'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { color: '#fff', fontSize: 22, fontWeight: 'bold', textAlign: 'center', padding: 20 }
});