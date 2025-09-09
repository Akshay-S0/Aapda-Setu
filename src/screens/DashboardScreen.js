import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useData } from '../context/DataContext';

export default function DashboardScreen({ navigation }) {
  const { drones } = useData();

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('DroneDetail', { id: item.id })}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={[styles.badge, badgeColor(item.status)]}>{item.status}</Text>
      </View>
      <Text style={styles.meta}>ID: {item.id}</Text>
      <Text style={styles.meta}>Battery: {item.battery}%</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topButtons}>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('MissionControl')}>
          <Text style={styles.secondaryText}>Mission Control</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Reports')}>
          <Text style={styles.secondaryText}>Reports</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={drones}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

function badgeColor(status) {
  switch (status) {
    case 'Idle':
      return { backgroundColor: '#e5e7eb', color: '#111827' };
    case 'Patrolling':
    case 'On Mission':
      return { backgroundColor: '#dbeafe', color: '#1d4ed8' };
    case 'Charging':
      return { backgroundColor: '#fef3c7', color: '#b45309' };
    case 'Returning':
      return { backgroundColor: '#fee2e2', color: '#991b1b' };
    default:
      return { backgroundColor: '#e5e7eb', color: '#111827' };
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f4f7', paddingHorizontal: 16, paddingTop: 12 },
  topButtons: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, gap: 10 },
  secondaryButton: { flex: 1, backgroundColor: '#111827', padding: 12, borderRadius: 8, alignItems: 'center' },
  secondaryText: { color: '#fff', fontWeight: '600' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 },
  name: { fontSize: 18, fontWeight: '700' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, overflow: 'hidden', fontSize: 12, fontWeight: '600' },
  meta: { color: '#4b5563', marginTop: 6 },
});



