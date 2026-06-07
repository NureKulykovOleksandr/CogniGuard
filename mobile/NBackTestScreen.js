import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config';

const N_BACK = 2;
const TOTAL_TRIALS = 20;
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'H', 'K', 'L', 'M', 'O', 'P', 'R', 'S', 'T'];

const generateSequence = (n, total) => {
  const seq = [];
  for (let i = 0; i < total; i++) {
    if (i >= n && Math.random() < 0.3) {
      seq.push(seq[i - n]);
    } else {
      let letter;
      do {
        letter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
      } while (i >= n && letter === seq[i - n]);
      seq.push(letter);
    }
  }
  return seq;
};

export default function NBackTestScreen({ token, onBack }) {
  const [gameState, setGameState] = useState('instructions'); 
  const [sequence, setSequence] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [showLetter, setShowLetter] = useState(false);

  const stats = useRef({
    correctMatches: 0,
    errors: 0,
    reactionTimes: [],
    hasResponded: false,
    startTime: 0
  });

  const timerRef = useRef(null);
  const hideTimerRef = useRef(null);

  const startGame = () => {
    setSequence(generateSequence(N_BACK, TOTAL_TRIALS));
    stats.current = { correctMatches: 0, errors: 0, reactionTimes: [], hasResponded: false, startTime: 0 };
    setGameState('active');
    setCurrentIndex(0);
  };

  useEffect(() => {
    if (gameState === 'active' && currentIndex >= 0) {
      if (currentIndex >= TOTAL_TRIALS) {
        finishTest();
        return;
      }

      
      if (currentIndex > 0) {
        const prevIndex = currentIndex - 1;
        const wasTarget = prevIndex >= N_BACK && sequence[prevIndex] === sequence[prevIndex - N_BACK];
        if (wasTarget && !stats.current.hasResponded) {
          stats.current.errors += 1;
        }
      }

      
      setShowLetter(true);
      stats.current.hasResponded = false;
      stats.current.startTime = Date.now();

      
      hideTimerRef.current = setTimeout(() => {
        setShowLetter(false);
      }, 1500);

      
      timerRef.current = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 2000);
    }

    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(hideTimerRef.current);
    };
  }, [currentIndex, gameState]);

  const handleMatch = () => {
    if (gameState !== 'active' || !showLetter || stats.current.hasResponded) return;

    stats.current.hasResponded = true;
    const isTarget = currentIndex >= N_BACK && sequence[currentIndex] === sequence[currentIndex - N_BACK];

    if (isTarget) {
      stats.current.correctMatches += 1;
      stats.current.reactionTimes.push(Date.now() - stats.current.startTime);
    } else {
      stats.current.errors += 1;
    }
  };

  const finishTest = async () => {
    setGameState('finished');
    const avgReactionTime = stats.current.reactionTimes.length > 0
      ? Math.round(stats.current.reactionTimes.reduce((a, b) => a + b, 0) / stats.current.reactionTimes.length)
      : 0;

    const testData = {
      user_id: token,
      test_type: 'n-back',
      reaction_time_ms: avgReactionTime,
      errors_count: stats.current.errors,
      timestamp: new Date().toISOString()
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`${API_URL}/api/tests`, {
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
        Alert.alert('Тест завершено', `Правильних: ${stats.current.correctMatches}\nПомилок: ${stats.current.errors}\nСер. час реакції: ${avgReactionTime} мс`);
      } else {
        throw new Error('Network error');
      }
    } catch (error) {
      try {
        const existing = await AsyncStorage.getItem('@offline_tests');
        const offlineTests = existing ? JSON.parse(existing) : [];
        offlineTests.push(testData);
        await AsyncStorage.setItem('@offline_tests', JSON.stringify(offlineTests));
        Alert.alert('Тест завершено (Офлайн)', `Правильних: ${stats.current.correctMatches}\nПомилок: ${stats.current.errors}\nСер. час реакції: ${avgReactionTime} мс`);
      } catch (e) {
        Alert.alert('Помилка', 'Результат не збережено.');
      }
    }
    onBack();
  };

  if (gameState === 'instructions') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Тест 2-back</Text>
        <Text style={styles.instructions}>
          Вам будуть по черзі показані літери.{"\n\n"}
          Натискайте кнопку "Збіг!", ЯКЩО поточна літера збігається з тією, що була ПОКАЗАНА 2 КРОКИ ТОМУ.{"\n\n"}
          Наприклад: A - B - A (це збіг!).
        </Text>
        <TouchableOpacity style={styles.button} onPress={startGame}>
          <Text style={styles.buttonText}>Почати</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.backButton]} onPress={onBack}>
          <Text style={styles.buttonText}>Назад</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.testContainer}>
      <View style={styles.letterBox}>
        <Text style={styles.letterText}>
          {showLetter && currentIndex < TOTAL_TRIALS ? sequence[currentIndex] : ''}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.matchButton, stats.current.hasResponded ? { backgroundColor: '#8E8E93' } : {}]}
        onPress={handleMatch}
        disabled={stats.current.hasResponded || !showLetter}
      >
        <Text style={styles.buttonText}>Збіг!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  testContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  instructions: { fontSize: 16, textAlign: 'center', marginBottom: 40, lineHeight: 24 },
  button: { backgroundColor: '#4CD964', padding: 15, borderRadius: 5, width: '100%', alignItems: 'center', marginBottom: 15 },
  backButton: { backgroundColor: '#FF3B30' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  letterBox: { height: 200, justifyContent: 'center', alignItems: 'center', marginBottom: 50 },
  letterText: { fontSize: 80, fontWeight: 'bold', color: '#333' },
  matchButton: { backgroundColor: '#007AFF', padding: 20, borderRadius: 10, width: '80%', alignItems: 'center' }
});
