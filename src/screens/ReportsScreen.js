import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useData } from '../context/DataContext';

export default function ReportsScreen() {
  const { missions, drones } = useData();

  const getDroneName = (id) => drones.find(d => d.id === id)?.name || id;

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.type}</Text>
      <Text style={styles.meta}>Drone: {getDroneName(item.droneId)}</Text>
      <Text style={styles.meta}>Status: {item.status}</Text>
      <Text style={styles.meta}>Time: {new Date(item.timestamp).toLocaleString()}</Text>
      {item.notes ? <Text style={styles.meta}>Notes: {item.notes}</Text> : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={missions}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 12 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f4f7' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 },
  title: { fontSize: 16, fontWeight: '700' },
  meta: { color: '#4b5563', marginTop: 4 },
});



