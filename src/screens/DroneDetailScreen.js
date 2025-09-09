import React, { useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useData } from '../context/DataContext';

const { width } = Dimensions.get('window');

export default function DroneDetailScreen({ route }) {
  const { id } = route.params || {};
  const { drones, updateDrone } = useData();
  const insets = useSafeAreaInsets();
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

  const onTakeOff = () => {
    updateDrone(drone.id, { status: 'Patrolling', altitude: 50, speed: 8 });
  };

  const onLand = () => {
    updateDrone(drone.id, { status: 'Idle', altitude: 0, speed: 0 });
  };

  if (!drone) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.errorText}>VTOL Drone not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <View style={styles.droneIcon}>
              <Ionicons name="airplane" size={32} color="#fff" />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.droneName}>VTOL</Text>
              <Text style={styles.droneSubtitle}>Vertical Take Off and Landing</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(drone.status) }]}>
              <Text style={styles.statusText}>{drone.status}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Video Feed */}
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
          <TouchableOpacity style={styles.videoOverlay} onPress={onPause}>
            <View style={styles.playButton}>
              <Ionicons name={isPlaying ? "pause" : "play"} size={32} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.statGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="battery-half" size={24} color="#fff" />
              <Text style={styles.statValue}>{drone.battery}%</Text>
              <Text style={styles.statLabel}>Battery</Text>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient
              colors={['#3B82F6', '#1D4ED8']}
              style={styles.statGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="trending-up" size={24} color="#fff" />
              <Text style={styles.statValue}>{drone.altitude}m</Text>
              <Text style={styles.statLabel}>Altitude</Text>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient
              colors={['#8B5CF6', '#7C3AED']}
              style={styles.statGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="speedometer" size={24} color="#fff" />
              <Text style={styles.statValue}>{drone.speed}m/s</Text>
              <Text style={styles.statLabel}>Speed</Text>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient
              colors={['#F59E0B', '#D97706']}
              style={styles.statGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="time" size={24} color="#fff" />
              <Text style={styles.statValue}>{drone.flightTime}min</Text>
              <Text style={styles.statLabel}>Flight Time</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Control Panel */}
        <View style={styles.controlPanel}>
          <Text style={styles.sectionTitle}>Flight Controls</Text>
          <View style={styles.controlGrid}>
            <TouchableOpacity style={styles.controlButton} onPress={onTakeOff}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.controlGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="play" size={28} color="#fff" />
                <Text style={styles.controlText}>Take Off</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton} onPress={onLand}>
              <LinearGradient
                colors={['#EF4444', '#DC2626']}
                style={styles.controlGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="stop" size={28} color="#fff" />
                <Text style={styles.controlText}>Land</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton} onPress={onReturnHome}>
              <LinearGradient
                colors={['#3B82F6', '#1D4ED8']}
                style={styles.controlGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="home" size={28} color="#fff" />
                <Text style={styles.controlText}>Return Home</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton}>
              <LinearGradient
                colors={['#8B5CF6', '#7C3AED']}
                style={styles.controlGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="camera" size={28} color="#fff" />
                <Text style={styles.controlText}>Camera</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* System Information */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>System Information</Text>
          <View style={styles.infoRow}>
            <Ionicons name="wifi" size={20} color="#10B981" />
            <Text style={styles.infoLabel}>Signal Strength:</Text>
            <Text style={styles.infoValue}>{drone.signal}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="thermometer" size={20} color="#F59E0B" />
            <Text style={styles.infoLabel}>Temperature:</Text>
            <Text style={styles.infoValue}>{drone.temperature}°C</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="leaf" size={20} color="#3B82F6" />
            <Text style={styles.infoLabel}>Wind Speed:</Text>
            <Text style={styles.infoValue}>{drone.windSpeed} km/h</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={20} color="#8B5CF6" />
            <Text style={styles.infoLabel}>Coordinates:</Text>
            <Text style={styles.infoValue}>{drone.coordinate.latitude.toFixed(4)}, {drone.coordinate.longitude.toFixed(4)}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStatusColor = (status) => {
  switch (status) {
    case 'Idle': return '#10B981';
    case 'Patrolling': return '#3B82F6';
    case 'On Mission': return '#8B5CF6';
    case 'Charging': return '#F59E0B';
    case 'Returning': return '#EF4444';
    default: return '#6B7280';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    margin: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  droneIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    marginLeft: 16,
  },
  droneName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  droneSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  videoCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    height: 250,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 16,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    width: (width - 56) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statGradient: {
    padding: 16,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    marginTop: 4,
  },
  controlPanel: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  controlGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  controlButton: {
    width: (width - 56) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  controlGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  controlText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
  },
  infoCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 12,
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    color: '#EF4444',
    fontWeight: '600',
  },
});



