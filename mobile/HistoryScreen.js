import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';

export default function HistoryScreen({ token, onBack }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      // Використовуємо localhost для підключення до локального бекенду.
      const response = await fetch(`http://localhost:3000/api/tests/history?user_id=${token}`);
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal': return '#4CD964'; // Зелений
      case 'fatigue': return '#FFCC00'; // Жовтий
      case 'critical': return '#FF3B30'; // Червоний
      default: return '#8E8E93'; // Сірий
    }
  };

  const formatDateUTC = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return "Невідома дата";
    const yyyy = date.getUTCFullYear();
    const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(date.getUTCDate()).padStart(2, '0');
    const hh = String(date.getUTCHours()).padStart(2, '0');
    const min = String(date.getUTCMinutes()).padStart(2, '0');
    const ss = String(date.getUTCSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss} UTC`;
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.status) }]} />
      <View style={styles.itemDetails}>
        <Text style={styles.testType}>Тест: {item.test_type}</Text>
        <Text style={styles.rtText}>Час реакції: {item.reaction_time_ms} мс</Text>
        <Text style={styles.errorsText}>Помилок: {item.errors_count}</Text>
        <Text style={styles.dateText}>{formatDateUTC(item.timestamp)}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Історія тестів</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.emptyText}>Історія порожня.</Text>}
        />
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
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statusIndicator: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginRight: 15,
  },
  itemDetails: { flex: 1 },
  testType: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  rtText: { fontSize: 14, color: '#333' },
  errorsText: { fontSize: 14, color: '#333' },
  dateText: { fontSize: 12, color: '#888', marginTop: 5 },
  emptyText: { textAlign: 'center', fontSize: 16, color: '#888', marginTop: 50 },
  backButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});