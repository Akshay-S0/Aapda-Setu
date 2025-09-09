import React, { useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import { useData } from '../context/DataContext';

export default function DroneDetailScreen({ route }) {
  const { id } = route.params || {};
  const { drones, updateDrone } = useData();
  const drone = useMemo(() => drones.find(d => d.id === id), [drones, id]);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const onPause = async () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      await videoRef.current.pauseAsync();
      setIsPlaying(false);
    } else {
      await videoRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  const onReturnHome = () => {
    updateDrone(drone.id, { status: 'Returning', speed: 12, altitude: drone.altitude > 0 ? drone.altitude : 60 });
  };

  if (!drone) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Drone not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.videoCard}>
        <Video
          ref={videoRef}
          source={{ uri: 'https://cdn.pixabay.com/video/2017/10/10/12934-238987997_large.mp4' }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="cover"
          shouldPlay
          isLooping
          style={styles.video}
          onReadyForDisplay={() => setIsPlaying(true)}
        />
      </View>
      <View style={styles.statsCard}>
        <Text style={styles.title}>{drone.name}</Text>
        <Text style={styles.meta}>ID: {drone.id}</Text>
        <Text style={styles.meta}>Status: {drone.status}</Text>
        <Text style={styles.meta}>Battery: {drone.battery}%</Text>
        <Text style={styles.meta}>Altitude: {drone.altitude} m</Text>
        <Text style={styles.meta}>Speed: {drone.speed} m/s</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#111827' }]} onPress={onPause}>
            <Text style={styles.buttonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#dc2626' }]} onPress={onReturnHome}>
            <Text style={styles.buttonText}>Return Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f4f7', padding: 12 },
  videoCard: { backgroundColor: '#000', borderRadius: 12, overflow: 'hidden', height: 220, marginBottom: 12 },
  video: { width: '100%', height: '100%' },
  statsCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, gap: 6, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 },
  title: { fontSize: 20, fontWeight: '700' },
  meta: { color: '#4b5563' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  button: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
});



