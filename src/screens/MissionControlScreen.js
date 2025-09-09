import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useData } from '../context/DataContext';

export default function MissionControlScreen() {
  const { drones, assignMission } = useData();
  const [selectedDroneId, setSelectedDroneId] = useState(null);

  const initialRegion = useMemo(() => ({
    latitude: drones[0]?.coordinate.latitude || 37.78825,
    longitude: drones[0]?.coordinate.longitude || -122.4324,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  }), [drones]);

  const selectDrone = (id) => setSelectedDroneId(id);

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>Status: {item.status} • Battery: {item.battery}%</Text>
      </View>
      <TouchableOpacity style={styles.smallButton} onPress={() => selectDrone(item.id)}>
        <Text style={styles.smallButtonText}>{selectedDroneId === item.id ? 'Selected' : 'Select'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.smallButton, { backgroundColor: '#2563eb' }]} onPress={() => assignMission(item.id, 'Recon', 'Assigned via Mission Control')}>
        <Text style={styles.smallButtonText}>Assign</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion}>
        {drones.map((drone) => (
          <Marker
            key={drone.id}
            coordinate={drone.coordinate}
            title={drone.name}
            description={`${drone.status} • ${drone.battery}%`}
            pinColor={selectedDroneId === drone.id ? 'blue' : 'red'}
            onPress={() => selectDrone(drone.id)}
          />
        ))}
      </MapView>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Drones</Text>
        <FlatList data={drones} keyExtractor={(it) => it.id} renderItem={renderItem} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  panel: { backgroundColor: '#fff', padding: 12, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  panelTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  listItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 8 },
  name: { fontWeight: '700' },
  meta: { color: '#4b5563' },
  smallButton: { backgroundColor: '#111827', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  smallButtonText: { color: '#fff', fontWeight: '600' },
});



