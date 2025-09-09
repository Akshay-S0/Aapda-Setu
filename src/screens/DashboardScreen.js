import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Linking, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../context/DataContext';

const { width } = Dimensions.get('window');

// Configurable ESP32 base URL (replace with your ESP32 IP or hostname)
const ESP_BASE_URL = 'http://192.168.0.100';

export default function DashboardScreen({ navigation }) {
  const { drones } = useData();
  const insets = useSafeAreaInsets();
  const drone = drones[0]; // Single VTOL drone

  const [motorRunning, setMotorRunning] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null); // 'start' | 'stop' | null

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

  const getBatteryColor = (battery) => {
    if (battery > 60) return '#10B981';
    if (battery > 30) return '#F59E0B';
    return '#EF4444';
  };

  const requestESP = async (path) => {
    try {
      const url = `${ESP_BASE_URL}${path}`;
      const res = await fetch(url);
      // We don't rely on body; ESP serves HTML. Just check ok flag.
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return true;
    } catch (e) {
      Alert.alert('ESP32 Error', `Failed to reach ESP32 (${e.message}). Check Wi‑Fi/IP.`);
      return false;
    }
  };

  const onStartMotor = async () => {
    if (loadingAction) return;
    setLoadingAction('start');
    const ok = await requestESP('/start');
    if (ok) {
      setMotorRunning(true);
      Alert.alert('Motor', 'Motor STARTED');
    }
    setLoadingAction(null);
  };

  const onStopMotor = async () => {
    if (loadingAction) return;
    setLoadingAction('stop');
    const ok = await requestESP('/stop');
    if (ok) {
      setMotorRunning(false);
      Alert.alert('Motor', 'Motor STOPPED');
    }
    setLoadingAction(null);
  };

  const onOpenESP = () => {
    Linking.openURL(ESP_BASE_URL).catch(() => {
      Alert.alert('Open Failed', 'Could not open the ESP32 web UI.');
    });
  };

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

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
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
        </View>

        {/* Control Panel */}
        <View style={styles.controlPanel}>
          <Text style={styles.sectionTitle}>ESP Controls</Text>
          <Text style={{ color: motorRunning ? '#10B981' : '#EF4444', marginBottom: 12, fontWeight: '700' }}>
            Motor: {motorRunning ? 'RUNNING' : 'STOPPED'}
          </Text>
          <View style={styles.controlGrid}>
            <TouchableOpacity style={styles.controlButton} onPress={onStartMotor} disabled={loadingAction === 'start'}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.controlGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="play" size={28} color="#fff" />
                <Text style={styles.controlText}>{loadingAction === 'start' ? 'Starting...' : 'Start Motor'}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton} onPress={onStopMotor} disabled={loadingAction === 'stop'}>
              <LinearGradient
                colors={['#EF4444', '#DC2626']}
                style={styles.controlGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="stop" size={28} color="#fff" />
                <Text style={styles.controlText}>{loadingAction === 'stop' ? 'Stopping...' : 'Stop Motor'}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton} onPress={onOpenESP}>
              <LinearGradient
                colors={['#3B82F6', '#1D4ED8']}
                style={styles.controlGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="globe" size={28} color="#fff" />
                <Text style={styles.controlText}>Open ESP Web UI</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Additional Info */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>System Information</Text>
          <View style={styles.infoRow}>
            <Ionicons name="wifi" size={20} color="#10B981" />
            <Text style={styles.infoLabel}>Signal:</Text>
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
            <Ionicons name="time" size={20} color="#8B5CF6" />
            <Text style={styles.infoLabel}>Flight Time:</Text>
            <Text style={styles.infoValue}>{drone.flightTime} min</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
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
});



